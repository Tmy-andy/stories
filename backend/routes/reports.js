const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authMiddleware } = require('../middleware/auth');
const { verifyManagerToken } = require('../middleware/managerAuth');

// User: gửi báo cáo (cần đăng nhập)
router.post('/', authMiddleware, reportController.createReport);

// Manager/Admin: xem và xử lý báo cáo
router.get('/stats', verifyManagerToken, reportController.getStats);
router.get('/', verifyManagerToken, reportController.getReports);
router.patch('/:id', verifyManagerToken, reportController.updateReport);

module.exports = router;
