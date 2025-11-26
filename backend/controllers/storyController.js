const Story = require('../models/Story');
const Chapter = require('../models/Chapter');
const mongoose = require('mongoose');

// Lấy tất cả truyện với phân trang và lọc
exports.getAllStories = async (req, res) => {
  try {
    const { page = 1, limit = 20, category, categories, status, featured, search } = req.query;
    const query = {};

    // Handle both single category (legacy) and multiple categories (new)
    if (categories) {
      // categories is an array from frontend: ["Tiên hiệp", "Kiếm hiệp"]
      const categoryArray = Array.isArray(categories) ? categories : [categories];
      query.category = { $in: categoryArray };
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
    
    const story = await Story.findOne(query);
    
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
    res.status(201).json(newStory);
  } catch (error) {
    console.error('Create story error:', error.message);
    res.status(400).json({ message: error.message });
  }
};

// Cập nhật truyện
exports.updateStory = async (req, res) => {
  try {
    const story = await Story.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!story) {
      return res.status(404).json({ message: 'Không tìm thấy truyện' });
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
      .sort({ updatedAt: -1 })
      .limit(limit);
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
