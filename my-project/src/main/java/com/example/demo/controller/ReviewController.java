package com.example.demo.controller;

import com.example.demo.model.dto.ReplyRequestDto;
import com.example.demo.model.dto.ReviewDto;
import com.example.demo.model.dto.ReviewResponseDto;
import com.example.demo.model.dto.UserCert;
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
    public ResponseEntity<ApiResponse<List<ReviewResponseDto>>> getReviewsByProduct(@PathVariable Integer productId) {
        List<ReviewResponseDto> reviewDtos = reviewService.getReviewsByProductId(productId);
        return ResponseEntity.ok(new ApiResponse<>(200, "查詢成功", reviewDtos));
    }
    
    @DeleteMapping("/{productId}")
    public ResponseEntity<ApiResponse<String>> deleteReview(
            @PathVariable Integer productId,
            HttpSession session) {
        Integer userId = (Integer) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(401).body(new ApiResponse<>(401, "未登入", null));
        }

        reviewService.deleteReview(userId, productId);
        return ResponseEntity.ok(new ApiResponse<>(200, "刪除成功", null));
    }
    
    @PutMapping("/reply/{reviewId}")
    public ResponseEntity<ApiResponse<Void>> replyToReview(
            @PathVariable Integer reviewId,
            @RequestBody ReplyRequestDto request,
            HttpSession session) {

        UserCert cert = (UserCert) session.getAttribute("userCert");
        if (cert == null || !"ADMIN".equals(cert.getRole())) {
            return ResponseEntity.status(403).body(ApiResponse.error(403, "僅限管理員回覆評價"));
        }

        boolean success = reviewService.updateReply(reviewId, request.getReply());
        if (success) {
            return ResponseEntity.ok(ApiResponse.success("回覆成功", null));
        } else {
            return ResponseEntity.status(404).body(ApiResponse.error(404, "找不到該評價"));
        }
    }

    @DeleteMapping("/reply/{reviewId}")
    public ResponseEntity<ApiResponse<Void>> deleteReply(
            @PathVariable Integer reviewId,
            HttpSession session) {

        UserCert cert = (UserCert) session.getAttribute("userCert");
        if (cert == null || !"ADMIN".equals(cert.getRole())) {
            return ResponseEntity.status(403).body(ApiResponse.error(403, "僅限管理員刪除回覆"));
        }

        boolean success = reviewService.deleteReply(reviewId);
        if (success) {
            return ResponseEntity.ok(ApiResponse.success("刪除回覆成功", null));
        } else {
            return ResponseEntity.status(404).body(ApiResponse.error(404, "找不到該評價"));
        }
    }


    
    
}