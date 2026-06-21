import axios from 'axios';

const runtimeHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const devBase = runtimeHost === 'localhost' || runtimeHost === '127.0.0.1'
  ? 'http://localhost:8080/api'
  : `http://${runtimeHost}:8080/api`;
const baseURL = import.meta.env.DEV ? devBase : '/api';

const http = axios.create({ baseURL });

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export function getApiOrigin() {
  if (!import.meta.env.DEV) return '';
  return devBase.replace('/api', '');
}

export default http;
