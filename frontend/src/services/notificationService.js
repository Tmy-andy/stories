import api from './api';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export const notificationService = {
  // Lấy danh sách thông báo
  getNotifications: async (read = null) => {
    try {
      const params = {};
      if (read !== null) {
        params.read = read;
      }
      const response = await api.get('/notifications', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  // Đếm thông báo chưa đọc
  getUnreadCount: async () => {
    try {
      const response = await api.get('/notifications/unread-count');
      return response.data.unreadCount;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  },

  // Đánh dấu thông báo đã đọc
  markAsRead: async (notificationId) => {
    try {
      const response = await api.put(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Đánh dấu tất cả thông báo đã đọc
  markAllAsRead: async () => {
    try {
      const response = await api.put('/notifications/mark-all-read');
      return response.data;
    } catch (error) {
      console.error('Error marking all as read:', error);
      throw error;
    }
  },

  // Xóa thông báo
  deleteNotification: async (notificationId) => {
    try {
      const response = await api.delete(`/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  // Xóa tất cả thông báo đã đọc
  deleteAllRead: async () => {
    try {
      const response = await api.delete('/notifications/delete-read');
      return response.data;
    } catch (error) {
      console.error('Error deleting all read notifications:', error);
      throw error;
    }
  }
};

export default notificationService;
