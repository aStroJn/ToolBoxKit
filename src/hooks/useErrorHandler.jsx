import { useCallback } from 'react';

// Global error handler hook
export const useErrorHandler = () => {
  const handleError = useCallback((error, context = {}) => {
    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('Global error handler:', error, context);
    }

    // Report to monitoring service in production
    if (import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true') {
      reportError(error, context);
    }

    // Store error in localStorage for persistence across reloads
    try {
      const errorLog = JSON.parse(localStorage.getItem('errorLog') || '[]');
      errorLog.push({
        message: error.message,
        stack: error.stack,
        context,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
      });
      
      // Keep only last 10 errors
      if (errorLog.length > 10) {
        errorLog.splice(0, errorLog.length - 10);
      }
      
      localStorage.setItem('errorLog', JSON.stringify(errorLog));
    } catch (localStorageError) {
      console.warn('Could not store error in localStorage:', localStorageError);
    }
  }, []);

  const clearErrorLog = useCallback(() => {
    localStorage.removeItem('errorLog');
  }, []);

  return { handleError, clearErrorLog };
};

// Report error to monitoring service
const reportError = (error, context) => {
  const errorReport = {
    message: error.message || 'Unknown error',
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    buildTime: import.meta.env.VITE_BUILD_TIME || new Date().toISOString()
  };

  // Example implementations for different services:
  
  // Sentry
  // if (window.Sentry) {
  //   window.Sentry.captureException(error, { extra: errorReport });
  // }

  // LogRocket
  // if (window.LogRocket) {
  //   window.LogRocket.captureException(error, { extra: errorReport });
  // }

  // Custom endpoint
  // fetch('/api/errors', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(errorReport)
  // }).catch(() => {
  //   // Silently fail to avoid infinite loops
  // });

  console.log('Error reported:', errorReport);
};

// Global unhandled error handlers
export const setupGlobalErrorHandlers = (errorHandler) => {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    errorHandler(event.reason, { type: 'unhandledrejection' });
    event.preventDefault();
  });

  // Handle global JavaScript errors
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    errorHandler(event.error, { type: 'error', filename: event.filename, lineno: event.lineno });
  });

  // Handle React errors in production
  if (import.meta.env.PROD) {
    // Override console.error to catch React warnings
    const originalConsoleError = console.error;
    console.error = (...args) => {
      originalConsoleError(...args);
      
      // Filter out React internal errors
      const isReactInternal = args.some(arg => 
        typeof arg === 'string' && (
          arg.includes('Warning: ReactDOM.render') ||
          arg.includes('Warning: ReactDOM.createRoot') ||
          arg.includes('Warning: ReactDOM.render is no longer supported')
        )
      );
      
      if (!isReactInternal) {
        errorHandler(new Error(args.join(' ')), { type: 'console.error' });
      }
    };
  }
};

// Cleanup function
export const cleanupGlobalErrorHandlers = () => {
  window.removeEventListener('unhandledrejection', () => {});
  window.removeEventListener('error', () => {});
};

export default useErrorHandler;
