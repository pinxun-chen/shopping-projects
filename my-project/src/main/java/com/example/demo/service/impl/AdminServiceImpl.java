package com.example.demo.service.impl;

import com.example.demo.model.dto.OrderDto;
import com.example.demo.model.dto.OrderItemDto;
import com.example.demo.model.dto.ProductDto;
import com.example.demo.model.entity.Category;
import com.example.demo.model.entity.Order;
import com.example.demo.model.entity.Product;
import com.example.demo.model.entity.User;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final ProductRepository productRepo;
    private final CategoryRepository categoryRepo;
    private final OrderRepository orderRepo;
    private final UserRepository userRepo;

    @Override
    public List<ProductDto> getAllProducts() {
        return productRepo.findAll().stream().map(p -> {
            ProductDto dto = new ProductDto();
            dto.setId(p.getId());
            dto.setName(p.getName());
            dto.setDescription(p.getDescription());
            dto.setPrice(p.getPrice());
            dto.setImageUrl(p.getImageUrl());
            dto.setCategoryName(p.getCategory().getName());
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public ProductDto addProduct(ProductDto dto) {
        Category category = categoryRepo.findByName(dto.getCategoryName())
                .orElseThrow(() -> new RuntimeException("找不到分類: " + dto.getCategoryName()));

        Product p = new Product();
        p.setName(dto.getName());
        p.setDescription(dto.getDescription());
        p.setPrice(dto.getPrice());
        p.setImageUrl(dto.getImageUrl());
        p.setCategory(category);

        Product saved = productRepo.save(p);

        dto.setId(saved.getId());
        return dto;
    }

    @Override
    public boolean deleteProduct(Integer productId) {
        if (productRepo.existsById(productId)) {
            productRepo.deleteById(productId);
            return true;
        }
        return false;
    }

    @Override
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    @Override
    public boolean updateUserRole(Integer userId, String newRole) {
        return userRepo.findById(userId).map(user -> {
            user.setRole(newRole);
            userRepo.save(user);
            return true;
        }).orElse(false);
    }
    
    @Override
    public List<OrderDto> getAllOrders() {
        List<Order> orders = orderRepo.findAll(); // 需有 fetch orderItems + product

        return orders.stream().map(order -> {
            OrderDto dto = new OrderDto();
            dto.setOrderId(order.getId());
            dto.setUserId(order.getUser().getUserId());
            dto.setOrderTime(order.getOrderTime());
            dto.setTotalAmount(order.getTotalAmount());
            dto.setReceiverName(order.getReceiverName());
            dto.setReceiverPhone(order.getReceiverPhone());
            dto.setReceiverAddress(order.getReceiverAddress());
            dto.setPaymentMethod(order.getPaymentMethod());
            dto.setEmail(order.getEmail());

            List<OrderItemDto> items = order.getOrderItems().stream().map(item -> {
                OrderItemDto itemDto = new OrderItemDto();
                itemDto.setProductName(item.getProduct().getName());
                itemDto.setQuantity(item.getQuantity());
                itemDto.setPrice(item.getPrice());
                return itemDto;
            }).collect(Collectors.toList());

            dto.setItems(items);
            return dto;
        }).collect(Collectors.toList());
    }
}