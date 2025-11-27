import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: {
    serialize: (params) => {
      const queryString = new URLSearchParams();
      Object.keys(params).forEach((key) => {
        if (Array.isArray(params[key])) {
          params[key].forEach((value) => {
            queryString.append(key, value);
          });
        } else {
          queryString.set(key, params[key]);
        }
      });
      return queryString.toString();
    },
  },
});

// Add JWT token to requests
api.interceptors.request.use(
  (config) => {
    // Check manager token, but only if it's still valid
    let token = null;
    
    const managerToken = localStorage.getItem('managerToken');
    if (managerToken) {
      try {
        // Decode token to check expiration
        const parts = managerToken.split('.');
        const payload = JSON.parse(atob(parts[1]));
        const now = Math.floor(Date.now() / 1000);
        
        // Use manager token only if not expired
        if (payload.exp > now) {
          token = managerToken;
          console.log('✅ Using manager token (valid)');
        } else {
          console.log('⏰ Manager token expired, removing...');
          localStorage.removeItem('managerToken');
        }
      } catch (e) {
        console.log('❌ Invalid manager token format, removing...');
        localStorage.removeItem('managerToken');
      }
    }
    
    // Fall back to user token if no valid manager token
    if (!token) {
      const userToken = localStorage.getItem('token');
      if (userToken) {
        token = userToken;
        console.log('✅ Using user token');
      }
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Also add X-User-Token header if we have a user token and manager token
    // This allows backend to get user ID from user token when manager token is being used
    const userToken = localStorage.getItem('token');
    if (userToken && token === managerToken) {
      config.headers['X-User-Token'] = userToken;
      console.log('ℹ️ Added X-User-Token for user context');
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
