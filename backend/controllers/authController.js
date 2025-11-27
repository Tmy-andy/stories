const User = require('../models/User');
const Comment = require('../models/Comment');
const Blacklist = require('../models/Blacklist');
const jwt = require('jsonwebtoken');

// Đăng ký user mới
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Get IP address from request
    const ipAddress = req.headers['x-forwarded-for']?.split(',')[0].trim() || 
                      req.connection.remoteAddress || 
                      req.socket.remoteAddress || 
                      req.ip ||
                      'unknown';

    // Kiểm tra blacklist
    const blacklisted = await Blacklist.findOne({
      $or: [
        { email: email.toLowerCase() },
        { ipAddress: ipAddress }
      ]
    });

    if (blacklisted) {
      return res.status(403).json({ 
        message: 'Tài khoản hoặc IP của bạn đã bị chặn. Vui lòng liên hệ quản trị viên.' 
      });
    }

    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.email === email ? 'Email đã được sử dụng' : 'Tên người dùng đã tồn tại' 
      });
    }

    // Tạo user mới (role mặc định là 'user')
    const user = new User({
      username,
      email,
      password,
      role: 'user',
      ipAddress: ipAddress
    });

    await user.save();

    // Tạo token - đảm bảo có id
    const userId = user._id ? user._id.toString() : user.id;
    const token = jwt.sign(
      { id: userId, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: userId,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Get IP address from request
    const ipAddress = req.headers['x-forwarded-for']?.split(',')[0].trim() || 
                      req.connection.remoteAddress || 
                      req.socket.remoteAddress || 
                      req.ip ||
                      'unknown';

    // Kiểm tra blacklist
    const blacklisted = await Blacklist.findOne({
      $or: [
        { email: email.toLowerCase() },
        { ipAddress: ipAddress }
      ]
    });

    if (blacklisted) {
      return res.status(403).json({ 
        message: 'Tài khoản hoặc IP của bạn đã bị chặn. Vui lòng liên hệ quản trị viên.' 
      });
    }

    // Tìm user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    // Kiểm tra mật khẩu
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    // Tạo token - đảm bảo có id
    const userId = user._id ? user._id.toString() : user.id;
    console.log('Login - User ID:', userId, 'User object:', user._id);
    
    const token = jwt.sign(
      { id: userId, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: userId,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy thông tin user hiện tại
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Đổi mật khẩu
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại' });
    }

    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }
    
    // Kiểm tra mật khẩu hiện tại
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Mật khẩu hiện tại không đúng' });
    }

    // Cập nhật mật khẩu mới
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật profile
exports.updateProfile = async (req, res) => {
  try {
    const { username, avatar } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { username, avatar },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy thông tin profile chi tiết
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id || req.user.id;
    
    // Lấy thông tin user
    const user = await User.findById(userId)
      .select('-password')
      .populate('readingHistory.storyId', 'title coverImage')
      .populate('favorites', 'title coverImage');
    
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    // Lấy bình luận gần đây
    let recentComments = await Comment.find({ userId })
      .populate('storyId', 'title')
      .sort({ createdAt: -1 })
      .limit(10);

    // Populate replies users
    const userIds = new Set();
    recentComments.forEach(comment => {
      if (comment.replies && comment.replies.length > 0) {
        comment.replies.forEach(reply => {
          if (reply.userId) {
            userIds.add(reply.userId.toString());
          }
        });
      }
    });

    if (userIds.size > 0) {
      const users = await User.find({ _id: { $in: Array.from(userIds) } })
        .select('username avatar role membershipPoints displayName');
      const userMap = {};
      users.forEach(user => {
        userMap[user._id.toString()] = user;
      });

      recentComments.forEach(comment => {
        if (comment.replies && comment.replies.length > 0) {
          comment.replies.forEach(reply => {
            if (reply.userId && userMap[reply.userId.toString()]) {
              reply.userId = userMap[reply.userId.toString()];
            }
          });
        }
      });
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        displayName: user.displayName,
        role: user.role,
        isAuthor: user.isAuthor,
        isAgeVerified: user.isAgeVerified,
        ageVerifiedAt: user.ageVerifiedAt,
        membershipPoints: user.membershipPoints,
        membershipLevel: user.membershipLevel,
        readCount: user.readCount,
        commentCount: user.commentCount,
        createdAt: user.createdAt,
        readingHistory: user.readingHistory,
        favorites: user.favorites
      },
      recentComments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Thêm truyện vào yêu thích
exports.addToFavorites = async (req, res) => {
  try {
    const { storyId } = req.body;
    const user = await User.findById(req.user.id);

    if (!user.favorites.includes(storyId)) {
      user.favorites.push(storyId);
      await user.save();
    }

    res.json({ message: 'Đã thêm vào danh sách yêu thích' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa truyện khỏi yêu thích
exports.removeFromFavorites = async (req, res) => {
  try {
    const { storyId } = req.params;
    const user = await User.findById(req.user.id);

    user.favorites = user.favorites.filter(id => id.toString() !== storyId);
    await user.save();

    res.json({ message: 'Đã xóa khỏi danh sách yêu thích' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật lịch sử đọc và thêm điểm
exports.updateReadingHistory = async (req, res) => {
  try {
    const { storyId, chapterNumber } = req.body;
    const user = await User.findById(req.user.id);

    // Tìm hoặc tạo mới reading history
    const existingHistory = user.readingHistory.find(
      h => h.storyId.toString() === storyId
    );

    if (existingHistory) {
      existingHistory.lastChapter = chapterNumber;
      existingHistory.lastReadAt = new Date();
    } else {
      user.readingHistory.push({
        storyId,
        lastChapter: chapterNumber,
        lastReadAt: new Date()
      });
    }

    // Tăng số lần đọc và thêm điểm (5 điểm mỗi chương)
    user.readCount += 1;
    await user.addPoints(5);

    res.json({ message: 'Đã cập nhật lịch sử đọc', points: user.membershipPoints });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật thông tin hồ sơ (tên hiển thị, avatar)
exports.updateProfile = async (req, res) => {
  try {
    const { displayName, avatar } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    if (displayName) {
      user.displayName = displayName;
    }

    if (avatar) {
      user.avatar = avatar;
    }

    await user.save();

    res.json({
      message: 'Cập nhật hồ sơ thành công',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar,
        role: user.role,
        isAgeVerified: user.isAgeVerified
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xác minh độ tuổi
exports.verifyAge = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    user.isAgeVerified = true;
    user.ageVerifiedAt = new Date();
    await user.save();

    res.json({
      message: 'Xác minh độ tuổi thành công',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAgeVerified: user.isAgeVerified,
        ageVerifiedAt: user.ageVerifiedAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
