const mongoose = require('mongoose');

const authorPostSchema = new mongoose.Schema({
  // Trang profile này thuộc về ai
  profileUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Ai đăng bài (với announcement: chính tác giả; message_board: bất kỳ ai)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // announcement: Thông báo từ tác giả
  // message_board: Tin nhắn từ độc giả
  type: {
    type: String,
    enum: ['announcement', 'message_board'],
    required: true
  },
  // Tiêu đề (dùng cho message_board)
  title: {
    type: String,
    default: ''
  },
  // Subtitle phân loại (dùng cho message_board)
  subtitle: {
    type: String,
    enum: ['thac_mac', 'giao_luu', null],
    default: null
  },
  content: {
    type: String,
    required: true
  }
}, { timestamps: true });

authorPostSchema.index({ profileUserId: 1, type: 1, createdAt: -1 });
authorPostSchema.index({ userId: 1 });

module.exports = mongoose.model('AuthorPost', authorPostSchema);
