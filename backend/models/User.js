const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  avatar: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  readingHistory: [{
    storyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Story'
    },
    lastChapter: Number,
    lastReadAt: Date
  }],
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story'
  }],
  membershipPoints: {
    type: Number,
    default: 0
  },
  membershipLevel: {
    type: String,
    enum: ['Đồng', 'Bạc', 'Vàng', 'Kim Cương'],
    default: 'Đồng'
  },
  readCount: {
    type: Number,
    default: 0
  },
  commentCount: {
    type: Number,
    default: 0
  },
  displayName: {
    type: String,
    default: ''
  },
  isAuthor: {
    type: Boolean,
    default: false
  },
  isAgeVerified: {
    type: Boolean,
    default: false
  },
  ageVerifiedAt: {
    type: Date,
    default: null
  },
  ipAddress: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Mã hóa password trước khi lưu
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method để so sánh password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method để cập nhật điểm thành viên
userSchema.methods.updateMembershipLevel = function() {
  const points = this.membershipPoints;
  if (points >= 5000) {
    this.membershipLevel = 'Kim Cương';
  } else if (points >= 2000) {
    this.membershipLevel = 'Vàng';
  } else if (points >= 500) {
    this.membershipLevel = 'Bạc';
  } else {
    this.membershipLevel = 'Đồng';
  }
};

// Method để thêm điểm
userSchema.methods.addPoints = async function(points) {
  this.membershipPoints += points;
  this.updateMembershipLevel();
  await this.save();
};

module.exports = mongoose.model('User', userSchema);
