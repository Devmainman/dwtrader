import axios from 'axios';
import { API_BASE_URL } from './config';

// In deposit.js
export const getPaymentMethods = async (token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/payments/methods`, {
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      });
  
      console.log('Full API Response:', {
        status: response.status,
        data: response.data,
        headers: response.headers
      });
  
      // Ensure we're extracting data correctly
      if (!response.data?.success) {
        throw new Error('API request failed');
      }
  
      return response.data.data || []; // Correct extraction
    } catch (error) {
      console.error('API Error:', {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      throw error;
    }
  };

export const createDeposit = async (formData, token) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/payments/deposit`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Deposit submission failed';
  }
};

export const getDepositHistory = async (token, params = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/payments/deposits`, {
      headers: { Authorization: `Bearer ${token}` },
      params
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch deposit history';
  }
};