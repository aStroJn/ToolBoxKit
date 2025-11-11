const CACHE_NAME = 'toolboxkit-v1.0.0';
const OFFLINE_URL = '/offline.html';

// Assets to cache for offline functionality
const urlsToCache = [
  '/',
  '/about',
  '/offline.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Install event - cache essential files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Install event');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Service Worker: Cache failed', error);
      })
  );
  
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activate event');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Claim control immediately
  self.clients.claim();
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip chrome-extension requests
  if (event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }

        // Clone the request because it's a one-time use stream
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest)
          .then((response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response because it's a one-time use stream
            const responseToCache = response.clone();

            // Only cache specific file types and same-origin requests
            if (event.request.url.startsWith(self.location.origin)) {
              const url = new URL(event.request.url);
              
              // Cache HTML, CSS, JS, images, and fonts
              if (
                url.pathname.endsWith('.html') ||
                url.pathname.endsWith('.css') ||
                url.pathname.endsWith('.js') ||
                url.pathname.endsWith('.png') ||
                url.pathname.endsWith('.jpg') ||
                url.pathname.endsWith('.jpeg') ||
                url.pathname.endsWith('.gif') ||
                url.pathname.endsWith('.svg') ||
                url.pathname.endsWith('.ico') ||
                url.pathname.endsWith('.woff') ||
                url.pathname.endsWith('.woff2') ||
                url.pathname.endsWith('.ttf') ||
                url.pathname.endsWith('.eot')
              ) {
                caches.open(CACHE_NAME)
                  .then((cache) => {
                    cache.put(event.request, responseToCache);
                  });
              }
            }

            return response;
          })
          .catch(() => {
            // If fetch fails, serve offline page for navigation requests
            if (event.request.destination === 'document') {
              return caches.match(OFFLINE_URL);
            }
            
            // For other requests, return a basic offline response
            return new Response('Offline - Content not available', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// Handle background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Service Worker: Background sync triggered');
    event.waitUntil(doBackgroundSync());
  }
});

// Background sync function
const doBackgroundSync = async () => {
  try {
    // Handle any queued actions when back online
    const syncData = await getStoredSyncData();
    
    if (syncData && syncData.length > 0) {
      console.log('Service Worker: Processing queued data', syncData);
      
      // Process queued data
      // This could be file conversions, analytics, etc.
      
      // Clear processed data
      await clearStoredSyncData();
    }
  } catch (error) {
    console.error('Service Worker: Background sync failed', error);
  }
};

// Helper functions for data persistence
const getStoredSyncData = async () => {
  try {
    const cache = await caches.open('sync-data');
    const response = await cache.match('/sync-queue');
    return response ? await response.json() : [];
  } catch (error) {
    console.error('Failed to get stored sync data:', error);
    return [];
  }
};

const clearStoredSyncData = async () => {
  try {
    const cache = await caches.open('sync-data');
    await cache.delete('/sync-queue');
  } catch (error) {
    console.error('Failed to clear stored sync data:', error);
  }
};

// Handle push notifications (for future features)
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push received');
  
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'explore',
        title: 'Open App',
        icon: '/icon-192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-192.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('ToolBoxKit', options)
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification click received');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

/* global clients */

// Update available notification
const showUpdateNotification = () => {
  self.registration.showNotification('App Update Available', {
    body: 'A new version is ready. Click to refresh.',
    icon: '/icon-192.png',
    tag: 'update-available',
    actions: [
      {
        action: 'update',
        title: 'Refresh'
      }
    ]
  });
};

// Check for updates periodically
const checkForUpdates = () => {
  fetch('/version.json', { cache: 'no-cache' })
    .then(response => response.json())
    .then(data => {
      if (data.version !== CACHE_NAME) {
        showUpdateNotification();
      }
    })
    .catch(error => {
      console.log('Update check failed:', error);
    });
};

// Check for updates every 30 minutes
setInterval(checkForUpdates, 30 * 60 * 1000);
