# 📸 Guía de Imágenes de Productos

## 🎯 **Opción 1: Imágenes de Pexels (Actualmente en uso)**
- ✅ Imágenes reales y específicas de cada producto
- ✅ Alta calidad y profesionales
- ✅ URLs externas (no ocupan espacio en tu servidor)

## 📁 **Opción 2: Imágenes Locales (Recomendado para producción)**

### Pasos para usar imágenes locales:

1. **Crea la carpeta de recursos:**
   ```
   backend/src/main/resources/static/images/
   ```

2. **Agrega tus imágenes (nomenclatura sugerida):**
   - `laptop-pro.jpg`
   - `mouse-inalambrico.jpg`
   - `teclado-mecanico.jpg`
   - `monitor-4k.jpg`
   - `hub-usb-c.jpg`
   - `webcam-hd.jpg`
   - `lampara-escritorio.jpg`
   - `soporte-telefono.jpg`

3. **Actualiza las URLs en DataInitializer.java:**
   ```java
   new Product(null, "Laptop Pro", "Laptop de alto rendimiento...", 
              new BigDecimal("999.99"), 10, "/images/laptop-pro.jpg")
   ```

## 🖼️ **Opción 3: Unsplash (Alternativa premium)**
```java
"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop"
```

## 📐 **Especificaciones recomendadas:**
- **Tamaño:** 300x300 píxeles
- **Formato:** JPG o PNG
- **Calidad:** Alta (80-100%)
- **Peso:** <50 KB por imagen
- **Fondo:** Neutro o transparente

## 🔄 **Para cambiar las imágenes actuales:**
1. Detén el backend: `taskkill /F /IM java.exe`
2. Modifica las URLs en `DataInitializer.java`
3. Elimina la carpeta `target/`
4. Reinicia el backend con `mvn spring-boot:run`
