import axios from 'axios';
import { API_BASE_URL } from './config';

const api = axios.create({
  baseURL: `${API_BASE_URL}/verification`,
  timeout: 40000, // 10 seconds timeout
  headers: {
    // 'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Don't automatically redirect - let components handle it
      console.error('Unauthorized request - token may be invalid');
    }
    return Promise.reject(error);
  }
);

const processResponse = (response) => {
  if (!response.data) {
    throw new Error('Empty response from server');
  }
  return response.data;
};

const handleUploadError = (error) => {
  let errorMessage = 'Upload failed';
  
  if (error.response) {
    errorMessage = error.response.data?.message || 
                 `Server responded with ${error.response.status}`;
  } else if (error.code === 'ECONNABORTED') {
    errorMessage = 'Request timeout. Please try again.';
  } else if (error.name === 'CanceledError') {
    errorMessage = 'Upload canceled';
  } else if (error.message.includes('Network Error')) {
    errorMessage = 'Network error. Please check your connection.';
  } else {
    errorMessage = error.message || errorMessage;
  }

  throw new Error(errorMessage);
};

let activeUploads = [];

export const completeProfile = async (profileData, token) => {
  try {
    const response = await api.post('/profile', profileData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return processResponse(response);
  } catch (error) {
    console.error('Profile update error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    const apiError = new Error(error.response?.data?.message || 'Profile update failed');
    apiError.status = error.response?.status;
    apiError.details = error.response?.data;
    throw apiError;
  }
};

export const sendPhoneVerification = async () => {
  const response = await api.post('/phone');
  return processResponse(response);
};

export const verifyPhoneOTP = async (otp) => {
  const response = await api.post('/verify-otp', { otp });
  return processResponse(response);
};

export const uploadIdDocument = async (formData) => {
  const controller = new AbortController();
  activeUploads.push(controller);

  try {
    const response = await api.post('/id-document', formData, {
      signal: controller.signal,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    activeUploads = activeUploads.filter(c => c !== controller);
    return processResponse(response);
  } catch (error) {
    return handleUploadError(error);
  }
};

export const cancelAllUploads = () => {
  activeUploads.forEach(controller => controller.abort());
  activeUploads = [];
};

export const uploadAddressProof = async (formData) => {
  const controller = new AbortController();
  activeUploads.push(controller);

  try {
    const response = await api.post('/address-proof', formData, {
      signal: controller.signal,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    activeUploads = activeUploads.filter(c => c !== controller);
    return processResponse(response);
  } catch (error) {
    return handleUploadError(error);
  }
};

export const uploadFaceImage = async (formData) => {
  const controller = new AbortController();
  activeUploads.push(controller);

  try {
    const response = await api.post('/face-image', formData, {
      signal: controller.signal,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    activeUploads = activeUploads.filter(c => c !== controller);
    return processResponse(response);
  } catch (error) {
    return handleUploadError(error);
  }
};

export const saveAddress = async (addressData) => {
  const response = await api.post('/address', addressData);
  return processResponse(response);
};