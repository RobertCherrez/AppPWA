package com.ecommerce;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.Environment;

@SpringBootApplication
public class EcommerceApplication {
    public static void main(String[] args) {
        SpringApplication.run(EcommerceApplication.class, args);
    }
    
    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady(ApplicationReadyEvent event) {
        Environment env = event.getApplicationContext().getEnvironment();
        System.out.println("=================================");
        System.out.println("🚀 APLICACIÓN INICIADA");
        System.out.println("🚀 Puerto: " + env.getProperty("server.port"));
        System.out.println("🚀 Perfiles activos: " + String.join(", ", env.getActiveProfiles()));
        System.out.println("🚀 Contexto listo para servir recursos");
        System.out.println("=================================");
    }
}
