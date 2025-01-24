import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import vue from "@astrojs/vue";
import node from "@astrojs/node";  // 添加这行

const DEV_PORT = import.meta.env.PUBLIC_WEB_PORT;


// https://astro.build/config
export default defineConfig({
  base: process.env.CI ? '/dashboard' : undefined,
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),

  /* Like Vercel, Netlify,… Mimicking for dev. server */
  // trailingSlash: 'always',

  server: {
    /* Dev. server only */
    port: DEV_PORT,
		host: '0.0.0.0'
  },
	// 重定向
	redirects:{
		// '/': '/dashboard'
	},
  integrations: [
  //
  sitemap(), tailwind(), vue()]
});
