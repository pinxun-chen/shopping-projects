package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.demo.model.dto.ProductSalesDto;
import com.example.demo.model.entity.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {
	// 報表
	@Query("SELECT new com.example.demo.model.dto.ProductSalesDto(" +
		       "p.id, p.name, v.size, c.name, SUM(oi.quantity)) " +
		       "FROM OrderItem oi " +
		       "JOIN oi.variant v " +
		       "JOIN v.product p " +
		       "JOIN p.category c " +  
		       "GROUP BY p.id, p.name, v.size, c.name " +
		       "ORDER BY p.id ASC")
	List<ProductSalesDto> findProductSalesReport();


}