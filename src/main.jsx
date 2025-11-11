import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { setupGlobalErrorHandlers } from './hooks/useErrorHandler.jsx'
import './index.css'
import App from './App.jsx'

// Setup global error handlers for production monitoring
if (import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true') {
  setupGlobalErrorHandlers((error, context) => {
    console.error('Global error:', error, context);
  });
}

// Register service worker for PWA
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)