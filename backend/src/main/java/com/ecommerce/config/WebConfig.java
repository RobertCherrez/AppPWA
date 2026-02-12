package com.ecommerce.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
.allowedOrigins(
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "https://app-pwa-jet.vercel.app"
)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Configurar para servir imágenes desde /images/**
        System.out.println("CONFIGURANDO RESOURCE HANDLER PARA /images/**");
        registry.addResourceHandler("/images/**")
                .addResourceLocations("classpath:/static/images/");
        System.out.println("RESOURCE HANDLER CONFIGURADO: /images/** -> classpath:/static/images/");
    }
}
