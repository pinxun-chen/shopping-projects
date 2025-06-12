package com.example.demo.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
// 回傳用
@Data
@AllArgsConstructor
public class ReviewResponseDto {
	private Integer id;
	private Integer userId;
	private int rating;
	private String comment;
	private String username;
	private LocalDateTime createdAt;
	private String reply;
}
