package com.example.demo.model.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // 使用者（多對一）
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // 商品（多對一）
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    // 購買數量
    private Integer quantity;
    
    @ManyToOne
    @JoinColumn(name = "variant_id")
    private ProductVariant variant;
}
