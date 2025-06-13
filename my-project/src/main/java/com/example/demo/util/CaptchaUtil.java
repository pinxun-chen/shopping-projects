package com.example.demo.util;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.util.Random;

public class CaptchaUtil {

    public static String generateCode(int length) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        Random rand = new Random();
        StringBuilder sb = new StringBuilder();
        for(int i = 0; i < length; i++) {
            sb.append(chars.charAt(rand.nextInt(chars.length())));
        }
        return sb.toString();
    }

    public static BufferedImage generateImage(String code) {
        int width = 120;
        int height = 40;
        BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        Graphics2D g = image.createGraphics();

        // 背景
        g.setColor(Color.WHITE);
        g.fillRect(0, 0, width, height);

        // 干擾線
        g.setColor(Color.LIGHT_GRAY);
        for (int i = 0; i < 5; i++) {
            int x1 = (int)(Math.random() * width);
            int y1 = (int)(Math.random() * height);
            int x2 = (int)(Math.random() * width);
            int y2 = (int)(Math.random() * height);
            g.drawLine(x1, y1, x2, y2);
        }

        // 驗證碼文字
        g.setFont(new Font("Arial", Font.BOLD, 24));
        g.setColor(Color.BLACK);
        g.drawString(code, 20, 30);

        g.dispose();
        return image;
    }
}
