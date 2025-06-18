package com.example.demo.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.example.demo.model.dto.CategoryDto;
import com.example.demo.model.dto.ProductDetailDto;
import com.example.demo.model.dto.ProductDto;

public interface ProductService {
    List<ProductDto> getAllProducts();
    List<ProductDto> getProductsByCategory(Integer categoryId);
    // void save(Product product);
    void delete(Integer id);
    List<CategoryDto> getAllCategories();
    // 查詢單一商品和尺寸
    ProductDetailDto getProductDetailWithVariants(Integer productId);
    List<ProductDto> getProductsByCategoryName(String categoryName);
    void createProductWithVariants(ProductDto dto);
    void updateProductWithVariants(ProductDto dto);
    ProductDto createProductWithImage(String name, String description, Integer price, Integer categoryId, MultipartFile imageFile);
}
