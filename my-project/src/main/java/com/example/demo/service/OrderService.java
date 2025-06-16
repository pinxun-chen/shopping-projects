package com.example.demo.service;

import java.util.List;
import com.example.demo.model.dto.OrderDto;
import com.example.demo.model.enums.OrderStatus;

public interface OrderService {
    OrderDto createOrder(OrderDto orderDto);
    List<OrderDto> getOrders(Integer userId);   // 使用者查詢自己的訂單
    List<OrderDto> getAllOrders();              // 管理員查詢所有訂單
}