package com.example.demo.service.impl;

import java.util.List;
import java.util.Optional;
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
import com.example.demo.service.CategoryService;
import com.example.demo.service.ProductService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductVariantRepository variantRepository;
    private final CategoryService categoryService;
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
    
//    @Override
//    public void save(Product product) {
//        if (product.getCategory() == null || product.getCategory().getId() == null) {
//            throw new IllegalArgumentException("請選擇分類");
//        }
//        Category category = categoryRepository.findById(product.getCategory().getId())
//                .orElseThrow(() -> new RuntimeException("找不到分類 ID: " + product.getCategory().getId()));
//        product.setCategory(category);
//        productRepository.save(product);
//    }


    @Override
    public void delete(Integer id) {
        productRepository.deleteById(id);
    }
    
    @Override
    public List<CategoryDto> getAllCategories() {
        List<Category> categoryList = categoryRepository.findAll();
        return categoryList.stream().map(category -> {
            CategoryDto dto = new CategoryDto();
            //dto.setId(category.getId());
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
    
    @Override
    public List<ProductDto> getProductsByCategoryName(String categoryName) {
        Optional<CategoryDto> categoryOpt = categoryService.getCategoryByName(categoryName);
        if (categoryOpt.isEmpty()) {
            throw new RuntimeException("分類不存在");
        }

        List<Product> products = productRepository.findByCategory(categoryOpt.get());
        return products.stream()
                       .map(p -> modelMapper.map(p, ProductDto.class))
                       .toList();
    }

    @Override
    @Transactional
    public void createProductWithVariants(ProductDto dto) {
        // 建立商品本體
        Product product = new Product();
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setImageUrl(dto.getImageUrl());

        // 透過 categoryName 找分類（你用 categoryId 的話請改成 findById）
        Category category = categoryRepository.findByName(dto.getCategoryName())
            .orElseThrow(() -> new RuntimeException("找不到分類：" + dto.getCategoryName()));
        product.setCategory(category);

        // 儲存商品
        Product savedProduct = productRepository.save(product);

        // 儲存 variants
        if (dto.getVariants() != null && !dto.getVariants().isEmpty()) {
            List<ProductVariant> variants = dto.getVariants().stream().map(vdto -> {
                ProductVariant variant = new ProductVariant();
                variant.setSize(vdto.getSize());
                variant.setStock(vdto.getStock());
                variant.setProduct(savedProduct); // 關聯回 product
                return variant;
            }).collect(Collectors.toList());

            variantRepository.saveAll(variants);
        }
    }

    @Override
    @Transactional
    public void updateProductWithVariants(ProductDto dto) {
        Product product = productRepository.findById(dto.getId())
            .orElseThrow(() -> new RuntimeException("找不到商品 ID：" + dto.getId()));

        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setImageUrl(dto.getImageUrl());

        Category category = categoryRepository.findByName(dto.getCategoryName())
                .orElseThrow(() -> new RuntimeException("找不到分類：" + dto.getCategoryName()));
        product.setCategory(category);

        productRepository.save(product);

        // 更新 variants（這邊你可以依需求選擇清除後重建，或比對更新）
        if (dto.getVariants() != null) {
            // 清除原有
            variantRepository.deleteByProduct_Id(product.getId());

            // 新增新的
            List<ProductVariant> variants = dto.getVariants().stream().map(vdto -> {
                ProductVariant variant = new ProductVariant();
                variant.setSize(vdto.getSize());
                variant.setStock(vdto.getStock());
                variant.setProduct(product);
                return variant;
            }).collect(Collectors.toList());

            variantRepository.saveAll(variants);
        }
    }




}
