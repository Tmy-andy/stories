const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const {
  addFavorite,
  removeFavorite,
  getUserFavorites,
  checkIsFavorite,
  getStoryFavoriteCount
} = require('../controllers/favoriteController');

// Routes cần xác thực
router.post('/add', authMiddleware, addFavorite);
router.delete('/:storyId', authMiddleware, removeFavorite);
router.get('/my-favorites', authMiddleware, getUserFavorites);
router.get('/check/:storyId', authMiddleware, checkIsFavorite);

// Routes công khai
router.get('/count/:storyId', getStoryFavoriteCount);

module.exports = router;module.exports = router;
