package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.entity.Order;
import com.example.demo.model.entity.User;

public interface OrderRepository extends JpaRepository<Order, Integer> {
	@EntityGraph(attributePaths = {"orderItems", "orderItems.product"})
	List<Order> findByUser(User user);
}
