import { useEffect, useRef } from 'react';

// Analytics service abstraction
class AnalyticsService {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.events = [];
    this.isEnabled = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';
  }

  generateSessionId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Track page views
  trackPageView(path, title = '') {
    if (!this.isEnabled) return;

    const event = {
      type: 'pageview',
      path,
      title,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      screen: {
        width: window.screen.width,
        height: window.screen.height,
        colorDepth: window.screen.colorDepth
      }
    };

    this.events.push(event);
    this.sendEvent(event);
  }

  // Track user interactions
  trackEvent(action, category, label = '', value = null) {
    if (!this.isEnabled) return;

    const event = {
      type: 'event',
      action,
      category,
      label,
      value,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId
    };

    this.events.push(event);
    this.sendEvent(event);
  }

  // Track performance metrics
  trackPerformance(metricName, value, additionalData = {}) {
    if (!this.isEnabled) return;

    const event = {
      type: 'performance',
      metric: metricName,
      value,
      ...additionalData,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId
    };

    this.events.push(event);
    this.sendEvent(event);
  }

  // Track errors
  trackError(error, context = {}) {
    if (!this.isEnabled) return;

    const event = {
      type: 'error',
      message: error.message || 'Unknown error',
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      url: window.location.href
    };

    this.events.push(event);
    this.sendEvent(event);
  }

  // Track user engagement
  trackUserEngagement(action, duration = 0) {
    if (!this.isEnabled) return;

    const event = {
      type: 'engagement',
      action,
      duration,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId
    };

    this.events.push(event);
    this.sendEvent(event);
  }

  // Send event to analytics service
  sendEvent(event) {
    // In production, send to your analytics service
    console.log('Analytics Event:', event);

    // Example implementations for different services:
    
    // Google Analytics 4
    // if (window.gtag) {
    //   window.gtag('event', event.action || event.type, {
    //     event_category: event.category,
    //     event_label: event.label,
    //     value: event.value,
    //     custom_parameter: event.metric
    //   });
    // }

    // Mixpanel
    // if (window.mixpanel) {
    //   window.mixpanel.track(event.action || event.type, event);
    // }

    // Custom endpoint
    // fetch('/api/analytics', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(event)
    // }).catch(() => {
    //   // Silently fail to avoid performance issues
    // });

    // Store locally for batch sending
    this.batchEvents(event);
  }

  // Batch events for performance
  batchEvents() {
    // Send batch every 10 events or every 30 seconds
    if (this.events.length >= 10) {
      this.flushEvents();
    } else {
      // Set timeout for batch sending
      clearTimeout(this.batchTimeout);
      this.batchTimeout = setTimeout(() => {
        this.flushEvents();
      }, 30000);
    }
  }

  // Flush batched events
  flushEvents() {
    if (this.events.length === 0) return;

    const eventsToSend = [...this.events];
    this.events = [];

    // Send batch to analytics service
    fetch('/api/analytics/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: this.sessionId,
        events: eventsToSend,
        timestamp: new Date().toISOString()
      })
    }).catch(() => {
      // Put events back if sending failed
      this.events.unshift(...eventsToSend);
    });
  }

  // Initialize analytics
  init() {
    if (!this.isEnabled) return;

    // Track initial page view
    this.trackPageView(window.location.pathname, document.title);

    // Listen for route changes (for SPA)
    this.setupRouteTracking();

    // Track user engagement
    this.setupEngagementTracking();

    // Performance monitoring
    this.setupPerformanceTracking();
  }

  // Setup route change tracking
  setupRouteTracking() {
    // This would be called by React Router
    // For manual implementation, listen to popstate and hashchange
    window.addEventListener('popstate', () => {
      this.trackPageView(window.location.pathname, document.title);
    });

    window.addEventListener('hashchange', () => {
      this.trackPageView(window.location.pathname, document.title);
    });
  }

  // Setup user engagement tracking
  setupEngagementTracking() {
    let startTime = Date.now();
    let isActive = true;

    // Track time spent on page
    window.addEventListener('beforeunload', () => {
      const duration = Date.now() - startTime;
      this.trackUserEngagement('page_duration', duration);
    });

    // Track visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        isActive = false;
        const duration = Date.now() - startTime;
        this.trackUserEngagement('hidden_duration', duration);
      } else if (!isActive) {
        isActive = true;
        startTime = Date.now();
        this.trackUserEngagement('returned_active', 0);
      }
    });
  }

  // Setup performance tracking
  setupPerformanceTracking() {
    // Core Web Vitals
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.trackPerformance('LCP', lastEntry.startTime, {
          element: lastEntry.element?.tagName,
          size: lastEntry.size
        });
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.trackPerformance('FID', entry.processingStart - entry.startTime, {
            target: entry.target?.tagName,
            type: entry.name
          });
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        
        this.trackPerformance('CLS', clsValue, {
          recent: entries.some(entry => entry.hadRecentInput)
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }

    // Navigation timing
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
          this.trackPerformance('TTFB', navigation.responseStart - navigation.requestStart);
          this.trackPerformance('DOMContentLoaded', navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart);
          this.trackPerformance('Load Complete', navigation.loadEventEnd - navigation.loadEventStart);
        }
      }, 0);
    });
  }
}

// Create singleton instance
const analytics = new AnalyticsService();

// React hook for using analytics
export const useAnalytics = () => {
  const startTime = useRef(Date.now());

  useEffect(() => {
    // Initialize analytics
    analytics.init();

    // Track page load performance
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0];
          if (perfData) {
            analytics.trackPerformance('page_load_time', perfData.loadEventEnd - perfData.fetchStart);
          }
        }, 0);
      });
    }

    // Capture the start time for cleanup
    const capturedStartTime = startTime.current;

    // Cleanup on unmount
    return () => {
      const duration = Date.now() - capturedStartTime;
      analytics.trackUserEngagement('component_unmount', duration);
    };
  }, []);

  const trackPageView = (path, title) => {
    analytics.trackPageView(path, title);
  };

  const trackEvent = (action, category, label, value) => {
    analytics.trackEvent(action, category, label, value);
  };

  const trackPerformance = (metric, value, additionalData) => {
    analytics.trackPerformance(metric, value, additionalData);
  };

  const trackError = (error, context) => {
    analytics.trackError(error, context);
  };

  const trackUserEngagement = (action, duration) => {
    analytics.trackUserEngagement(action, duration);
  };

  return {
    trackPageView,
    trackEvent,
    trackPerformance,
    trackError,
    trackUserEngagement
  };
};

export default analytics;
