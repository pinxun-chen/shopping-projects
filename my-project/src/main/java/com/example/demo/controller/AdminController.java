package com.example.demo.controller;

import com.example.demo.model.dto.ProductDto;
import com.example.demo.model.dto.ProductSalesDto;
import com.example.demo.model.entity.User;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.AdminService;

import jakarta.servlet.http.HttpSession;
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
    
    // 刪除使用者帳號
    @DeleteMapping("/users/delete/{username}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(
            @PathVariable String username,
            HttpSession session) {

    	// 取得登入者的認證資訊
        Object cert = session.getAttribute("userCert");
        
        // Debug 輸出 session 內容與欲刪除的帳號
        System.out.println("===== 刪除帳號請求 =====");
        System.out.println("Session userCert: " + cert);
        System.out.println("欲刪除帳號: " + username);

        // 防止刪除自己帳號
        if (cert instanceof com.example.demo.model.dto.UserCert userCert &&
            userCert.getUsername().equals(username)) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(400, "不能刪除自己帳號"));
        }

        boolean result = adminService.deleteUser(username);
        if (result) {
            return ResponseEntity.ok(ApiResponse.success("帳號與訂單已成功刪除", null));
        } else {
            return ResponseEntity.status(404)
                    .body(ApiResponse.error(404, "找不到該帳號"));
        }
    }



    // 查詢所有訂單
    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<?>> getAllOrders() {
        return ResponseEntity.ok(ApiResponse.success("查詢成功", adminService.getAllOrders()));
    }
    
    // 刪除訂單
    @DeleteMapping("/orders/{orderId}")
    public ResponseEntity<ApiResponse<Void>> cancelOrder(@PathVariable Integer orderId) {
        boolean result = adminService.cancelOrder(orderId);
        if (result) {
            return ResponseEntity.ok(ApiResponse.success("訂單已取消", null));
        } else {
            return ResponseEntity.status(404).body(ApiResponse.error(404, "查無此訂單"));
        }
       
    }
    
    // 商品銷售報表
    @GetMapping("/report/product-sales")
    public ResponseEntity<ApiResponse<List<ProductSalesDto>>> getProductSalesReport() {
        List<ProductSalesDto> report = adminService.getProductSalesReport();
        return ResponseEntity.ok(ApiResponse.success("報表查詢成功", report));
    }
    
}
