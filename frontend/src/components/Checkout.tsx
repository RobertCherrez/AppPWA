import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { orderService } from '../services/api';
import { OrderRequest } from '../types';

const Checkout: React.FC = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    shippingAddress: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isOfflineOrder, setIsOfflineOrder] = useState(false);
  const { state, clearCart } = useCart();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const orderRequest: OrderRequest = {
        ...formData,
        items: state.items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      };

      const response = await orderService.createOrder(orderRequest);
      
      // Verificar si es una respuesta offline del Service Worker
      console.log('Response from API:', response);
      
      if (response && typeof response === 'object' && 'offline' in response && response.offline === true) {
        console.log('Detected offline response:', response);
        setOrderPlaced(true);
        setIsOfflineOrder(true);
        clearCart();
        // Mostrar mensaje especial para offline
        return;
      }
      
      setOrderPlaced(true);
      setIsOfflineOrder(false);
      clearCart();
    } catch (err: any) {
      console.log('Error in checkout:', err);
      
      // Verificar si es un error offline
      if (err.message && err.message.includes('offline')) {
        setOrderPlaced(true);
        setIsOfflineOrder(true);
        clearCart();
        return;
      }
      
      setError('Error al realizar el pedido. Inténtalo de nuevo.');
      console.error('Error placing order:', err);
    } finally {
      setLoading(false);
    }
  };

  if (state.items.length === 0 && !orderPlaced) {
    return (
      <div className="container mt-4">
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

  if (orderPlaced) {
    return (
      <div className="container mt-4">
        <div className="max-w-md mx-auto text-center py-5">
          <div className="text-success display-1 mb-4">✓</div>
          <h1 className="display-4 fw-bold mb-4">¡Pedido Realizado con Éxito!</h1>
          <p className="text-muted mb-4">
            Gracias por tu pedido. Recibirás un correo de confirmación shortly.
            {isOfflineOrder && (
              <>
                <br />
                <small className="text-info">
                  Tu pedido está guardado y se procesará cuando haya conexión a internet.
                </small>
              </>
            )}
          </p>
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
      <h1 className="display-4 fw-bold mb-4">Checkout</h1>
      
      <div className="row">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title mb-4">Información de Envío</h5>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="customerName" className="form-label">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="customerEmail" className="form-label">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="customerEmail"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="shippingAddress" className="form-label">
                    Dirección de Envío *
                  </label>
                  <textarea
                    className="form-control"
                    id="shippingAddress"
                    name="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={handleChange}
                    required
                    rows={3}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-success btn-lg w-full"
                >
                  {loading ? 'Procesando Pedido...' : 'Realizar Pedido'}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title mb-4">Resumen del Pedido</h5>
              
              <div className="mb-3">
                {state.items.map((item) => (
                  <div key={item.id} className="d-flex justify-content-between small mb-1">
                    <span>{item.name} x {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <hr />
              <div className="mb-2">
                <div className="d-flex justify-content-between">
                  <span>Subtotal</span>
                  <span>${state.total.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Envío</span>
                  <span>Gratis</span>
                </div>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold fs-5">
                <span>Total</span>
                <span>${state.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
