const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Manager PIN (mã hóa '300803')
// Hash được tạo từ: bcrypt.hashSync('300803', 10)
const MANAGER_PIN_HASH = '$2b$10$qkbyaZQdgjxcmhzaKwMTROdTt01ZvraQHqn5isi8TgFHxdtJqw6Le';

/**
 * Xác thực mã PIN Manager
 * POST /api/manager/verify-pin
 */
router.post('/verify-pin', async (req, res) => {
    try {
        const { pin } = req.body;

        // Validate input
        if (!pin || pin.length !== 6 || !/^\d{6}$/.test(pin)) {
            return res.status(400).json({
                success: false,
                message: 'Mã PIN không hợp lệ. Vui lòng nhập 6 số'
            });
        }

        // Kiểm tra mã PIN
        const isValidPin = await bcrypt.compare(pin, MANAGER_PIN_HASH);

        if (!isValidPin) {
            return res.status(401).json({
                success: false,
                message: 'Mã PIN không chính xác'
            });
        }

        // Tạo JWT token
        const token = jwt.sign(
            {
                type: 'manager',
                role: 'manager',
                iat: Date.now()
            },
            process.env.JWT_SECRET || 'your-secret-key-change-in-production',
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Xác thực thành công',
            token
        });

    } catch (error) {
        console.error('Error in verify-pin:', error);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra, vui lòng thử lại'
        });
    }
});

/**
 * Kiểm tra token có hợp lệ không
 * POST /api/manager/verify-token
 */
router.post('/verify-token', (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token không được cung cấp'
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'your-secret-key-change-in-production'
        );

        res.json({
            success: true,
            message: 'Token hợp lệ',
            decoded
        });

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token không hợp lệ hoặc đã hết hạn'
        });
    }
});

module.exports = router;
