import { defineConfig } from 'astro/config';

const rawBase = process.env.BASE_URL || '/';
const normalizedBase = rawBase.startsWith('/') ? rawBase : `/${rawBase}`;

export default defineConfig({
  output: 'static',
  base: normalizedBase,
  build: {
    assets: '_astro',
  },
});
