import { defineConfig } from 'astro/config';

const rawBase = process.env.BASE_URL || '/';
const normalizedBase = rawBase.startsWith('/') ? rawBase : `/${rawBase}`;
const siteUrl = process.env.SITE_URL || undefined;

export default defineConfig({
  site: siteUrl,
  output: 'static',
  base: normalizedBase,
  build: {
    assets: '_astro',
  },
});
