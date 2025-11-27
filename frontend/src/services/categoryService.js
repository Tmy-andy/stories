import api from './api';

export const categoryService = {
  // Lấy danh sách categories với số lượng stories
  getCategories: async () => {
    const response = await api.get('/stories/categories');
    return response.data;
  },

  // Lấy danh sách categories mà không có số lượng
  getCategoryList: async () => {
    const response = await api.get('/stories/categories');
    return response.data.categories || [];
  }
};

export default categoryService;
