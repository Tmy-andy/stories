const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

async function createAdminAccount() {
  try {
    // Kiểm tra xem admin đã tồn tại chưa
    const existingAdmin = await User.findOne({ email: 'admin@gmail.com' });
    
    if (existingAdmin) {
      console.log('Tài khoản admin đã tồn tại');
      // Cập nhật mật khẩu nếu cần
      existingAdmin.password = '123456';
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      console.log('Đã cập nhật mật khẩu admin');
    } else {
      // Tạo tài khoản admin mới
      const admin = new User({
        username: 'Admin',
        email: 'admin@gmail.com',
        password: '123456',
        role: 'admin'
      });

      await admin.save();
      console.log('Tạo tài khoản admin thành công!');
    }
    
    console.log('Email: tmy300803@gmail.com');
    console.log('Password: 123456');
    console.log('Role: admin');
    
    process.exit(0);
  } catch (error) {
    console.error('Lỗi tạo admin:', error);
    process.exit(1);
  }
}

createAdminAccount();
