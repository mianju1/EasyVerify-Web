import type { APIRoute } from 'astro';

export const get: APIRoute = function get(/* { params, request } */) {
	/* IDEA: Can be dynamicized (alternative colors…) */

	const icon = /* html */ `
<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
	<!-- 主圆环 -->
	<path
		d="M180 100c0 44.183-35.817 80-80 80s-80-35.817-80-80 35.817-80 80-80 80 35.817 80 80z"
		fill="url(#paint0_linear)" />
	
	<!-- 内部装饰圆弧 -->
	<path
		d="M160 100c0 33.137-26.863 60-60 60s-60-26.863-60-60 26.863-60 60-60 60 26.863 60 60"
		stroke="url(#paint1_linear)"
		stroke-width="4"
		stroke-dasharray="8 8"
		fill="none" />
	
	<!-- 对勾符号 -->
	<path
		d="M70 100L90 120L130 80"
		stroke="white"
		stroke-width="12"
		stroke-linecap="round"
		stroke-linejoin="round" />

	<!-- 渐变定义 -->
	<defs>
		<linearGradient id="paint0_linear" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
			<stop offset="0" stop-color="#1C64F2"/>
			<stop offset="1" stop-color="#0092FF"/>
		</linearGradient>
		
		<linearGradient id="paint1_linear" x1="40" y1="40" x2="160" y2="160" gradientUnits="userSpaceOnUse">
			<stop offset="0" stop-color="#45B2FF"/>
			<stop offset="1" stop-color="#1724C9"/>
		</linearGradient>
	</defs>
</svg>
    
`;

	return {
		body: icon,
		headers: {
			'Content-Type': 'image/svg+xml',
		},
	};
};
