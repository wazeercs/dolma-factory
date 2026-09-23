import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { host: true, port: 5173 },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // فصل Supabase SDK (كبير الحجم)
          'supabase': ['@supabase/supabase-js'],
          // فصل React Router
          'router': ['react-router-dom'],
          // فصل React Core
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
