package com.example.demo.model.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.example.demo.model.enums.OrderStatus;

import lombok.Data;

@Data
public class OrderDto {
    
    private Integer orderId;              // 訂單編號
    private Integer userId;               // 使用者 ID
    
    private LocalDateTime orderTime;      // 訂單時間
    private String formattedTime;         // 時間格式化
    private Integer totalAmount;          // 總金額
    private Integer shippingFee;          // 運費

    private String receiverName;          // 收件人姓名
    private String receiverPhone;         // 收件人電話
    private String receiverAddress;       // 收件地址
    
    private String paymentMethod;         // 付款方式（宅配、超商、信用卡）
    private String email;                 // 收件人 Email
    
    private OrderStatus status;           // 訂單狀態

    private List<OrderItemDto> items;     // 商品明細列表
}

