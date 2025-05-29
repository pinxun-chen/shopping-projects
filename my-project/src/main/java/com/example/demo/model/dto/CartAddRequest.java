package com.example.demo.model.dto;

import lombok.Data;

@Data
public class CartAddRequest {
    
    private Integer productId;
    private Integer quantity;
}
