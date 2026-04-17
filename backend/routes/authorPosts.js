const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const {
  getPosts,
  createPost,
  deletePost,
  getComments,
  addComment,
  deleteComment
} = require('../controllers/authorPostController');

// Posts
router.get('/', getPosts);                              // public
router.post('/', authMiddleware, createPost);
router.delete('/:id', authMiddleware, deletePost);

// Comments
router.get('/:id/comments', getComments);               // public
router.post('/:id/comments', authMiddleware, addComment);
router.delete('/:id/comments/:commentId', authMiddleware, deleteComment);

module.exports = router;
