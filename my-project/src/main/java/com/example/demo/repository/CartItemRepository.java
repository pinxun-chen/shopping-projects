package com.example.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.entity.CartItem;
import com.example.demo.model.entity.Product;
import com.example.demo.model.entity.ProductVariant;
import com.example.demo.model.entity.User;

public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
    List<CartItem> findByUser(User user);
    Optional<CartItem> findByUserAndProduct(User user, Product product);
    Optional<CartItem> findByUserAndProductAndVariant(User user, Product product, ProductVariant variant);
    void deleteByUser(User user);
}