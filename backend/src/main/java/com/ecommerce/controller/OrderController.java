package com.ecommerce.controller;

import com.ecommerce.entity.Order;
import com.ecommerce.entity.OrderItem;
import com.ecommerce.entity.Product;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003", "https://app-pwa-green.vercel.app"})
public class OrderController {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return ResponseEntity.ok(orders);
    }
    
    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Map<String, Object> orderRequest) {
        try {
            Order order = new Order();
            order.setCustomerName((String) orderRequest.get("customerName"));
            order.setCustomerEmail((String) orderRequest.get("customerEmail"));
            order.setShippingAddress((String) orderRequest.get("shippingAddress"));
            order.setOrderDate(LocalDateTime.now());
            order.setStatus(Order.OrderStatus.PENDING);
            
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> items = (List<Map<String, Object>>) orderRequest.get("items");
            
            List<OrderItem> orderItems = new ArrayList<>();
            BigDecimal totalAmount = BigDecimal.ZERO;
            
            for (Map<String, Object> item : items) {
                Long productId = ((Number) item.get("productId")).longValue();
                Integer quantity = (Integer) item.get("quantity");
                
                System.out.println("🛒 Procesando item: productId=" + productId + ", quantity=" + quantity);
                
                Product product = productRepository.findById(productId)
                        .orElseThrow(() -> new RuntimeException("Product not found: " + productId));
                
                if (product.getStockQuantity() < quantity) {
                    throw new RuntimeException("Insufficient stock for product: " + product.getName());
                }
                
                OrderItem orderItem = new OrderItem();
                orderItem.setOrder(order);
                orderItem.setProduct(product);
                orderItem.setQuantity(quantity);
                orderItem.setUnitPrice(product.getPrice());
                orderItem.setTotalPrice(product.getPrice().multiply(BigDecimal.valueOf(quantity)));
                
                orderItems.add(orderItem);
                totalAmount = totalAmount.add(orderItem.getTotalPrice());
                
                product.setStockQuantity(product.getStockQuantity() - quantity);
                productRepository.save(product);
            }
            
            order.setOrderItems(orderItems);
            order.setTotalAmount(totalAmount);
            
            Order savedOrder = orderRepository.save(order);
            return ResponseEntity.ok(savedOrder);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
