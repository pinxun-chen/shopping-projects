package com.example.demo.model.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderDto {
    private Integer orderId;
    private LocalDateTime orderTime;
    private Integer totalAmount;
    private List<OrderItemDto> items;
}
