package com.example.demo.model.dto;

import lombok.Data;
// 新增或更新評價用
@Data
public class ReviewDto {
	private Integer productId;
	private int rating;
	private String comment;
}
