package com.example.demo.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.demo.model.dto.CartItemDto;
import com.example.demo.model.entity.CartItem;
import com.example.demo.model.entity.Product;
import com.example.demo.model.entity.ProductVariant;
import com.example.demo.model.entity.User;
import com.example.demo.repository.CartItemRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.ProductVariantRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.CartService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartItemRepository cartItemRepo;
    private final ProductRepository productRepo;
    private final UserRepository userRepo;
    private final ProductVariantRepository variantRepo;

    @Override
    public void addToCart(Integer userId, Integer productId, Integer variantId, Integer quantity) {
        User user = userRepo.findById(userId).orElseThrow();
        Product product = productRepo.findById(productId).orElseThrow();
        ProductVariant variant = variantRepo.findById(variantId).orElseThrow();
        
        // 驗證該變體是否屬於此商品
        if (!variant.getProduct().getId().equals(product.getId())) {
            throw new RuntimeException("尺寸資訊錯誤，請重新選擇");
        }
        
        // 若庫存不足，拒絕加入
        if (variant.getStock() <= 0) {
            throw new RuntimeException("該尺寸已售完，無法加入購物車");
        }
        
        // 查詢是否已有相同商品在購物車
        Optional<CartItem> optionalItem = cartItemRepo.findByUserAndProductAndVariant(user, product, variant);

        if (optionalItem.isPresent()) {
            // 若已有商品，數量相加
            CartItem existingItem = optionalItem.get();
            
            // 驗證合併後是否超過庫存
            int newQuantity = existingItem.getQuantity() + quantity;
            if (newQuantity > variant.getStock()) {
                throw new RuntimeException("加入數量超過庫存");
            }
            
            existingItem.setQuantity(newQuantity);
            cartItemRepo.save(existingItem);
        } else {
            // 否則新增
        	// 新增新項目前也驗證一次
            if (quantity > variant.getStock()) {
                throw new RuntimeException("加入數量超過庫存");
            }
            CartItem newItem = new CartItem();
            newItem.setUser(user);
            newItem.setProduct(product);
            newItem.setVariant(variant);
            newItem.setQuantity(quantity);
            cartItemRepo.save(newItem);
        }
    }

    @Override
    public List<CartItemDto> getCartItems(Integer userId) {
        User user = userRepo.findById(userId).orElseThrow();
        List<CartItem> cartItems = cartItemRepo.findByUser(user);

        return cartItems.stream().map(item -> {
            CartItemDto dto = new CartItemDto();
            dto.setId(item.getId());
            dto.setProductId(item.getProduct().getId());
            dto.setProductName(item.getProduct().getName());
            dto.setQuantity(item.getQuantity());
            dto.setUnitPrice(item.getProduct().getPrice());
            dto.setSubtotal(item.getQuantity() * item.getProduct().getPrice());
            dto.setImageUrl(item.getProduct().getImageUrl());
            
            dto.setSize(item.getVariant() != null ? item.getVariant().getSize() : "無尺寸");
            
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public void updateQuantity(Integer cartItemId, Integer quantity) {
        CartItem item = cartItemRepo.findById(cartItemId).orElseThrow();
        item.setQuantity(quantity);
        cartItemRepo.save(item);
    }

    @Override
    public void removeItem(Integer cartItemId) {
        cartItemRepo.deleteById(cartItemId);
    }
}
