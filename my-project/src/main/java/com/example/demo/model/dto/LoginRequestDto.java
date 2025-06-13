package com.example.demo.model.dto;

import lombok.Data;

@Data
public class LoginRequestDto {
    private String username;
    private String password;
    private String captcha;
}