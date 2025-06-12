package com.example.demo.controller;

import com.example.demo.model.dto.ReviewDto;
import com.example.demo.model.entity.ProductReview;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.ReviewService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/api/review")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ApiResponse<String>> addOrUpdateReview(@RequestBody ReviewDto dto, HttpSession session) {
        Integer userId = (Integer) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(401).body(new ApiResponse<>(401, "請先登入", null));
        }

        reviewService.addOrUpdateReview(userId, dto);
        return ResponseEntity.ok(new ApiResponse<>(200, "評價成功", null));
    }

    @GetMapping("/{productId}")
    public ResponseEntity<ApiResponse<List<ProductReview>>> getReviewsByProduct(@PathVariable Integer productId) {
        List<ProductReview> reviews = reviewService.getReviewsByProductId(productId);
        return ResponseEntity.ok(new ApiResponse<>(200, "查詢成功", reviews));
    }
}