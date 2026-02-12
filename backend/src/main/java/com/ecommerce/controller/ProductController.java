package com.ecommerce.controller;

import com.ecommerce.entity.Product;
import com.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}
