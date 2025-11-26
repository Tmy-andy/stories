const Chapter = require('../models/Chapter');
const Story = require('../models/Story');
const mongoose = require('mongoose');

// Lấy tất cả chapters của một truyện (by ID hoặc slug) - KHÔNG LẤY DRAFT & ARCHIVED
exports.getChaptersByStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    
    // Find story by ID or slug
    let query = { slug: storyId };
    if (mongoose.Types.ObjectId.isValid(storyId)) {
      query = {
        $or: [
          { _id: storyId },
          { slug: storyId }
        ]
      };
    }
    
    const story = await Story.findOne(query);
    
    if (!story) {
      return res.status(404).json({ message: 'Không tìm thấy truyện' });
    }
    
    // Lấy chapters nhưng loại bỏ draft và archived (chỉ lấy published)
    const chapters = await Chapter.find({ 
      storyId: story._id, 
      status: 'published'
    })
      .sort({ chapterNumber: 1 });
    res.json(chapters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy TẤT CẢ chapters của một truyện (cho admin) - DRAFT, PUBLISHED, ARCHIVED
exports.getAllChaptersByStoryAdmin = async (req, res) => {
  try {
    const { storyId } = req.params;
    console.log('Admin chapters request for storyId:', storyId);
    
    // Validate storyId is a valid MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(storyId)) {
      console.log('Invalid storyId format');
      return res.status(400).json({ message: 'ID truyện không hợp lệ' });
    }
    
    const story = await Story.findById(storyId);
    
    if (!story) {
      console.log('Story not found');
      return res.status(404).json({ message: 'Không tìm thấy truyện' });
    }
    
    // Lấy TẤT CẢ chapters (draft, published, archived)
    const chapters = await Chapter.find({ storyId: story._id })
      .sort({ chapterNumber: 1 });
    console.log('Returning', chapters.length, 'chapters');
    res.json(chapters);
  } catch (error) {
    console.error('Error in getAllChaptersByStoryAdmin:', error);
    res.status(500).json({ message: error.message });
  }
};

// Lấy một chapter
exports.getChapterById = async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id).populate('storyId', 'title author');
    if (!chapter) {
      return res.status(404).json({ message: 'Không tìm thấy chương' });
    }
    
    // Tăng lượt xem
    chapter.views += 1;
    await chapter.save();
    
    res.json(chapter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy chapter theo số chương (by storyId hoặc slug)
exports.getChapterByNumber = async (req, res) => {
  try {
    const { storyId, chapterNumber } = req.params;
    
    // Find story by ID or slug
    let query = { slug: storyId };
    if (mongoose.Types.ObjectId.isValid(storyId)) {
      query = {
        $or: [
          { _id: storyId },
          { slug: storyId }
        ]
      };
    }
    
    const story = await Story.findOne(query);
    
    if (!story) {
      return res.status(404).json({ message: 'Không tìm thấy truyện' });
    }
    
    const chapter = await Chapter.findOne({ 
      storyId: story._id,
      chapterNumber: parseInt(chapterNumber) 
    }).populate('storyId', 'title author slug');
    
    if (!chapter) {
      return res.status(404).json({ message: 'Không tìm thấy chương' });
    }
    
    // Tăng lượt xem
    chapter.views += 1;
    await chapter.save();
    
    res.json(chapter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tạo chapter mới
exports.createChapter = async (req, res) => {
  try {
    const chapter = new Chapter(req.body);
    const newChapter = await chapter.save();
    
    // Cập nhật số lượng chapter trong story
    await Story.findByIdAndUpdate(
      req.body.storyId,
      { $inc: { chapterCount: 1 }, updatedAt: Date.now() }
    );
    
    res.status(201).json(newChapter);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Cập nhật chapter
exports.updateChapter = async (req, res) => {
  try {
    const chapter = await Chapter.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!chapter) {
      return res.status(404).json({ message: 'Không tìm thấy chương' });
    }
    
    // Cập nhật updatedAt của story
    await Story.findByIdAndUpdate(chapter.storyId, { updatedAt: Date.now() });
    
    res.json(chapter);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Xóa chapter
exports.deleteChapter = async (req, res) => {
  try {
    const chapter = await Chapter.findByIdAndDelete(req.params.id);
    
    if (!chapter) {
      return res.status(404).json({ message: 'Không tìm thấy chương' });
    }
    
    // Giảm số lượng chapter trong story
    await Story.findByIdAndUpdate(
      chapter.storyId,
      { $inc: { chapterCount: -1 } }
    );
    
    res.json({ message: 'Đã xóa chương thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
