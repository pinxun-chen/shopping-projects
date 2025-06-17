package com.example.demo.controller;

import com.example.demo.model.dto.CategoryDto;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.CategoryService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/category")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    // 查詢所有分類（使用 DTO 回傳）
    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryDto>>> getAllCategories() {
        List<CategoryDto> categories = categoryService.getAllCategoryDtos();
        String message = categories.isEmpty() ? "查無分類資料" : "查詢成功";
        return ResponseEntity.ok(ApiResponse.success(message, categories));
    }

    // 新增分類（接收並回傳 DTO）
    @PostMapping
    public ResponseEntity<ApiResponse<CategoryDto>> createCategory(@RequestBody CategoryDto dto) {
        CategoryDto created = categoryService.createCategory(dto);
        return ResponseEntity.ok(ApiResponse.success("新增分類成功", created));
    }

    // 修改分類（只接收 DTO）
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> updateCategory(@PathVariable Integer id, @RequestBody CategoryDto dto) {
        categoryService.updateCategory(id, dto);
        return ResponseEntity.ok(ApiResponse.success("修改分類成功", null));
    }

    // 刪除分類（驗證是否可刪除）
    @DeleteMapping("/name/{name}")
    public ResponseEntity<ApiResponse<String>> deleteCategoryByName(@PathVariable String name) {
        Optional<CategoryDto> categoryOpt = categoryService.getCategoryByName(name);

        if (categoryOpt.isEmpty()) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error(400, "找不到名稱為 " + name + " 的分類"));
        }

        CategoryDto category = categoryOpt.get();

        if (!categoryService.canDeleteCategory(category.getId())) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error(400, "該分類下仍有商品，無法刪除"));
        }

        categoryService.deleteCategory(category.getId());
        return ResponseEntity.ok(ApiResponse.success("刪除分類成功", null));
    }
}