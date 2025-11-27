import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('managerToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('managerToken');
      window.location.href = '/manager/login';
    }
    return Promise.reject(error);
  }
);

export const managerAPI = {
  // Authentication
  verifyPin: (pin) => api.post('/api/manager/verify-pin', { pin }),
  verifyToken: () => api.post('/api/manager/verify-token'),

  // Dashboard
  getDashboardData: () => api.get('/api/manager/dashboard'),

  // Stories
  getStories: (params) => api.get('/api/manager/stories', { params }),
  getStoryById: (id) => api.get(`/api/manager/stories/${id}`),
  updateStory: (id, data) => api.put(`/api/manager/stories/${id}`, data),
  deleteStory: (id) => api.delete(`/api/manager/stories/${id}`),
  toggleStoryStatus: (id) => api.patch(`/api/manager/stories/${id}/toggle-status`),

  // Chapters
  getChapters: (storyId) => api.get(`/api/manager/chapters/story/${storyId}`),
  getChapterById: (id) => api.get(`/api/manager/chapters/${id}`),
  createChapter: (data) => api.post('/api/manager/chapters', data),
  updateChapter: (id, data) => api.put(`/api/manager/chapters/${id}`, data),
  deleteChapter: (id) => api.delete(`/api/manager/chapters/${id}`),
  updateChapterStatus: (id, status) => api.patch(`/api/manager/chapters/${id}/status`, { status }),

  // Authors
  getAuthors: (params) => api.get('/api/manager/authors', { params }),
  getAuthorById: (id) => api.get(`/api/manager/authors/${id}`),
  updateAuthor: (id, data) => api.put(`/api/manager/authors/${id}`, data),
  deleteAuthor: (id) => api.delete(`/api/manager/authors/${id}`),
  toggleAuthorStatus: (id) => api.patch(`/api/manager/authors/${id}/toggle-status`),

  // Users
  getUsers: (params) => api.get('/api/manager/users', { params }),
  getUserById: (id) => api.get(`/api/manager/users/${id}`),
  updateUser: (id, data) => api.put(`/api/manager/users/${id}`, data),
  deleteUser: (id) => api.delete(`/api/manager/users/${id}`),
  toggleUserStatus: (id) => api.patch(`/api/manager/users/${id}/toggle-status`),
  updateUserRole: (id, newRole) => api.patch(`/api/manager/users/${id}/role`, { newRole }),
  blockUser: (id) => api.post(`/api/manager/users/${id}/block`),

  // Blacklist
  getBlacklist: (params) => api.get('/api/manager/blacklist', { params }),
  removeFromBlacklist: (id) => api.delete(`/api/manager/blacklist/${id}`),

  // Comments
  getComments: (params) => api.get('/api/manager/comments', { params }),
  approveComment: (id) => api.patch(`/api/manager/comments/${id}/approve`),
  rejectComment: (id) => api.patch(`/api/manager/comments/${id}/reject`),
  deleteComment: (id) => api.delete(`/api/manager/comments/${id}`),

  // Contact
  getContacts: (params) => api.get('/api/manager/contacts', { params }),
  getContactById: (id) => api.get(`/api/manager/contacts/${id}`),
  markContactAsRead: (id) => api.patch(`/api/manager/contacts/${id}/mark-read`),
  respondToContact: (id, data) => api.post(`/api/manager/contacts/${id}/respond`, data),
  deleteContact: (id) => api.delete(`/api/manager/contacts/${id}`),
};

export default api;
