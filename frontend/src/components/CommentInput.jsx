import React, { useState, useRef, useEffect } from 'react';
import { commentService } from '../services/commentService';
import { authService } from '../services/authService';
import { MedalIcon, calculateLevel, AdminVerifiedIcon } from '../utils/tierSystem';

const CommentInput = ({ storyId, chapterId, onCommentAdded, isReply = false, onCancel = null, onReplyAdded = null, commentId = null }) => {
  const [content, setContent] = useState('');
  const [mentions, setMentions] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef(null);
  const user = authService.getCurrentUser();

  const handleContentChange = async (e) => {
    const text = e.target.value;
    const cursorPos = e.target.selectionStart;
    
    setContent(text);
    setCursorPosition(cursorPos);

    // Tìm @mention
    const lastAtIndex = text.lastIndexOf('@', cursorPos);
    if (lastAtIndex !== -1 && lastAtIndex === cursorPos - 1) {
      setShowSuggestions(true);
      setSuggestions([]);
      setSelectedSuggestion(-1);
    } else if (lastAtIndex !== -1) {
      const query = text.substring(lastAtIndex + 1, cursorPos);
      if (query.length > 0 && /^[a-zA-Z0-9_-]*$/.test(query)) {
        try {
          const results = await commentService.getUserSuggestions(query, storyId);
          setSuggestions(results);
          setShowSuggestions(true);
          setSelectedSuggestion(-1);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const insertMention = (user) => {
    const lastAtIndex = content.lastIndexOf('@');
    const beforeMention = content.substring(0, lastAtIndex);
    const afterMention = content.substring(cursorPosition);
    const newContent = `${beforeMention}@${user.username} ${afterMention}`;
    
    setContent(newContent);
    setMentions([...mentions, { userId: user._id, username: user.username }]);
    setSuggestions([]);
    setShowSuggestions(false);
    
    // Set cursor position
    setTimeout(() => {
      if (textareaRef.current) {
        const newCursorPos = beforeMention.length + user.username.length + 2;
        textareaRef.current.selectionStart = newCursorPos;
        textareaRef.current.selectionEnd = newCursorPos;
        textareaRef.current.focus();
      }
    }, 0);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestion(prev =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestion(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedSuggestion >= 0) {
        insertMention(suggestions[selectedSuggestion]);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    setLoading(true);
    try {
      if (isReply) {
        const reply = await commentService.addReply(commentId, content.trim(), mentions);
        if (onReplyAdded) onReplyAdded(reply);
      } else {
        const comment = await commentService.createComment(storyId, chapterId, content.trim(), mentions);
        if (onCommentAdded) onCommentAdded(comment);
      }
      setContent('');
      setMentions([]);
      setSuggestions([]);
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Có lỗi xảy ra khi gửi bình luận');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-lg text-center">
        <p className="text-text-secondary-light dark:text-text-secondary-dark">
          Vui lòng đăng nhập để bình luận
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex gap-2">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold overflow-hidden shrink-0">
          {user.avatar ? (
            <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
          ) : (
            user.username.charAt(0).toUpperCase()
          )}
        </div>
        <div className="flex-1">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleContentChange}
              onKeyDown={handleKeyDown}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder={isReply ? 'Viết câu trả lời (@mention người khác)...' : 'Viết bình luận (@mention người khác)...'}
              className="w-full min-h-24 p-3 bg-secondary-light dark:bg-secondary-dark border border-gray-300 dark:border-white/10 rounded-lg text-text-light dark:text-white placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark focus:ring-2 focus:ring-primary focus:border-primary resize-none"
              disabled={loading}
            />
            
            {/* User suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#1e1c27] border border-gray-200 dark:border-white/10 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={suggestion._id}
                    type="button"
                    onClick={() => insertMention(suggestion)}
                    className={`w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-white/10 ${
                      idx === selectedSuggestion ? 'bg-primary/10 dark:bg-primary/20' : ''
                    }`}
                  >
                    <span className="text-sm text-text-light dark:text-white font-medium">
                      @{suggestion.username}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-3 justify-end">
            {isReply && onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 h-9 rounded-lg text-sm font-medium text-text-light dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                disabled={loading}
              >
                Hủy
              </button>
            )}
            <button
              type="submit"
              disabled={!content.trim() || loading}
              className="px-4 h-9 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Đang gửi...' : isReply ? 'Trả lời' : 'Bình luận'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CommentInput;
