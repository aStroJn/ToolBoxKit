# Gotenberg Integration Guide

## Overview

ToolBoxKit now includes Gotenberg integration for robust, server-side document and image conversion capabilities. This guide explains the architecture, setup, and usage.

## Architecture

### Dual Processing Strategy

The application uses a **two-tier conversion strategy**:

1. **Local FFmpeg (WASM)** - For video/audio files
   - Runs entirely in the browser via WebAssembly
   - CDN-based loading with automatic fallbacks
   - No backend required
   - Used by: `VideoConverter`, `AudioConverter`

2. **Remote Gotenberg Service** - For documents/images
   - Server-side processing via Gotenberg REST API
   - Handles complex document layouts and formatting
   - Supports multiple output formats
   - Used by: `ImageConverter`, `DocumentConverter`

## Quick Start

### 1. Start the Full Stack

```bash
docker-compose up -d
```

This starts:
- **Frontend** (Nginx): http://localhost:80
- **Gotenberg**: http://localhost:3000
- **Redis** (optional caching): http://localhost:6379
- **Monitoring** (optional): `docker-compose --profile monitoring up -d`

### 2. Local Development

```bash
# Install dependencies
npm install

# Start dev server (runs on http://localhost:5173)
npm run dev

# Vite proxy automatically forwards /api/* requests to Gotenberg
# Headers for FFMPEG.wasm are automatically configured in vite.config.js
# No additional configuration needed
```

**Note:** FFMPEG.wasm (used for video/audio conversion) requires specific HTTP headers for SharedArrayBuffer support. These are automatically configured in `vite.config.js` for local development. For production deployment, see [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md).

## Configuration

### Environment Variables

Create `.env.local` for development:

```bash
# Required
VITE_GOTENBERG_URL=http://localhost:3000

# Optional
VITE_APP_ENV=development
VITE_API_BASE_URL=http://localhost:3001  # For future backend services
```

For production (`.env.production`):

```bash
VITE_GOTENBERG_URL=http://gotenberg:3000  # Use service name in docker-compose
VITE_APP_ENV=production
```

### Vite Proxy Configuration

The `vite.config.js` includes automatic proxy forwarding:

```javascript
server: {
  proxy: {
    '/api': {
      target: env.VITE_API_BASE_URL || 'http://localhost:3001',
      changeOrigin: true,
      secure: false,
    }
  }
}
```

For Gotenberg specifically, the frontend can call:
- `POST /api/conversions/convert` (images/documents)
- `GET /api/conversions/health` (health check)

## API Integration

### Services Layer

**File**: `src/services/gotenbergService.js`

Provides abstraction for Gotenberg API:

```javascript
import { convertImage, convertDocument, checkHealth } from '@/services/gotenbergService';

// Check service health
const health = await checkHealth();

// Convert image
const pdfBlob = await convertImage(imageFile, 'PDF', { quality: 85 });

// Convert document
const pptxBlob = await convertDocument(docxFile, 'PPTX', {});
```

### Hooks Layer

**File**: `src/hooks/useGotenberg.jsx`

React hook for component integration:

```javascript
const {
  isServiceReady,      // Service health check passed
  isCheckingHealth,    // Currently checking service status
  health,              // { status, message, latencyMs }
  isProcessing,        // Currently converting files
  progress,            // 0-100 conversion progress
  error,               // Error message or null
  successMessage,      // Success notification
  processedFiles,      // Array of completed conversions
  currentFile,         // Currently processing file info
  convertFiles,        // Start conversion: convertFiles(files, format, options)
  cancel,              // Cancel current conversion
  reset,               // Reset state
  refreshHealth,       // Manual health check refresh
  canConvert,          // Boolean: ready to convert
} = useGotenberg('image' | 'document');
```

## Components

### ImageConverter

**File**: `src/components/converters/ImageConverter.jsx`

Features:
- Supported formats: JPG, PNG, WEBP
- Quality slider: 1-100%
- Real-time progress tracking
- Auto-download on completion
- Health status indicator

### DocumentConverter

**File**: `src/components/converters/DocumentConverter.jsx`

Features:
- Supported formats: PDF, DOCX, TXT, HTML, XLSX, PPTX
- Preserves formatting and layouts
- Batch file processing
- Progress per file
- Health status indicator

## Gotenberg API Reference

### Endpoints Used

1. **Health Check**
   ```bash
   GET http://localhost:3000/health
   Response: { status: 'up' }
   ```

2. **LibreOffice Conversions** (documents)
   ```bash
   POST http://localhost:3000/forms/libreoffice/convert
   Body: multipart/form-data
   Fields:
     - files (file upload)
     - outputFormat (e.g., "pdf", "docx", "xlsx")
   ```

3. **Chromium Conversions** (images/HTML)
   ```bash
   POST http://localhost:3000/forms/chromium/convert
   Body: multipart/form-data
   Fields:
     - files (file upload)
     - outputFormat (e.g., "png", "jpeg", "webp")
   ```

For full API reference, see: https://gotenberg.dev/docs/

## Supported Formats

### Image Conversions

| Input | Output |
|-------|--------|
| JPG, PNG, WEBP, HEIC | JPG, PNG, WEBP |
| SVG, BMP, GIF | JPG, PNG, WEBP |

### Document Conversions

