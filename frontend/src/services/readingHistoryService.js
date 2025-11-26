import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Reading History Service
const readingHistoryService = {
  // Save reading position (called every 5 seconds)
  saveReadingPosition: async (storyId, chapterNumber, scrollPosition = 0) => {
    try {
      const response = await client.post('/reading-history/save', {
        storyId,
        chapterNumber,
        scrollPosition,
      });
      return response.data;
    } catch (error) {
      console.error('Error saving reading position:', error);
      throw error;
    }
  },

  // Get reading history (5 most recent stories)
  getReadingHistory: async () => {
    try {
      const response = await client.get('/reading-history');
      return response.data;
    } catch (error) {
      console.error('Error fetching reading history:', error);
      throw error;
    }
  },

  // Get all reading history (no limit)
  getAllReadingHistory: async () => {
    try {
      const response = await client.get('/reading-history/all');
      return response.data;
    } catch (error) {
      console.error('Error fetching all reading history:', error);
      throw error;
    }
  },

  // Get reading position for a specific story
  getReadingPosition: async (storyId) => {
    try {
      const response = await client.get(`/reading-history/${storyId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching reading position:', error);
      throw error;
    }
  },

  // Delete reading history for a story
  deleteReadingHistory: async (storyId) => {
    try {
      const response = await client.delete(`/reading-history/${storyId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting reading history:', error);
      throw error;
    }
  },

  // Clear all reading history
  clearAllReadingHistory: async () => {
    try {
      const response = await client.delete('/reading-history');
      return response.data;
    } catch (error) {
      console.error('Error clearing reading history:', error);
      throw error;
    }
  },
};

export default readingHistoryService;
