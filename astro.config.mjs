import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://lianaspostcards.com',
  base: '/', // Custom domain - site at root
});
