package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import com.example.demo.model.dto.CategoryDto;

public interface CategoryService {
    // 回傳 DTO 給前端
    List<CategoryDto> getAllCategoryDtos();

    // 根據名稱查詢實體（後端內部使用，可保留）
    Optional<CategoryDto> getCategoryByName(String name);

    // 建立分類（回傳包含 id 的 DTO）
    CategoryDto createCategory(CategoryDto dto);

    // 更新分類
    void updateCategory(Integer id, CategoryDto dto);

    // 刪除分類
    void deleteCategory(Integer id);

    // 驗證是否可刪除
    boolean canDeleteCategory(Integer categoryId);
}
