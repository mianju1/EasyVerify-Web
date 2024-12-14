import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import vue from "@astrojs/vue";
import node from "@astrojs/node";  // 添加这行

const DEV_PORT = 2121;


// https://astro.build/config
export default defineConfig({
  site: process.env.CI ? 'https://themesberg.github.io' : `http://localhost:${DEV_PORT}`,
  base: process.env.CI ? '/flowbite-astro-admin-dashboard' : undefined,
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),

  /* Like Vercel, Netlify,… Mimicking for dev. server */
  // trailingSlash: 'always',

  server: {
    /* Dev. server only */
    port: DEV_PORT
  },
	// 重定向
	redirects:{
		// '/': '/dashboard'
	},
  integrations: [
  //
  sitemap(), tailwind(), vue()]
});
