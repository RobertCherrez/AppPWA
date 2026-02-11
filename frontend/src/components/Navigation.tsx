import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const Navigation: React.FC = () => {
  const { state } = useCart();
  const location = useLocation();

  const cartItemsCount = state.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow sticky-top">
      <div className="container">
        <Link to="/" className="navbar-brand fw-bold text-primary">
          🛒 Tienda Online
        </Link>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link
                to="/"
                className={`nav-link ${
                  location.pathname === '/' ? 'active text-primary' : 'text-secondary'
                }`}
              >
                📦 Productos
              </Link>
            </li>
            
            <li className="nav-item">
              <Link
                to="/cart"
                className={`nav-link position-relative ${
                  location.pathname === '/cart' ? 'active text-primary' : 'text-secondary'
                }`}
              >
                🛒 Carrito
                {cartItemsCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
