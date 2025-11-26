const Favorite = require('../models/Favorite');
const Story = require('../models/Story');

// Thêm truyện vào yêu thích
const addFavorite = async (req, res) => {
  try {
    const { storyId } = req.body;
    const userId = req.user.id;

    // Kiểm tra story tồn tại
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ message: 'Truyện không tồn tại' });
    }

    // Kiểm tra đã yêu thích chưa
    const existingFavorite = await Favorite.findOne({ userId, storyId });
    if (existingFavorite) {
      return res.status(400).json({ message: 'Truyện đã có trong danh sách yêu thích' });
    }

    const favorite = new Favorite({ userId, storyId });
    await favorite.save();

    res.status(201).json({
      message: 'Thêm vào danh sách yêu thích thành công',
      favorite
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi thêm vào yêu thích', error: error.message });
  }
};

// Xóa truyện khỏi yêu thích
const removeFavorite = async (req, res) => {
  try {
    const { storyId } = req.params;
    const userId = req.user.id;

    const favorite = await Favorite.findOneAndDelete({ userId, storyId });

    if (!favorite) {
      return res.status(404).json({ message: 'Truyện không có trong danh sách yêu thích' });
    }

    res.json({ message: 'Xóa khỏi danh sách yêu thích thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa yêu thích', error: error.message });
  }
};

// Lấy danh sách yêu thích của user
const getUserFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    const favorites = await Favorite.find({ userId })
      .populate('storyId', 'title author coverImage chapterCount')
      .sort({ createdAt: -1 });

    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách yêu thích', error: error.message });
  }
};

// Kiểm tra truyện có trong yêu thích không
const checkIsFavorite = async (req, res) => {
  try {
    const { storyId } = req.params;
    const userId = req.user.id;

    const favorite = await Favorite.findOne({ userId, storyId });

    res.json({ isFavorite: !!favorite });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi kiểm tra yêu thích', error: error.message });
  }
};

// Lấy danh sách yêu thích (public - không cần xác thực)
const getStoryFavoriteCount = async (req, res) => {
  try {
    const { storyId } = req.params;

    const count = await Favorite.countDocuments({ storyId });

    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy số lượng yêu thích', error: error.message });
  }
};

module.exports = {
  addFavorite,
  removeFavorite,
  getUserFavorites,
  checkIsFavorite,
  getStoryFavoriteCount
};
