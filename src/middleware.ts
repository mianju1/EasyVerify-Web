import { defineMiddleware } from 'astro/middleware';

const publicPages = [
	'/',
	'/authentication/login',
	'/authentication/register',
	'/authentication/reset-password',
	'/authentication/forgot-password'
];
const redirectPages = [
	'/authentication/login',
	'/authentication/register',
	'/authentication/reset-password',
	'/authentication/forgot-password',
];

export const onRequest = defineMiddleware(async (context, next) => {
	const url = new URL(context.request.url);

	// 获取 token (注意: localStorage 只在浏览器端可用)
	const token = context.cookies.get('token')?.value;
	const username = context.cookies.get('username')?.value;


	// 如果已登录且访问以下页面，重定向到 主页
	if (token && username && redirectPages.includes(url.pathname)) {
		return context.redirect('/dashboard');
	}

	// 如果是公开页面,直接放行
	if (publicPages.includes(url.pathname)) {
		return next();
	}

	// 如果没有token且不是公开页面,重定向到登录
	if (!token || !username) {
		return context.redirect('/authentication/login');
	}

	return next();
});