| Input | Output |
|-------|--------|
| DOCX, DOC, ODT | PDF, DOCX, XLSX, PPTX, HTML, TXT |
| PDF | DOCX, XLSX, PPTX, HTML, TXT |
| XLSX, XLS | PDF, DOCX, XLSX, PPTX, HTML, TXT |
| PPTX, PPT | PDF, DOCX, XLSX, PPTX, HTML, TXT |
| TXT, HTML, RTF | PDF, DOCX, XLSX, PPTX, HTML, TXT |

## Deployment

### Docker Compose (Recommended)

```bash
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f gotenberg
docker-compose logs -f toolboxkit
```

### Kubernetes

Example resources:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: gotenberg
spec:
  replicas: 2
  template:
    spec:
      containers:
      - name: gotenberg
        image: gotenberg/gotenberg:8-alpine
        ports:
        - containerPort: 3000
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
```

### Environment-Specific Configuration

**Development**:
```bash
VITE_GOTENBERG_URL=http://localhost:3000
```

**Staging**:
```bash
VITE_GOTENBERG_URL=http://gotenberg.staging.internal:3000
```

**Production**:
```bash
VITE_GOTENBERG_URL=http://gotenberg-prod.example.com
# Ensure HTTPS is enabled for production
```

## Performance

### Resource Limits

Docker Compose sets tmpfs limits:
- `/tmp`: 500MB (no-exec, no-suid)
- `/home/gotenberg`: 500MB (no-exec, no-suid)

This prevents runaway processes from consuming disk space.

### Recommended Specs

- **Single Instance**: 2 CPU cores, 2GB RAM
- **High Load**: 4 CPU cores, 4GB RAM
- **Very High Load**: Horizontal scaling with load balancer

### Benchmarks

Typical conversion times:
- Image conversion: 100-500ms
- Document conversion (PDF→DOCX): 500ms-2s
- Complex document (DOCX→PDF): 1-3s

## Troubleshooting

### Gotenberg Service Not Starting

```bash
# Check logs
docker-compose logs gotenberg

# Verify port availability
netstat -an | grep 3000

# Manual restart
docker-compose restart gotenberg
```

### Health Check Fails

```bash
# Manual health check
curl http://localhost:3000/health

# Expected response
{ "status": "up" }
```

### Conversion Fails

1. **Check service health**:
   - Visit converter UI, look for "Service offline" message
   - Click "Retry health check"

2. **Check file format**:
   - Verify file is supported format
   - Check MIME type detection

3. **Check logs**:
   ```bash
   docker-compose logs gotenberg | tail -20
   ```

4. **Test API directly**:
   ```bash
   curl -F "files=@image.jpg" \
        -F "outputFormat=png" \
        http://localhost:3000/forms/chromium/convert -o output.png
   ```

## Advanced Configuration

### Custom Gotenberg Options

Modify `docker-compose.yml`:

```yaml
gotenberg:
  environment:
    - LOG_LEVEL=debug  # More verbose logging
    - DISABLE_UNOCONV=false  # Enable all LibreOffice modules
    - DISABLE_LIBREOFFICE=false
    - DISABLE_CHROMIUM=false
```

### Rate Limiting

Future enhancement: Add rate limiting middleware to `vite.config.js`:

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true,
    // Add rate limiting here if needed
  }
}
```

### Caching

Redis integration (optional):

```javascript
// In useGotenberg hook
const cacheKey = `${resourceType}:${file.name}:${format}`;
const cached = await redis.get(cacheKey);
if (cached) return cached;
```

## Security Considerations

1. **Input Validation**
   - File type verification (MIME + extension)
   - File size limits enforced in hooks
   - Extension whitelist: `.pdf`, `.docx`, `.xlsx`, `.jpg`, `.png`, `.webp`

2. **Resource Limits**
   - tmpfs prevents disk exhaustion
   - Memory limits per container
   - Timeout on conversions (default: 30s)

3. **Network**
   - Gotenberg in isolated docker network
   - No direct internet access
   - HTTPS recommended for production

4. **Output Validation**
   - Downloaded files validated before storage
   - Temporary files cleaned up automatically
   - Object URLs revoked after download

## Monitoring

### Prometheus Metrics (Optional)

Enable monitoring profile:

```bash
docker-compose --profile monitoring up -d
```

Grafana available at: http://localhost:3000 (admin/admin123)

### Health Checks

Both services include health checks:

```yaml
# Frontend health
curl http://localhost/health

# Gotenberg health
curl http://localhost:3000/health
```

## Testing

### Manual Test

1. Navigate to http://localhost:5173
2. Go to "Converters" section
3. Try image or document conversion
4. Verify download works

### Automated Test (Future)

```bash
npm run test:converters
```

## FAQ

**Q: Can I convert files > 500MB?**
A: Increase tmpfs size in docker-compose.yml Gotenberg section

**Q: How do I add new output formats?**
A: Modify `SUPPORTED_FORMATS` in component and `useGotenberg` hook

**Q: Is HTTPS supported?**
A: Yes, configure SSL certificates and update VITE_GOTENBERG_URL

**Q: How do I scale for high load?**
A: Deploy multiple Gotenberg instances behind a load balancer

## References

- [Gotenberg Documentation](https://gotenberg.dev/docs/)
- [Gotenberg GitHub](https://github.com/gotenberg/gotenberg)
- [Vite Proxy Configuration](https://vitejs.dev/config/server-options.html#server-proxy)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)

## License

ToolBoxKit and this integration guide are available under the project's license.
