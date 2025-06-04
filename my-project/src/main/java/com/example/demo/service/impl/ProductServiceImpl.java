package com.example.demo.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.example.demo.model.dto.CategoryDto;
import com.example.demo.model.dto.ProductDetailDto;
import com.example.demo.model.dto.ProductDto;
import com.example.demo.model.dto.ProductVariantDto;
import com.example.demo.model.entity.Category;
import com.example.demo.model.entity.Product;
import com.example.demo.model.entity.ProductVariant;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.ProductVariantRepository;
import com.example.demo.service.ProductService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductVariantRepository variantRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<ProductDto> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDto> getProductsByCategory(Integer categoryId) {
        return productRepository.findByCategoryId(categoryId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private ProductDto convertToDto(Product product) {
        ProductDto dto = modelMapper.map(product, ProductDto.class);
        dto.setCategoryName(product.getCategory().getName());
        return dto;
    }
    
    @Override
    public void save(Product product) {
        if (product.getCategory() == null || product.getCategory().getId() == null) {
            throw new IllegalArgumentException("請選擇分類");
        }
        Category category = categoryRepository.findById(product.getCategory().getId())
                .orElseThrow(() -> new RuntimeException("找不到分類 ID: " + product.getCategory().getId()));
        product.setCategory(category);
        productRepository.save(product);
    }


    @Override
    public void delete(Integer id) {
        productRepository.deleteById(id);
    }
    
    @Override
    public List<CategoryDto> getAllCategories() {
        List<Category> categoryList = categoryRepository.findAll();
        return categoryList.stream().map(category -> {
            CategoryDto dto = new CategoryDto();
            dto.setId(category.getId());
            dto.setName(category.getName());
            return dto;
        }).collect(Collectors.toList());
    }
    
    @Override
    public ProductDetailDto getProductDetailWithVariants(Integer productId) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("找不到商品"));

        List<ProductVariant> variants = variantRepository.findByProduct_Id(productId);

        ProductDetailDto dto = modelMapper.map(product, ProductDetailDto.class);
        dto.setCategoryName(product.getCategory().getName()); // 如果你想展示分類名稱
        dto.setCategoryId(product.getCategory().getId());

        List<ProductVariantDto> variantDtos = variants.stream().map(variant -> {
            ProductVariantDto vDto = new ProductVariantDto();
            vDto.setVariantId(variant.getVariantId());
            vDto.setSize(variant.getSize());
            vDto.setStock(variant.getStock());
            return vDto;
        }).collect(Collectors.toList());

        dto.setVariants(variantDtos);

        return dto;
    }
}
