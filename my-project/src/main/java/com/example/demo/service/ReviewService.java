package com.example.demo.service;

import com.example.demo.model.dto.ReviewDto;
import com.example.demo.model.entity.ProductReview;

import java.util.List;

public interface ReviewService {
    void addOrUpdateReview(Integer userId, ReviewDto dto);

    List<ProductReview> getReviewsByProductId(Integer productId);
}
