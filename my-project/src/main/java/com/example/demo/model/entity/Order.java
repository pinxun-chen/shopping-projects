package com.example.demo.model.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

import com.example.demo.model.enums.OrderStatus;

@Entity
@Data
@Table(name = "orders") 
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
    
    // 運費
    private Integer shippingFee;

    // 付款方式（例如：信用卡、7-11）
    private String paymentMethod;

    // 收件人資訊
    private String receiverName;
    private String receiverPhone;
    private String receiverAddress;
    private String email; 
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status = OrderStatus.待出貨;

    // 訂單明細
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> orderItems;
}
