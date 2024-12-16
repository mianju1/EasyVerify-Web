import axios from 'axios';

// 创建 axios 实例
const instance = axios.create({
    baseURL: 'http://localhost:8080', // 设置基础URL
    timeout: 5000, // 设置超时时间
    headers: {
        'Content-Type': 'application/json'
    }
});

// 请求拦截器
instance.interceptors.request.use(
    (config) => {			

        try {

					const token = localStorage.getItem('token');

            if (!token) {						
							const cookie = document.cookie;
							token = cookie.split('token=')[1];							
            }
						config.headers.Authorization = `Bearer ${token}`;
        } catch (error) {
            console.warn('无法访问 localStorage');
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器
instance.interceptors.response.use(
    (response) => {
        try {
            if (response?.data?.code === 401 && typeof window !== 'undefined') {
                // 清除 cookie
                if (typeof document !== 'undefined') {
                    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
                    document.cookie = 'username=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
                    // 重定向到登录页面
                    window.location.href = '/authentication/login';
                }
                return Promise.reject('未授权访问');
            }
            return response;
        } catch (error) {
            console.warn('无法访问 localStorage 或 cookie');
            return response;
        }
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance; 
