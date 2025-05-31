package com.example.demo.service;

import com.example.demo.model.entity.Product;
import com.example.demo.model.entity.User;

import java.util.List;

public interface AdminService {
    List<Product> getAllProducts();
    Product addProduct(Product product);
    boolean deleteProduct(Integer productId);
    List<User> getAllUsers();
    boolean updateUserRole(Integer userId, String newRole);
}
