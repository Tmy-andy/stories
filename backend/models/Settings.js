const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  // General Settings
  siteTitle: {
    type: String,
    default: 'Lam điệp cô ảnh'
  },
  tagline: {
    type: String,
    default: 'Nơi những câu chuyện bắt đầu'
  },
  siteDescription: {
    type: String,
    default: 'Nơi chắp cánh cho những câu chuyện tiểu thuyết, đưa bạn vào thế giới của trí tưởng tượng.'
  },
  contactEmail: {
    type: String,
    default: 'admin@lamdiepcoanh.com'
  },

  // Homepage Settings
  bannerTitle: {
    type: String,
    default: 'Welcome to Our Story World'
  },
  bannerSubtitle: {
    type: String,
    default: 'Discover amazing stories'
  },
  bannerButtonText: {
    type: String,
    default: 'Start Reading'
  },
  bannerImage: {
    type: String,
    default: null
  },

  // Security Settings
  maintenanceMode: {
    type: Boolean,
    default: false
  },
  requireEmailVerification: {
    type: Boolean,
    default: true
  },
  maxStoriesPerUser: {
    type: Number,
    default: 10
  },
  maxChaptersPerStory: {
    type: Number,
    default: 1000
  },

  // Features
  enableComments: {
    type: Boolean,
    default: true
  },
  enableFavorites: {
    type: Boolean,
    default: true
  },
  enableReadingHistory: {
    type: Boolean,
    default: true
  },

  // Timestamps
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
