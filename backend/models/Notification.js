const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'new_chapter', 'new_story', 'mention', 'reply', 'like', 'comment', 'contact_reply',
      'author_announcement', 'story_status_change', 'message_board_post'
    ],
    required: true
  },
  authorPostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AuthorPost'
  },
  message: {
    type: String,
    required: true
  },
  storyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story'
  },
  chapterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter'
  },
  commentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  },
  contactId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact'
  },
  triggeredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index để tìm kiếm nhanh
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, read: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
