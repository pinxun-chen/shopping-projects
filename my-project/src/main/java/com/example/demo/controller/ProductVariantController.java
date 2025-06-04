package com.example.demo.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.dto.ProductVariantDto;
import com.example.demo.response.ApiResponse;
import com.example.demo.service.ProductVariantService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/variants")
@RequiredArgsConstructor
public class ProductVariantController {

    private final ProductVariantService productVariantService;

    // 查詢某商品的所有尺寸與庫存
    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<List<ProductVariantDto>>> getVariants(@PathVariable Integer productId) {
        List<ProductVariantDto> variants = productVariantService.getVariantsByProductId(productId);
        return ResponseEntity.ok(ApiResponse.success("查詢成功", variants));
    }

    // 新增尺寸與庫存
    @PostMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<String>> addVariant(
            @PathVariable Integer productId,
            @RequestBody ProductVariantDto variantDto) {

        productVariantService.addVariant(productId, variantDto);
        return ResponseEntity.ok(ApiResponse.success("新增尺寸與庫存成功", null));
    }

    // 修改尺寸與庫存
    @PutMapping("/{variantId}")
    public ResponseEntity<ApiResponse<String>> updateVariant(
            @PathVariable Integer variantId,
            @RequestBody ProductVariantDto variantDto) {

        productVariantService.updateVariant(variantId, variantDto);
        return ResponseEntity.ok(ApiResponse.success("修改成功", null));
    }

    // 刪除尺寸與庫存
    @DeleteMapping("/{variantId}")
    public ResponseEntity<ApiResponse<String>> deleteVariant(@PathVariable Integer variantId) {
        productVariantService.deleteVariant(variantId);
        return ResponseEntity.ok(ApiResponse.success("刪除成功", null));
    }
}
