import api from './api';

export const settingsService = {
  // Get all settings (public)
  getSettings: async () => {
    const response = await api.get('/settings');
    return response.data;
  },

  // Update settings (admin only)
  updateSettings: async (data) => {
    const response = await api.patch('/settings', data);
    return response.data;
  },

  // Upload banner image (admin only)
  uploadBannerImage: async (file) => {
    const formData = new FormData();
    formData.append('bannerImage', file);
    
    const response = await api.post('/settings/upload-banner', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};

export default settingsService;
