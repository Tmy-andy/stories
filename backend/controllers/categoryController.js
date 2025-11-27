const Category = require('../models/Category');
const Story = require('../models/Story');

// Lấy tất cả categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ displayOrder: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy categories với số lượng stories
exports.getCategoriesWithCounts = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ displayOrder: 1 });

    const categoriesWithCounts = await Promise.all(
      categories.map(async (cat) => {
        // Try to count stories where category contains this category ID
        const count = await Story.countDocuments({
          category: cat._id
        });
        return {
          _id: cat._id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          displayOrder: cat.displayOrder,
          storyCount: count
        };
      })
    );

    res.json({
      categories: categoriesWithCounts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy một category
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Không tìm thấy thể loại' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tạo category
exports.createCategory = async (req, res) => {
  try {
    const { name, description, displayOrder } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Tên thể loại là bắt buộc' });
    }

    // Tạo slug từ name
    const slug = name.toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    const category = new Category({
      name,
      slug,
      description: description || '',
      displayOrder: displayOrder || 0,
      isActive: true
    });

    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Cập nhật category
exports.updateCategory = async (req, res) => {
  try {
    const { name, description, displayOrder, isActive } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Không tìm thấy thể loại' });
    }

    if (name) category.name = name;
    if (description !== undefined) category.description = description;
    if (displayOrder !== undefined) category.displayOrder = displayOrder;
    if (isActive !== undefined) category.isActive = isActive;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Xóa category
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Không tìm thấy thể loại' });
    }

    // Kiểm tra xem có stories dùng category này không
    const storiesCount = await Story.countDocuments({
      category: { $in: [req.params.id] }
    });

    if (storiesCount > 0) {
      return res.status(400).json({
        message: `Không thể xóa thể loại vì có ${storiesCount} truyện đang dùng`
      });
    }

    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Đã xóa thể loại thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
