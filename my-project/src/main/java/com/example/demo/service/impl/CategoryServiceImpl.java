package com.example.demo.service.impl;

import com.example.demo.model.dto.CategoryDto;
import com.example.demo.model.entity.Category;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.service.CategoryService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    // 封裝 Entity → DTO
    private CategoryDto convertToDto(Category category) {
        CategoryDto dto = new CategoryDto();
        dto.setId(category.getId()); // ✅ 補上 id 設定
        dto.setName(category.getName());
        return dto;
    }

    // 取得全部分類 (DTO)
    @Override
    public List<CategoryDto> getAllCategoryDtos() {
        return categoryRepository.findAll().stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    // 新增分類
    @Override
    public CategoryDto createCategory(CategoryDto dto) {
        // 可選：驗證名稱是否已存在
        if (categoryRepository.findByName(dto.getName()).isPresent()) {
            throw new RuntimeException("分類名稱已存在");
        }

        Category category = new Category();
        category.setName(dto.getName());
        Category saved = categoryRepository.save(category);

        return convertToDto(saved); // ✅ 回傳包含 id 的 DTO
    }

    // 修改分類
    @Override
    public void updateCategory(Integer id, CategoryDto dto) {
        Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("找不到分類 ID: " + id));
        category.setName(dto.getName());
        categoryRepository.save(category);
    }

    // 刪除分類
    @Override
    public void deleteCategory(Integer id) {
        categoryRepository.deleteById(id);
    }

    // 驗證是否可刪除（是否有商品關聯）
    @Override
    public boolean canDeleteCategory(Integer categoryId) {
        return productRepository.countByCategoryId(categoryId) == 0;
    }

    // 根據名稱查詢（回傳 DTO）
    @Override
    public Optional<CategoryDto> getCategoryByName(String name) {
        return categoryRepository.findByName(name).map(this::convertToDto);
    }
}
