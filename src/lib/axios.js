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
        // 从 localStorage 获取 token
        const token = localStorage.getItem('token');

        // 如果 token 存在，则添加到请求头
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
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
        return response;
    },
    (error) => {
        // 如果响应状态码是 401（未授权），可能是 token 过期
        if (response.data.code && error.response.status === 401) {
            // 清除本地存储的 token
            localStorage.removeItem('token');
						document.cookie = 'token=; path=/;';
						document.cookie = 'username=; path=/;';

            // 重定向到登录页面
            window.location.href = '/authentication/login';
        }
        return Promise.reject(error);
    }
);

export default instance; 
