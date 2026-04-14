const express = require('express');
const router = express.Router();
const Page = require('../models/Page');
const { hydrate, getDefaults } = require('../data/pageDefaults');

// GET /api/pages/:slug — public
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    if (!getDefaults(slug)) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy trang' });
    }
    const doc = await Page.findOne({ slug });
    const storedContent = doc ? Object.fromEntries(doc.content) : {};
    const hydrated = hydrate(slug, storedContent);
    res.json({ success: true, data: hydrated });
  } catch (error) {
    console.error('Error fetching page:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi tải trang' });
  }
});

module.exports = router;
