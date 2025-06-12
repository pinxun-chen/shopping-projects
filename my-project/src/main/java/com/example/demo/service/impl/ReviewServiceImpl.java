package com.example.demo.service.impl;

import com.example.demo.model.dto.ReviewDto;
import com.example.demo.model.entity.Product;
import com.example.demo.model.entity.ProductReview;
import com.example.demo.model.entity.User;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.ProductReviewRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.ReviewService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ProductReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    public void addOrUpdateReview(Integer userId, ReviewDto dto) {
        Optional<ProductReview> existing = reviewRepository.findByProductIdAndUser_UserId(dto.getProductId(), userId);

        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("查無此商品"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("查無此使用者"));

        ProductReview review = existing.orElse(new ProductReview());
        review.setProduct(product);
        review.setUser(user);
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());
        review.setUpdatedAt(LocalDateTime.now());
        if (review.getCreatedAt() == null) {
            review.setCreatedAt(LocalDateTime.now());
        }

        reviewRepository.save(review);
    }

    @Override
    public List<ProductReview> getReviewsByProductId(Integer productId) {
        return reviewRepository.findByProductId(productId);
    }
}
