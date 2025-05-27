package com.example.demo.util;

import com.example.demo.model.entity.Category;
import com.example.demo.model.entity.Product;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    @Override
    public void run(String... args) {
        if (categoryRepository.count() == 0) {
            Category clothes = new Category(null, "衣服", new ArrayList<>());
            Category pants = new Category(null, "褲子", new ArrayList<>());
            Category accessories = new Category(null, "飾品", new ArrayList<>());

            categoryRepository.saveAll(List.of(clothes, pants, accessories));

            productRepository.saveAll(List.of(
                new Product(null, "T恤", "舒適棉質", 500, "https://your-image.com/tshirt.jpg", clothes),
                new Product(null, "牛仔褲", "韓版設計", 1200, "https://your-image.com/jeans.jpg", pants),
                new Product(null, "耳環", "手工藝品", 350, "https://your-image.com/earring.jpg", accessories)
            ));
        }
    }
}

