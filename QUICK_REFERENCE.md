# Quick Reference: Gotenberg Integration

## 🚀 Quick Start (5 minutes)

```bash
# 1. Start everything
docker-compose up -d

# 2. Open browser
http://localhost

# 3. Go to Converters → Images or Documents
# 4. Upload file → Select format → Start
```

## 📍 Key URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost | Main application |
| Gotenberg API | http://localhost:3000 | Conversion backend |
| Health Check | http://localhost:3000/health | Service status |
| Dev Server | http://localhost:5173 | `npm run dev` |

## 🗂️ Key Files

| File | Purpose | Lines |
|------|---------|-------|
| `docker-compose.yml` | Infrastructure config | Modified |
| `src/services/gotenbergService.js` | API client | 200+ |
| `src/hooks/useGotenberg.jsx` | React hook | 280+ |
| `src/components/converters/ImageConverter.jsx` | UI component | 357 |
| `src/components/converters/DocumentConverter.jsx` | UI component | 313 |

## ⚙️ Environment Variables

### Development (`.env.local`)
```
VITE_GOTENBERG_URL=http://localhost:3000
VITE_APP_ENV=development
```

### Production (`.env.production`)
```
VITE_GOTENBERG_URL=http://gotenberg:3000
VITE_APP_ENV=production
```

## 🔧 Common Commands

```bash
# Start full stack
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f gotenberg

# Restart Gotenberg
docker-compose restart gotenberg

# Development mode
npm run dev

# Production build
npm run build

# Check service health
curl http://localhost:3000/health

# Test image conversion
curl -F "files=@image.jpg" \
     -F "outputFormat=png" \
     http://localhost:3000/forms/chromium/convert > output.png

# Test document conversion
curl -F "files=@document.docx" \
     -F "outputFormat=pdf" \
     http://localhost:3000/forms/libreoffice/convert > output.pdf
```

## 📊 Supported Conversions

### Images
- Input: JPG, PNG, WEBP, HEIC, HEIF, SVG, BMP, GIF
- Output: JPG, PNG, WEBP
- Options: Quality (1-100%)

### Documents
- Input: DOCX, DOC, PDF, XLSX, PPTX, TXT, HTML, ODT, RTF
- Output: PDF, DOCX, XLSX, PPTX, HTML, TXT
- Options: None (automatic formatting)

## 🎯 Component Usage

### useGotenberg Hook
```javascript
import useGotenberg from '@/hooks/useGotenberg';

const MyComponent = () => {
  const {
    isServiceReady,      // boolean
    isProcessing,        // boolean
    progress,            // 0-100
    error,               // string | null
    convertFiles,        // (files, format, options) => Promise
    cancel,              // () => void
    reset,               // () => void
  } = useGotenberg('image' | 'document');

  return (
    <button onClick={() => convertFiles(files, 'PDF', {})}>
      Convert to PDF
    </button>
  );
};
```

## 🐛 Quick Troubleshooting

### "Service offline"
```bash
# Check health
curl http://localhost:3000/health

# Restart
docker-compose restart gotenberg
```

### Conversion timeout
- Check file size (should be < 500MB)
- Increase timeout in `useGotenberg.jsx` if needed

### Port already in use
```bash
# Find process on port 3000
netstat -ano | findstr :3000

# Change port in docker-compose.yml
ports:
  - "3001:3000"

# Update .env.local
VITE_GOTENBERG_URL=http://localhost:3001
```

### Need to debug
```javascript
// Check browser console for errors
// View network tab for API calls
// Check docker logs for backend errors
docker-compose logs gotenberg -f
```

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [GOTENBERG_INTEGRATION.md](./GOTENBERG_INTEGRATION.md) | Comprehensive setup guide |
| [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) | Technical implementation details |
| [COMPLETION_REPORT.md](./COMPLETION_REPORT.md) | Final status report |
| [.github/copilot-instructions.md](./.github/copilot-instructions.md) | Architecture & patterns |

## ✅ Status

- ✅ ImageConverter: Fully functional
- ✅ DocumentConverter: Fully functional
- ✅ Health monitoring: Working
- ✅ Error handling: Comprehensive
- ✅ Progress tracking: Real-time
- ✅ Auto-download: Enabled
- ✅ ESLint: Passing

## 🎓 Learn More

1. **For Setup**: GOTENBERG_INTEGRATION.md → Quick Start
2. **For Troubleshooting**: GOTENBERG_INTEGRATION.md → Troubleshooting
3. **For Architecture**: IMPLEMENTATION_SUMMARY.md
4. **For Code Patterns**: .github/copilot-instructions.md

## 🚢 Production Deployment

1. Update `VITE_GOTENBERG_URL` in `.env.production`
2. Build: `npm run build`
3. Deploy with: `docker-compose -f docker-compose.yml up -d`
4. Verify: `curl https://your-domain/health`

---

**Last Updated**: 2024  
**Status**: Production Ready ✅  
**Version**: 1.0
