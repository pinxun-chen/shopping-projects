package com.example.demo.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.dto.OrderDto;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.OrderService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // 建立訂單：將指定使用者的購物車轉為訂單
    @PostMapping("/{userId}")
    public ResponseEntity<ApiResponse<OrderDto>> createOrder(@PathVariable Integer userId) {
        OrderDto createdOrder = orderService.createOrder(userId);
        return ResponseEntity.ok(ApiResponse.success("訂單建立成功", createdOrder));
    }

    // 查詢指定使用者的所有訂單
    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<List<OrderDto>>> getOrders(@PathVariable Integer userId) {
        List<OrderDto> orders = orderService.getOrders(userId);
        String message = orders.isEmpty() ? "沒有訂單紀錄" : "查詢成功";
        return ResponseEntity.ok(ApiResponse.success(message, orders));
    }
}
