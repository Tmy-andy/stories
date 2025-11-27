const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { verifyManagerToken } = require('../middleware/managerAuth');
const multer = require('multer');
const path = require('path');

// Setup multer for banner image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/banner'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Public routes
router.get('/', settingsController.getSettings);

// Admin/Manager only routes
router.patch('/', verifyManagerToken, settingsController.updateSettings);
router.post('/upload-banner', verifyManagerToken, upload.single('bannerImage'), settingsController.uploadBannerImage);

module.exports = router;
