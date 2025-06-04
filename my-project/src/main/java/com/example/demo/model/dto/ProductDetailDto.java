package com.example.demo.model.dto;

import java.util.List;

import lombok.Data;

@Data
public class ProductDetailDto {
    private Integer Id;
    private String name;
    private String description;
    private Integer price;
    private String imageUrl;
    private String categoryName;
    private Integer categoryId; 

    private List<ProductVariantDto> variants;
}
