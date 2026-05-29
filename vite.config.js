import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.BASE_PATH || '/',
  server: {
    port: 3456,
    open: false,
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
  },
});
