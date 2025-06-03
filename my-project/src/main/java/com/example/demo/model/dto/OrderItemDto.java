package com.example.demo.model.dto;

import lombok.Data;

@Data
public class OrderItemDto {
    private Integer productId;
    private String productName;
    private Integer quantity;
    private Integer price;// 單價
    private String imageUrl;
}
