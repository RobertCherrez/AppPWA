import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

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
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="rounded"
                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                  />
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
