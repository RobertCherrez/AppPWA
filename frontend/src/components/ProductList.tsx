import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { productService } from '../services/api';
import { useCart } from '../contexts/CartContext';
import './ProductList.css';

// Gradientes para cada producto
const getProductGradient = (productName: string) => {
  const gradients: { [key: string]: string } = {
    'Laptop Pro': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'Mouse Inalámbrico': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'Teclado Mecánico': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'Monitor 4K': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'Hub USB-C': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'Webcam HD': 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    'Lámpara de Escritorio': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'Soporte para Teléfono': 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
  };
  return gradients[productName] || 'linear-gradient(135deg, #a8c0ff 0%, #3f2b96 100%)';
};

// Iconos simples con emoji
const getProductIcon = (productName: string) => {
  const icons: { [key: string]: string } = {
    'Laptop Pro': '💻',
    'Mouse Inalámbrico': '🖱️',
    'Teclado Mecánico': '⌨️',
    'Monitor 4K': '🖥️',
    'Hub USB-C': '🔌',
    'Webcam HD': '📹',
    'Lámpara de Escritorio': '💡',
    'Soporte para Teléfono': '📱'
  };
  return icons[productName] || '📦';
};

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAllProducts();
        setProducts(data);
      } catch (err) {
        setError('Failed to fetch products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <span className="ms-3">Cargando productos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-danger text-center p-4">
        <div className="fs-5">Error al cargar productos</div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1 className="display-4 fw-bold text-center mb-4">Productos</h1>
      <div className="row g-4">
        {products.map((product) => (
          <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div className="card h-100 shadow-sm">
              <div 
                className="card-img-top d-flex align-items-center justify-content-center position-relative overflow-hidden"
                style={{ 
                  height: '200px',
                  background: getProductGradient(product.name),
                  color: 'white',
                  fontSize: '4rem',
                  fontWeight: 'bold',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  transition: 'all 0.3s ease'
                }}
              >
                <div 
                  className="position-absolute w-100 h-100"
                  style={{
                    background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                    animation: 'shimmer 2s infinite'
                  }}
                />
                <span className="position-relative z-1">{getProductIcon(product.name)}</span>
              </div>
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text text-muted small">{product.description}</p>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="h4 text-success mb-0">${product.price}</span>
                  <span className="badge bg-secondary">Stock: {product.stockQuantity}</span>
                </div>
                <button
                  onClick={() => addToCart(product)}
                  className="btn btn-primary mt-auto"
                  disabled={product.stockQuantity === 0}
                >
                  {product.stockQuantity === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
