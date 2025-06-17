package com.example.demo.model.dto;

import java.util.List;

import lombok.Data;

@Data
public class ProductDto {
    private Integer id;
    private String name;
    private String description;
    private Integer price;
    private String imageUrl;
    private String categoryName;
    private List<ProductVariantDto> variants;
}
