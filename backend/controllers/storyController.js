const Story = require('../models/Story');
const Chapter = require('../models/Chapter');
const mongoose = require('mongoose');
const AuthorFollow = require('../models/AuthorFollow');
const Notification = require('../models/Notification');
const Favorite = require('../models/Favorite');

// Lấy tất cả truyện với phân trang và lọc
exports.getAllStories = async (req, res) => {
  try {
    const { page = 1, limit = 20, category, categories, status, featured, search } = req.query;
    const query = {};

    // Handle both single category (legacy) and multiple categories (new)
    // Use $all for AND logic - story must have ALL selected categories
    if (categories) {
      const categoryArray = Array.isArray(categories) ? categories : [categories];
      query.category = { $all: categoryArray };
    } else if (category) {
      // Legacy support: single category
      query.category = { $in: [category] };
    }

    if (status) query.status = status;
    if (featured) query.featured = featured === 'true';
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }

    const stories = await Story.find(query)
      .populate('category', 'name slug')
      .populate('authorId', 'displayName username email')
      .sort({ updatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Story.countDocuments(query);

    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy một truyện theo ID hoặc slug
exports.getStoryById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Getting story with id/slug:', id);
    
    let query = { slug: id }; // Try slug first
    
    // Check if it's a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = {
        $or: [
          { _id: id },
          { slug: id }
        ]
      };
    }
    
    const story = await Story.findOne(query)
      .populate('category', 'name slug')
      .populate('authorId', 'displayName username email');
    
    if (!story) {
      console.log('Story not found');
      return res.status(404).json({ message: 'Không tìm thấy truyện' });
    }
    
    // Skip incrementing views to avoid errors - can be fixed later
    // if (!story.views) story.views = 0;
    // story.views += 1;
    // await story.save();
    
    res.json(story);
  } catch (error) {
    console.error('Error in getStoryById:', error);
    res.status(500).json({ message: error.message });
  }
};

// Tạo truyện mới
exports.createStory = async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user.id);
    
    const storyData = {
      ...req.body,
      author: user.username,
      authorId: req.user.id
    };
    
    const story = new Story(storyData);
    const newStory = await story.save();

    // Gửi thông báo cho người đang theo dõi tác giả (fire-and-forget)
    sendNewStoryNotifications(newStory, req.user.id).catch(err =>
      console.error('Notification error:', err.message)
    );

    res.status(201).json(newStory);
  } catch (error) {
    console.error('Create story error:', error.message);
    res.status(400).json({ message: error.message });
  }
};

async function sendNewStoryNotifications(story, authorId) {
  const follows = await AuthorFollow.find({ authorId })
    .select('userId')
    .limit(500);

  const notifications = follows.map(f => ({
    userId: f.userId,
    type: 'new_story',
    message: `Tác giả bạn theo dõi vừa đăng truyện mới: "${story.title}"`,
    storyId: story._id,
    triggeredBy: authorId
  }));

  if (notifications.length > 0) {
    await Notification.insertMany(notifications);
  }
}

// Cập nhật truyện
exports.updateStory = async (req, res) => {
  try {
    const oldStory = await Story.findById(req.params.id);
    if (!oldStory) {
      return res.status(404).json({ message: 'Không tìm thấy truyện' });
    }

    const oldStatus = oldStory.status;

    const story = await Story.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    // Nếu trạng thái thay đổi → thông báo cho người đã yêu thích truyện
    const newStatus = story.status;
    if (req.body.status && oldStatus !== newStatus) {
      const statusLabels = {
        publishing: 'Đang ra',
        completed: 'Hoàn thành',
        paused_indefinite: 'Hoãn vô thời hạn',
        paused_timed: 'Hoãn có thời hạn',
        dropped: 'Ngừng xuất bản'
      };
      const label = statusLabels[newStatus] || newStatus;

      const favorites = await Favorite.find({ storyId: story._id }).select('userId');
      const io = req.app?.locals?.io;

      for (const fav of favorites) {
        const noti = await Notification.create({
          userId: fav.userId,
          type: 'story_status_change',
          message: `Truyện "${story.title}" đã đổi trạng thái: ${label}`,
          storyId: story._id,
          triggeredBy: story.authorId
        });
        if (io) {
          io.to(`user_${fav.userId}`).emit('notification', noti);
        }
      }
    }

    res.json(story);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Xóa truyện
exports.deleteStory = async (req, res) => {
  try {
    const story = await Story.findByIdAndDelete(req.params.id);
    
    if (!story) {
      return res.status(404).json({ message: 'Không tìm thấy truyện' });
    }
    
    // Xóa tất cả chapters của truyện
    await Chapter.deleteMany({ storyId: req.params.id });
    
    res.json({ message: 'Đã xóa truyện thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy truyện nổi bật
exports.getFeaturedStories = async (req, res) => {
  try {
    const stories = await Story.find({ featured: true })
      .populate('category', 'name slug')
      .populate('authorId', 'displayName username avatar')
      .sort({ views: -1 })
      .limit(10);
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy truyện mới cập nhật
exports.getLatestStories = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const stories = await Story.find()
      .populate('category', 'name slug')
      .populate('authorId', 'displayName username avatar')
      .sort({ updatedAt: -1 })
      .limit(limit);
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
