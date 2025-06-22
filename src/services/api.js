import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

export const userService = {
  signup: (userData) => API.post('/users/signup', userData),
  login: (userData) => API.post('/users/login', userData),
};

export const adminService = {
  login: (adminData) => API.post('/admin/login', adminData),
  getDashboard: () => API.get('/admin/dashboard'),
};

export default API;