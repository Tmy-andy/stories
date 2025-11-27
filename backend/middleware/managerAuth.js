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

        // Kiểm tra xem token có phải của manager hoặc admin không
        if (decoded.type !== 'manager' || (decoded.role !== 'manager' && decoded.role !== 'admin')) {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền truy cập'
            });
        }

        // Gắn thông tin manager/admin vào request
        req.user = decoded;
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
