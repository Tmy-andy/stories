const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Public route - submit contact form (can be used by guest or logged in user)
router.post('/submit', (req, res, next) => {
  // Try to authenticate, but don't require it
  if (req.headers.authorization) {
    authMiddleware(req, res, next);
  } else {
    next();
  }
}, contactController.submitContact);

// Admin routes - specific routes first
router.get('/', authMiddleware, adminMiddleware, contactController.getAllContacts);
router.patch('/:id', authMiddleware, adminMiddleware, contactController.updateContactStatus);
router.delete('/:id', authMiddleware, adminMiddleware, contactController.deleteContact);

// Get contact details (user can view their own, admin can view any) - generic route last
router.get('/:id', authMiddleware, contactController.getContactDetails);

module.exports = router;

