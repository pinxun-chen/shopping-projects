package com.example.demo.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.model.entity.Product;
import com.example.demo.model.entity.User;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.AdminService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

	private final ProductRepository productRepo;
	private final UserRepository userRepo;
	
	@Override
	public List<Product> getAllProducts() {
		return productRepo.findAll();
	}

	@Override
	public Product addProduct(Product product) {
		return productRepo.save(product);
	}

	@Override
	public boolean deleteProduct(Integer productId) {
		if(productRepo.existsById(productId)) {
			productRepo.deleteById(productId);
			return true;
		}
		return false;
	}

	@Override
	public List<User> getAllUsers() {
		return userRepo.findAll();
	}

	@Override
	public boolean updateUserRole(Integer userId, String newRole) {
		return userRepo.findById(userId).map(user -> {
			user.setRole(newRole);
			userRepo.save(user);
			return true;
		}).orElse(false);
	}

}
