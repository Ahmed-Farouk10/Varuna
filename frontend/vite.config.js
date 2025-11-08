import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [
    react(),
  ],
  base: '/', // Use root path for Netlify deployment
});