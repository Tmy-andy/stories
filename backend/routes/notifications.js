const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authMiddleware } = require('../middleware/auth');

// Protected routes - specific routes first
router.get('/unread-count', authMiddleware, notificationController.getUnreadCount);
router.put('/mark-all-read', authMiddleware, notificationController.markAllAsRead);
router.delete('/delete-read', authMiddleware, notificationController.deleteAllReadNotifications);

// Generic routes
router.get('/', authMiddleware, notificationController.getUserNotifications);
router.put('/:notificationId/read', authMiddleware, notificationController.markAsRead);
router.delete('/:notificationId', authMiddleware, notificationController.deleteNotification);

module.exports = router;

