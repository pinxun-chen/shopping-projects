package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.entity.Order;
import com.example.demo.model.entity.User;

public interface OrderRepository extends JpaRepository<Order, Integer> {
	// 避免查詢 order.getOrderItems() 時多次發 SQL
	@EntityGraph(attributePaths = {"orderItems", "orderItems.product"}) 
	List<Order> findByUser(User user);
	
	// 根據 userId 查詢訂單（方便 service 只持有 userId 時使用）
    @EntityGraph(attributePaths = {"orderItems", "orderItems.product"})
    List<Order> findByUserUserId(Integer userId);

    // 管理者查詢所有訂單，並抓出每張訂單的明細與會員資訊
    @Override
    @EntityGraph(attributePaths = {"orderItems", "orderItems.product", "user"})
    List<Order> findAll();
}
