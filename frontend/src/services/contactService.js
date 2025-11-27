import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const contactService = {
  // Submit contact form
  submitContact: async (contactData) => {
    try {
      const token = localStorage.getItem('token');
      const config = token ? {
        headers: { Authorization: `Bearer ${token}` }
      } : {};
      
      const response = await axios.post(`${API_URL}/contact/submit`, contactData, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get contact details by ID
  getContactDetails: async (contactId) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      const response = await axios.get(`${API_URL}/contact/${contactId}`, config);
      return response.data;
    } catch (error) {
      console.error('Error fetching contact details:', error);
      throw error.response?.data || error;
    }
  }
};

export default contactService;
export { contactService };
