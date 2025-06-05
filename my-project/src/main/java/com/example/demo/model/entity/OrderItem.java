package com.example.demo.model.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // 所屬訂單
    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    // 商品
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    // 單價（下訂當下的商品價格）
    private Integer price;

    // 數量
    private Integer quantity;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "variant_id")
    private ProductVariant variant;
}
