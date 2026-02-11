# E-Commerce PWA

A full-stack e-commerce Progressive Web Application built with Spring Boot backend and React frontend.

## Project Structure

```
ecommerce-pwa/
├── backend/                 # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/ecommerce/
│   │   │   │   ├── entity/          # JPA entities
│   │   │   │   ├── repository/      # Data repositories
│   │   │   │   ├── controller/      # REST controllers
│   │   │   │   ├── config/          # Configuration classes
│   │   │   │   └── EcommerceApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   └── pom.xml
└── frontend/               # React frontend
    ├── public/
    │   ├── manifest.json
    │   └── sw.js           # Service worker
    ├── src/
    │   ├── components/     # React components
    │   ├── contexts/       # React contexts
    │   ├── services/       # API services
    │   ├── types/          # TypeScript types
    │   └── App.tsx
    └── package.json
```

## Backend Features

- **Spring Boot 3.2.0** with Java 21
- **Spring Data JPA** with H2 in-memory database
- **REST API endpoints:**
  - `GET /api/products` - Get all products
  - `GET /api/products/{id}` - Get product by ID
  - `POST /api/orders` - Create new order
  - `GET /api/orders` - Get all orders
- **Sample data initialization** with 8 products
- **CORS configuration** for frontend integration

## Frontend Features

- **React 18** with TypeScript
- **React Router** for navigation
- **Context API** for cart state management
- **Axios** for API communication
- **Tailwind CSS** for styling
- **PWA support** with service worker
- **Responsive design** for mobile and desktop

## Pages

1. **Product List** - Browse all available products
2. **Cart** - View and manage shopping cart
3. **Checkout** - Complete purchase with shipping information

## Getting Started

### Prerequisites

- Java 21 or higher
- Node.js 16 or higher
- Maven 3.6 or higher

### Running the Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```

   The backend will start on `http://localhost:8080`

3. Access H2 Console (for development):
   - URL: `http://localhost:8080/h2-console`
   - JDBC URL: `jdbc:h2:mem:testdb`
   - Username: `sa`
   - Password: (leave empty)

### Running the Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

   The frontend will start on `http://localhost:3000`

## API Endpoints

### Products
- `GET /api/products` - Returns all products with stock > 0
- `GET /api/products/{id}` - Returns a specific product

### Orders
- `POST /api/orders` - Creates a new order
  ```json
  {
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "shippingAddress": "123 Main St, City, State 12345",
    "items": [
      {
        "productId": 1,
        "quantity": 2
      }
    ]
  }
  ```
- `GET /api/orders` - Returns all orders

## PWA Features

- **Service Worker** for offline caching
- **Web App Manifest** for installable app
- **Responsive Design** works on all devices
- **Install Prompt** allows users to add to home screen

## Sample Data

The application automatically initializes with 8 sample products:

1. Laptop Pro - $999.99
2. Wireless Mouse - $29.99
3. Mechanical Keyboard - $79.99
4. 4K Monitor - $399.99
5. USB-C Hub - $49.99
6. Webcam HD - $69.99
7. Desk Lamp - $34.99
8. Phone Stand - $19.99

## Development Notes

- Backend uses H2 in-memory database for simplicity
- Frontend includes proper error handling and loading states
- Cart state is managed using React Context API
- PWA features enable offline functionality
- CORS is configured for local development

## Production Deployment

For production deployment:

1. **Backend**: Replace H2 with a production database (PostgreSQL, MySQL)
2. **Frontend**: Build the application with `npm run build`
3. **PWA**: Configure proper HTTPS for service worker registration
4. **Database**: Set up proper database connection and migration
