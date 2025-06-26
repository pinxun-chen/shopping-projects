package com.example.demo.service;

import com.example.demo.model.dto.OrderDto;
import com.example.demo.model.dto.ProductDto;
import com.example.demo.model.dto.ProductVariantDto;
import com.example.demo.repository.OrderRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.ollama.OllamaChatClient;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AiService {

    private final OllamaChatClient chatClient;
    private final ProductService productService;
    private final OrderRepository orderRepository;

    public String askWithUserAndProducts(String prompt, String username) {
        if (containsBadWords(prompt)) {
            return "您的提問包含不當字詞，請重新輸入。";
        }

        String systemInfo = analyzePrompt(prompt);

        List<Message> messages = List.of(
                new SystemMessage(String.format("""
                    你是一位親切且專業的客服，請使用繁體中文逐字回應會員的問題，稱呼對方為「%s」。
                    回答內容只能根據提供的商品或訂單資訊，請勿捏造任何不存在的商品、價格或資訊。
                    若使用者詢問價格、庫存、名稱等，請只根據提供清單回答，無資料時請明確說明。
                    """, username)),
                new UserMessage(String.format("以下是商城參考資料：\n%s\n請根據上述資訊回答：%s", systemInfo, prompt))
         );

        Prompt p = new Prompt(messages);
        String response = chatClient.call(p).getResult().getOutput().getContent();
        return filterBadWords(response);
    }

    public SseEmitter streamAiReply(String prompt, String username) {
        SseEmitter emitter = new SseEmitter();

        new Thread(() -> {
            try {
                String systemInfo = analyzePrompt(prompt);
                List<Message> messages = List.of(
                        new SystemMessage(String.format("""
                            你是一位親切且專業的客服，請使用繁體中文逐字回應會員的問題，稱呼對方為「%s」。
                            回答內容只能根據提供的商品或訂單資訊，請勿捏造任何不存在的商品、價格或資訊。
                            若使用者詢問價格、庫存、名稱等，請只根據提供清單回答，無資料時請明確說明。
                            """, username)),
                        new UserMessage(String.format("以下是商城參考資料：\n%s\n請根據上述資訊回答：%s", systemInfo, prompt))
                );

                Prompt p = new Prompt(messages);

                chatClient.stream(p).doOnNext(chunk -> {
                    try {
                        emitter.send(chunk.getResult().getOutput().getContent(), MediaType.TEXT_PLAIN);
                    } catch (IOException e) {
                        emitter.completeWithError(e);
                    }
                }).doOnComplete(emitter::complete).subscribe();

            } catch (Exception e) {
                emitter.completeWithError(e);
            }
        }).start();

        return emitter;
    }

    public String askWithUser(String prompt, String username) {
        return askWithUserAndProducts(prompt, username);
    }

    private String analyzePrompt(String prompt) {
        prompt = prompt.toLowerCase();

        Pattern pricePattern = Pattern.compile("(\\d{2,5})[^\\d]*(\\d{2,5})");
        Matcher matcher = pricePattern.matcher(prompt);
        if (prompt.contains("價格") && matcher.find()) {
            int min = Integer.parseInt(matcher.group(1));
            int max = Integer.parseInt(matcher.group(2));
            List<ProductDto> products = productService.getAllProducts().stream()
                .filter(p -> p.getPrice() >= min && p.getPrice() <= max)
                .collect(Collectors.toList());

            if (products.isEmpty()) {
                List<ProductDto> fallback = productService.getAllProducts().stream().limit(3).toList();
                return String.format("目前找不到價格在 $%d 到 $%d 的商品，這是我們推薦的商品：\n%s",
                        min, max, buildProductInfo(fallback));
            }

            return buildProductInfo(products, String.format("價格在 $%d 到 $%d 的商品：", min, max));
        }

        if (prompt.contains("有沒有") || prompt.contains("庫存") || prompt.contains("尺寸")) {
            List<ProductDto> all = productService.getAllProducts();
            StringBuilder result = new StringBuilder("以下為部分商品的尺寸與庫存：\n");
            for (ProductDto dto : all.stream().limit(3).toList()) {
                List<ProductVariantDto> variants = productService.getProductDetailWithVariants(dto.getId()).getVariants();
                result.append("- ").append(dto.getName()).append(":\n");
                for (ProductVariantDto v : variants) {
                    result.append("  ‣ ").append(v.getSize()).append("：剩餘 ").append(v.getStock()).append(" 件\n");
                }
            }
            return result.toString();
        }

        if (prompt.contains("訂單") && prompt.matches(".*\\d{4,}.*")) {
            Pattern idPattern = Pattern.compile("(\\d{4,})");
            Matcher idMatch = idPattern.matcher(prompt);
            if (idMatch.find()) {
                Integer orderId = Integer.valueOf(idMatch.group(1));
                Optional<OrderDto> orderOpt = orderRepository.findById(orderId)
                    .map(order -> {
                        OrderDto dto = new OrderDto();
                        dto.setOrderId(order.getId());
                        dto.setStatus(order.getStatus());
                        dto.setFormattedTime(order.getOrderTime().toString());
                        return dto;
                    });
                return orderOpt.map(order -> String.format("訂單編號：%d\n狀態：%s\n建立時間：%s",
                        order.getOrderId(), order.getStatus(), order.getFormattedTime()))
                    .orElse("查無此訂單編號，請確認後再輸入。");
            }
        }

        List<ProductDto> matchedProducts = productService.searchProductsForPrompt(prompt);
        if (!matchedProducts.isEmpty()) {
            return buildProductInfo(matchedProducts, "以下是我們推薦的商品：");
        }

        if (prompt.contains("怎麼") || prompt.contains("如何") || prompt.contains("導覽")) {
            return """
                    歡迎使用商城，這裡是基本導覽說明：
                    - 購物流程：瀏覽商品 > 加入購物車 > 前往結帳(結帳時要先填基本資訊)
                    - 查詢訂單：登入後進入「歷史訂單」
                    - 客服詢問：隨時使用本 AI 客服聊天視窗
                    """;
        }

        return "目前無法判斷您的問題，請再描述得更清楚一點，例如「查詢鞋子的庫存」或「價格在 500~1000 的商品」。";
    }

    private String buildProductInfo(List<ProductDto> products) {
        return buildProductInfo(products, "推薦商品：");
    }

    private String buildProductInfo(List<ProductDto> products, String title) {
        return title + "\n" + products.stream()
                .limit(3)
                .map(p -> String.format("- %s：$%d", p.getName(), p.getPrice()))
                .collect(Collectors.joining("\n"));
    }

    private boolean containsBadWords(String input) {
        List<String> badWords = List.of("幹", "你娘", "去死", "王八蛋", "靠北", "垃圾", "死", "媽的");
        return badWords.stream().anyMatch(input::contains);
    }

    private String filterBadWords(String content) {
        List<String> badWords = List.of("幹", "你娘", "去死", "王八蛋", "靠北", "垃圾", "死", "媽的");
        String filtered = content;
        for (String word : badWords) {
            filtered = filtered.replaceAll(word, "**");
        }
        return filtered;
    }
}
