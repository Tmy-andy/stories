const jwt = require('jsonwebtoken');

/**
 * Middleware kiểm tra token Manager
 * Kiểm tra xem request có token hợp lệ không
 */
const verifyManagerToken = (req, res, next) => {
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

        // Accept both:
        // 1. Manager/Admin tokens: { type: 'manager', role: 'manager|admin' }
        // 2. Admin user tokens: { id: userId, role: 'admin' } from regular login
        const isManagerToken = decoded.type === 'manager' && (decoded.role === 'manager' || decoded.role === 'admin');
        const isAdminUserToken = decoded.role === 'admin' && decoded.id;

        if (!isManagerToken && !isAdminUserToken) {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền truy cập'
            });
        }

        // Gắn thông tin vào request
        req.user = {
            id: decoded.id || decoded.id,
            role: decoded.role,
            type: decoded.type || 'user'
        };
        next();

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token đã hết hạn'
            });
        }

        return res.status(401).json({
            success: false,
            message: 'Token không hợp lệ'
        });
    }
};

module.exports = { verifyManagerToken };
