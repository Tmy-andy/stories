import api from './api';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export const commentService = {
  // Lấy tất cả comments của một truyện (ngoài chapter)
  getCommentsByStory: async (storyId) => {
    try {
      const response = await api.get(`/comments/story/${storyId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },

  // Lấy comments của một chapter
  getCommentsByChapter: async (storyId, chapterId) => {
    try {
      const response = await api.get(`/comments/story/${storyId}/chapter/${chapterId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching chapter comments:', error);
      throw error;
    }
  },

  // Lấy comments của user
  getCommentsByUser: async (userId) => {
    try {
      const response = await api.get(`/comments/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user comments:', error);
      throw error;
    }
  },

  // Tạo comment mới
  createComment: async (storyId, chapterId, content, mentions = []) => {
    try {
      const response = await api.post('/comments', {
        storyId,
        chapterId: chapterId || null,
        content,
        mentions
      });
      return response.data;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  },

  // Like/Unlike comment
  toggleLikeComment: async (commentId) => {
    try {
      const response = await api.post(`/comments/${commentId}/like`);
      return response.data;
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  },

  // Xóa comment
  deleteComment: async (commentId) => {
    try {
      const response = await api.delete(`/comments/${commentId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  },

  // Lấy user suggestions cho @mention
  getUserSuggestions: async (query, storyId) => {
    try {
      const response = await api.get('/comments/suggestions', {
        params: { query, storyId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user suggestions:', error);
      throw error;
    }
  },

  // Thêm reply vào comment
  addReply: async (commentId, content, mentions = []) => {
    try {
      const response = await api.post(`/comments/${commentId}/replies`, {
        content,
        mentions
      });
      return response.data;
    } catch (error) {
      console.error('Error adding reply:', error);
      throw error;
    }
  },

  // Like/Unlike reply
  toggleLikeReply: async (commentId, replyId) => {
    try {
      const response = await api.post(`/comments/${commentId}/replies/${replyId}/like`);
      return response.data;
    } catch (error) {
      console.error('Error toggling reply like:', error);
      throw error;
    }
  },

  // Xóa reply
  deleteReply: async (commentId, replyId) => {
    try {
      const response = await api.delete(`/comments/${commentId}/replies/${replyId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting reply:', error);
      throw error;
    }
  }
};

export default commentService;
