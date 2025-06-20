package com.example.demo.service.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("找不到商品"));

        // 如果 imageUrl 是本地圖片，刪除實體檔案
        String imageUrl = product.getImageUrl();
        if (imageUrl != null && !imageUrl.startsWith("http")) {
            try {
                // 去除開頭的 "/"
                String relativePath = imageUrl.startsWith("/") ? imageUrl.substring(1) : imageUrl;
                Path path = Paths.get(relativePath);
                Files.deleteIfExists(path);
            } catch (IOException e) {
                throw new RuntimeException("刪除圖片檔案失敗：" + e.getMessage());
            }
        }
        // 刪除商品
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
        // 透過 categoryRepository 查詢 Category Entity（不是 DTO）
        Category category = categoryRepository.findByName(categoryName)
            .orElseThrow(() -> new RuntimeException("分類不存在: " + categoryName));

        List<Product> products = productRepository.findByCategory(category);

        return products.stream()
                       .map(p -> modelMapper.map(p, ProductDto.class))
                       .collect(Collectors.toList());
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


    @Override
    public ProductDto createProductWithImage(String name, String description, Integer price, Integer categoryId, MultipartFile imageFile) {
        try {
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("找不到分類"));

            // 圖片儲存處理
            String uploadDir = "uploads/";
            String fileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
            Path uploadPath = Paths.get(uploadDir);
            Files.createDirectories(uploadPath);

            Path filePath = uploadPath.resolve(fileName);
            Files.write(filePath, imageFile.getBytes());

            // 建立商品
            Product product = new Product();
            product.setName(name);
            product.setDescription(description);
            product.setPrice(price);
            product.setCategory(category);
            product.setImageUrl("/uploads/" + fileName); // 存相對網址

            Product saved = productRepository.save(product);
            
            ProductDto dto = new ProductDto();
            dto.setId(saved.getId());
            dto.setName(saved.getName());
            dto.setDescription(saved.getDescription());
            dto.setPrice(saved.getPrice());
            dto.setImageUrl(saved.getImageUrl());
            dto.setCategoryName(saved.getCategory().getName());
            dto.setVariants(null);

            return dto;
        } catch (IOException e) {
            throw new RuntimeException("圖片儲存失敗：" + e.getMessage());
        }
    }
    
    @Override
    public String uploadImage(MultipartFile file) {
        try {
            String uploadDir = "uploads/";
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path uploadPath = Paths.get(uploadDir);
            Files.createDirectories(uploadPath);

            Path filePath = uploadPath.resolve(fileName);
            Files.write(filePath, file.getBytes());

            return "/uploads/" + fileName;
        } catch (IOException e) {
            throw new RuntimeException("圖片上傳失敗：" + e.getMessage());
        }
    }

}
