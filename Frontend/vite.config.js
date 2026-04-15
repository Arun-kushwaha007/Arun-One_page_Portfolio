import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import compression from 'vite-plugin-compression'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), compression()],
  assetsInclude: ['**/*.fbx'],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-three': ['three', '@react-three/fiber', '@react-three/drei', 'maath'],
          'vendor-motion': ['framer-motion'],
          'vendor-utils': ['lenis', 'lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
