package com.example.demo.controller;

import com.example.demo.model.dto.UserCert;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.AiService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AiApiController {

    private final AiService aiService;

    public AiApiController(AiService aiService) {
        this.aiService = aiService;
    }

    // 一般同步回覆 API
    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<Map<String, String>>> chat(
            HttpSession session,
            @RequestBody Map<String, String> body) {

        UserCert cert = (UserCert) session.getAttribute("userCert");
        if (cert == null) {
            return ResponseEntity.status(401)
                    .body(ApiResponse.error(401, "請先登入會員才能使用 AI 客服功能"));
        }

        if (!"USER".equalsIgnoreCase(cert.getRole())) {
            return ResponseEntity.status(403)
                    .body(ApiResponse.error(403, "僅限會員使用 AI 客服功能"));
        }

        String message = body.get("message");
        if (message == null || message.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(400, "請輸入有效的問題"));
        }

        String reply = aiService.askWithUserAndProducts(message, cert.getUsername());

        List<Map<String, String>> chatHistory =
                (List<Map<String, String>>) session.getAttribute("chatHistory");
        if (chatHistory == null) chatHistory = new java.util.ArrayList<>();

        chatHistory.add(Map.of("role", "user", "text", message));
        chatHistory.add(Map.of("role", "bot", "text", reply));
        session.setAttribute("chatHistory", chatHistory);

        return ResponseEntity.ok(
                ApiResponse.success("回覆成功", Map.of("response", reply))
        );
    }

    // SSE 串流回覆 API
    @GetMapping(value = "/chat/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter chatStream(HttpSession session, @RequestParam String message) {
        UserCert cert = (UserCert) session.getAttribute("userCert");
        if (cert == null || !"USER".equalsIgnoreCase(cert.getRole())) {
            throw new RuntimeException("請先登入會員才能使用串流 AI 客服功能");
        }

        String username = cert.getUsername();
        StringBuilder replyBuffer = new StringBuilder();

        // 串流完成時儲存聊天紀錄
        Runnable onComplete = () -> {
            List<Map<String, String>> chatHistory =
                    (List<Map<String, String>>) session.getAttribute("chatHistory");
            if (chatHistory == null) chatHistory = new java.util.ArrayList<>();

            chatHistory.add(Map.of("role", "user", "text", message));
            chatHistory.add(Map.of("role", "bot", "text", replyBuffer.toString()));
            session.setAttribute("chatHistory", chatHistory);
        };

        return aiService.streamAiReply(message, username, replyBuffer, onComplete);
    }


    // 聊天紀錄
    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<Map<String, String>>>> getChatHistory(HttpSession session) {
        UserCert cert = (UserCert) session.getAttribute("userCert");
        if (cert == null) {
            return ResponseEntity.status(401)
                    .body(ApiResponse.error(401, "請先登入會員才能查看紀錄"));
        }

        List<Map<String, String>> chatHistory =
                (List<Map<String, String>>) session.getAttribute("chatHistory");
        return ResponseEntity.ok(
                ApiResponse.success("載入成功", chatHistory != null ? chatHistory : List.of())
        );
    }
}
