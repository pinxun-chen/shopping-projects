package com.example.demo.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.dto.ProductDetailDto;
import com.example.demo.model.dto.ProductDto;
import com.example.demo.model.entity.Product;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.ProductService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // 查詢所有商品
    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductDto>>> getAllProducts() {
        List<ProductDto> products = productService.getAllProducts();
        String message = products.isEmpty() ? "查無商品資料" : "查詢成功";
        return ResponseEntity.ok(ApiResponse.success(message, products));
    }
    
    // 根據分類 ID 查詢商品
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponse<List<ProductDto>>> getByCategory(@PathVariable Integer categoryId) {
        List<ProductDto> products = productService.getProductsByCategory(categoryId);
        String message = products.isEmpty() ? "查無此分類的商品" : "查詢成功";
        return ResponseEntity.ok(ApiResponse.success(message, products));
    }
    
    // 查詢單一商品（包含尺寸與庫存）
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDetailDto>> getProductDetail(@PathVariable Integer id) {
        ProductDetailDto dto = productService.getProductDetailWithVariants(id);
        return ResponseEntity.ok(ApiResponse.success("查詢成功", dto));
    }
    
    // 新增商品
    @PostMapping
    public ResponseEntity<ApiResponse<String>> createProduct(@RequestBody Product product) {
        productService.save(product);
        return ResponseEntity.ok(ApiResponse.success("新增成功", null));
    }

    // 修改商品
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> updateProduct(@PathVariable Integer id, @RequestBody Product product) {
        product.setId(id);
        productService.save(product);
        return ResponseEntity.ok(ApiResponse.success("修改成功", null));
    }

    // 刪除商品
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteProduct(@PathVariable Integer id) {
        productService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("刪除成功", null));
    }
    
}

