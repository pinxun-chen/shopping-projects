package com.example.demo.service.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.dto.OrderDto;
import com.example.demo.model.dto.OrderItemDto;
import com.example.demo.model.entity.CartItem;
import com.example.demo.model.entity.Order;
import com.example.demo.model.entity.OrderItem;
import com.example.demo.model.entity.User;
import com.example.demo.repository.CartItemRepository;
import com.example.demo.repository.OrderItemRepository;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.EmailService;
import com.example.demo.service.OrderService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final CartItemRepository cartRepo;
    private final OrderRepository orderRepo;
    private final OrderItemRepository orderItemRepo;
    private final UserRepository userRepo;
    @Autowired
    private EmailService emailService;

    @Override
    @Transactional
    public OrderDto createOrder(OrderDto orderDto) {
        Integer userId = orderDto.getUserId(); // 從 DTO 取得 userId
        User user = userRepo.findById(userId).orElseThrow();
        List<CartItem> cartItems = cartRepo.findByUser(user);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("購物車是空的");
        }

        Order order = new Order();
        order.setUser(user);
        order.setOrderTime(LocalDateTime.now());
        
        // 從前端接收資訊
        order.setReceiverName(orderDto.getReceiverName());
        order.setReceiverPhone(orderDto.getReceiverPhone());
        order.setReceiverAddress(orderDto.getReceiverAddress());
        order.setPaymentMethod(orderDto.getPaymentMethod());
        order.setEmail(orderDto.getEmail());

        int total = 0;
        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem cartItem : cartItems) {
            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(cartItem.getProduct());
            item.setPrice(cartItem.getProduct().getPrice());
            item.setQuantity(cartItem.getQuantity());
            orderItems.add(item);
            total += item.getPrice() * item.getQuantity();
        }

        order.setTotalAmount(total);
        order.setOrderItems(orderItems);

        orderRepo.save(order); // 連同明細一併存入
        cartRepo.deleteAll(cartItems); // 清空購物車
        
        // 寄送 Email 通知
        if (user.getEmail() != null && !user.getEmail().isEmpty()) {
            String subject = "🛒 訂單確認通知";
            String content = "<h3>您好，" + user.getUsername() + "</h3>"
                + "<p>您的訂單已成功建立，感謝您的購買。</p>"
                + "<ul>"
                + "<li>訂單編號：<strong>" + order.getId() + "</strong></li>"
                + "<li>總金額：<strong>$" + order.getTotalAmount() + "</strong></li>"
                + "<li>建立時間：<strong>" + order.getOrderTime() + "</strong></li>"
                + "</ul>"
                + "<p>如有任何問題歡迎與我們聯繫。</p>";
            emailService.sendMail(user.getEmail(), subject, content);
        }

        // 回傳 DTO
        OrderDto dto = new OrderDto();
        dto.setOrderId(order.getId());
        dto.setOrderTime(order.getOrderTime());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setItems(orderItems.stream().map(oi -> {
            OrderItemDto oidto = new OrderItemDto();
            oidto.setProductId(oi.getProduct().getId());
            oidto.setProductName(oi.getProduct().getName());
            oidto.setPrice(oi.getPrice());
            oidto.setQuantity(oi.getQuantity());
            return oidto;
        }).collect(Collectors.toList()));
        return dto;
    }

    @Override
    public List<OrderDto> getOrders(Integer userId) {
        User user = userRepo.findById(userId).orElseThrow();
        List<Order> orders = orderRepo.findByUser(user);

        return orders.stream().map(order -> {
            OrderDto dto = new OrderDto();
            dto.setOrderId(order.getId());
            dto.setOrderTime(order.getOrderTime());
            dto.setTotalAmount(order.getTotalAmount());
            dto.setReceiverName(order.getReceiverName());
            dto.setReceiverPhone(order.getReceiverPhone());
            dto.setReceiverAddress(order.getReceiverAddress());
            dto.setPaymentMethod(order.getPaymentMethod());
            dto.setEmail(order.getEmail());

            List<OrderItemDto> itemDtos = order.getOrderItems().stream().map(oi -> {
                OrderItemDto oidto = new OrderItemDto();
                oidto.setProductId(oi.getProduct().getId());
                oidto.setProductName(oi.getProduct().getName());
                oidto.setQuantity(oi.getQuantity());
                oidto.setPrice(oi.getPrice());
                return oidto;
            }).collect(Collectors.toList());

            dto.setItems(itemDtos);
            return dto;
        }).collect(Collectors.toList());
    }
}

