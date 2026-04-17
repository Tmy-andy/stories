const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  commentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    required: true
  },
  replyId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reason: {
    type: String,
    enum: ['inappropriate', 'copyright', 'unwanted'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'dismissed'],
    default: 'pending'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  reviewedAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

// Mỗi user chỉ báo cáo 1 lần mỗi comment/reply
reportSchema.index({ commentId: 1, replyId: 1, reportedBy: 1 }, { unique: true });

module.exports = mongoose.model('Report', reportSchema);
