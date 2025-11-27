const Comment = require('../models/Comment');
const User = require('../models/User');
const { createNotification } = require('./notificationController');

// Tạo comment mới
exports.createComment = async (req, res) => {
  try {
    const { storyId, chapterId, content } = req.body;
    const io = req.app.locals.io;
    const userConnections = req.app.locals.userConnections;
    
    const comment = new Comment({
      userId: req.user.id,
      storyId,
      chapterId: chapterId || null,
      content
    });

    await comment.save();

    // Tăng số lượng comment và thêm điểm (10 điểm mỗi comment)
    const user = await User.findById(req.user.id);
    user.commentCount += 1;
    await user.addPoints(10);

    const populatedComment = await Comment.findById(comment._id)
      .populate('userId', 'username avatar role membershipPoints displayName')
      .populate('storyId', 'title authorId');

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
          `${user.username} vừa bình luận trên truyện "${populatedComment.storyId.title}"`,
          { storyId, commentId: comment._id, triggeredBy: req.user.id }
        );

        // Gửi qua Socket.io nếu user online
        if (userConnections[storyAuthorId]) {
          io.to(`user_${storyAuthorId}`).emit('notification', notification);
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
  
  // Collect all unique user IDs from comments and replies
  comments.forEach(comment => {
    if (comment.userId && comment.userId._id) {
      userIds.add(comment.userId._id.toString());
    }
    if (comment.replies && comment.replies.length > 0) {
      comment.replies.forEach(reply => {
        if (reply.userId) {
          userIds.add(reply.userId.toString());
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
    if (comment.replies && comment.replies.length > 0) {
      comment.replies.forEach(reply => {
        if (reply.userId && userMap[reply.userId.toString()]) {
          reply.userId = userMap[reply.userId.toString()];
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
    const { content, mentions } = req.body;
    const io = req.app.locals.io;
    const userConnections = req.app.locals.userConnections;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Không tìm thấy bình luận' });
    }

    const reply = {
      userId: req.user.id,
      content,
      mentions: mentions || []
    };

    comment.replies.push(reply);
    await comment.save();

    // Gửi thông báo cho người tạo comment gốc
    const origCommentUser = await User.findById(comment.userId);
    const currentUser = await User.findById(req.user.id);

    if (origCommentUser && origCommentUser._id.toString() !== req.user.id) {
      const notification = await createNotification(
        comment.userId.toString(),
        'reply',
        `${currentUser.username} trả lời bình luận của bạn`,
        { storyId: comment.storyId, commentId: comment._id, triggeredBy: req.user.id }
      );

      // Gửi qua Socket.io nếu user online
      if (userConnections[comment.userId.toString()]) {
        io.to(`user_${comment.userId.toString()}`).emit('notification', notification);
      }
    }

    // Gửi thông báo cho những người được mention
    if (mentions && mentions.length > 0) {
      for (const mention of mentions) {
        if (mention.userId !== req.user.id) {
          const notification = await createNotification(
            mention.userId.toString(),
            'mention',
            `${currentUser.username} mention bạn trong một reply`,
            { storyId: comment.storyId, commentId: comment._id, triggeredBy: req.user.id }
          );

          // Gửi qua Socket.io nếu user online
          if (userConnections[mention.userId.toString()]) {
            io.to(`user_${mention.userId.toString()}`).emit('notification', notification);
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
exports.getUserSuggestions = async (req, res) => {
  try {
    const { query, storyId } = req.query;

    if (!query || query.length < 1) {
      return res.json([]);
    }

    // Lấy danh sách user đã comment trên truyện này
    const comments = await Comment.find({ storyId })
      .distinct('userId')
      .limit(20);

    const users = await User.find({
      _id: { $in: comments },
      username: { $regex: query, $options: 'i' }
    })
    .select('_id username')
    .limit(10);

    res.json(users);
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
