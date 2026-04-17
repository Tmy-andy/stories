import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

/**
 * 3-dot dropdown menu for comments/replies
 * Props:
 *   commentId       — ID bình luận gốc
 *   replyId         — ID reply (nếu là reply)
 *   canDelete       — bool: hiện nút Xóa không
 *   onDelete        — callback khi xóa
 *   onReport        — callback khi bấm báo cáo (mở modal)
 */
const CommentMenu = ({ commentId, replyId, canDelete, onDelete, onReport }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleCopyLink = () => {
    const targetId = replyId || commentId;
    const url = `${window.location.origin}${window.location.pathname}#comment-${targetId}`;
    navigator.clipboard.writeText(url).then(() => {
      alert('Đã sao chép liên kết bình luận');
    });
    setOpen(false);
  };

  const handleReport = () => {
    setOpen(false);
    if (onReport) onReport();
  };

  const handleDelete = () => {
    setOpen(false);
    if (onDelete) onDelete();
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(prev => !prev)}
        className="flex items-center justify-center w-7 h-7 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        title="Tùy chọn"
      >
        <span className="material-symbols-outlined text-base">more_horiz</span>
      </button>

      {open && (
        <div className="absolute right-0 bottom-8 z-50 min-w-[200px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden">
          {/* Báo cáo */}
          <button
            onClick={handleReport}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
          >
            <span className="material-symbols-outlined text-base text-gray-500">flag</span>
            Báo cáo Bình luận
          </button>

          {/* Copy link */}
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
          >
            <span className="material-symbols-outlined text-base text-gray-500">link</span>
            Liên kết đến Bình luận
          </button>

          {/* Quy tắc ứng xử */}
          <Link
            to="/community-rules"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="material-symbols-outlined text-base text-gray-500">gavel</span>
            Quy tắc Ứng xử
          </Link>

          {/* Xóa — chỉ hiện nếu có quyền */}
          {canDelete && (
            <>
              <div className="border-t border-gray-100 dark:border-gray-700" />
              <button
                onClick={handleDelete}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
              >
                <span className="material-symbols-outlined text-base">delete</span>
                Xóa Bình luận
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentMenu;
