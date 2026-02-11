const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8082;

// Middleware
app.use(cors());
app.use(express.json());

// Sample data
const products = [
  {
    id: 1,
    name: "Laptop Pro",
    description: "High-performance laptop with 16GB RAM and 512GB SSD",
    price: 999.99,
    stockQuantity: 10,
    imageUrl: "https://via.placeholder.com/300x300/4285f4/ffffff?text=Laptop"
  },
  {
    id: 2,
    name: "Wireless Mouse",
    description: "Ergonomic wireless mouse with long battery life",
    price: 29.99,
    stockQuantity: 50,
    imageUrl: "https://via.placeholder.com/300x300/34a853/ffffff?text=Mouse"
  },
  {
    id: 3,
    name: "Mechanical Keyboard",
    description: "RGB mechanical keyboard with blue switches",
    price: 79.99,
    stockQuantity: 25,
    imageUrl: "https://via.placeholder.com/300x300/fbbc04/000000?text=Keyboard"
  },
  {
    id: 4,
    name: "4K Monitor",
    description: "27-inch 4K UHD monitor with HDR support",
    price: 399.99,
    stockQuantity: 15,
    imageUrl: "https://via.placeholder.com/300x300/ea4335/ffffff?text=Monitor"
  },
  {
    id: 5,
    name: "USB-C Hub",
    description: "7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader",
    price: 49.99,
    stockQuantity: 30,
    imageUrl: "https://via.placeholder.com/300x300/9c27b0/ffffff?text=Hub"
  },
  {
    id: 6,
    name: "Webcam HD",
    description: "1080p HD webcam with noise-cancelling microphone",
    price: 69.99,
    stockQuantity: 20,
    imageUrl: "https://via.placeholder.com/300x300/ff5722/ffffff?text=Webcam"
  },
  {
    id: 7,
    name: "Desk Lamp",
    description: "LED desk lamp with adjustable brightness",
    price: 34.99,
    stockQuantity: 40,
    imageUrl: "https://via.placeholder.com/300x300/607d8b/ffffff?text=Lamp"
  },
  {
    id: 8,
    name: "Phone Stand",
    description: "Adjustable phone stand for desk use",
    price: 19.99,
    stockQuantity: 60,
    imageUrl: "https://via.placeholder.com/300x300/795548/ffffff?text=Stand"
  }
];

let orders = [];
let orderIdCounter = 1;

// Routes
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

app.get('/api/orders', (req, res) => {
  res.json(orders);
});

app.post('/api/orders', (req, res) => {
  try {
    const orderData = req.body;
    const newOrder = {
      id: orderIdCounter++,
      ...orderData,
      orderDate: new Date().toISOString(),
      status: 'PENDING'
    };
    orders.push(newOrder);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ error: 'Invalid order data' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET /api/products');
  console.log('  GET /api/products/{id}');
  console.log('  GET /api/orders');
  console.log('  POST /api/orders');
  console.log('  GET /health');
});
