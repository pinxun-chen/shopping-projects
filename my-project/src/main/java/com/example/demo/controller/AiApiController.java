package com.example.demo.controller;

import com.example.demo.model.dto.UserCert;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.AiService;

import jakarta.servlet.http.HttpSession;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AiApiController {

    private final AiService aiService;

    public AiApiController(AiService aiService) {
        this.aiService = aiService;
    }

    // 聊天功能：僅限 USER 身份使用
    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<Map<String, String>>> chat(
            HttpSession session,
            @RequestBody Map<String, String> body) {

        // 驗證登入
        UserCert cert = (UserCert) session.getAttribute("userCert");
        if (cert == null) {
            return ResponseEntity
                    .status(401)
                    .body(ApiResponse.error(401, "請先登入會員才能使用 AI 客服功能"));
        }

        // 僅限 USER 角色使用
        if (!"USER".equalsIgnoreCase(cert.getRole())) {
            return ResponseEntity
                    .status(403)
                    .body(ApiResponse.error(403, "僅限會員使用 AI 客服功能"));
        }

        String message = body.get("message");
        if (message == null || message.trim().isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body(ApiResponse.error(400, "請輸入有效的問題"));
        }

        // 呼叫 AI 模型
        String reply = aiService.ask(message);
        return ResponseEntity.ok(
                ApiResponse.success("回覆成功", Map.of("response", reply))
        );
    }
}
