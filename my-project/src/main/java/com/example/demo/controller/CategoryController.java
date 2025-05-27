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

import com.example.demo.model.entity.Category;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.response.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {
	
    private final CategoryRepository categoryRepository;

    // 查詢所有分類
    @GetMapping
    public ResponseEntity<ApiResponse<List<Category>>> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        String message = categories.isEmpty() ? "查無分類資料" : "查詢成功";
        return ResponseEntity.ok(ApiResponse.success(message, categories));
    }
    
    // 新增分類
    @PostMapping
    public ResponseEntity<ApiResponse<String>> createCategory(@RequestBody Category category) {
        categoryRepository.save(category);
        return ResponseEntity.ok(ApiResponse.success("新增分類成功", null));
    }

    // 修改分類
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> updateCategory(@PathVariable Integer id, @RequestBody Category category) {
        category.setId(id);
        categoryRepository.save(category);
        return ResponseEntity.ok(ApiResponse.success("修改分類成功", null));
    }

    // 刪除分類
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteCategory(@PathVariable Integer id) {
        categoryRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("刪除分類成功", null));
    }
}
