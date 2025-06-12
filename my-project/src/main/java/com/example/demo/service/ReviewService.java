package com.example.demo.service;

import com.example.demo.model.dto.ReviewDto;
import com.example.demo.model.dto.ReviewResponseDto;

import java.util.List;

public interface ReviewService {
    void addOrUpdateReview(Integer userId, ReviewDto dto);

    List<ReviewResponseDto> getReviewsByProductId(Integer productId);
    
    void deleteReview(Integer userId, Integer productId);
    
    boolean replyToReview(Integer reviewId, String reply);
}
