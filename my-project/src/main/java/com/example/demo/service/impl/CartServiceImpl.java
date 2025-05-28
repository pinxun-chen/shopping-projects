package com.example.demo.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.demo.model.dto.CartItemDto;
import com.example.demo.model.entity.CartItem;
import com.example.demo.model.entity.Product;
import com.example.demo.model.entity.User;
import com.example.demo.repository.CartItemRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.CartService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartItemRepository cartItemRepo;
    private final ProductRepository productRepo;
    private final UserRepository userRepo;

    @Override
    public void addToCart(Integer userId, Integer productId, Integer quantity) {
        User user = userRepo.findById(userId).orElseThrow();
        Product product = productRepo.findById(productId).orElseThrow();

        CartItem item = new CartItem();
        item.setUser(user);
        item.setProduct(product);
        item.setQuantity(quantity);

        cartItemRepo.save(item);
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
