package com.example.demo.service;

import java.util.List;

import com.example.demo.model.dto.ProductVariantDto;

public interface ProductVariantService {

    // 查詢某商品的所有尺寸與庫存
    List<ProductVariantDto> getVariantsByProductId(Integer productId);

    // 新增尺寸與庫存
    void addVariant(Integer productId, ProductVariantDto variantDto);

    // 修改尺寸與庫存
    void updateVariant(Integer variantId, ProductVariantDto variantDto);

    // 刪除尺寸
    void deleteVariant(Integer variantId);
}