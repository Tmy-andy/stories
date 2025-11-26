const mongoose = require('mongoose');

const readingHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    storyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Story',
      required: true,
    },
    chapterNumber: {
      type: Number,
      required: true,
      min: 1,
    },
    scrollPosition: {
      type: Number,
      default: 0,
      min: 0,
    },
    readAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Compound index for userId and storyId to ensure one record per user per story
readingHistorySchema.index({ userId: 1, storyId: 1 }, { unique: true });

// Index for efficient querying
readingHistorySchema.index({ userId: 1, updatedAt: -1 });

module.exports = mongoose.model('ReadingHistory', readingHistorySchema);
