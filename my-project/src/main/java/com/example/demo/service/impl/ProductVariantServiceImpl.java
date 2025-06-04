package com.example.demo.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.demo.model.dto.ProductVariantDto;
import com.example.demo.model.entity.Product;
import com.example.demo.model.entity.ProductVariant;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.ProductVariantRepository;
import com.example.demo.service.ProductVariantService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductVariantServiceImpl implements ProductVariantService {

    private final ProductRepository productRepository;
    private final ProductVariantRepository variantRepository;

    // 查詢某商品的所有尺寸與庫存
    @Override
    public List<ProductVariantDto> getVariantsByProductId(Integer productId) {
        List<ProductVariant> variants = variantRepository.findByProduct_Id(productId);
        return variants.stream().map(variant -> {
            ProductVariantDto dto = new ProductVariantDto();
            dto.setVariantId(variant.getVariantId());
            dto.setSize(variant.getSize());
            dto.setStock(variant.getStock());
            return dto;
        }).collect(Collectors.toList());
    }

    // 為某商品新增一個尺寸與庫存
    @Override
    public void addVariant(Integer productId, ProductVariantDto variantDto) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("找不到商品 ID: " + productId));

        ProductVariant variant = new ProductVariant();
        variant.setProduct(product);
        variant.setSize(variantDto.getSize());
        variant.setStock(variantDto.getStock());

        variantRepository.save(variant);
    }
    
    @Override
    public void updateVariant(Integer variantId, ProductVariantDto dto) {
        ProductVariant variant = variantRepository.findById(variantId)
            .orElseThrow(() -> new RuntimeException("找不到尺寸變體"));
        variant.setSize(dto.getSize());
        variant.setStock(dto.getStock());
        variantRepository.save(variant);
    }

    @Override
    public void deleteVariant(Integer variantId) {
        variantRepository.deleteById(variantId);
    }
}
