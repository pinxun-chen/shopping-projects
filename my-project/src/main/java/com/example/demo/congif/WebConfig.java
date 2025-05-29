package com.example.demo.congif;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins("http://localhost:5173") // 確保與你前端網址相符
            .allowedMethods("*")
            .allowCredentials(true); // 這行會允許 Cookie / Session 傳送
    }
}
