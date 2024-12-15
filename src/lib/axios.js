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
            if (typeof window !== 'undefined' && window.localStorage) {
                const token = window.localStorage.getItem('token');
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
            }
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
                // 清除本地存储的 token
                if (window.localStorage) {
                    window.localStorage.removeItem('token');
                }
                if (typeof document !== 'undefined') {
                    document.cookie = 'token=; path=/;';
                    document.cookie = 'username=; path=/;';
                }
                // 重定向到登录页面
                window.location.href = '/authentication/login';
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
