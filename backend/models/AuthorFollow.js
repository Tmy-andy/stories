const mongoose = require('mongoose');

const authorFollowSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

authorFollowSchema.index({ userId: 1, authorId: 1 }, { unique: true });

module.exports = mongoose.model('AuthorFollow', authorFollowSchema);
