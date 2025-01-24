import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import vue from "@astrojs/vue";
import node from "@astrojs/node";
import { loadEnv } from "vite";

const env = loadEnv(process.env.NODE_ENV, process.cwd(), '');
const DEV_PORT = parseInt(env.PUBLIC_WEB_PORT,10);


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
