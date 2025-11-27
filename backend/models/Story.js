const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  coverImage: {
    type: String,
    default: ''
  },
  category: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Category',
    required: true
  },
  status: {
    type: String,
    enum: ['publishing', 'completed', 'paused_indefinite', 'paused_timed', 'dropped'],
    default: 'publishing'
    // publishing: Đang ra (Publishing)
    // completed: Hoàn thành (Completed)
    // paused_indefinite: Hoãn vô thời hạn (Indefinite pause)
    // paused_timed: Hoãn có thời hạn (Timed pause)
    // dropped: Ngừng xuất bản (Drop)
  },
  pauseDate: {
    type: Date,
    default: null
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  chapterCount: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Generate slug before saving
storySchema.pre('save', async function() {
  if (!this.slug) {
    // Vietnamese to English mapping for common characters
    const vietnameseMap = {
      'à': 'a', 'á': 'a', 'ạ': 'a', 'ả': 'a', 'ã': 'a', 'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ậ': 'a', 'ẩ': 'a', 'ẫ': 'a',
      'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ặ': 'a', 'ẳ': 'a', 'ẵ': 'a',
      'è': 'e', 'é': 'e', 'ẹ': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ê': 'e', 'ề': 'e', 'ế': 'e', 'ệ': 'e', 'ể': 'e', 'ễ': 'e',
      'ì': 'i', 'í': 'i', 'ị': 'i', 'ỉ': 'i', 'ĩ': 'i',
      'ò': 'o', 'ó': 'o', 'ọ': 'o', 'ỏ': 'o', 'õ': 'o', 'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ộ': 'o', 'ổ': 'o', 'ỗ': 'o',
      'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ợ': 'o', 'ở': 'o', 'ỡ': 'o',
      'ù': 'u', 'ú': 'u', 'ụ': 'u', 'ủ': 'u', 'ũ': 'u', 'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ự': 'u', 'ử': 'u', 'ữ': 'u',
      'ỳ': 'y', 'ý': 'y', 'ỵ': 'y', 'ỷ': 'y', 'ỹ': 'y',
      'đ': 'd'
    };

    let slug = this.title.toLowerCase().trim();
    
    // Replace Vietnamese characters
    for (const [viet, eng] of Object.entries(vietnameseMap)) {
      slug = slug.replace(new RegExp(viet, 'g'), eng);
    }
    
    // Replace spaces and special characters with hyphens
    slug = slug.replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/^-+|-+$/g, '');
    
    this.slug = slug;
  }
});

module.exports = mongoose.model('Story', storySchema);
