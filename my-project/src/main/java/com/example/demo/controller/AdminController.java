package com.example.demo.controller;

import com.example.demo.model.entity.Product;
import com.example.demo.model.entity.User;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/products")
    public ResponseEntity<ApiResponse<List<Product>>> getAllProducts() {
        return ResponseEntity.ok(ApiResponse.success("查詢成功", adminService.getAllProducts()));
    }

    @PostMapping("/products")
    public ResponseEntity<ApiResponse<Product>> addProduct(@RequestBody Product product) {
        return ResponseEntity.ok(ApiResponse.success("新增成功", adminService.addProduct(product)));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Integer id) {
        boolean result = adminService.deleteProduct(id);
        if (result) {
            return ResponseEntity.ok(ApiResponse.success("刪除成功", null));
        } else {
            return ResponseEntity.status(404).body(ApiResponse.error(404, "查無商品"));
        }
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success("查詢成功", adminService.getAllUsers()));
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<ApiResponse<Void>> updateUserRole(@PathVariable Integer id, @RequestParam String role) {
        boolean result = adminService.updateUserRole(id, role);
        if (result) {
            return ResponseEntity.ok(ApiResponse.success("更新成功", null));
        } else {
            return ResponseEntity.status(404).body(ApiResponse.error(404, "使用者不存在"));
        }
    }
}