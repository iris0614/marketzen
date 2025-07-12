import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加认证token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token过期或无效，清除本地存储并重定向到登录页
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 认证相关API
export const authAPI = {
  register: (data: {
    email: string;
    username: string;
    password: string;
    bio?: string;
    investment_style?: string[];
  }) => api.post('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  getCurrentUser: () => api.get('/auth/me'),
};

// 用户相关API
export const userAPI = {
  getUser: (id: string) => api.get(`/users/${id}`),
  
  updateUser: (id: string, data: any) => api.put(`/users/${id}`, data),
  
  followUser: (id: string) => api.post(`/users/${id}/follow`),
  
  unfollowUser: (id: string) => api.delete(`/users/${id}/follow`),
  
  getFollowing: (id: string) => api.get(`/users/${id}/following`),
  
  getFollowers: (id: string) => api.get(`/users/${id}/followers`),
  
  searchUsers: (query: string) => api.get(`/users/search?q=${query}`),
};

// 交易相关API
export const tradeAPI = {
  getTrades: (params?: any) => api.get('/trades', { params }),
  
  createTrade: (data: any) => api.post('/trades', data),
  
  getTrade: (id: string) => api.get(`/trades/${id}`),
  
  updateTrade: (id: string, data: any) => api.put(`/trades/${id}`, data),
  
  deleteTrade: (id: string) => api.delete(`/trades/${id}`),
  
  updateTradePrivacy: (id: string, isPublic: boolean) =>
    api.put(`/trades/${id}/privacy`, { is_public: isPublic }),
};

// 投资原则相关API
export const principleAPI = {
  getPrinciples: (params?: any) => api.get('/principles', { params }),
  
  createPrinciple: (data: any) => api.post('/principles', data),
  
  getPrinciple: (id: string) => api.get(`/principles/${id}`),
  
  updatePrinciple: (id: string, data: any) => api.put(`/principles/${id}`, data),
  
  deletePrinciple: (id: string) => api.delete(`/principles/${id}`),
  
  updatePrinciplePrivacy: (id: string, isPublic: boolean) =>
    api.put(`/principles/${id}/privacy`, { is_public: isPublic }),
};

// 社交动态相关API
export const feedAPI = {
  getFeed: (params?: any) => api.get('/feed', { params }),
  
  getExplore: (params?: any) => api.get('/feed/explore', { params }),
  
  createInteraction: (data: any) => api.post('/feed/interactions', data),
  
  deleteInteraction: (id: string) => api.delete(`/feed/interactions/${id}`),
};

export default api; 