const mongoose = require('mongoose');
const Story = require('./models/Story');
const Category = require('./models/Category');
require('dotenv').config();

const categoryNameToIdMap = {
  'Tiên hiệp': null,
  'Kiếm hiệp': null,
  'Huyền huyễn': null,
  'Ngôn tình': null,
  'Đô thị': null,
  'Khoa huyễn': null,
  'Lịch sử': null,
  'Đồng nhân': null,
  'Linh dị': null
};

async function migrateCategories() {
  try {
    // Kết nối MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Lấy tất cả categories
    const categories = await Category.find();
    console.log(`Found ${categories.length} categories in database`);

    // Tạo map từ name -> _id
    categories.forEach(cat => {
      categoryNameToIdMap[cat.name] = cat._id;
    });

    console.log('\nCategory mapping:');
    Object.entries(categoryNameToIdMap).forEach(([name, id]) => {
      console.log(`  ${name} => ${id}`);
    });

    // Lấy tất cả stories
    const stories = await Story.find();
    console.log(`\nFound ${stories.length} stories to migrate`);

    let updatedCount = 0;
    let errorCount = 0;

    // Lấy default category (Tiên hiệp)
    const defaultCategoryId = categoryNameToIdMap['Tiên hiệp'];

    // Cập nhật từng story
    for (const story of stories) {
      try {
        // Chuyển đổi category names thành IDs
        let newCategories = [];
        
        if (Array.isArray(story.category) && story.category.length > 0) {
          // Nếu category là array
          story.category.forEach(cat => {
            const id = categoryNameToIdMap[cat];
            if (id) {
              newCategories.push(id);
            } else if (mongoose.Types.ObjectId.isValid(cat)) {
              // Nếu đã là ObjectId, giữ lại
              newCategories.push(cat);
            } else {
              console.warn(`  ⚠️  Unknown category: "${cat}" in story "${story.title}"`);
            }
          });
        } else if (typeof story.category === 'string' && story.category) {
          // Nếu category là string đơn
          const id = categoryNameToIdMap[story.category];
          if (id) {
            newCategories.push(id);
          } else if (mongoose.Types.ObjectId.isValid(story.category)) {
            newCategories.push(story.category);
          } else {
            console.warn(`  ⚠️  Unknown category: "${story.category}" in story "${story.title}"`);
          }
        }

        // Nếu không có category, gán mặc định
        if (newCategories.length === 0) {
          newCategories = [defaultCategoryId];
          console.log(`  ℹ️  No categories found, assigned default (Tiên hiệp): ${story.title}`);
        }

        await Story.findByIdAndUpdate(story._id, {
          category: newCategories
        });
        updatedCount++;
        console.log(`  ✓ Updated: ${story.title} (${newCategories.length} categories)`);
      } catch (err) {
        console.error(`  ✗ Error updating story ${story.title}: ${err.message}`);
        errorCount++;
      }
    }

    console.log(`\n✓ Migration complete!`);
    console.log(`  - Updated: ${updatedCount} stories`);
    console.log(`  - Errors: ${errorCount}`);

    // Kiểm tra kết quả
    const updatedStories = await Story.find().populate('category', 'name');
    console.log(`\nUpdated stories with categories:`);
    updatedStories.slice(0, 10).forEach(story => {
      if (story.category && Array.isArray(story.category)) {
        const catNames = story.category.map(c => c.name || c).join(', ');
        console.log(`  - ${story.title}: [${catNames}]`);
      }
    });

    process.exit(0);
  } catch (error) {
    console.error('Error migrating categories:', error);
    process.exit(1);
  }
}

migrateCategories();
