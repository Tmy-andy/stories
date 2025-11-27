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
    let token = null;
    
    const managerToken = localStorage.getItem('managerToken');
    if (managerToken) {
      try {
        const parts = managerToken.split('.');
        const payload = JSON.parse(atob(parts[1]));
        const now = Math.floor(Date.now() / 1000);
        
        if (payload.exp > now) {
          token = managerToken;
        } else {
          localStorage.removeItem('managerToken');
        }
      } catch (e) {
        localStorage.removeItem('managerToken');
      }
    }
    
    if (!token) {
      const userToken = localStorage.getItem('token');
      if (userToken) {
        token = userToken;
      }
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    const userToken = localStorage.getItem('token');
    if (userToken && token === managerToken) {
      config.headers['X-User-Token'] = userToken;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
