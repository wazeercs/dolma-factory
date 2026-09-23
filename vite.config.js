import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { host: true, port: 5173 },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Supabase SDK
            if (id.includes('@supabase')) return 'supabase';
            // React Router
            if (id.includes('react-router') || id.includes('@remix-run')) return 'router';
            // React Core
            if (id.includes('react-dom')) return 'react-vendor';
            if (id.includes('/react/') || id.endsWith('react/index.js')) return 'react-vendor';
            // بقية المكتبات
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
