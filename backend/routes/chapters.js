const express = require('express');
const router = express.Router();
const chapterController = require('../controllers/chapterController');

// Routes - ORDER MATTERS! More specific routes first
router.get('/admin/story/:storyId', chapterController.getAllChaptersByStoryAdmin);
router.get('/:id', chapterController.getChapterById);
router.get('/story/:storyId/:chapterNumber', chapterController.getChapterByNumber);
router.get('/story/:storyId', chapterController.getChaptersByStory);
router.post('/', chapterController.createChapter);
router.put('/:id', chapterController.updateChapter);
router.patch('/:id', chapterController.updateChapter);
router.delete('/:id', chapterController.deleteChapter);

module.exports = router;
