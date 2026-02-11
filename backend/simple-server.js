const http = require('http');
const url = require('url');

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

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;

  // Products endpoint
  if (path === '/api/products' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(products));
    return;
  }

  // Single product endpoint
  if (path.startsWith('/api/products/') && req.method === 'GET') {
    const id = parseInt(path.split('/')[3]);
    const product = products.find(p => p.id === id);
    if (product) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(product));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Product not found' }));
    }
    return;
  }

  // Orders endpoints
  if (path === '/api/orders') {
    if (req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(orders));
    } else if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          const orderData = JSON.parse(body);
          const newOrder = {
            id: orderIdCounter++,
            ...orderData,
            orderDate: new Date().toISOString(),
            status: 'PENDING'
          };
          orders.push(newOrder);
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(newOrder));
        } catch (error) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid order data' }));
        }
      });
    }
    return;
  }

  // 404 for unknown paths
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

const PORT = 8081;
server.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET /api/products');
  console.log('  GET /api/products/{id}');
  console.log('  GET /api/orders');
  console.log('  POST /api/orders');
});
