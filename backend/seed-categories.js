const mongoose = require('mongoose');
const Category = require('./models/Category');
require('dotenv').config();

const defaultCategories = [
  { name: 'Tiên hiệp', displayOrder: 1 },
  { name: 'Kiếm hiệp', displayOrder: 2 },
  { name: 'Huyền huyễn', displayOrder: 3 },
  { name: 'Ngôn tình', displayOrder: 4 },
  { name: 'Đô thị', displayOrder: 5 },
  { name: 'Khoa huyễn', displayOrder: 6 },
  { name: 'Lịch sử', displayOrder: 7 },
  { name: 'Đồng nhân', displayOrder: 8 },
  { name: 'Linh dị', displayOrder: 9 }
];

async function seedCategories() {
  try {
    // Kết nối MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Xóa tất cả categories cũ
    await Category.deleteMany({});
    console.log('Cleared old categories');

    // Tạo categories mới
    const categoriesToInsert = defaultCategories.map(cat => ({
      name: cat.name,
      slug: cat.name.toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
      displayOrder: cat.displayOrder,
      isActive: true
    }));

    const result = await Category.insertMany(categoriesToInsert);
    console.log(`✓ Seeded ${result.length} categories`);

    // Hiển thị categories đã tạo
    const allCategories = await Category.find();
    console.log('\nCategories in database:');
    allCategories.forEach(cat => {
      console.log(`  - ${cat.name} (ID: ${cat._id}, slug: ${cat.slug})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
}

seedCategories();
