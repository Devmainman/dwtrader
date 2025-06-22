import axios from 'axios';
import { API_BASE_URL } from './config';

export const fetchPaymentMethods = async () => {
  const response = await axios.get(`${API_BASE_URL}/payment-methods`);
  return response.data;
};

export const createDeposit = async (data, token) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  });
  
  const response = await axios.post(`${API_BASE_URL}/deposits`, formData, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};