package com.example.demo;

import com.example.demo.model.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.util.Hash;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class Test_AddUser {

    @Autowired
    private UserRepository userRepository;

    @Test
    public void addUser() {
        String rawPassword = "1234"; // 原始密碼
        String salt = Hash.getSalt(); // 產生鹽
        String hash = Hash.getHash(rawPassword, salt); // 加鹽雜湊

        User user = new User();
        user.setUsername("admin");
        user.setPasswordHash(hash);
        user.setSalt(salt);
        user.setEmail("a930406a@gmail.com");
        user.setActive(true);
        user.setRole("ADMIN");
        user.setBlocked(false);
        userRepository.save(user);
        System.out.println("新增使用者成功！");
    }
}
