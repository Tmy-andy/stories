import React, { useState } from 'react';
import { commentService } from '../services/commentService';
import { authService } from '../services/authService';
import { MedalIcon, calculateLevel, AdminVerifiedIcon } from '../utils/tierSystem';
import UserTooltip from './UserTooltip';
import CommentInput from './CommentInput';

const ReplyList = ({ commentId, replies, onReplyAdded, onReplyDeleted }) => {
  const [expandedReplies, setExpandedReplies] = useState({});
  const [showReplyForm, setShowReplyForm] = useState({});
  const user = authService.getCurrentUser();

  const handleToggleReply = (replyId) => {
    setExpandedReplies(prev => ({
      ...prev,
      [replyId]: !prev[replyId]
    }));
  };

  const toggleReplyForm = (replyId) => {
    setShowReplyForm(prev => ({
      ...prev,
      [replyId]: !prev[replyId]
    }));
  };

  const handleDeleteReply = async (replyId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa reply này?')) return;

    try {
      await commentService.deleteReply(commentId, replyId);
      if (onReplyDeleted) onReplyDeleted(replyId);
    } catch (error) {
      console.error('Error deleting reply:', error);
      alert('Không thể xóa reply');
    }
  };

  if (!replies || replies.length === 0) {
    return null;
  }

  return (
    <div className="ml-8 mt-4 border-l border-gray-200 dark:border-white/10 pl-4">
      {replies.map((reply) => (
        <div key={reply._id} id={`comment-${reply._id}`} className="mb-4 scroll-m-20">
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold overflow-hidden shrink-0">
              {reply.userId?.avatar ? (
                <img src={reply.userId.avatar} alt={reply.userId?.displayName || reply.userId?.username} className="w-full h-full object-cover" />
              ) : (
                (reply.userId?.displayName || reply.userId?.username)?.charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <div className="flex items-center gap-1">
                  {reply.userId?.role === 'admin' ? (
                    <AdminVerifiedIcon size={14} />
                  ) : (
                    <MedalIcon level={calculateLevel(reply.userId?.membershipPoints || 0)} size={14} role={reply.userId?.role} />
                  )}
                </div>
                {reply.userId && typeof reply.userId === 'object' && reply.userId._id ? (
                  <UserTooltip profile={reply.userId} placement="right">
                    <span className={`text-sm font-semibold ${
                      reply.userId?.role === 'admin' 
                        ? 'text-primary' 
                        : 'text-text-light dark:text-white'
                    }`}>
                      {reply.userId?.displayName || reply.userId?.username || 'Người dùng'}
                    </span>
                  </UserTooltip>
                ) : (
                  <span className="text-sm font-semibold text-text-light dark:text-white">
                    Người dùng (Dữ liệu không đầy đủ)
                  </span>
                )}
                <span className="text-xs text-text-muted-light dark:text-text-muted-dark">
                  {new Date(reply.createdAt).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              <p className="text-sm text-text-light dark:text-white mb-2">{reply.content}</p>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleToggleReply(reply._id)}
                  className="flex items-center gap-1 text-xs text-text-muted-light dark:text-text-muted-dark hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-base">favorite</span>
                  <span>{reply.likes || 0}</span>
                </button>

                {user && (
                  <>
                    <button
                      onClick={() => toggleReplyForm(reply._id)}
                      className="text-xs text-text-muted-light dark:text-text-muted-dark hover:text-primary transition-colors"
                    >
                      Trả lời
                    </button>

                    {(user._id === reply.userId?._id || user.role === 'admin') && (
                      <button
                        onClick={() => handleDeleteReply(reply._id)}
                        className="text-xs text-red-500 hover:text-red-600 transition-colors"
                      >
                        Xóa
                      </button>
                    )}
                  </>
                )}
              </div>

              {showReplyForm[reply._id] && (
                <div className="mt-3">
                  <CommentInput
                    storyId={null}
                    commentId={commentId}
                    isReply={true}
                    onCancel={() => toggleReplyForm(reply._id)}
                    onReplyAdded={(updatedComment) => {
                      if (onReplyAdded) onReplyAdded(updatedComment);
                      toggleReplyForm(reply._id);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReplyList;
