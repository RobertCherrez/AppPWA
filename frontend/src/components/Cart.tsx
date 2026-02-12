import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import './ProductList.css'; // Importar los mismos estilos

// Reutilizar las mismas funciones de ProductList
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

const Cart: React.FC = () => {
  const { state, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (state.items.length === 0) {
    return (
      <div className="container mt-4">
        <h1 className="display-4 fw-bold mb-4">Carrito de Compras</h1>
        <div className="text-center py-5">
          <div className="text-muted fs-5 mb-4">Tu carrito está vacío</div>
          <button
            onClick={() => navigate('/')}
            className="btn btn-primary"
          >
            Seguir Comprando
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1 className="display-4 fw-bold mb-4">Carrito de Compras</h1>
      
      <div className="row">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-body">
              {state.items.map((item) => (
                <div key={item.id} className="d-flex align-items-center border-bottom pb-3 mb-3">
                  <div 
                    className="rounded d-flex align-items-center justify-content-center position-relative overflow-hidden"
                    style={{ 
                      width: '80px', 
                      height: '80px',
                      background: getProductGradient(item.name),
                      color: 'white',
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                      transition: 'all 0.3s ease',
                      flexShrink: 0
                    }}
                  >
                    <div 
                      className="position-absolute w-100 h-100"
                      style={{
                        background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                        animation: 'shimmer 2s infinite'
                      }}
                    />
                    <span className="position-relative z-1">{getProductIcon(item.name)}</span>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h5 className="mb-1">{item.name}</h5>
                    <p className="text-muted mb-0">${item.price}</p>
                  </div>
                  <div className="d-flex align-items-center me-3">
                    <div className="btn-group" role="group">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="btn btn-outline-secondary"
                      >
                        -
                      </button>
                      <button className="btn btn-outline-secondary" disabled>
                        {item.quantity}
                      </button>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="btn btn-outline-secondary"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="fw-bold">${(item.price * item.quantity).toFixed(2)}</div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="btn btn-link text-danger p-0 text-decoration-none"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title mb-4">Resumen del Pedido</h5>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <span>${state.total.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Envío</span>
                  <span>Gratis</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold fs-5">
                  <span>Total</span>
                  <span>${state.total.toFixed(2)}</span>
                </div>
              </div>
              <div className="d-grid gap-2">
                <button
                  onClick={handleCheckout}
                  className="btn btn-success"
                >
                  Proceder al Checkout
                </button>
                <button
                  onClick={clearCart}
                  className="btn btn-danger"
                >
                  Vaciar Carrito
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="btn btn-secondary"
                >
                  Seguir Comprando
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
