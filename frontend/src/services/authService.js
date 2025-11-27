import api from './api';

export const authService = {
  // Đăng ký
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Đăng nhập
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // If user is admin, create admin token for manager access
      if (response.data.user.role === 'admin') {
        try {
          // Parse token to get payload
          const tokenParts = response.data.token.split('.');
          const payload = JSON.parse(atob(tokenParts[1]));
          
          // Create admin token with manager format
          // For client-side, we'll use the user token as admin token
          // The backend middleware accepts both
          localStorage.setItem('managerToken', response.data.token);
          console.log('✅ Admin token created for manager access');
        } catch (e) {
          console.log('⚠️ Could not create admin token:', e.message);
        }
      }
    }
    return response.data;
  },

  // Đăng xuất
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('managerToken'); // Also remove admin token if exists
  },

  // Lấy user hiện tại
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Kiểm tra đã đăng nhập
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Lấy token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Đổi mật khẩu
  changePassword: async (passwords) => {
    // IMPORTANT: Use user token, not manager token for auth endpoints
    const userToken = localStorage.getItem('token');
    console.log('🔍 changePassword - User Token:', userToken ? userToken.substring(0, 20) + '...' : 'NO TOKEN');
    
    if (!userToken) {
      throw new Error('Chưa đăng nhập. Vui lòng đăng nhập lại.');
    }
    
    const response = await api.put('/auth/change-password', passwords, {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    });
    return response.data;
  },

  // Cập nhật profile
  updateProfile: async (profileData) => {
    // IMPORTANT: Use user token, not manager token for auth endpoints
    const userToken = localStorage.getItem('token');
    if (!userToken) {
      throw new Error('Chưa đăng nhập. Vui lòng đăng nhập lại.');
    }
    
    const response = await api.put('/auth/profile', profileData, {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    });
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  // Kiểm tra manager đã đăng nhập
  getManager: () => {
    return localStorage.getItem('managerToken');
  }
};
