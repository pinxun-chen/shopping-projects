package com.example.demo.controller;

import com.example.demo.util.CaptchaUtil;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;

@RestController
public class CaptchaController {

    @GetMapping("/api/captcha")
    public void getCaptcha(HttpServletResponse response, HttpSession session) throws IOException {
        String code = CaptchaUtil.generateCode(4); // 產生 4 位數驗證碼
        session.setAttribute("captcha", code); // 存到 session

        BufferedImage image = CaptchaUtil.generateImage(code);
        response.setContentType("image/png");
        ImageIO.write(image, "png", response.getOutputStream());
    }
}
