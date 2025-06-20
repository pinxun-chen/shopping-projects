package com.example.demo.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.model.dto.ProductDetailDto;
import com.example.demo.model.dto.ProductDto;
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
    public ResponseEntity<ApiResponse<String>> createProduct(@RequestBody ProductDto dto) {
        productService.createProductWithVariants(dto);
        return ResponseEntity.ok(ApiResponse.success("新增成功", null));
    }


    // 修改商品
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> updateProduct(@PathVariable Integer id, @RequestBody ProductDto dto) {
        dto.setId(id);
        productService.updateProductWithVariants(dto);
        return ResponseEntity.ok(ApiResponse.success("修改成功", null));
    }


    // 刪除商品
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteProduct(@PathVariable Integer id) {
        productService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("刪除成功", null));
    }
    
    // 根據分類名稱查詢商品（首頁用）
    @GetMapping("/category/name/{categoryName}")
    public ResponseEntity<ApiResponse<List<ProductDto>>> getByCategoryName(@PathVariable String categoryName) {
        List<ProductDto> products = productService.getProductsByCategoryName(categoryName);
        String message = products.isEmpty() ? "查無此分類的商品" : "查詢成功";
        return ResponseEntity.ok(ApiResponse.success(message, products));
    }
    
    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<ProductDto>> createProductWithImage(
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam Integer price,
            @RequestParam Integer categoryId,
            @RequestParam("image") MultipartFile imageFile
    ) {
        ProductDto savedDto = productService.createProductWithImage(name, description, price, categoryId, imageFile);
        return ResponseEntity.ok(ApiResponse.success("新增成功", savedDto));
    }

    // 上傳圖片
    @PostMapping("/upload-image")
    public ResponseEntity<ApiResponse<String>> uploadImage(@RequestParam MultipartFile file) {
        try {
            String imageUrl = productService.uploadImage(file);
            return ResponseEntity.ok(ApiResponse.success("圖片上傳成功", imageUrl));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error(500, e.getMessage()));
        }
    }
    
}

