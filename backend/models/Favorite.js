const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  storyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index để tìm kiếm nhanh
favoriteSchema.index({ userId: 1, storyId: 1 }, { unique: true });
favoriteSchema.index({ userId: 1 });
favoriteSchema.index({ storyId: 1 });

module.exports = mongoose.model('Favorite', favoriteSchema);
