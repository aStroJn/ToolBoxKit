# Multi-stage Dockerfile for production deployment

# Stage 1: Build stage
FROM node:18-alpine as build-stage

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production stage
FROM nginx:alpine as production-stage

# Install Node.js for any server-side operations (if needed)
RUN apk add --no-cache nodejs npm

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built application from build stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy service worker and offline page
COPY --from=build-stage /app/public/sw.js /usr/share/nginx/html/
COPY --from=build-stage /app/public/offline.html /usr/share/nginx/html/

# Copy PWA manifest and icons
COPY --from=build-stage /app/public/manifest.json /usr/share/nginx/html/
COPY --from=build-stage /app/public/icon-192.png /usr/share/nginx/html/
COPY --from=build-stage /app/public/icon-512.png /usr/share/nginx/html/

# Create nginx cache directories
RUN mkdir -p /var/cache/nginx/client_temp \
    && mkdir -p /var/cache/nginx/proxy_temp \
    && mkdir -p /var/cache/nginx/fastcgi_temp \
    && mkdir -p /var/cache/nginx/uwsgi_temp \
    && mkdir -p /var/cache/nginx/scgi_temp

# Set proper permissions
RUN chown -R nginx:nginx /var/cache/nginx \
    && chown -R nginx:nginx /usr/share/nginx/html \
    && chmod -R 755 /usr/share/nginx/html

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
