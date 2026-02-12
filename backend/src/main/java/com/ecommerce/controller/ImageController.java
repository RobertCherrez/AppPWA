package com.ecommerce.controller;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003", "https://app-pwa-jet.vercel.app"})
public class ImageController {
    
    // ENDPOINT ESPECÍFICO PARA IMÁGENES
    @GetMapping("/images/{filename}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        System.out.println("🖼️ ImageController: Solicitando imagen: " + filename);
        try {
            // USAR FileSystemResource con ruta absoluta para producción
            File imageFile = new File("/opt/render/project/src/main/resources/static/images/" + filename);
            Resource resource = new FileSystemResource(imageFile);
            
            if (resource.exists() && resource.isReadable()) {
                System.out.println("✅ ImageController: Imagen encontrada en filesystem absoluto: " + filename);
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                        .body(resource);
            } else {
                System.out.println("❌ ImageController: Imagen no encontrada en filesystem absoluto: " + filename);
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
