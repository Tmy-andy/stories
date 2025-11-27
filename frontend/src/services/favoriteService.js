import axios from 'axios';
import { authService } from './authService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export const favoriteService = {
  // Thêm vào yêu thích
  addFavorite: async (storyId) => {
    const token = authService.getToken();
    return axios.post(
      `${API_URL}/favorites/add`,
      { storyId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  },

  // Xóa khỏi yêu thích
  removeFavorite: async (storyId) => {
    const token = authService.getToken();
    return axios.delete(
      `${API_URL}/favorites/${storyId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
  },

  // Lấy danh sách yêu thích
  getUserFavorites: async () => {
    const token = authService.getToken();
    const response = await axios.get(
      `${API_URL}/favorites/my-favorites`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  // Kiểm tra đã yêu thích
  checkIsFavorite: async (storyId) => {
    const token = authService.getToken();
    return axios.get(
      `${API_URL}/favorites/check/${storyId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
  },

  // Lấy số lượng yêu thích
  getStoryFavoriteCount: async (storyId) => {
    return axios.get(`${API_URL}/favorites/count/${storyId}`);
  }
};
