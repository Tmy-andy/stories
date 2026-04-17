const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authMiddleware, managerMiddleware } = require('../middleware/auth');

// User routes
router.post('/', authMiddleware, reportController.createReport);

// Manager/Admin routes
router.get('/', managerMiddleware, reportController.getReports);
router.get('/stats', managerMiddleware, reportController.getStats);
router.patch('/:id', managerMiddleware, reportController.updateReport);

module.exports = router;
