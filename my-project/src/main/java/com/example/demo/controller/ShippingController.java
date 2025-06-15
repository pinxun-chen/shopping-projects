package com.example.demo.controller;

import com.example.demo.model.dto.ShippingFeeRequest;
import com.example.demo.model.dto.ShippingFeeResponse;
import com.example.demo.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/shipping")
public class ShippingController {

    @PostMapping("/fee")
    public ResponseEntity<ApiResponse<ShippingFeeResponse>> calculateFee(@RequestBody ShippingFeeRequest request) {
        // 基本驗證（避免負金額）
        if (request.getOrderAmount() < 0) {
            return ResponseEntity
                    .badRequest()
                    .body(ApiResponse.error(400, "金額不可小於 0"));
        }

        int fee = request.getOrderAmount() >= 2000 ? 0 : 80;

        ShippingFeeResponse response = new ShippingFeeResponse();
        response.setShippingFee(fee);
        response.setTotalAmount(request.getOrderAmount() + fee);

        return ResponseEntity.ok(ApiResponse.success("運費計算成功", response));
    }
}
