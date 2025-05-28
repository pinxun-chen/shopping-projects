package com.example.demo.service;

import java.util.List;

import com.example.demo.model.dto.CartItemDto;

public interface CartService {
    void addToCart(Integer userId, Integer productId, Integer quantity);
    List<CartItemDto> getCartItems(Integer userId);
    void updateQuantity(Integer cartItemId, Integer quantity);
    void removeItem(Integer cartItemId);
}
