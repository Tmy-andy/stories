const express = require('express');
const router = express.Router();
const { verifyManagerToken } = require('../middleware/managerAuth');
const Story = require('../models/Story');
const User = require('../models/User');
const Comment = require('../models/Comment');
const Contact = require('../models/Contact');
const Chapter = require('../models/Chapter');
const contactController = require('../controllers/contactController');

/**
 * Dashboard Statistics
 * GET /api/manager/dashboard
 */
router.get('/dashboard', verifyManagerToken, async (req, res) => {
  try {
    const totalStories = await Story.countDocuments();
    const totalAuthors = await User.countDocuments({ role: 'author' });
    const totalUsers = await User.countDocuments({ role: 'user' });
    const pendingContacts = await Contact.countDocuments({ status: 'pending' });
    const pendingComments = await Comment.countDocuments({ status: 'pending' });

    // Recent activities
    const recentStories = await Story.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title createdAt');

    const activities = recentStories.map(story => ({
      type: 'story_added',
      title: `Truyện "${story.title}" được thêm`,
      timestamp: story.createdAt,
    }));

    res.json({
      success: true,
      stats: {
        totalStories,
        totalAuthors,
        totalUsers,
        pendingContacts,
        pendingComments,
      },
      activities,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy dữ liệu dashboard',
    });
  }
});

/**
 * Stories Management
 */

// Get all stories
router.get('/stories', verifyManagerToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (status) query.status = status;
    if (search) query.title = { $regex: search, $options: 'i' };

    const stories = await Story.find(query)
      .populate('authorId', 'displayName username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Story.countDocuments(query);

    res.json({
      success: true,
      stories,
      pageInfo: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách truyện',
    });
  }
});

// Get story by ID
router.get('/stories/:id', verifyManagerToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    let story = null;
    
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      try {
        story = await Story.findById(id).populate('authorId', 'displayName username email');
      } catch (err) {
        console.log('Error finding by ID:', err.message);
      }
    }
    
    // If not found by ID, try by slug
    if (!story) {
      story = await Story.findOne({ slug: { $regex: `^${id}$`, $options: 'i' } }).populate('authorId', 'displayName username email');
    }

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy truyện',
      });
    }

    res.json({
      success: true,
      story,
    });
  } catch (error) {
    console.error('Error getting story:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin truyện: ' + error.message,
    });
  }
});

// Update story
router.put('/stories/:id', verifyManagerToken, async (req, res) => {
  try {
    const { title, description, category, status } = req.body;
    const { id } = req.params;

    let story = null;
    
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      try {
        story = await Story.findByIdAndUpdate(
          id,
          { title, description, category, status },
          { new: true }
        );
      } catch (err) {
        console.log('Error updating by ID:', err.message);
      }
    }
    
    // If not updated by ID, try by slug
    if (!story) {
      story = await Story.findOneAndUpdate(
        { slug: { $regex: `^${id}$`, $options: 'i' } },
        { title, description, category, status },
        { new: true }
      );
    }

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy truyện',
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật truyện thành công',
      story,
    });
  } catch (error) {
    console.error('Error updating story:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật truyện: ' + error.message,
    });
  }
});

// Delete story
router.delete('/stories/:id', verifyManagerToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Try to find by ID or slug first
    let story = null;
    
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      try {
        story = await Story.findByIdAndDelete(id);
      } catch (err) {
        console.log('Error deleting by ID:', err.message);
      }
    }
    
    // If not deleted by ID, try by slug
    if (!story) {
      story = await Story.findOneAndDelete({ slug: { $regex: `^${id}$`, $options: 'i' } });
    }

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy truyện',
      });
    }

    res.json({
      success: true,
      message: 'Xóa truyện thành công',
    });
  } catch (error) {
    console.error('Error deleting story:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa truyện: ' + error.message,
    });
  }
});

// Toggle story status
router.patch('/stories/:id/toggle-status', verifyManagerToken, async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Toggle status for ID:', id);
    
    // Try to find by ID or slug
    let story = null;
    
    // First try by ID if valid ObjectId format
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      try {
        story = await Story.findById(id);
        console.log('Found by ID:', story ? 'yes' : 'no');
      } catch (err) {
        console.log('Error finding by ID:', err.message);
      }
    }
    
    // If not found by ID, try by slug (case-insensitive)
    if (!story) {
      try {
        story = await Story.findOne({ slug: { $regex: `^${id}$`, $options: 'i' } });
        console.log('Found by slug:', story ? 'yes' : 'no');
      } catch (slugErr) {
        console.log('Error finding by slug:', slugErr.message);
      }
    }

    if (!story) {
      console.log('Story not found for ID:', id);
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy truyện',
      });
    }

    // Toggle between publishing and paused_indefinite
    story.status = story.status === 'publishing' ? 'paused_indefinite' : 'publishing';
    await story.save();

    res.json({
      success: true,
      message: 'Cập nhật trạng thái thành công',
      story,
    });
  } catch (error) {
    console.error('Error toggling story status:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật trạng thái: ' + error.message,
    });
  }
});

/**
 * Users Management
 */

// Get all users
router.get('/users', verifyManagerToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, role, status, search } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (role) query.role = role;
    if (status === 'active') query.isActive = true;
    if (status === 'locked') query.isActive = false;
    if (search) query.name = { $regex: search, $options: 'i' };

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      pageInfo: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách người dùng',
    });
  }
});

// Delete user
router.delete('/users/:id', verifyManagerToken, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng',
      });
    }

    res.json({
      success: true,
      message: 'Xóa người dùng thành công',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa người dùng',
    });
  }
});

// Toggle user status
router.patch('/users/:id/toggle-status', verifyManagerToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng',
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: 'Cập nhật trạng thái thành công',
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật trạng thái',
    });
  }
});

