import React, { useState, useEffect } from 'react';
import { commentService } from '../services/commentService';
import { authService } from '../services/authService';
import { MedalIcon, calculateLevel, AdminVerifiedIcon } from '../utils/tierSystem';
import UserTooltip from './UserTooltip';
import CommentInput from './CommentInput';
import ReplyList from './ReplyList';

const CommentSection = ({ storyId, chapterId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    loadComments();
  }, [storyId, chapterId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      setError('');
      const data = chapterId 
        ? await commentService.getCommentsByChapter(storyId, chapterId)
        : await commentService.getCommentsByStory(storyId);
      setComments(data);
    } catch (err) {
      console.error('Error loading comments:', err);
      setError('Không thể tải bình luận');
    } finally {
      setLoading(false);
    }
  };

  const handleCommentAdded = (newComment) => {
    setComments([newComment, ...comments]);
  };

  const handleLikeComment = async (commentId) => {
    if (!currentUser) {
      alert('Vui lòng đăng nhập để thích bình luận');
      return;
    }

    try {
      const result = await commentService.toggleLikeComment(commentId);
      setComments(comments.map(comment =>
        comment._id === commentId
          ? { ...comment, likes: result.likes }
          : comment
      ));
    } catch (err) {
      console.error('Error liking comment:', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa bình luận này?')) {
      return;
    }

    try {
      await commentService.deleteComment(commentId);
      setComments(comments.filter(comment => comment._id !== commentId));
    } catch (err) {
      console.error('Error deleting comment:', err);
      alert('Không thể xóa bình luận');
    }
  };

  const canDeleteComment = (comment) => {
    if (!currentUser) return false;
    return comment.userId?._id === currentUser.id || currentUser.role === 'admin';
  };

  return (
    <div className="space-y-6">
      {/* Comments Header */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-text-light dark:text-white">
          Bình luận ({comments.length})
        </h2>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Comment Input Form */}
      <div className="bg-background-light dark:bg-background-dark rounded-lg p-4 border border-gray-200 dark:border-gray-600">
        <CommentInput storyId={storyId} chapterId={chapterId} onCommentAdded={handleCommentAdded} />
      </div>

      {/* Comments List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-muted-light dark:text-text-muted-dark">Chưa có bình luận nào. Hãy là người bình luận đầu tiên!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment._id} id={`comment-${comment._id}`} className="bg-background-light dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-sm transition-shadow scroll-m-20">
              <div className="flex gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {comment.userId?.avatar ? (
                    <img src={comment.userId.avatar} alt={comment.userId.displayName || comment.userId.username} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-700 dark:text-gray-300 font-bold">
                      {(comment.userId?.displayName || comment.userId?.username)?.[0]?.toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Comment Content */}
                <div className="flex-1 min-w-0">
                  {/* User Info */}
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <div className="flex items-center gap-1">
                      {comment.userId?.role === 'admin' ? (
                        <AdminVerifiedIcon size={16} />
                      ) : comment.userId?.role === 'manager' ? (
                        <MedalIcon level="Manager" size={16} />
                      ) : (
                        <MedalIcon level={calculateLevel(comment.userId?.membershipPoints || 0)} size={16} />
                      )}
                    </div>
                    <UserTooltip profile={comment.userId} placement="right">
                      <p className={`text-sm font-semibold ${
                        comment.userId?.role === 'admin' 
                          ? 'text-primary' 
                          : 'text-text-light dark:text-white'
                      }`}>
                        {comment.userId?.displayName || comment.userId?.username}
                      </p>
                    </UserTooltip>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(comment.createdAt).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  {/* Comment Text */}
                  <p className="text-sm text-text-light dark:text-gray-200 break-words whitespace-pre-wrap">
                    {comment.content}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-4 mt-3">
                    <button
                      onClick={() => handleLikeComment(comment._id)}
                      className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">favorite_border</span>
                      <span>{comment.likes || 0}</span>
                    </button>

                    {currentUser && (
                      <button
                        onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                        className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
                      >
                        <span className="material-symbols-outlined text-base">reply</span>
                        <span>Trả lời</span>
                      </button>
                    )}

                    {canDeleteComment(comment) && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                        <span>Xóa</span>
                      </button>
                    )}
                  </div>

                  {/* Reply Form */}
                  {replyingTo === comment._id && (
                    <div className="mt-4">
                      <CommentInput
                        storyId={storyId}
                        commentId={comment._id}
                        isReply={true}
                        onCancel={() => setReplyingTo(null)}
                        onReplyAdded={(updatedComment) => {
                          setComments(comments.map(c =>
                            c._id === comment._id ? updatedComment : c
                          ));
                          setReplyingTo(null);
                        }}
                      />
                    </div>
                  )}

                  {/* Replies List */}
                  {comment.replies && comment.replies.length > 0 && (
                    <ReplyList
                      commentId={comment._id}
                      replies={comment.replies}
                      onReplyAdded={(updatedComment) => {
                        setComments(comments.map(c =>
                          c._id === comment._id ? updatedComment : c
                        ));
                      }}
                      onReplyDeleted={(replyId) => {
                        setComments(comments.map(c =>
                          c._id === comment._id
                            ? {
                              ...c,
                              replies: c.replies.filter(r => r._id !== replyId)
                            }
                            : c
                        ));
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
