package com.ecommerce.controller;

import com.ecommerce.entity.Product;
import com.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003", "https://app-pwa-jet.vercel.app"})
public class ProductController {
    
    @Autowired
    private ProductRepository productRepository;
    
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        System.out.println("📦 Solicitando todos los productos...");
        List<Product> products = productRepository.findByStockQuantityGreaterThan(0);
        System.out.println("📦 Productos encontrados: " + products.size());
        return ResponseEntity.ok(products);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        System.out.println("🔍 Buscando producto con ID: " + id);
        Optional<Product> productOpt = productRepository.findById(id);
        if (productOpt.isPresent()) {
            Product product = productOpt.get();
            System.out.println("✅ Producto encontrado: " + product.getName());
            return ResponseEntity.ok(product);
        } else {
            System.out.println("❌ Producto no encontrado con ID: " + id);
            return ResponseEntity.notFound().build();
        }
    }
    
    // ENDPOINT DIRECTO PARA IMÁGENES COMO FALLBACK
    @GetMapping("/images/{filename}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        System.out.println("🖼️ Solicitando imagen: " + filename);
        try {
            Resource resource = new ClassPathResource("static/images/" + filename);
            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                        .body(resource);
            } else {
                System.out.println("❌ Imagen no encontrada: " + filename);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.out.println("❌ Error al cargar imagen: " + e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
}
