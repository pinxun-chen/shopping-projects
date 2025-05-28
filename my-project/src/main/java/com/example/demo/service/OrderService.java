package com.example.demo.service;

import java.util.List;

import com.example.demo.model.dto.OrderDto;

public interface OrderService {
    OrderDto createOrder(Integer userId);
    List<OrderDto> getOrders(Integer userId);
}
