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
    // Check for manager token first, then user token
    const managerToken = localStorage.getItem('managerToken');
    const userToken = localStorage.getItem('token');
    const token = managerToken || userToken;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
