package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.entity.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {
}