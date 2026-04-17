const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const {
  followAuthor,
  unfollowAuthor,
  checkIsFollowing,
  getFollowedAuthors,
  getFollowedAuthorsByUserId
} = require('../controllers/authorFollowController');

router.post('/', authMiddleware, followAuthor);
router.delete('/:authorId', authMiddleware, unfollowAuthor);
router.get('/my-follows', authMiddleware, getFollowedAuthors);
router.get('/check/:authorId', authMiddleware, checkIsFollowing);
router.get('/user/:userId', getFollowedAuthorsByUserId);  // public

module.exports = router;
