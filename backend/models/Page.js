const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    content: {
      type: Map,
      of: String,
      default: {}
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Page', pageSchema);
