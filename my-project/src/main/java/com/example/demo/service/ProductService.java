package com.example.demo.service;

import java.util.List;

import com.example.demo.model.dto.CategoryDto;
import com.example.demo.model.dto.ProductDto;
import com.example.demo.model.entity.Product;

public interface ProductService {
    List<ProductDto> getAllProducts();
    List<ProductDto> getProductsByCategory(Integer categoryId);
    void save(Product product);
    void delete(Integer id);
    List<CategoryDto> getAllCategories();
}
