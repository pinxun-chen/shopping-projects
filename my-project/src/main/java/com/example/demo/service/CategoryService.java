package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import com.example.demo.model.entity.Category;

public interface CategoryService {
	List<Category> getAllCategories();
	Optional<Category> getCategoryByName(String name);
	void createCategory(Category category);
	void updateCategory(Integer id, Category category);
	void deleteCategory(Integer id);
	boolean canDeleteCategory(Integer categoryId);
}
