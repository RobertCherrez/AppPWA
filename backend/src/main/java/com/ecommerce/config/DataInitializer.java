package com.ecommerce.config;

import com.ecommerce.entity.Product;
import com.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private ProductRepository productRepository;
    
    @Override
    public void run(String... args) throws Exception {
        System.out.println("=================================");
        System.out.println("🔄 INICIANDO DATA INITIALIZER");
        System.out.println("=================================");
        
        // FORZAR limpieza completa para asegurar reinicio con nombres correctos
        System.out.println("🗑️ LIMPIANDO todos los productos existentes...");
        productRepository.deleteAll();
        System.out.println("🗑️ Productos eliminados: " + productRepository.count());
        
        // Pequeña pausa para asegurar limpieza
        Thread.sleep(1000);
        
        initializeProducts();
        System.out.println("✅ Productos reinicializados con nombres correctos: " + productRepository.count());
        System.out.println("=================================");
    }
    
    private void initializeProducts() {
        Product[] products = {
            // Usar nombres de archivos reales que existen en backend/src/main/resources/static/images/
            new Product(null, "Laptop Pro", "Laptop de alto rendimiento con 16GB RAM y 512GB SSD", 
                       new BigDecimal("999.99"), 10, "/images/laptop.jpg"),
            new Product(null, "Mouse Inalámbrico", "Mouse ergonómico inalámbrico con larga duración de batería", 
                       new BigDecimal("29.99"), 50, "/images/mouse.jpg"),
            new Product(null, "Teclado Mecánico", "Teclado mecánico RGB con switches azules", 
                       new BigDecimal("79.99"), 25, "/images/teclado.jpg"),
            new Product(null, "Monitor 4K", "Monitor 4K UHD de 27 pulgadas con soporte HDR", 
                       new BigDecimal("399.99"), 15, "/images/monitor.jpg"),
            new Product(null, "Hub USB-C", "Hub USB-C 7-en-1 con HDMI, USB 3.0 y lector de tarjetas SD", 
                       new BigDecimal("49.99"), 30, "/images/hub.jpg"),
            new Product(null, "Webcam HD", "Webcam HD 1080p con micrófono cancelador de ruido", 
                       new BigDecimal("69.99"), 20, "/images/webcam.jpg"),
            new Product(null, "Lámpara de Escritorio", "Lámpara LED de escritorio con brillo ajustable", 
                       new BigDecimal("34.99"), 40, "/images/lampara.jpg"),
            new Product(null, "Soporte para Teléfono", "Soporte ajustable para teléfono de escritorio", 
                       new BigDecimal("19.99"), 60, "/images/soporte.jpg")
        };
        
        System.out.println("💾 Guardando " + products.length + " productos en la base de datos...");
        for (Product product : products) {
            productRepository.save(product);
            System.out.println("✅ Producto guardado: " + product.getName() + " -> " + product.getImageUrl());
        }
        
        System.out.println("¡Productos de ejemplo inicializados exitosamente!");
    }
}
