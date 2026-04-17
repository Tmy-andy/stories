const mongoose = require('mongoose');

const postCommentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AuthorPost',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000
  }
}, { timestamps: true });

postCommentSchema.index({ postId: 1, createdAt: 1 });

module.exports = mongoose.model('PostComment', postCommentSchema);
