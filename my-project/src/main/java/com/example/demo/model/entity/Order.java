package com.example.demo.model.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@Table(name = "orders") // 防止與 SQL 保留字衝突
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // 訂單所屬使用者
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // 訂單建立時間
    private LocalDateTime orderTime;

    // 訂單總金額
    private Integer totalAmount;

    // 訂單明細
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> orderItems;
}
