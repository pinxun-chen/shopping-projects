package com.example.demo.model.dto;

import lombok.Data;

@Data
public class CartItemDto {
    private Integer id;
    private Integer productId;
    private String productName;
    private Integer quantity;
    private Integer unitPrice;
    private Integer subtotal;
    private String imageUrl;
    private String size;
}
