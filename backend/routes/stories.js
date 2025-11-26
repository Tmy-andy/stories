const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Public routes
router.get('/featured', storyController.getFeaturedStories);
router.get('/latest', storyController.getLatestStories);
router.get('/', storyController.getAllStories);
router.get('/:id', storyController.getStoryById);

// Protected routes (admin only)
router.post('/', authMiddleware, adminMiddleware, storyController.createStory);
router.patch('/:id', authMiddleware, adminMiddleware, storyController.updateStory);
router.delete('/:id', authMiddleware, adminMiddleware, storyController.deleteStory);

module.exports = router;
