const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const {
  saveReadingPosition,
  getReadingHistory,
  getAllReadingHistory,
  getReadingPosition,
  deleteReadingHistory,
  clearAllReadingHistory,
} = require('../controllers/readingHistoryController');

// All routes require authentication
router.use(authMiddleware);

// Save reading position (called every 5 seconds from frontend)
router.post('/save', saveReadingPosition);

// Delete reading history for specific story (MUST be before /:storyId GET to avoid conflict)
router.delete('/:storyId', deleteReadingHistory);

// Clear all reading history
router.delete('/', clearAllReadingHistory);

// Get all reading history (no limit)
router.get('/all', getAllReadingHistory);

// Get reading position for specific story
router.get('/:storyId', getReadingPosition);

// Get reading history (5 most recent stories)
router.get('/', getReadingHistory);

module.exports = router;
