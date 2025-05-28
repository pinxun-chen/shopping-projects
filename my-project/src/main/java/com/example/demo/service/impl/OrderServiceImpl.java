package com.example.demo.service.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

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

    @Override
    @Transactional
    public OrderDto createOrder(Integer userId) {
        User user = userRepo.findById(userId).orElseThrow();
        List<CartItem> cartItems = cartRepo.findByUser(user);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("購物車是空的");
        }

        Order order = new Order();
        order.setUser(user);
        order.setOrderTime(LocalDateTime.now());

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

