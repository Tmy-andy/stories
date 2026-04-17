const AuthorFollow = require('../models/AuthorFollow');
const User = require('../models/User');

// Theo dõi tác giả
const followAuthor = async (req, res) => {
  try {
    const userId = req.user.id;
    const { authorId } = req.body;

    if (userId === authorId) {
      return res.status(400).json({ message: 'Không thể tự theo dõi chính mình' });
    }

    const author = await User.findById(authorId);
    if (!author || !author.isAuthor) {
      return res.status(404).json({ message: 'Không tìm thấy tác giả' });
    }

    const existing = await AuthorFollow.findOne({ userId, authorId });
    if (existing) {
      return res.status(400).json({ message: 'Đã theo dõi tác giả này rồi' });
    }

    await AuthorFollow.create({ userId, authorId });
    res.status(201).json({ message: 'Đã theo dõi tác giả' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi theo dõi tác giả', error: error.message });
  }
};

// Bỏ theo dõi tác giả
const unfollowAuthor = async (req, res) => {
  try {
    const userId = req.user.id;
    const { authorId } = req.params;

    const follow = await AuthorFollow.findOneAndDelete({ userId, authorId });
    if (!follow) {
      return res.status(404).json({ message: 'Chưa theo dõi tác giả này' });
    }

    res.json({ message: 'Đã bỏ theo dõi tác giả' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi bỏ theo dõi', error: error.message });
  }
};

// Kiểm tra có đang theo dõi không
const checkIsFollowing = async (req, res) => {
  try {
    const userId = req.user.id;
    const { authorId } = req.params;

    const follow = await AuthorFollow.findOne({ userId, authorId });
    res.json({ isFollowing: !!follow });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi kiểm tra', error: error.message });
  }
};

// Danh sách tác giả đang theo dõi (của user hiện tại, cần auth)
const getFollowedAuthors = async (req, res) => {
  try {
    const userId = req.user.id;

    const follows = await AuthorFollow.find({ userId })
      .populate('authorId', 'displayName username avatar isAuthor')
      .sort({ createdAt: -1 });

    res.json(follows);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách', error: error.message });
  }
};

// Danh sách tác giả đang theo dõi của bất kỳ userId (public)
const getFollowedAuthorsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const follows = await AuthorFollow.find({ userId })
      .populate('authorId', 'displayName username avatar isAuthor')
      .sort({ createdAt: -1 });

    res.json(follows);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách', error: error.message });
  }
};

module.exports = {
  followAuthor,
  unfollowAuthor,
  checkIsFollowing,
  getFollowedAuthors,
  getFollowedAuthorsByUserId
};
