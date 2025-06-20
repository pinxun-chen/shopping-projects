package com.example.demo.service;

import org.springframework.ai.ollama.OllamaChatClient;
import org.springframework.stereotype.Service;

@Service
public class AiService {
    private final OllamaChatClient chatClient;

    public AiService(OllamaChatClient chatClient) {
        this.chatClient = chatClient;
    }

    public String ask(String prompt) {
        return chatClient.call(prompt);
    }
}