/**
 * Comments Management
 */

// Get all comments
router.get('/comments', verifyManagerToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (status) query.status = status;

    const comments = await Comment.find(query)
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Comment.countDocuments(query);

    res.json({
      success: true,
      comments,
      pageInfo: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách bình luận',
    });
  }
});

// Approve comment
router.patch('/comments/:id/approve', verifyManagerToken, async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bình luận',
      });
    }

    res.json({
      success: true,
      message: 'Duyệt bình luận thành công',
      comment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi duyệt bình luận',
    });
  }
});

// Reject comment
router.patch('/comments/:id/reject', verifyManagerToken, async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bình luận',
      });
    }

    res.json({
      success: true,
      message: 'Từ chối bình luận thành công',
      comment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi từ chối bình luận',
    });
  }
});

// Delete comment
router.delete('/comments/:id', verifyManagerToken, async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bình luận',
      });
    }

    res.json({
      success: true,
      message: 'Xóa bình luận thành công',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa bình luận',
    });
  }
});

/**
 * Contacts Management
 */

// Get all contacts
router.get('/contacts', verifyManagerToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const contacts = await Contact.find(query)
      .populate('userId', 'displayName username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Contact.countDocuments(query);

    res.json({
      success: true,
      contacts,
      pageInfo: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách liên hệ',
    });
  }
});

// Get contact by ID
router.get('/contacts/:id', verifyManagerToken, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy liên hệ',
      });
    }

    res.json({
      success: true,
      contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin liên hệ',
    });
  }
});

// Mark contact as read
router.patch('/contacts/:id/mark-read', verifyManagerToken, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy liên hệ',
      });
    }

    res.json({
      success: true,
      message: 'Đánh dấu đã xem',
      contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật liên hệ',
    });
  }
});

// Respond to contact
router.post('/contacts/:id/respond', verifyManagerToken, contactController.respondToContact);

// Delete contact
router.delete('/contacts/:id', verifyManagerToken, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy liên hệ',
      });
    }

    res.json({
      success: true,
      message: 'Xóa liên hệ thành công',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa liên hệ',
    });
  }
});

/**
 * Chapters Management
 */

// Get chapters for a story (by slug or ID)
router.get('/chapters/story/:storyId', verifyManagerToken, async (req, res) => {
  try {
    const { storyId } = req.params;
    console.log('Fetching chapters for storyId:', storyId);
    
    // Try to find story by ID or slug
    let story = null;
    
    // First try to find by ID if it looks like a valid MongoDB ObjectId
    if (storyId.match(/^[0-9a-fA-F]{24}$/)) {
      try {
        story = await Story.findById(storyId);
        console.log('Found story by ID:', story ? story._id : 'not found');
      } catch (idError) {
        console.log('Error finding by ID:', idError.message);
      }
    }
    
    // If not found by ID, try by slug (case-insensitive)
    if (!story) {
      try {
        story = await Story.findOne({ slug: { $regex: `^${storyId}$`, $options: 'i' } });
        console.log('Found story by slug:', story ? story._id : 'not found');
      } catch (slugError) {
        console.log('Error finding by slug:', slugError.message);
      }
    }
    
    if (!story) {
      console.log('Story not found for:', storyId);
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy truyện',
      });
    }

    const chapters = await Chapter.find({ storyId: story._id })
      .sort({ chapterNumber: 1 });

    console.log('Found', chapters.length, 'chapters');

    res.json({
      success: true,
      chapters,
    });
  } catch (error) {
    console.error('Error fetching chapters:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách chương: ' + error.message,
    });
  }
});

// Get chapter by ID
router.get('/chapters/:id', verifyManagerToken, async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id).populate('storyId', 'title');

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy chương',
      });
    }

    res.json({
      success: true,
      chapter,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin chương',
    });
  }
});

// Create new chapter
router.post('/chapters', verifyManagerToken, async (req, res) => {
  try {
    const { storyId, chapterNumber, title, content, status } = req.body;

    // Validate required fields
    if (!storyId || !chapterNumber || !title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ thông tin chương',
      });
    }

    // Verify story exists
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy truyện',
      });
    }

    const chapter = new Chapter({
      storyId,
      chapterNumber,
      title,
      content,
      status: status || 'published',
    });

    await chapter.save();

    res.json({
      success: true,
      message: 'Tạo chương thành công',
      chapter,
    });
  } catch (error) {
    console.error('Error creating chapter:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo chương',
    });
  }
});

// Update chapter
router.put('/chapters/:id', verifyManagerToken, async (req, res) => {
  try {
    const { title, content, status, chapterNumber } = req.body;

    const chapter = await Chapter.findByIdAndUpdate(
      req.params.id,
      { title, content, status, chapterNumber, updatedAt: new Date() },
      { new: true }
    );

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy chương',
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật chương thành công',
      chapter,
    });
  } catch (error) {
    console.error('Error updating chapter:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật chương',
    });
  }
});

// Delete chapter
router.delete('/chapters/:id', verifyManagerToken, async (req, res) => {
  try {
    const chapter = await Chapter.findByIdAndDelete(req.params.id);

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy chương',
      });
    }

    res.json({
      success: true,
      message: 'Xóa chương thành công',
    });
  } catch (error) {
    console.error('Error deleting chapter:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa chương',
    });
  }
});

// Update chapter status
router.patch('/chapters/:id/status', verifyManagerToken, async (req, res) => {
  try {
    const { status } = req.body;

    const chapter = await Chapter.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy chương',
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật trạng thái chương thành công',
      chapter,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật trạng thái chương',
    });
  }
});

module.exports = router;
