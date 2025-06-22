import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../api/config';

const UserAuthContext = createContext();

export function UserAuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    }
  });

  api.interceptors.request.use(config => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, error => Promise.reject(error));

  const fetchWithAuth = async (endpoint, options = {}) => {
    try {
      const fullEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
      const response = await api({
        ...options,
        url: fullEndpoint
      });
      return response;
    } catch (error) {
      console.error('API Error:', {
        url: error.config?.url,
        status: error.response?.status,
        message: error.message
      });

      if (error.response?.status === 401) {
        try {
          const newToken = await refreshToken();
          if (newToken) {
            const retryResponse = await api({
              ...options,
              url: error.config.url,
              headers: {
                ...(error.config?.headers || {}),
                Authorization: `Bearer ${newToken}`
              }
            });
            return retryResponse;
          }
        } catch (refreshError) {
          logout();
          throw refreshError;
        }
      }

      throw error;
    }
  };

  const refreshToken = useCallback(async () => {
    try {
      const response = await api.post('/users/refresh', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const newToken = response.data.token;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      return newToken;
    } catch (error) {
      logout();
      return null;
    }
  });

  const verifyAdminAccess = async (adminAccessToken) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(
        `${API_BASE_URL}/auth/admin-access`,
        { token: adminAccessToken },
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (response.data.success) {
        const { user: userData, token: sessionToken } = response.data;
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', sessionToken);
        setUser(userData);
        setToken(sessionToken);
        return true;
      } else {
        setError(response.data.message || 'Admin access verification failed');
        return false;
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Admin access verification failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const initializeAuth = async () => {
    // Check for adminAccessToken in URL
    const params = new URLSearchParams(window.location.search);
    const adminAccessToken = params.get('adminAccessToken');
    
    if (adminAccessToken && isMounted.current) {
      const success = await verifyAdminAccess(adminAccessToken);
      if (success && isMounted.current) {
        // Clear query parameter from URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
      return;
    }

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // Skip fetching from /users/me — no request here
      if (isMounted.current) {
        setLoading(false);
      }
    } catch (error) {
      if (isMounted.current) {
        console.error('Initialization error:', error);
        setError(error.response?.data?.message || error.message);
        if (error.response?.status === 401 || error.response?.status === 404) {
          logout();
        }
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    initializeAuth();
    return () => {
      isMounted.current = false;
    };
  }, [token]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post('/users/login', { email, password });
      localStorage.setItem('token', response.data.token);
      setToken(response.data.token);

      // Optional: Store dummy user if you want user state during login
      const dummyUser = {
        email,
        accountId: 'dummy-id',
      };
      setUser(dummyUser);
      localStorage.setItem('user', JSON.stringify(dummyUser));

      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'Login failed. Please try again.';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = useCallback((profileData) => {
    setUser(prevUser => {
      if (!prevUser) return prevUser; // Handle null user case
      const updatedUser = { ...prevUser, ...profileData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, []); // Empty dependency array = stable reference
  
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setError(null);
  }, []); // Stable reference

  return (
    <UserAuthContext.Provider value={{ 
      user, 
      token,
      loading,
      error,
      login,
      logout,
      fetchWithAuth,
      refreshToken,
      updateUserProfile,
      verifyAdminAccess // Expose for potential reuse
    }}>
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  return context;
}