package com.example.demo.service.impl;

import com.example.demo.model.dto.ReviewDto;
import com.example.demo.model.dto.ReviewResponseDto;
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
import java.util.stream.Collectors;

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
        review.setComment(filterBadWords(dto.getComment()));
        review.setUpdatedAt(LocalDateTime.now());
        if (review.getCreatedAt() == null) {
            review.setCreatedAt(LocalDateTime.now());
        }

        reviewRepository.save(review);
    }

    @Override
    public List<ReviewResponseDto> getReviewsByProductId(Integer productId) {
        List<ProductReview> reviews = reviewRepository.findByProductIdWithUser(productId);
        return reviews.stream()
			.map(r -> new ReviewResponseDto(
				    r.getId(),                             
				    r.getUser().getUserId(),
				    r.getRating(),
				    r.getComment(),
				    r.getUser().getUsername(),
				    r.getCreatedAt(),
				    r.getReply()
			))
        	.collect(Collectors.toList());
    }

	@Override
	public void deleteReview(Integer userId, Integer productId) {
		Optional<ProductReview> review = reviewRepository.findByProductIdAndUser_UserId(productId, userId);
	    review.ifPresent(reviewRepository::delete);
	}

	@Override
	public boolean replyToReview(Integer reviewId, String reply) {
		Optional<ProductReview> optionalReview = reviewRepository.findById(reviewId);
	    if (optionalReview.isPresent()) {
	        ProductReview review = optionalReview.get();
	        review.setReply(filterBadWords(reply));
	        reviewRepository.save(review);
	        return true;
	    }
	    return false;
	}

	@Override
	public boolean updateReply(Integer reviewId, String reply) {
		Optional<ProductReview> optional = reviewRepository.findById(reviewId);
	    if (optional.isEmpty()) return false;

	    ProductReview review = optional.get();
	    review.setReply(filterBadWords(reply));
	    reviewRepository.save(review);
	    return true;
	}

	@Override
	public boolean deleteReply(Integer reviewId) {
		Optional<ProductReview> optional = reviewRepository.findById(reviewId);
	    if (optional.isEmpty()) return false;

	    ProductReview review = optional.get();
	    review.setReply(null);
	    reviewRepository.save(review);
	    return true;
	}
	
	// 加入髒話過濾邏輯
    private String filterBadWords(String content) {
        if (content == null) return null;
        List<String> badWords = List.of("幹", "你娘", "去死", "王八蛋", "靠北", "垃圾", "死", "媽的");
        String filtered = content;
        for (String word : badWords) {
            filtered = filtered.replaceAll(word, "**");
        }
        return filtered;
    }

}
