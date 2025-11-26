const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { authMiddleware } = require('../middleware/auth');

// Public routes
router.get('/story/:storyId', commentController.getCommentsByStory);
router.get('/story/:storyId/chapter/:chapterId', commentController.getCommentsByChapter);
router.get('/suggestions', commentController.getUserSuggestions);

// Protected routes
router.get('/user', authMiddleware, commentController.getCommentsByUser);
router.get('/user/:userId', authMiddleware, commentController.getCommentsByUser);
router.post('/', authMiddleware, commentController.createComment);
router.post('/:id/like', authMiddleware, commentController.toggleLikeComment);
router.delete('/:id', authMiddleware, commentController.deleteComment);

// Reply routes
router.post('/:commentId/replies', authMiddleware, commentController.addReply);
router.post('/:commentId/replies/:replyId/like', authMiddleware, commentController.toggleLikeReply);
router.delete('/:commentId/replies/:replyId', authMiddleware, commentController.deleteReply);

module.exports = router;
