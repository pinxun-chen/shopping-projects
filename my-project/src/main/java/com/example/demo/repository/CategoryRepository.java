package com.example.demo.repository;

import com.example.demo.model.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
    
    Optional<Category> findByName(String name); // 用於後台新增商品用 categoryName 找分類
    Optional<Category> findById(Integer id);
    
    // ai用
    Optional<Category> findByNameContainingIgnoreCase(String name);

}
