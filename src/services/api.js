import axios from 'axios';

let rawBaseUrl = import.meta.env.VITE_API_URL || '/api';
if (rawBaseUrl.endsWith('/')) {
  rawBaseUrl = rawBaseUrl.slice(0, -1);
}
if (!rawBaseUrl.endsWith('/api') && rawBaseUrl.startsWith('http')) {
  rawBaseUrl = `${rawBaseUrl}/api`;
}

const API = axios.create({
  baseURL: rawBaseUrl,
});

// Automatically inject JWT Bearer token on every outgoing request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('rental_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle unauthenticated edge cases gracefully
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired, clear invalid credentials
      const token = localStorage.getItem('rental_token');
      if (token && window.location.pathname.includes('/dashboard')) {
        localStorage.removeItem('rental_token');
        localStorage.removeItem('rental_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
