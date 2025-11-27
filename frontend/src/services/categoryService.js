import api from './api';

export const categoryService = {
  // Lấy danh sách tất cả categories
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  // Lấy danh sách categories chỉ tên và slug (cho dropdown)
  getCategoryList: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  // Lấy categories với số lượng stories
  getCategoriesWithCounts: async () => {
    const response = await api.get('/categories/with-counts');
    return response.data;
  },

  // Lấy một category
  getCategoryById: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  // Tạo category (admin only)
  createCategory: async (data) => {
    const response = await api.post('/categories', data);
    return response.data;
  },

  // Cập nhật category (admin only)
  updateCategory: async (id, data) => {
    const response = await api.patch(`/categories/${id}`, data);
    return response.data;
  },

  // Xóa category (admin only)
  deleteCategory: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  }
};

export default categoryService;

