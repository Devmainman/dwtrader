import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo
} from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../api/config';

const UserAuthContext = createContext();



// Secure storage abstraction
const secureStorage = {
  get: (key) => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.error('Storage get failed:', e);
      return null;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.error('Storage set failed:', e);
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Storage remove failed:', e);
    }
  }
};


export function UserAuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = secureStorage.get('user');
    return stored && stored !== 'undefined' ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState(() => secureStorage.get('token'));
  const [loading, setLoading] = useState({ global: true, login: false, refresh: false });
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState(null);

  const websocketRef = useRef(null);
  const isMounted = useRef(true);
  const hasInitialized = useRef(false);
  const refreshInProgress = useRef(null);

  const connectWebSocket = useCallback(() => {
    if (!token) return;
  
    const ws = new WebSocket(`${API_BASE_URL.replace(/^http/, 'ws')}/notifications/ws?token=${token}`);
  
    ws.onopen = () => {
      console.log('[WS] Connected to server');
    };
  
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('[WS] Message received:', message);
    };
  
    ws.onerror = (error) => {
      console.error('[WS] Error:', error);
    };
  
    ws.onclose = (e) => {
      console.warn('[WS] Disconnected:', e.reason);
      websocketRef.current = null;
      // Optionally try reconnect after delay
      setTimeout(connectWebSocket, 5000); 
    };
  
    websocketRef.current = ws;
  }, [token]);

  const isTokenExpired = useCallback((token) => {
    if (!token) return true;
    try {
      const { exp } = JSON.parse(atob(token.split('.')[1]));
      return Date.now() >= exp * 1000;
    } catch {
      return true;
    }
  }, []);

  const logout = async () => {
    try {
      setLoggingOut(true);  // <- Trigger logout state
      localStorage.removeItem('token');
      setUser(null);
      setToken(null);
  
      const res = await fetch(`${API_BASE_URL}/public/settings`);
      const data = await res.json();
      const logoutUrl = data?.settings?.logoutUrl;
  
      setTimeout(() => {
        window.location.href = logoutUrl || '/auth';
      }, 500); // Optional delay to let spinner appear smoothly
    } catch (err) {
      console.error('Logout error:', err);
      window.location.href = '/auth';
    }
  };
  
  const refreshToken = useCallback(async () => {
    if (!token || refreshInProgress.current) return refreshInProgress.current;

    refreshInProgress.current = (async () => {
      try {
        setLoading(prev => ({ ...prev, refresh: true }));
        const response = await axios.post(`${API_BASE_URL}/users/refresh`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const newToken = response.data.token;
        secureStorage.set('token', newToken);
        if (newToken !== token) {
          setToken(newToken);
        }        
        return newToken;
      } catch (error) {
        console.error('Token refresh failed:', error);
        await logout(true);
        return null;
      } finally {
        setLoading(prev => ({ ...prev, refresh: false }));
        refreshInProgress.current = null;
      }
    })();

    return refreshInProgress.current;
  }, [token, logout]);

  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: API_BASE_URL,
      headers: { 'Content-Type': 'application/json' }
    });

    instance.interceptors.request.use((config) => {
      if (token && !isTokenExpired(token)) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    instance.interceptors.response.use(
      res => res,
      async error => {
        const original = error.config;
        if (error.response?.status === 401 && !original._retry) {
          original._retry = true;
          const newToken = await refreshToken();
          if (newToken) {
            original.headers.Authorization = `Bearer ${newToken}`;
            return instance(original);
          }
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }, [token, isTokenExpired, refreshToken]);

  const fetchWithAuth = async (endpoint, options = {}, retries = 1) => {
    try {
      const response = await api({
        ...options,
        url: endpoint.startsWith('/') ? endpoint : `/${endpoint}`
      });
      return response;
    } catch (error) {
      if (error.response?.status === 401 && retries > 0) {
        return fetchWithAuth(endpoint, options, retries - 1);
      }
      throw error;
    }
  };

  const verifyAdminAccess = async (adminAccessToken) => {
    try {
      setLoading(prev => ({ ...prev, global: true }));
      const response = await axios.post(`${API_BASE_URL}/auth/admin-access`, {
        token: adminAccessToken
      });

      if (response.data.success) {
        const { user: u, token: newToken } = response.data;
        secureStorage.set('user', JSON.stringify(u));
        secureStorage.set('token', newToken);
        setUser(u);
        setToken(newToken);
        return true;
      } else {
        setError('Admin access verification failed');
        return false;
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Admin access failed');
      return false;
    } finally {
      setLoading(prev => ({ ...prev, global: false }));
    }
  };

  const initializeAuth = useCallback(async () => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
  
    const params = new URLSearchParams(window.location.search);
    const adminAccessToken = params.get('adminAccessToken');
  
    if (adminAccessToken) {
      const ok = await verifyAdminAccess(adminAccessToken);
      if (ok) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
      return;
    }
  
    if (!token || isTokenExpired(token)) {
      setLoading(prev => ({ ...prev, global: false }));
      return;
    }
  
    try {
      const res = await api.get('/users/me');
      if (isMounted.current) {
        const user = res.data.user || res.data; // Safe fallback
        console.log("Fetched user from /me:", user);
        setUser(user);
        secureStorage.set('user', JSON.stringify(user));
      }

    } catch (error) {
      console.warn("Invalid token or expired, not logging out yet...");
      secureStorage.remove('token');
      secureStorage.remove('user');
      setToken(null);
      setUser(null);
    } finally {
      if (isMounted.current) {
        setLoading(prev => ({ ...prev, global: false }));
      }
    }
  }, [token, isTokenExpired, api]);

  const refreshUser = useCallback(async () => {
  if (!token || isTokenExpired(token)) return;

  try {
    const res = await api.get('/users/me');
    const refreshedUser = res.data.user || res.data;
    setUser(refreshedUser);
    secureStorage.set('user', JSON.stringify(refreshedUser));
    console.log('User refreshed:', refreshedUser);
  } catch (err) {
    console.error('Failed to refresh user:', err);
  }
}, [token, isTokenExpired, api]);

  

  useEffect(() => {
    initializeAuth();
    return () => { isMounted.current = false; };
  }, []); 

  // Live notifications (the WebSocket) are handled by NotificationProvider in context/NotificationContext.jsx.
  
  

  useEffect(() => {
    const syncStorage = (e) => {
      if (e.key === 'token') setToken(e.newValue);
      if (e.key === 'user') setUser(e.newValue ? JSON.parse(e.newValue) : null);
    };
    window.addEventListener('storage', syncStorage);
    return () => window.removeEventListener('storage', syncStorage);
  }, []);

  const login = async (email, password) => {
  try {
    setLoading(prev => ({ ...prev, login: true }));

    const res = await axios.post(`${API_BASE_URL}/users/login`, { email, password });
    const receivedToken = res.data.token;

    if (!receivedToken) {
      throw { type: "unknown", message: "Invalid server response" };
    }

    // Save token immediately
    secureStorage.set('token', receivedToken);
    setToken(receivedToken);

    // Fetch user with token
    const userRes = await axios.get(`${API_BASE_URL}/users/me`, {
      headers: { Authorization: `Bearer ${receivedToken}` }
    });

    const fullUser = userRes.data.user || userRes.data;

    secureStorage.set('user', JSON.stringify(fullUser));
    setUser(fullUser);

    return true;

  } catch (err) {
    // NEVER set global error here
    // NEVER console.error here

    // Network / no internet
    if (!err.response) {
      throw { type: "network" };
    }

    const status = err.response.status;
    const message =
      err.response.data?.error ||
      err.response.data?.message ||
      "Login failed";

    // Wrong credentials
    if (status === 400 || status === 401) {
      throw { type: "credentials", message };
    }

    // Server down
    if (status >= 500) {
      throw { type: "server" };
    }

    // Default
    throw { type: "unknown", message };

  } finally {
    setLoading(prev => ({ ...prev, login: false }));
  }
};

  

  const updateUserProfile = useCallback((data) => {
    setUser((prev) => {
      const updated = { ...prev, ...data };
      secureStorage.set('user', JSON.stringify(updated));
      return updated;
    });
  }, []);

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
      verifyAdminAccess,
      isTokenExpired,
      loggingOut,
      refreshUser
    }}>
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  const context = useContext(UserAuthContext);
  if (!context) throw new Error("useUserAuth must be used inside UserAuthProvider");
  return context;
}
