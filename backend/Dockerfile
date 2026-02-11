# Imagen base con Java
FROM eclipse-temurin:21-jdk

# Carpeta de trabajo
WORKDIR /app

# Copiar proyecto
COPY . .

# Dar permisos y construir
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# Exponer puerto Spring Boot
EXPOSE 8080

# Ejecutar jar
CMD ["java","-jar","target/*.jar"]
