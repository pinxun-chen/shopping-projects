package com.example.demo.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.dto.OrderDto;
import com.example.demo.model.dto.UserCert;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.OrderService;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // 建立訂單：將指定使用者的購物車轉為訂單
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<OrderDto>> createOrder(
            HttpSession session,
            @RequestBody OrderDto orderDto // 接收前端傳來的收件資訊
    ) {
        UserCert cert = (UserCert) session.getAttribute("userCert");

        if (cert == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(401, "請先登入"));
        }

        // 補上 userId
        orderDto.setUserId(cert.getUserId());

        OrderDto createdOrder = orderService.createOrder(orderDto); // 改為接受 DTO
        return ResponseEntity.ok(ApiResponse.success("訂單建立成功", createdOrder));
    }


    // 查詢指定使用者的所有訂單
    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<List<OrderDto>>> getOrders(@PathVariable Integer userId, HttpSession session) {
        UserCert cert = (UserCert) session.getAttribute("userCert");

        if (cert == null || !cert.getUserId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(401, "無權查詢此訂單"));
        }

        List<OrderDto> orders = orderService.getOrders(userId);
        String message = orders.isEmpty() ? "沒有訂單紀錄" : "查詢成功";
        return ResponseEntity.ok(ApiResponse.success(message, orders));
    }
}
