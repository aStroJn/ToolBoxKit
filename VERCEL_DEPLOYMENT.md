# Vercel Deployment Guide - FFMPEG.wasm

## Overview

This guide covers the deployment of ToolBoxKit to Vercel with special focus on ensuring FFMPEG.wasm (WebAssembly) works correctly in production.

## Prerequisites

- Vercel account
- Git repository connected to Vercel
- Node.js 18+ for local testing

## Quick Start

1. **Connect Repository to Vercel**
   ```bash
   # Install Vercel CLI (optional)
   npm i -g vercel
   
   # Deploy
   vercel --prod
   ```

2. **Verify Configuration Files**
   - Ensure `vercel.json` exists in project root
   - Ensure `public/_redirects` has correct CSP headers

## FFMPEG.wasm Requirements

FFMPEG.wasm requires specific browser features and HTTP headers to function:

### Required Browser Features
- **WebAssembly** support
- **SharedArrayBuffer** support (requires specific headers)

### Required HTTP Headers

1. **Content-Security-Policy**
   - Must include `'wasm-unsafe-eval'` in `script-src` directive
   - Must allow CDN sources: `https://unpkg.com` and `https://cdn.jsdelivr.net`

2. **Cross-Origin-Embedder-Policy (COEP)**
   - Must be set to `require-corp` for SharedArrayBuffer support

3. **Cross-Origin-Opener-Policy (COOP)**
   - Must be set to `same-origin` for SharedArrayBuffer support

4. **WASM File Headers**
   - `.wasm` files must be served with `Content-Type: application/wasm`
   - Should include `Cross-Origin-Resource-Policy: cross-origin`

## Configuration Files

### vercel.json

The `vercel.json` file configures:
- HTTP headers for all routes (CSP, COEP, COOP)
- Special headers for `.wasm` files
- SPA routing rewrites

**Key Configuration:**
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "... 'wasm-unsafe-eval' ..."
        },
        {
          "key": "Cross-Origin-Embedder-Policy",
          "value": "require-corp"
        },
        {
          "key": "Cross-Origin-Opener-Policy",
          "value": "same-origin"
        }
      ]
    }
  ]
}
```

### public/_redirects

The `public/_redirects` file (for Netlify compatibility) should match the CSP in `vercel.json`:
```
Content-Security-Policy: ... 'wasm-unsafe-eval' ...
```

### vite.config.js (Local Development)

For local development, headers are configured in `vite.config.js`:

**Dev Server Configuration:**
```javascript
server: {
  headers: {
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'cross-origin'
  }
}
```

**Preview Server Configuration:**
```javascript
preview: {
  headers: {
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'cross-origin'
  }
}
```

These headers enable SharedArrayBuffer support during local development (`npm run dev`) and when testing production builds (`npm run preview`).

## Local Development Setup

### Running Locally with FFMPEG.wasm

To develop and test FFMPEG.wasm locally:

1. **Start Development Server:**
   ```bash
   npm run dev
   ```

2. **Verify Headers:**
   - Open browser DevTools → Network tab
   - Reload page
   - Check response headers for:
     - `Cross-Origin-Embedder-Policy: require-corp`
     - `Cross-Origin-Opener-Policy: same-origin`

3. **Test SharedArrayBuffer:**
   - Open browser console
   - Run: `console.log(typeof SharedArrayBuffer)`
   - Should output: `"function"` (not `"undefined"`)

4. **Test FFMPEG:**
   - Navigate to Video or Audio Converter
   - FFMPEG should load without errors
   - Try converting a file

### Testing Production Build Locally

To test the production build with headers:

```bash
# Build the application
npm run build

# Preview with production build
npm run preview
```

The preview server includes the same headers as the dev server, ensuring consistent behavior.

### Troubleshooting Local Development

**Issue: SharedArrayBuffer is undefined**

1. **Check Headers:**
   - Open DevTools → Network tab
   - Select the main document request
   - Verify headers are present in Response Headers

2. **Hard Refresh:**
   - Press `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
   - Browsers may cache responses without headers

3. **Verify vite.config.js:**
   - Ensure `headers` object exists in both `server` and `preview` sections
   - Check for syntax errors

4. **Check Browser Console:**
   - Look for CSP violations
   - Check for network errors
   - Verify no conflicting headers

**Issue: Headers not appearing**

- Restart the dev server after changing `vite.config.js`
- Clear browser cache
- Try incognito/private browsing mode

## Deployment Steps

### 1. Pre-Deployment Checklist

- [ ] `vercel.json` exists and is properly configured
- [ ] `public/_redirects` CSP includes `'wasm-unsafe-eval'`
- [ ] `vite.config.js` includes `assetsInclude: ['**/*.wasm']`
- [ ] All dependencies are in `package.json`

### 2. Build Configuration

Vercel automatically detects Vite projects. Ensure your build settings:

**Build Command:** `npm run build`  
**Output Directory:** `dist`  
**Install Command:** `npm install`

### 3. Environment Variables

No special environment variables required for FFMPEG.wasm. However, if using Gotenberg:

```bash
VITE_GOTENBERG_URL=https://your-gotenberg-instance.com
```

### 4. Deploy

```bash
# Via Vercel CLI
vercel --prod

# Or push to connected Git branch
git push origin main
```

## Testing After Deployment

### 1. Verify Headers

Check that headers are correctly applied:

```bash
curl -I https://your-app.vercel.app
```

Look for:
- `Content-Security-Policy` with `'wasm-unsafe-eval'`
- `Cross-Origin-Embedder-Policy: require-corp`
- `Cross-Origin-Opener-Policy: same-origin`

### 2. Test FFMPEG Loading

1. Open your deployed app
2. Navigate to Video or Audio Converter
3. Open browser DevTools Console
4. Check for:
   - No CSP violations
   - FFMPEG loads successfully
   - No CORS errors
   - SharedArrayBuffer is available

