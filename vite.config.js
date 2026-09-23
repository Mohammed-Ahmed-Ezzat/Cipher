import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    host: true, // Listens on all addresses (0.0.0.0, 127.0.0.1, localhost) to fix Windows connection issues
    port: 3000,
    open: true,
    watch: {
      ignored: ['**/dist/**']
    }
  },
  preview: {
    host: true,
    port: 3000
  }
});
