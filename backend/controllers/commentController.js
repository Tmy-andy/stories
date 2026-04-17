const Comment = require('../models/Comment');
const User = require('../models/User');
const Chapter = require('../models/Chapter');
const Story = require('../models/Story');
const Favorite = require('../models/Favorite');
const { createNotification } = require('./notificationController');

// Tạo comment mới
exports.createComment = async (req, res) => {
  try {
    const { storyId, chapterId, content, isSpoiler, mentions } = req.body;
    const io = req.app.locals.io;
    const userConnections = req.app.locals.userConnections;

    const comment = new Comment({
      userId: req.user.id,
      storyId,
      chapterId: chapterId || null,
      content,
      mentions: mentions || [],
      isSpoiler: isSpoiler || false
    });

    await comment.save();

    // Tăng số lượng comment và thêm điểm (10 điểm mỗi comment)
    const user = await User.findById(req.user.id);
    user.commentCount += 1;
    await user.addPoints(10);

    const populatedComment = await Comment.findById(comment._id)
      .populate('userId', 'username avatar role membershipPoints displayName')
      .populate('storyId', 'title authorId');

    // Lấy thông tin chapter nếu comment trên chapter
    let chapterInfo = null;
    if (chapterId) {
      chapterInfo = await Chapter.findById(chapterId).select('chapterNumber title');
    }
    const chapterLabel = chapterInfo ? ` (Chương ${chapterInfo.chapterNumber}: ${chapterInfo.title})` : '';
    const notiData = {
      storyId, commentId: comment._id, triggeredBy: req.user.id,
      ...(chapterId ? { chapterId } : {})
    };

    // Tập hợp những người đã nhận noti để tránh gửi trùng
    const notifiedUsers = new Set();

    // Gửi thông báo cho tác giả khi có bình luận mới
    if (populatedComment.storyId && populatedComment.storyId.authorId) {
      const storyAuthorId = populatedComment.storyId.authorId._id ?
        populatedComment.storyId.authorId._id.toString() :
        populatedComment.storyId.authorId.toString();

      // Chỉ gửi thông báo nếu người comment không phải là tác giả
      if (storyAuthorId !== req.user.id) {
        const notification = await createNotification(
          storyAuthorId,
          'comment',
          `${user.username} vừa bình luận trên truyện "${populatedComment.storyId.title}"${chapterLabel}`,
          notiData
        );
        notifiedUsers.add(storyAuthorId);

        // Gửi qua Socket.io nếu user online
        if (userConnections[storyAuthorId]) {
          io.to(`user_${storyAuthorId}`).emit('notification', notification);
        }
      }
    }

    // Gửi thông báo cho những người được @mention trong comment
    if (mentions && mentions.length > 0) {
      for (const mention of mentions) {
        const mentionUserId = mention.userId.toString();
        // Không gửi noti cho chính mình hoặc người đã nhận noti (tác giả)
        if (mentionUserId !== req.user.id && !notifiedUsers.has(mentionUserId)) {
          const notification = await createNotification(
            mentionUserId,
            'mention',
            `${user.username} mention bạn trong một bình luận${chapterLabel}`,
            notiData
          );
          notifiedUsers.add(mentionUserId);

          if (userConnections[mentionUserId]) {
            io.to(`user_${mentionUserId}`).emit('notification', notification);
          }
        }
      }
    }

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to populate replies with user data
const populateRepliesUsers = async (comments) => {
  const userIds = new Set();

  // Collect all unique user IDs from comments, replies, and mentions
  comments.forEach(comment => {
    if (comment.userId && comment.userId._id) {
      userIds.add(comment.userId._id.toString());
    }
    // Mention userIds trong comment
    if (comment.mentions) {
      comment.mentions.forEach(m => {
        if (m.userId) userIds.add(m.userId.toString());
      });
    }
    if (comment.replies && comment.replies.length > 0) {
      comment.replies.forEach(reply => {
        if (reply.userId) userIds.add(reply.userId.toString());
        // Mention userIds trong reply
        if (reply.mentions) {
          reply.mentions.forEach(m => {
            if (m.userId) userIds.add(m.userId.toString());
          });
        }
      });
    }
  });

  // Fetch all users
  const users = await User.find({ _id: { $in: Array.from(userIds) } })
    .select('username avatar role membershipPoints displayName');
  const userMap = {};
  users.forEach(user => {
    userMap[user._id.toString()] = user;
  });

  // Replace userId references with actual user objects
  comments.forEach(comment => {
    // Populate mentions trong comment
    if (comment.mentions) {
      comment.mentions.forEach(m => {
        if (m.userId && userMap[m.userId.toString()]) {
          m.userId = userMap[m.userId.toString()];
        }
      });
    }
    if (comment.replies && comment.replies.length > 0) {
      comment.replies.forEach(reply => {
        if (reply.userId && userMap[reply.userId.toString()]) {
          reply.userId = userMap[reply.userId.toString()];
        }
        // Populate mentions trong reply
        if (reply.mentions) {
          reply.mentions.forEach(m => {
            if (m.userId && userMap[m.userId.toString()]) {
              m.userId = userMap[m.userId.toString()];
            }
          });
        }
      });
    }
  });

  return comments;
};

// Lấy comments của một truyện (ngoài chapter)
exports.getCommentsByStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    let comments = await Comment.find({ 
      storyId,
      chapterId: null
    })
      .populate('userId', 'username avatar role membershipPoints displayName')
      .sort({ createdAt: -1 });

    // Populate replies users
    comments = await populateRepliesUsers(comments);
    
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy comments của một chapter
exports.getCommentsByChapter = async (req, res) => {
  try {
    const { storyId, chapterId } = req.params;
    let comments = await Comment.find({
      storyId,
      chapterId
    })
      .populate('userId', 'username avatar role membershipPoints displayName')
      .sort({ createdAt: -1 });

    // Populate replies users
    comments = await populateRepliesUsers(comments);
    
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy comments của user
exports.getCommentsByUser = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    const comments = await Comment.find({ userId })
      .populate('storyId', 'title')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Like/Unlike comment
exports.toggleLikeComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ message: 'Không tìm thấy bình luận' });
    }

    const userId = req.user.id;
    const hasLiked = comment.likedBy.includes(userId);

    if (hasLiked) {
      // Unlike
      comment.likedBy = comment.likedBy.filter(id => id.toString() !== userId);
      comment.likes -= 1;
    } else {
      // Like
      comment.likedBy.push(userId);
      comment.likes += 1;
    }

    await comment.save();

    res.json({ likes: comment.likes, hasLiked: !hasLiked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa comment
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ message: 'Không tìm thấy bình luận' });
    }

    // Kiểm tra quyền xóa (chỉ người tạo hoặc admin)
    if (comment.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Bạn không có quyền xóa bình luận này' });
    }

    await Comment.findByIdAndDelete(id);

    // Giảm số lượng comment của user
    const user = await User.findById(comment.userId);
    if (user.commentCount > 0) {
      user.commentCount -= 1;
      await user.save();
    }

    res.json({ message: 'Đã xóa bình luận' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Thêm reply vào comment
exports.addReply = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content, mentions, isSpoiler } = req.body;
    const io = req.app.locals.io;
    const userConnections = req.app.locals.userConnections;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Không tìm thấy bình luận' });
    }

    const reply = {
      userId: req.user.id,
      content,
      mentions: mentions || [],
      isSpoiler: isSpoiler || false
    };

    comment.replies.push(reply);
    await comment.save();

    // Lấy thông tin chapter nếu comment thuộc chapter
    let chapterInfo = null;
    if (comment.chapterId) {
      chapterInfo = await Chapter.findById(comment.chapterId).select('chapterNumber title');
    }
    const chapterLabel = chapterInfo ? ` (Chương ${chapterInfo.chapterNumber}: ${chapterInfo.title})` : '';
    const notiData = {
      storyId: comment.storyId, commentId: comment._id, triggeredBy: req.user.id,
      ...(comment.chapterId ? { chapterId: comment.chapterId } : {})
    };

    // Tập hợp những người đã nhận noti để tránh gửi trùng
    const notifiedUsers = new Set();

    // Gửi thông báo cho người tạo comment gốc
    const origCommentUser = await User.findById(comment.userId);
    const currentUser = await User.findById(req.user.id);
    const origCommentUserId = comment.userId.toString();

    if (origCommentUser && origCommentUserId !== req.user.id) {
      const notification = await createNotification(
        origCommentUserId,
        'reply',
        `${currentUser.username} trả lời bình luận của bạn${chapterLabel}`,
        notiData
      );
      notifiedUsers.add(origCommentUserId);

      // Gửi qua Socket.io nếu user online
      if (userConnections[origCommentUserId]) {
        io.to(`user_${origCommentUserId}`).emit('notification', notification);
      }
    }

    // Gửi thông báo cho những người được mention (trừ người đã nhận noti reply ở trên)
    if (mentions && mentions.length > 0) {
      for (const mention of mentions) {
        const mentionUserId = mention.userId.toString();
        if (mentionUserId !== req.user.id && !notifiedUsers.has(mentionUserId)) {
          const notification = await createNotification(
            mentionUserId,
            'mention',
            `${currentUser.username} mention bạn trong một reply${chapterLabel}`,
            notiData
          );
          notifiedUsers.add(mentionUserId);

          // Gửi qua Socket.io nếu user online
          if (userConnections[mentionUserId]) {
            io.to(`user_${mentionUserId}`).emit('notification', notification);
          }
        }
      }
    }

    // Populate lại để trả về dữ liệu đầy đủ
    let updatedComment = await Comment.findById(commentId)
      .populate('userId', 'username avatar role membershipPoints displayName');

    // Manually populate replies users
    if (updatedComment.replies && updatedComment.replies.length > 0) {
      const replyUserIds = updatedComment.replies.map(r => r.userId);
      const replyUsers = await User.find({ _id: { $in: replyUserIds } })
        .select('username avatar role membershipPoints displayName');
      const userMap = {};
      replyUsers.forEach(user => {
        userMap[user._id.toString()] = user;
      });
      updatedComment.replies.forEach(reply => {
        if (reply.userId && userMap[reply.userId.toString()]) {
          reply.userId = userMap[reply.userId.toString()];
        }
      });
    }

    res.status(201).json(updatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy user suggestions cho @mention
// Ưu tiên: (1) user đã comment trên truyện → (2) tác giả truyện → (3) tác giả truyện yêu thích → (4) tất cả user
exports.getUserSuggestions = async (req, res) => {
  try {
    const { query, storyId } = req.query;
    const currentUserId = req.user.id;

    // Build search filter cho tên
    const nameFilter = {};
    if (query && query.length > 0) {
      nameFilter.$or = [
        { username: { $regex: query, $options: 'i' } },
        { displayName: { $regex: query, $options: 'i' } }
      ];
    }

    // Thu thập các nhóm ưu tiên song song
    const [commentUserIds, story, favoriteStories] = await Promise.all([
      // Nhóm 1: User đã comment trên truyện này
      storyId ? Comment.find({ storyId }).distinct('userId') : [],
      // Nhóm 2: Tác giả truyện này
      storyId ? Story.findById(storyId).select('authorId') : null,
      // Nhóm 3: Truyện yêu thích của user hiện tại
      Favorite.find({ userId: currentUserId }).select('storyId').limit(50)
    ]);

    const storyAuthorId = story?.authorId?.toString();

    // Lấy tác giả các truyện yêu thích
    let favAuthorIds = [];
    if (favoriteStories.length > 0) {
      const favStoryIds = favoriteStories.map(f => f.storyId);
      const favStories = await Story.find({ _id: { $in: favStoryIds } }).select('authorId');
      favAuthorIds = favStories.map(s => s.authorId?.toString()).filter(Boolean);
    }

    // Tìm tất cả users match query (giới hạn 20)
    const allUsers = await User.find({
      _id: { $ne: currentUserId },
      ...nameFilter
    })
      .select('_id username displayName avatar')
      .limit(20);

    // Gán priority score cho mỗi user
    const commentSet = new Set(commentUserIds.map(id => id.toString()));
    const favAuthorSet = new Set(favAuthorIds);

    const scored = allUsers.map(u => {
      const uid = u._id.toString();
      let priority = 3; // mặc định: tất cả user khác
      if (commentSet.has(uid)) priority = 0; // ưu tiên cao nhất
      else if (uid === storyAuthorId) priority = 1;
      else if (favAuthorSet.has(uid)) priority = 2;
      return { user: u, priority };
    });

    // Sắp xếp theo priority rồi trả về tối đa 10
    scored.sort((a, b) => a.priority - b.priority);
    const result = scored.slice(0, 10).map(s => s.user);

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Like/Unlike reply
exports.toggleLikeReply = async (req, res) => {
  try {
    const { commentId, replyId } = req.params;
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Không tìm thấy bình luận' });
    }

    const reply = comment.replies.id(replyId);
    if (!reply) {
      return res.status(404).json({ message: 'Không tìm thấy reply' });
    }

    const userId = req.user.id;
    const hasLiked = reply.likedBy.includes(userId);

    if (hasLiked) {
      reply.likedBy = reply.likedBy.filter(id => id.toString() !== userId);
      reply.likes -= 1;
    } else {
      reply.likedBy.push(userId);
      reply.likes += 1;
    }

    await comment.save();

    res.json({ likes: reply.likes, hasLiked: !hasLiked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa reply
exports.deleteReply = async (req, res) => {
  try {
    const { commentId, replyId } = req.params;
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Không tìm thấy bình luận' });
    }

    const reply = comment.replies.id(replyId);
    if (!reply) {
      return res.status(404).json({ message: 'Không tìm thấy reply' });
    }

    // Kiểm tra quyền xóa
    if (reply.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Bạn không có quyền xóa reply này' });
    }

    reply.deleteOne();
    await comment.save();

    res.json({ message: 'Đã xóa reply' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = exports;
