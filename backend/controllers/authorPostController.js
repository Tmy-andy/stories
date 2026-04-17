const AuthorPost = require('../models/AuthorPost');
const PostComment = require('../models/PostComment');
const AuthorFollow = require('../models/AuthorFollow');
const Notification = require('../models/Notification');
const User = require('../models/User');

// Gửi noti realtime nếu có io
const sendNotification = (req, notification) => {
  const io = req.app.locals.io;
  if (io) {
    io.to(`user_${notification.userId}`).emit('notification', notification);
  }
};

// Detect @mentions trong content → trả về mảng username
const extractMentions = (content) => {
  const matches = content.match(/@(\w+)/g) || [];
  return matches.map(m => m.slice(1));
};

// ─── Posts ───────────────────────────────────────────────────────────────────

// GET /api/author-posts?profileUserId=&type=announcement|message_board&page=&limit=
exports.getPosts = async (req, res) => {
  try {
    const { profileUserId, type, page = 1, limit = 20 } = req.query;
    if (!profileUserId) return res.status(400).json({ message: 'Thiếu profileUserId' });

    const query = { profileUserId };
    if (type) query.type = type;

    const posts = await AuthorPost.find(query)
      .populate('userId', 'displayName username avatar role')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await AuthorPost.countDocuments(query);

    // Lấy số comment cho từng post
    const postIds = posts.map(p => p._id);
    const commentCounts = await PostComment.aggregate([
      { $match: { postId: { $in: postIds } } },
      { $group: { _id: '$postId', count: { $sum: 1 } } }
    ]);
    const countMap = {};
    commentCounts.forEach(c => { countMap[c._id.toString()] = c.count; });

    const result = posts.map(p => ({
      ...p.toObject(),
      commentCount: countMap[p._id.toString()] || 0
    }));

    res.json({ posts: result, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/author-posts
// - announcement: chỉ chính tác giả của profile mới được đăng
// - message_board: bất kỳ user đã đăng nhập
exports.createPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { profileUserId, type, title, subtitle, content } = req.body;

    if (!profileUserId || !type || !content) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
    }

    // Kiểm tra profileUserId tồn tại và là tác giả
    const profileUser = await User.findById(profileUserId);
    if (!profileUser || !profileUser.isAuthor) {
      return res.status(404).json({ message: 'Không tìm thấy tác giả' });
    }

    if (type === 'announcement' && userId !== profileUserId) {
      return res.status(403).json({ message: 'Chỉ tác giả mới được đăng thông báo' });
    }

    if (type === 'message_board' && (!title || !title.trim())) {
      return res.status(400).json({ message: 'Tin nhắn cần có tiêu đề' });
    }

    const post = await AuthorPost.create({
      profileUserId,
      userId,
      type,
      title: title || '',
      subtitle: subtitle || null,
      content
    });

    const populated = await post.populate('userId', 'displayName username avatar role');

    // ── Gửi thông báo ──────────────────────────────────────────────────────
    if (type === 'announcement') {
      // Noti tất cả follower của tác giả
      const followers = await AuthorFollow.find({ authorId: profileUserId }).select('userId');
      const poster = await User.findById(userId).select('displayName username');
      const notiList = followers.map(f => ({
        userId: f.userId,
        type: 'author_announcement',
        message: `${poster.displayName || poster.username} vừa đăng thông báo mới`,
        triggeredBy: userId,
        authorPostId: post._id
      }));
      if (notiList.length > 0) {
        const savedNotis = await Notification.insertMany(notiList);
        savedNotis.forEach(n => sendNotification(req, n));
      }
    } else if (type === 'message_board') {
      // Noti tác giả của profile
      const poster = await User.findById(userId).select('displayName username');
      const noti = await Notification.create({
        userId: profileUserId,
        type: 'message_board_post',
        message: `${poster.displayName || poster.username} đã đăng một tin nhắn mới trên trang của bạn`,
        triggeredBy: userId,
        authorPostId: post._id
      });
      sendNotification(req, noti);
    }

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/author-posts/:id
exports.deletePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const post = await AuthorPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Không tìm thấy bài đăng' });

    const user = await User.findById(userId);
    const isOwner = post.userId.toString() === userId;
    const isProfileOwner = post.profileUserId.toString() === userId;
    const isAdmin = user?.role === 'admin' || user?.role === 'manager';

    if (!isOwner && !isProfileOwner && !isAdmin) {
      return res.status(403).json({ message: 'Không có quyền xóa bài này' });
    }

    await PostComment.deleteMany({ postId: post._id });
    await post.deleteOne();
    res.json({ message: 'Đã xóa bài đăng' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Comments ────────────────────────────────────────────────────────────────

// GET /api/author-posts/:id/comments?page=&limit=
exports.getComments = async (req, res) => {
  try {
    const { page = 1, limit = 30 } = req.query;
    const comments = await PostComment.find({ postId: req.params.id })
      .populate('userId', 'displayName username avatar role')
      .sort({ createdAt: 1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await PostComment.countDocuments({ postId: req.params.id });
    res.json({ comments, total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/author-posts/:id/comments
exports.addComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Nội dung bình luận không được trống' });
    }

    const post = await AuthorPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Không tìm thấy bài đăng' });

    const comment = await PostComment.create({ postId: post._id, userId, content });
    const populated = await comment.populate('userId', 'displayName username avatar role');

    // ── Gửi thông báo khi có @mention ───────────────────────────────────────
    const mentionedUsernames = extractMentions(content);
    if (mentionedUsernames.length > 0) {
      const mentionedUsers = await User.find({
        username: { $in: mentionedUsernames }
      }).select('_id');

      const commenter = await User.findById(userId).select('displayName username');
      const notiList = mentionedUsers
        .filter(u => u._id.toString() !== userId)
        .map(u => ({
          userId: u._id,
          type: 'mention',
          message: `${commenter.displayName || commenter.username} đã nhắc đến bạn trong một bình luận`,
          triggeredBy: userId,
          authorPostId: post._id
        }));

      if (notiList.length > 0) {
        const savedNotis = await Notification.insertMany(notiList);
        savedNotis.forEach(n => sendNotification(req, n));
      }
    }

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/author-posts/:id/comments/:commentId
exports.deleteComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const comment = await PostComment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Không tìm thấy bình luận' });

    const post = await AuthorPost.findById(req.params.id);
    const user = await User.findById(userId);
    const isOwner = comment.userId.toString() === userId;
    const isProfileOwner = post?.profileUserId.toString() === userId;
    const isAdmin = user?.role === 'admin' || user?.role === 'manager';

    if (!isOwner && !isProfileOwner && !isAdmin) {
      return res.status(403).json({ message: 'Không có quyền xóa bình luận này' });
    }

    await comment.deleteOne();
    res.json({ message: 'Đã xóa bình luận' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
