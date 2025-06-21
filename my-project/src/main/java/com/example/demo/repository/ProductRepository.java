package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.entity.Category;
import com.example.demo.model.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    List<Product> findByCategoryId(Integer categoryId);
    long countByCategoryId(Integer categoryId);
    List<Product> findByCategory(Category category);
    
    // 新增：依商品名稱模糊查詢（忽略大小寫）
    List<Product> findByNameContainingIgnoreCase(String keyword);

}
