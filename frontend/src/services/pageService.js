import api from './api';

export const pageService = {
  getPage: async (slug) => {
    const res = await api.get(`/pages/${slug}`);
    return res.data;
  }
};

export default pageService;
