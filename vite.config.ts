import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path for GitHub Pages deployment
  // Use the repository name as the base path (e.g., /numbers/)
  // For local development, this will be '/'
  base: process.env.NODE_ENV === 'production' ? '/numbers/' : '/',
});
