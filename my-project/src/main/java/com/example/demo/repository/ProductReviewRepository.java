package com.example.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.model.entity.ProductReview;

public interface ProductReviewRepository extends JpaRepository<ProductReview, Integer> {
    
    // 查詢特定商品的所有評價
	@Query("SELECT r FROM ProductReview r JOIN FETCH r.user WHERE r.product.id = :productId")
	List<ProductReview> findByProductIdWithUser(@Param("productId") Integer productId);

    // 查詢某使用者對某商品的評價（用於檢查是否已留言）
    Optional<ProductReview> findByProductIdAndUser_UserId(Integer productId, Integer userId);
}
