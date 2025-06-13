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
            Category shoe = new Category(null, "鞋子", new ArrayList<>());

            categoryRepository.saveAll(List.of(clothes, pants, accessories));

            productRepository.saveAll(List.of(
                new Product(null, "Drew淺紫色短袖", "舒適棉質", 1600, "https://shoplineimg.com/5fb51d7f25f3d00031ddb131/66e3ed5b9d126c001961757b/800x.jpg?", clothes),
                new Product(null, "基礎款淺藍牛仔褲", "韓版設計", 1200, "https://shoplineimg.com/5f7c36224817d10030d3b7ca/6651c08d29f06c000dc782ee/800x.webp?source_format=jpg", pants),
                new Product(null, "男生自然圓弧耳環", "手工藝品", 900, "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSeMioK2gtcx3BZLOmOrf5V_3AG38NoHzIZrMb-Lk79bmVx17UlSPwJGwl-g3YQEGs71isX0P3npYQ42_DiBT9kVJXcFMKfxOSlc5KbPAaQhh0AvQrEZpvmvUKPrWMU4-i6OT0T4zft&usqp=CAc", accessories),
                new Product(null, "NIKE  SACAI奶茶色", "現代潮流", 6000, "https://shoplineimg.com/5765171061706918ee4c3700/623713500a062b0026856020/800x.jpeg?",shoe),
                new Product(null, "Nike Dunk 低筒 Retro 男鞋", "籃球復刻風", 3200, "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b1bcbca4-e853-4df7-b329-5be3c61ee057/NIKE+DUNK+LOW+RETRO.png", shoe)
            ));
        }
    }
}

