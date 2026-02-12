import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';
import './App.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// Register service worker for PWA - forzar registro in producción
if ('serviceWorker' in navigator) {
  const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
  
  // Registrar inmediatamente sin esperar a load
  navigator.serviceWorker.register(swUrl)
    .then(registration => {
      console.log('Service worker registered successfully: ', registration);
      
      // Forzar activación inmediata
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
      
      if (registration.active) {
        console.log('Service worker is active');
      }
    })
    .catch(error => {
      console.error('Service worker registration failed:', error);
    });
    
  // También registrar en load como fallback
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(swUrl)
      .then(registration => {
        console.log('Service worker registered on load: ', registration);
      })
      .catch(error => {
        console.error('Service worker registration failed on load:', error);
      });
  });
}
