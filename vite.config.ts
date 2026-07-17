import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), ViteImageOptimizer()],
  build: {
    // Ensure proper asset hashing for cache busting
rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return 'assets/images/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        },
        manualChunks: {
          'vendor-router': ['react-router-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-ui': ['lucide-react', 'cmdk', 'react-markdown', 'remark-gfm', 'react-github-calendar']
        }
      },
    },
    manifest: true,
  },
})
