package com.example.demo.controller;

import com.example.demo.model.dto.ProductDto;
import com.example.demo.model.entity.User;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // 查詢所有商品
    @GetMapping("/products")
    public ResponseEntity<ApiResponse<List<ProductDto>>> getAllProducts() {
        List<ProductDto> products = adminService.getAllProducts();
        return ResponseEntity.ok(ApiResponse.success("查詢成功", products));
    }

    // 新增商品
    @PostMapping("/products")
    public ResponseEntity<ApiResponse<ProductDto>> addProduct(@RequestBody ProductDto dto) {
        ProductDto result = adminService.addProduct(dto);
        return ResponseEntity.ok(ApiResponse.success("新增成功", result));
    }

    // 刪除商品
    @DeleteMapping("/products/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Integer id) {
        boolean result = adminService.deleteProduct(id);
        if (result) {
            return ResponseEntity.ok(ApiResponse.success("刪除成功", null));
        } else {
            return ResponseEntity.status(404).body(ApiResponse.error(404, "查無商品"));
        }
    }

    // 查詢所有使用者
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        List<User> users = adminService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success("查詢成功", users));
    }

    // 更新使用者角色
    @PutMapping("/users/{id}/role")
    public ResponseEntity<ApiResponse<Void>> updateUserRole(@PathVariable Integer id, @RequestParam String role) {
        boolean result = adminService.updateUserRole(id, role);
        if (result) {
            return ResponseEntity.ok(ApiResponse.success("更新成功", null));
        } else {
            return ResponseEntity.status(404).body(ApiResponse.error(404, "使用者不存在"));
        }
    }

    // 查詢所有訂單
    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<?>> getAllOrders() {
        return ResponseEntity.ok(ApiResponse.success("查詢成功", adminService.getAllOrders()));
    }
}
