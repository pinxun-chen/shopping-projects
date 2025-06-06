package com.example.demo.controller;

import com.example.demo.model.entity.Category;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.CategoryService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/category")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    // 查詢所有分類
    @GetMapping
    public ResponseEntity<ApiResponse<List<Category>>> getAllCategories() {
        List<Category> categories = categoryService.getAllCategories();
        String message = categories.isEmpty() ? "查無分類資料" : "查詢成功";
        return ResponseEntity.ok(ApiResponse.success(message, categories));
    }

    // 新增分類
    @PostMapping
    public ResponseEntity<ApiResponse<String>> createCategory(@RequestBody Category category) {
        categoryService.createCategory(category);
        return ResponseEntity.ok(ApiResponse.success("新增分類成功", null));
    }

    // 修改分類
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> updateCategory(@PathVariable Integer id, @RequestBody Category category) {
        categoryService.updateCategory(id, category);
        return ResponseEntity.ok(ApiResponse.success("修改分類成功", null));
    }

    // 刪除分類
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteCategory(@PathVariable Integer id) {
        if (!categoryService.canDeleteCategory(id)) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error(400, "該分類下仍有商品，無法刪除"));
        }

        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.success("刪除分類成功", null));
    }
}
