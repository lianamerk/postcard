import { defineConfig } from 'astro/config';

// https://astro.build/config
// For local dev, we'll use root path. For production build, use /postcard
export default defineConfig({
  output: 'static',
  site: 'https://lianamerk.github.io',
  base: '/postcard', // Keep this for production, but we'll test locally at root
});
