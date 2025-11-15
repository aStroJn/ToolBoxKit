/* global process */
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    
    // Test Configuration
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/test/setup.js'],
      css: true,
    },
    
    // Build Configuration
    build: {
      target: 'es2015',
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: env.VITE_BUILD_SOURCEMAP === 'true',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: env.VITE_APP_ENV === 'production',
          drop_debugger: env.VITE_APP_ENV === 'production',
        },
      },
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            ffmpeg: ['@ffmpeg/ffmpeg', '@ffmpeg/util'],
            utils: ['file-saver', 'jszip']
          },
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]'
        }
      },
      chunkSizeWarningLimit: 1000,
      // Include WASM files as assets
      assetsInclude: ['**/*.wasm']
    },
    
    // Development Configuration
    server: {
      port: 5173,
      host: true, // Allow external connections
      strictPort: false,
      cors: true,
      headers: {
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Resource-Policy': 'cross-origin',
        'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval' 'wasm-unsafe-eval' blob: https://unpkg.com https://cdn.jsdelivr.net https://esm.sh; worker-src 'self' blob:; connect-src 'self' https://unpkg.com https://cdn.jsdelivr.net https://esm.sh https://gotenberg.toolboxkit.com;",
      },
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
        }
      }
    },
    
    // Preview Configuration
    preview: {
      port: 4173,
      host: true,
      strictPort: false,
      cors: true,
      headers: {
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Resource-Policy': 'cross-origin',
        'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval' 'wasm-unsafe-eval' blob: https://unpkg.com https://cdn.jsdelivr.net https://esm.sh; worker-src 'self' blob:; connect-src 'self' https://unpkg.com https://cdn.jsdelivr.net https://esm.sh https://gotenberg.toolboxkit.com;"
      }
    },
    
    // Resolver Configuration
    resolve: {
      alias: {
        '@': resolve(process.cwd(), 'src'),
        '@components': resolve(process.cwd(), 'src/components'),
        '@pages': resolve(process.cwd(), 'src/pages'),
        '@hooks': resolve(process.cwd(), 'src/hooks'),
        '@context': resolve(process.cwd(), 'src/context'),
        '@utils': resolve(process.cwd(), 'src/utils')
      }
    },
    
    // CSS Configuration
    css: {
      devSourcemap: true,
      postcss: './postcss.config.js'
    },
    
    // Define global constants
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },
    
    // Optimize Dependencies
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'file-saver',
        'jszip'
      ],
      exclude: [
        // Exclude FFMPEG from optimization - it uses workers internally
        '@ffmpeg/ffmpeg',
        '@ffmpeg/util',
        // Exclude worker files from optimization
        'worker.js',
        '@ffmpeg/ffmpeg/dist/esm/worker'
      ]
    },
    
    // Security Configuration
    esbuild: {
      legalComments: 'none',
      drop: env.VITE_APP_ENV === 'production' ? ['console', 'debugger'] : []
    },
    
    // Worker Configuration
    worker: {
      format: 'es'
    }
  }
})
