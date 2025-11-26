const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/me', authMiddleware, authController.getCurrentUser);
router.get('/profile', authMiddleware, authController.getUserProfile);
router.get('/profile/:id', authMiddleware, authController.getUserProfile);
router.put('/change-password', authMiddleware, authController.changePassword);
router.put('/profile', authMiddleware, authController.updateProfile);
router.put('/verify-age', authMiddleware, authController.verifyAge);
router.post('/favorites', authMiddleware, authController.addToFavorites);
router.delete('/favorites/:storyId', authMiddleware, authController.removeFromFavorites);
router.post('/reading-history', authMiddleware, authController.updateReadingHistory);

module.exports = router;
