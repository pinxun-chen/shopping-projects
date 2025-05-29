package com.example.demo.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.dto.CartAddRequest;
import com.example.demo.model.dto.CartItemDto;
import com.example.demo.model.dto.UpdateCartItemRequestDto;
import com.example.demo.model.dto.UserCert;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.CartService;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    // 取得指定使用者的購物車項目
    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<List<CartItemDto>>> getCart(@PathVariable Integer userId, HttpSession session) {
        UserCert cert = (UserCert) session.getAttribute("userCert");
        if (cert == null || !cert.getUserId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(401, "未登入或使用者錯誤"));
        }

        List<CartItemDto> items = cartService.getCartItems(userId);
        return ResponseEntity.ok(ApiResponse.success("查詢成功", items));
    }


    // 加入商品至購物車
    @PostMapping("/add")
    public ResponseEntity<ApiResponse<Void>> addToCart(
            @RequestBody CartAddRequest request,
            HttpSession session) {

        UserCert cert = (UserCert) session.getAttribute("userCert");

        if (cert == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(401, "請先登入!"));
        }

        // 不再使用前端傳來的 userId，直接從 session 取出
        cartService.addToCart(cert.getUserId(), request.getProductId(), request.getQuantity());
        return ResponseEntity.ok(ApiResponse.success("加入成功", null));
    }

    // 更新購物車項目的商品數量
    @PutMapping("/{cartItemId}")
    public ResponseEntity<ApiResponse<Void>> updateQuantity(
            @PathVariable Integer cartItemId,
            @RequestBody UpdateCartItemRequestDto request
    ) {
        cartService.updateQuantity(cartItemId, request.getQuantity());
        return ResponseEntity.ok(ApiResponse.success("更新成功", null));
    }

    // 從購物車中移除指定項目
    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<ApiResponse<Void>> deleteItem(@PathVariable Integer cartItemId) {
        cartService.removeItem(cartItemId);
        return ResponseEntity.ok(ApiResponse.success("刪除成功", null));
    }
}
