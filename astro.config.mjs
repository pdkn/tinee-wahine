import { defineConfig } from 'astro/config'
import react from '@astrojs/react';
import netlify from '@astrojs/netlify/edge-functions';

export default defineConfig({
  site: 'https://tinee-wahine.netlify.app/',
  adapter: netlify(),
  integrations: [
    react(),
  ],
})