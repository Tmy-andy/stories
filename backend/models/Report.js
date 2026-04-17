const mongoose = require('mongoose');

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

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
  detail: {
    type: String,
    default: '',
    maxlength: 500
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
  },
  // TTL field: MongoDB tự xóa document khi đến thời điểm này
  // Chỉ được set khi status chuyển sang reviewed/dismissed
  deleteAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

// Unique: mỗi user chỉ báo cáo 1 lần mỗi comment/reply
reportSchema.index({ commentId: 1, replyId: 1, reportedBy: 1 }, { unique: true });

// TTL index: MongoDB tự xóa khi deleteAt <= now
// expireAfterSeconds: 0 → xóa ngay tại thời điểm deleteAt
reportSchema.index({ deleteAt: 1 }, { expireAfterSeconds: 0, sparse: true });

// Helper static method
reportSchema.statics.getDeleteAt = () => new Date(Date.now() + SEVEN_DAYS_MS);

module.exports = mongoose.model('Report', reportSchema);
