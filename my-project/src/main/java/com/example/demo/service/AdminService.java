package com.example.demo.service;

import com.example.demo.model.dto.OrderDto;
import com.example.demo.model.dto.ProductDto;
import com.example.demo.model.dto.ProductSalesDto;
import com.example.demo.model.entity.User;
import com.example.demo.model.enums.OrderStatus;

import java.util.List;

public interface AdminService {
    List<ProductDto> getAllProducts();
    ProductDto addProduct(ProductDto dto);
    boolean deleteProduct(Integer productId);
    
    List<User> getAllUsers();
    boolean updateUserRole(Integer userId, String newRole);
    boolean deleteUser(String username);
    
    // 提供給管理者查詢所有訂單
    List<OrderDto> getAllOrders();
    
    // 提供給管理者刪除訂單
    boolean cancelOrder(Integer orderId);
    
    List<ProductSalesDto> getProductSalesReport();
    
    void updateOrderStatus(Integer orderId, OrderStatus newStatus);
}