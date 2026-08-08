import axios from 'axios';

const API = axios.create({
  baseURL: '', // Uses Vite proxy
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach Admin JWT token to protected requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token && config.url.includes('/api/admin')) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor for global auth error handling
API.interceptors.response.use((response) => response, (error) => {
  if (error.response && error.response.status === 401 && window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('/login')) {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    window.location.href = '/admin/login';
  }
  return Promise.reject(error);
});

export default API;
