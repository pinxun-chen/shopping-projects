package com.example.demo.model.dto;

import lombok.Data;

@Data
public class ReviewDto {
	private Integer productId;
	private int rating;
	private String comment;
}