### 3. Browser Compatibility

Test in multiple browsers:
- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support (iOS 16.4+)

## Troubleshooting

### FFMPEG Fails to Load

**Symptom:** FFMPEG.wasm doesn't load, error in console

**Solutions:**

1. **Check CSP Violations**
   - Open DevTools → Console
   - Look for CSP violation errors
   - Verify `'wasm-unsafe-eval'` is in `script-src`

2. **Check SharedArrayBuffer**
   ```javascript
   // Run in browser console
   console.log(typeof SharedArrayBuffer);
   // Should output: "function"
   ```
   - If `undefined`, check COEP/COOP headers
   - Verify headers are set correctly in `vercel.json`

3. **Check Network Requests**
   - Open DevTools → Network tab
   - Look for failed requests to CDN URLs
   - Check CORS headers on responses

4. **Verify vercel.json**
   - Ensure file is in project root
   - Check JSON syntax is valid
   - Verify headers are correctly formatted

### CORS Errors

**Symptom:** CORS errors when loading from CDN

**Solutions:**
- Verify CDN URLs are in CSP `connect-src`
- Check that CDN allows cross-origin requests
- Ensure `Cross-Origin-Resource-Policy` is set for WASM files

### SharedArrayBuffer Not Available

**Symptom:** Error: "SharedArrayBuffer is not available"

**For Local Development:**
1. **Verify vite.config.js headers:**
   - Check `server.headers` section exists
   - Verify headers match production configuration
   - Restart dev server after changes

2. **Check browser console:**
   ```javascript
   console.log(typeof SharedArrayBuffer);
   // Should output: "function"
   ```

3. **Verify headers in DevTools:**
   - Open Network tab
   - Select main document request
   - Check Response Headers for COEP and COOP

4. **Hard refresh browser:**
   - `Ctrl+Shift+R` (Windows/Linux)
   - `Cmd+Shift+R` (Mac)
   - Browsers may cache responses

**For Production (Vercel):**
1. Verify headers are set in `vercel.json`:
   - `Cross-Origin-Embedder-Policy: require-corp`
   - `Cross-Origin-Opener-Policy: same-origin`
2. Check browser support:
   - Chrome/Edge: Supported
   - Firefox: Supported
   - Safari: iOS 16.4+ required
3. Ensure site is served over HTTPS (required for SharedArrayBuffer)

### Timeout Errors

**Symptom:** FFMPEG load times out after 30 seconds

**Solutions:**
- Check network connectivity
- Verify CDN is accessible
- Try different CDN URL (fallback is automatic)
- Check Vercel function timeout limits (shouldn't apply to static assets)

### Build Errors

**Symptom:** Build fails on Vercel

**Solutions:**
1. Check build logs in Vercel dashboard
2. Verify Node.js version (should be 18+)
3. Ensure all dependencies are in `package.json`
4. Check for syntax errors in configuration files

## Browser Console Checks

After deployment, run these checks in browser console:

```javascript
// 1. Check WebAssembly support
console.log('WebAssembly:', typeof WebAssembly !== 'undefined');

// 2. Check SharedArrayBuffer
console.log('SharedArrayBuffer:', typeof SharedArrayBuffer !== 'undefined');

// 3. Check headers (requires manual inspection in Network tab)
// Look for COEP and COOP headers in response headers

// 4. Test FFMPEG load
// Navigate to converter and check console for errors
```

## Performance Considerations

### CDN Loading

FFMPEG.wasm loads from CDN (unpkg.com or jsdelivr.net):
- First load: ~10-15MB download
- Subsequent loads: Cached by browser
- Multiple fallback URLs ensure reliability

### Optimization Tips

1. **Preload WASM Files** (Future Enhancement)
   - Add `<link rel="preload">` for WASM files
   - Reduces initial load time

2. **Service Worker Caching** (Future Enhancement)
   - Cache WASM files in service worker
   - Offline support for repeat conversions

## Common Issues

### Issue: Headers Not Applied

**Cause:** `vercel.json` not in root or syntax error

**Fix:** 
- Verify file location
- Validate JSON syntax
- Check Vercel deployment logs

### Issue: CSP Still Blocking

**Cause:** Multiple CSP headers or incorrect directive

**Fix:**
- Ensure only one CSP header is set
- Verify `'wasm-unsafe-eval'` spelling
- Check for conflicting headers in `public/_redirects`

### Issue: Works Locally, Fails on Vercel

**Cause:** Different header configuration or environment

**Fix:**
- Compare local vs production headers
- Verify `vercel.json` is deployed
- Check Vercel-specific configuration

## Monitoring

### Vercel Analytics

Monitor:
- Page load times
- Error rates
- User sessions

### Browser Console

Regular checks:
- CSP violations
- Network errors
- JavaScript errors

## Rollback Plan

If deployment fails:

1. **Revert Git Commit**
   ```bash
   git revert HEAD
   git push origin main
   ```

2. **Revert Vercel Deployment**
   - Go to Vercel dashboard
   - Select previous successful deployment
   - Click "Promote to Production"

3. **Check Logs**
   - Review Vercel build logs
   - Check browser console errors
   - Verify configuration files

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [FFMPEG.wasm Documentation](https://ffmpegwasm.netlify.app/)
- [WebAssembly Documentation](https://webassembly.org/)
- [SharedArrayBuffer Requirements](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer)

## Support

For issues specific to:
- **Vercel Deployment**: Check Vercel dashboard logs
- **FFMPEG.wasm**: Check browser console for specific errors
- **Configuration**: Verify `vercel.json` and `public/_redirects` files

## Version History

- **v1.0** - Initial Vercel deployment guide with FFMPEG.wasm support

