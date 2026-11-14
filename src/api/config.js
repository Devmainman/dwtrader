export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
// Uploaded files are served by the API host itself (without /api).
export const STATIC_BASE_URL = import.meta.env.VITE_STATIC_BASE_URL || API_BASE_URL.replace(/\/api\/?$/, '');
