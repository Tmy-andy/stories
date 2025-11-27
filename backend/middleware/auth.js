const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    console.log('🔍 Auth Middleware - Authorization header:', req.header('Authorization'));
    console.log('🔍 Token:', token ? token.substring(0, 20) + '...' : 'NO TOKEN');

    if (!token) {
      console.log('❌ No token found');
      return res.status(401).json({ message: 'Không tìm thấy token xác thực' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    console.log('✅ Token decoded:', decoded);
    
    req.user = decoded;
    next();
  } catch (error) {
    console.log('❌ Token verification error:', error.message);
    res.status(401).json({ message: 'Token không hợp lệ' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Chưa xác thực người dùng' });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Bạn không có quyền truy cập' });
  }
  next();
};

const managerMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Chưa xác thực người dùng' });
  }
  
  if (req.user.role !== 'manager' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Bạn không có quyền truy cập' });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware, managerMiddleware };
