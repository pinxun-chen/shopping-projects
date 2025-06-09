package com.example.demo.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProductSalesDto {
    private Integer productId;
    private String productName;
    private String size;
    private String name;
    private Long totalSold;
}
