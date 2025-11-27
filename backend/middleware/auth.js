const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Không tìm thấy token xác thực' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    
    // If manager token doesn't have user ID, try to get it from X-User-Token header
    if (!req.user.id && req.header('X-User-Token')) {
      try {
        const userToken = req.header('X-User-Token');
        const userDecoded = jwt.verify(userToken, process.env.JWT_SECRET || 'your-secret-key');
        req.user.id = userDecoded.id;
      } catch (e) {
        // X-User-Token is invalid or expired, continue with current token
      }
    }
    
    next();
  } catch (error) {
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
