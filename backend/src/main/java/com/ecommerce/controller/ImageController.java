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

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003", "https://app-pwa-jet.vercel.app"})
public class ImageController {
    
    @Autowired
    private ProductRepository productRepository;
    
    // ENDPOINT ESPECÍFICO PARA IMÁGENES
    @GetMapping("/images/{filename}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        System.out.println("🖼️ ImageController: Solicitando imagen: " + filename);
        try {
            // CORRECTO: ClassPathResource busca en classpath:/images/
            Resource resource = new ClassPathResource("images/" + filename);
            if (resource.exists() && resource.isReadable()) {
                System.out.println("✅ ImageController: Imagen encontrada en classpath: " + filename);
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                        .body(resource);
            } else {
                System.out.println("❌ ImageController: Imagen no encontrada en classpath: " + filename);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.out.println("❌ ImageController: Error al cargar imagen: " + e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
    
    // ENDPOINT PARA VERIFICAR IMÁGENES DISPONIBLES
    @GetMapping("/images")
    public ResponseEntity<List<String>> getAvailableImages() {
        System.out.println("📋 ImageController: Listando imágenes disponibles");
        try {
            String[] images = {
                "laptop.jpg", "mouse.jpg", "teclado.jpg", "monitor.jpg",
                "hub.jpg", "webcam.jpg", "lampara.jpg", "soporte.jpg"
            };
            return ResponseEntity.ok(List.of(images));
        } catch (Exception e) {
            System.out.println("❌ ImageController: Error listando imágenes: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
}
