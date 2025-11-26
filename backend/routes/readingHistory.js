const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  saveReadingPosition,
  getReadingHistory,
  getReadingPosition,
  deleteReadingHistory,
  clearAllReadingHistory,
} = require('../controllers/readingHistoryController');

// All routes require authentication
router.use(auth);

// Save reading position (called every 5 seconds from frontend)
router.post('/save', saveReadingPosition);

// Get reading history (5 most recent stories)
router.get('/', getReadingHistory);

// Get reading position for specific story
router.get('/:storyId', getReadingPosition);

// Delete reading history for specific story
router.delete('/:storyId', deleteReadingHistory);

// Clear all reading history
router.delete('/', clearAllReadingHistory);

module.exports = router;
