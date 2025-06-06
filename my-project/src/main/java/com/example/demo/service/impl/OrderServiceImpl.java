package com.example.demo.service.impl;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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
import com.example.demo.model.entity.ProductVariant;
import com.example.demo.model.entity.User;
import com.example.demo.repository.CartItemRepository;
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
    private final UserRepository userRepo;
    
    @Autowired
    private EmailService emailService;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss");

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
        	ProductVariant variant = cartItem.getVariant();
	    	if (variant == null) {
	            throw new RuntimeException("商品「" + cartItem.getProduct().getName() + "」未選擇尺寸，請確認購物車內容");
	        }
	
	        int quantity = cartItem.getQuantity();
	        if (variant.getStock() < quantity) {
	            throw new RuntimeException("商品「" + variant.getProduct().getName() + "」的「" + variant.getSize() + "」尺寸庫存不足");
	        }
	
	        variant.setStock(variant.getStock() - quantity); // 扣庫存
            
            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(variant.getProduct());
            item.setVariant(variant);
            item.setPrice(variant.getProduct().getPrice());
            item.setQuantity(quantity);
            orderItems.add(item);
            total += item.getPrice() * item.getQuantity();
        }

        order.setTotalAmount(total);
        order.setOrderItems(orderItems);

        orderRepo.save(order); // 連同明細一併存入
        cartRepo.deleteAll(cartItems); // 清空購物車

        // 寄送 Email 通知
        if (user.getEmail() != null && !user.getEmail().isEmpty()) {
            String subject = "訂單確認通知";

            // 組裝商品明細 HTML
            StringBuilder itemsHtml = new StringBuilder();
            for (OrderItem item : order.getOrderItems()) {
                String size = (item.getVariant() != null) ? item.getVariant().getSize() : "無";
                itemsHtml.append("<li>")
                    .append(item.getProduct().getName())
                    .append(" - 尺寸：")
                    .append(size)
                    .append(" × ")
                    .append(item.getQuantity())
                    .append("（單價 $")
                    .append(item.getPrice())
                    .append("）</li>");
            }

            // 組裝信件內容
            String content = "<h3>您好，" + user.getUsername() + "</h3>"
                + "<p>您的訂單已成功建立，感謝您的購買。</p>"
                + "<ul>"
                + "<li>訂單編號：<strong>" + order.getId() + "</strong></li>"
                + "</ul>"
                + "<p>訂單商品：</p>"
                + "<ul>" + itemsHtml + "</ul>"
                + "<li>總金額：<strong>$" + order.getTotalAmount() + "</strong></li>"
                + "<li>建立時間：<strong>" + order.getOrderTime().format(FORMATTER) + "</strong></li>"
                + "<p>如有任何問題歡迎與我們聯繫。</p>";

            emailService.sendMail(user.getEmail(), subject, content);
        }

        // 回傳 DTO
        OrderDto dto = new OrderDto();
        dto.setOrderId(order.getId());
        dto.setOrderTime(order.getOrderTime());
        dto.setFormattedTime(order.getOrderTime().format(FORMATTER));
        dto.setTotalAmount(order.getTotalAmount());
        dto.setItems(orderItems.stream().map(oi -> {
            OrderItemDto oidto = new OrderItemDto();
            oidto.setProductId(oi.getProduct().getId());
            oidto.setProductName(oi.getProduct().getName());
            oidto.setPrice(oi.getPrice());
            oidto.setQuantity(oi.getQuantity());
            oidto.setImageUrl(oi.getProduct().getImageUrl());
            ProductVariant variant = oi.getVariant();
            oidto.setSize(variant != null ? variant.getSize() : "無尺寸");
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
            dto.setFormattedTime(order.getOrderTime().format(FORMATTER));
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
                oidto.setImageUrl(oi.getProduct().getImageUrl());
                ProductVariant variant = oi.getVariant();
                oidto.setSize(variant != null ? variant.getSize() : "無尺寸");
                return oidto;
            }).collect(Collectors.toList());

            dto.setItems(itemDtos);
            return dto;
        }).collect(Collectors.toList());
    }

    // 管理者查詢所有訂單
    @Override
    public List<OrderDto> getAllOrders() {
        return orderRepo.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // 將 Order 實體轉換成 OrderDto（不包含 items 的版本）
    private OrderDto convertToDto(Order order) {
        OrderDto dto = new OrderDto();
        dto.setOrderId(order.getId());
        dto.setUserId(order.getUser().getUserId());
        dto.setOrderTime(order.getOrderTime());
        dto.setFormattedTime(order.getOrderTime().format(FORMATTER));
        dto.setTotalAmount(order.getTotalAmount());
        dto.setReceiverName(order.getReceiverName());
        dto.setReceiverPhone(order.getReceiverPhone());
        dto.setReceiverAddress(order.getReceiverAddress());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setEmail(order.getEmail());

        // 商品明細（可選）
        List<OrderItemDto> itemDtos = order.getOrderItems().stream().map(item -> {
            OrderItemDto itemDto = new OrderItemDto();
            itemDto.setProductName(item.getProduct().getName());
            itemDto.setPrice(item.getPrice());
            itemDto.setQuantity(item.getQuantity());
            itemDto.setImageUrl(item.getProduct().getImageUrl());
            ProductVariant variant = item.getVariant();
            itemDto.setSize(variant != null ? variant.getSize() : "無尺寸");
            return itemDto;
        }).collect(Collectors.toList());
        dto.setItems(itemDtos);

        return dto;
    }
}
