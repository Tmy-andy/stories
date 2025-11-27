const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema({
  // Có thể block bằng email hoặc IP
  email: {
    type: String,
    trim: true,
    lowercase: true,
    sparse: true
  },
  ipAddress: {
    type: String,
    sparse: true
  },
  reason: {
    type: String,
    default: 'User blocked by admin'
  },
  blockedAt: {
    type: Date,
    default: Date.now
  },
  blockedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

// Index để tìm kiếm nhanh
blacklistSchema.index({ email: 1 });
blacklistSchema.index({ ipAddress: 1 });

module.exports = mongoose.model('Blacklist', blacklistSchema);
