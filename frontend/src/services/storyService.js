import api from './api';

export const storyService = {
  // Lấy tất cả truyện
  getAllStories: async (params = {}) => {
    const response = await api.get('/stories', { params });
    return response.data;
  },

  // Lấy truyện nổi bật
  getFeaturedStories: async () => {
    const response = await api.get('/stories/trending');
    return response.data;
  },

  // Lấy truyện mới nhất
  getLatestStories: async (limit = 10) => {
    const response = await api.get('/stories/new', { params: { limit } });
    return response.data;
  },

  // Lấy một truyện theo ID
  getStoryById: async (id) => {
    const response = await api.get(`/stories/${id}`);
    return response.data;
  },

  // Tạo truyện mới
  createStory: async (storyData) => {
    const response = await api.post('/stories', storyData);
    return response.data;
  },

  // Cập nhật truyện
  updateStory: async (id, storyData) => {
    const response = await api.patch(`/stories/${id}`, storyData);
    return response.data;
  },

  // Xóa truyện
  deleteStory: async (id) => {
    const response = await api.delete(`/stories/${id}`);
    return response.data;
  },
};

export const chapterService = {
  // Lấy tất cả chapters của một truyện
  getChaptersByStory: async (storyId) => {
    const response = await api.get(`/chapters/story/${storyId}`);
    return response.data;
  },

  // Lấy một chapter theo ID
  getChapterById: async (id) => {
    const response = await api.get(`/chapters/${id}`);
    return response.data;
  },

  // Lấy chapter theo số chương
  getChapterByNumber: async (storyId, chapterNumber) => {
    const response = await api.get(`/chapters/story/${storyId}/${chapterNumber}`);
    return response.data;
  },

  // Tạo chapter mới
  createChapter: async (chapterData) => {
    const response = await api.post('/chapters', chapterData);
    return response.data;
  },

  // Cập nhật chapter
  updateChapter: async (id, chapterData) => {
    const response = await api.patch(`/chapters/${id}`, chapterData);
    return response.data;
  },

  // Xóa chapter
  deleteChapter: async (id) => {
    const response = await api.delete(`/chapters/${id}`);
    return response.data;
  },
};

// Export individual functions for convenience
export const getAllStories = storyService.getAllStories;
export const getFeaturedStories = storyService.getFeaturedStories;
export const getLatestStories = storyService.getLatestStories;
export const getStoryById = storyService.getStoryById;
export const createStory = storyService.createStory;
export const updateStory = storyService.updateStory;
export const deleteStory = storyService.deleteStory;

export const getChaptersByStory = chapterService.getChaptersByStory;
export const getChapterById = chapterService.getChapterById;
export const getChapterByNumber = chapterService.getChapterByNumber;
export const createChapter = chapterService.createChapter;
export const updateChapter = chapterService.updateChapter;
export const deleteChapter = chapterService.deleteChapter;
