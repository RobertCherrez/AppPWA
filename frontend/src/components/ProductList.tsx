import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { productService } from '../services/api';
import { useCart } from '../contexts/CartContext';

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
              <img
                src={product.imageUrl.startsWith('http') ? product.imageUrl : `/images/${product.imageUrl.split('/').pop()}`}
                alt={product.name}
                className="card-img-top"
                style={{ height: '200px', objectFit: 'cover' }}
              />
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
