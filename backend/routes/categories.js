const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/with-counts', categoryController.getCategoriesWithCounts);
router.get('/:id', categoryController.getCategoryById);

// Admin only routes
router.post('/', authMiddleware, adminMiddleware, categoryController.createCategory);
router.patch('/:id', authMiddleware, adminMiddleware, categoryController.updateCategory);
router.delete('/:id', authMiddleware, adminMiddleware, categoryController.deleteCategory);

module.exports = router;
