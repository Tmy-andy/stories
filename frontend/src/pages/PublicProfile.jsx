import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MedalIcon, calculateLevel, AdminVerifiedIcon } from '../utils/tierSystem';
import api from '../services/api';
import { authService } from '../services/authService';

// ─── Sub-component: Tab Danh sách truyện ─────────────────────────────────────
function StoriesTab({ stories }) {
  if (stories.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600">auto_stories</span>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Chưa có truyện nào</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {stories.map((story) => (
        <Link
          key={story._id}
          to={`/story/${story.slug || story._id}`}
          className="group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
        >
          <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-700 overflow-hidden">
            {story.coverImage ? (
              <img
                src={story.coverImage}
                alt={story.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-gray-400 dark:text-gray-500">menu_book</span>
              </div>
            )}
          </div>
          <div className="p-2.5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary transition-colors">
              {story.title}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  );
}

// ─── Sub-component: Post item với expand comments ─────────────────────────────
function PostItem({ post, profileUserId, currentUserId, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadComments = useCallback(async () => {
    if (loadingComments) return;
    setLoadingComments(true);
    try {
      const res = await api.get(`/author-posts/${post._id}/comments`);
      setComments(res.data.comments || []);
    } catch { /* ignore */ }
    setLoadingComments(false);
  }, [post._id]);

  const toggleExpand = () => {
    const next = !expanded;
    setExpanded(next);
    if (next && comments.length === 0) loadComments();
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const res = await api.post(`/author-posts/${post._id}/comments`, { content: newComment });
      setComments(prev => [...prev, res.data]);
      setNewComment('');
    } catch { /* ignore */ }
    setSubmitting(false);
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/author-posts/${post._id}/comments/${commentId}`);
      setComments(prev => prev.filter(c => c._id !== commentId));
    } catch { /* ignore */ }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'Vừa xong';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} phút trước`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} giờ trước`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} ngày trước`;
    return new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const subtitleLabel = { thac_mac: 'Thắc mắc', giao_luu: 'Giao lưu' };
  const canDeletePost = currentUserId && (
    post.userId?._id === currentUserId ||
    post.userId === currentUserId ||
    profileUserId === currentUserId
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Post header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold overflow-hidden flex-shrink-0">
              {post.userId?.avatar ? (
                <img src={post.userId.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                (post.userId?.displayName || post.userId?.username || '?').charAt(0).toUpperCase()
              )}
            </div>
            <div className="min-w-0">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {post.userId?.displayName || post.userId?.username || 'Người dùng'}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">{getTimeAgo(post.createdAt)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {post.subtitle && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium">
                {subtitleLabel[post.subtitle] || post.subtitle}
              </span>
            )}
            {canDeletePost && (
              <button
                onClick={() => onDelete(post._id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
                title="Xóa bài"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
              </button>
            )}
          </div>
        </div>

        {post.title && (
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mt-2">{post.title}</h4>
        )}
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1.5 whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Comment toggle */}
      <div className="px-4 pb-3 border-t border-gray-100 dark:border-gray-700 pt-2">
        <button
          onClick={toggleExpand}
          className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-sm">chat_bubble_outline</span>
          {post.commentCount > 0 ? `${post.commentCount} bình luận` : 'Bình luận'}
          <span className="material-symbols-outlined text-xs">{expanded ? 'expand_less' : 'expand_more'}</span>
        </button>
      </div>

      {/* Comments section */}
      {expanded && (
        <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-4 py-3 space-y-3">
          {loadingComments ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {comments.map(comment => (
                <div key={comment._id} className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold overflow-hidden flex-shrink-0 mt-0.5">
                    {comment.userId?.avatar ? (
                      <img src={comment.userId.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      (comment.userId?.displayName || comment.userId?.username || '?').charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="bg-white dark:bg-gray-700 rounded-lg px-3 py-2">
                      <span className="text-xs font-semibold text-gray-900 dark:text-white">
                        {comment.userId?.displayName || comment.userId?.username}
                      </span>
                      <p className="text-xs text-gray-700 dark:text-gray-300 mt-0.5 whitespace-pre-wrap">{comment.content}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-1 px-1">
                      <span className="text-xs text-gray-400">{getTimeAgo(comment.createdAt)}</span>
                      {currentUserId && (comment.userId?._id === currentUserId || profileUserId === currentUserId) && (
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                        >Xóa</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {currentUserId && (
                <form onSubmit={handleComment} className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    placeholder="Viết bình luận..."
                    className="flex-1 text-xs px-3 py-2 rounded-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    type="submit"
                    disabled={submitting || !newComment.trim()}
                    className="px-3 py-2 bg-primary text-white rounded-full text-xs font-semibold disabled:opacity-50 hover:bg-primary/90 transition-colors"
                  >
                    Gửi
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Sub-component: Tab Thông báo ─────────────────────────────────────────────
function AnnouncementsTab({ profileUserId, currentUserId, isOwnProfile }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newContent, setNewContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/author-posts', { params: { profileUserId, type: 'announcement' } });
      setPosts(res.data.posts || []);
    } catch { /* ignore */ }
    setLoading(false);
  }, [profileUserId]);

  useEffect(() => { loadPosts(); }, [loadPosts]);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    setSubmitting(true);
    try {
      const res = await api.post('/author-posts', {
        profileUserId,
        type: 'announcement',
        content: newContent
      });
      setPosts(prev => [{ ...res.data, commentCount: 0 }, ...prev]);
      setNewContent('');
    } catch { /* ignore */ }
    setSubmitting(false);
  };

  const handleDelete = async (postId) => {
    try {
      await api.delete(`/author-posts/${postId}`);
      setPosts(prev => prev.filter(p => p._id !== postId));
    } catch { /* ignore */ }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div></div>;

  return (
    <div className="space-y-4">
      {isOwnProfile && (
        <form onSubmit={handlePost} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <textarea
            value={newContent}
            onChange={e => setNewContent(e.target.value)}
            placeholder="Đăng thông báo mới tới người theo dõi..."
            rows={3}
            className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={submitting || !newContent.trim()}
              className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold disabled:opacity-50 hover:bg-primary/90 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">send</span>
              Đăng thông báo
            </button>
          </div>
        </form>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600">campaign</span>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Chưa có thông báo nào</p>
        </div>
      ) : (
        posts.map(post => (
          <PostItem
            key={post._id}
            post={post}
            profileUserId={profileUserId}
            currentUserId={currentUserId}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
}

// ─── Sub-component: Tab Tin nhắn ──────────────────────────────────────────────
function MessageBoardTab({ profileUserId, currentUserId }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', subtitle: 'thac_mac', content: '' });
  const [submitting, setSubmitting] = useState(false);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/author-posts', { params: { profileUserId, type: 'message_board' } });
      setPosts(res.data.posts || []);
    } catch { /* ignore */ }
    setLoading(false);
  }, [profileUserId]);

  useEffect(() => { loadPosts(); }, [loadPosts]);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;
    setSubmitting(true);
    try {
      const res = await api.post('/author-posts', {
        profileUserId,
        type: 'message_board',
        title: form.title,
        subtitle: form.subtitle,
        content: form.content
      });
      setPosts(prev => [{ ...res.data, commentCount: 0 }, ...prev]);
      setForm({ title: '', subtitle: 'thac_mac', content: '' });
      setShowForm(false);
    } catch { /* ignore */ }
    setSubmitting(false);
  };

  const handleDelete = async (postId) => {
    try {
      await api.delete(`/author-posts/${postId}`);
      setPosts(prev => prev.filter(p => p._id !== postId));
    } catch { /* ignore */ }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div></div>;

  return (
    <div className="space-y-4">
      {/* Nút mở form đăng tin nhắn */}
      {currentUserId && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-sm hover:border-primary hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-sm">edit</span>
          Đặt câu hỏi hoặc giao lưu với tác giả...
        </button>
      )}

      {/* Form đăng tin nhắn */}
      {showForm && currentUserId && (
        <form onSubmit={handlePost} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Phân loại:</label>
            <div className="flex gap-2">
              {[
                { value: 'thac_mac', label: 'Thắc mắc' },
                { value: 'giao_luu', label: 'Giao lưu' }
              ].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, subtitle: opt.value }))}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    form.subtitle === opt.value
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <input
            type="text"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="Tiêu đề..."
            className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <textarea
            value={form.content}
            onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
            placeholder="Nội dung..."
            rows={4}
            className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting || !form.title.trim() || !form.content.trim()}
              className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold disabled:opacity-50 hover:bg-primary/90 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">send</span>
              Gửi
            </button>
          </div>
        </form>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600">forum</span>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Chưa có tin nhắn nào</p>
          {!currentUserId && (
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Đăng nhập để giao lưu với tác giả</p>
          )}
        </div>
      ) : (
        posts.map(post => (
          <PostItem
            key={post._id}
            post={post}
            profileUserId={profileUserId}
            currentUserId={currentUserId}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
}

// ─── Sub-component: Tab Bình luận gần đây ────────────────────────────────────
function CommentsTab({ comments }) {
  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'Vừa xong';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} phút trước`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} giờ trước`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} ngày trước`;
    return new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  if (comments.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600">chat_bubble_outline</span>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Chưa có bình luận nào</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <div key={comment._id} className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{comment.content}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span>{getTimeAgo(comment.createdAt)}</span>
            {comment.storyId && (
              <Link
                to={`/story/${comment.storyId.slug || comment.storyId._id}`}
                className="hover:text-primary transition-colors underline"
              >
                {comment.storyId.title}
              </Link>
            )}
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">favorite</span>
              {comment.likes || 0}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Sub-component: Tab Tác giả đang theo dõi ───────────────────────────────
function FollowingTab({ userId }) {
  const [follows, setFollows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/author-follows/user/${userId}`)
      .then(res => setFollows(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div></div>;

  if (follows.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600">person_search</span>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Chưa theo dõi tác giả nào</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {follows.map(follow => {
        const author = follow.authorId;
        if (!author) return null;
        const authorId = author._id || author;
        return (
          <Link
            key={follow._id}
            to={`/profile/${authorId}`}
            className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-primary/40 transition-all group"
          >
            <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold overflow-hidden">
              {author.avatar ? (
                <img src={author.avatar} alt={author.displayName || author.username} className="w-full h-full object-cover" />
              ) : (
                (author.displayName || author.username || '?').charAt(0).toUpperCase()
              )}
            </div>
            <div className="text-center min-w-0 w-full">
              <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1 group-hover:text-primary transition-colors">
                {author.displayName || author.username}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">@{author.username}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
function PublicProfile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [comments, setComments] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('stories');

  const currentUser = authService.getCurrentUser();
  const currentUserId = currentUser?.id || currentUser?._id;

  useEffect(() => {
    loadProfile();
  }, [userId]);

  useEffect(() => {
    if (currentUserId && userId && currentUserId !== userId) {
      api.get(`/author-follows/check/${userId}`)
        .then(r => setIsFollowing(r.data.isFollowing))
        .catch(() => {});
    }
  }, [userId, currentUserId]);

  // Khi profile load xong, chọn tab mặc định phù hợp
  useEffect(() => {
    if (profile) {
      setActiveTab(profile.isAuthor ? 'stories' : 'comments');
    }
  }, [profile?.isAuthor]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/auth/profile/${userId}`);
      setProfile(response.data.user);
      setComments(response.data.recentComments || []);
      setStories(response.data.authorStories || []);
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Không tìm thấy người dùng');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  };

  const handleToggleFollow = async () => {
    if (!currentUserId) {
      alert('Vui lòng đăng nhập để theo dõi tác giả');
      return;
    }
    setFollowLoading(true);
    try {
      if (isFollowing) {
        await api.delete(`/author-follows/${userId}`);
        setIsFollowing(false);
      } else {
        await api.post('/author-follows', { authorId: userId });
        setIsFollowing(true);
      }
    } catch (err) {
      console.error('Follow error:', err);
    } finally {
      setFollowLoading(false);
    }
  };

  const getLevelColor = (level) => {
    const colors = {
      'Đồng': 'text-orange-500',
      'Bạc': 'text-gray-400',
      'Vàng': 'text-yellow-500',
      'Kim Cương': 'text-blue-400'
    };
    return colors[level] || colors['Đồng'];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <span className="material-symbols-outlined text-5xl text-gray-400">person_off</span>
        <p className="text-gray-500 dark:text-gray-400">{error || 'Không tìm thấy người dùng'}</p>
        <Link to="/" className="text-primary hover:underline text-sm">Quay về trang chủ</Link>
      </div>
    );
  }

  const memberLevel = calculateLevel(profile.membershipPoints || 0);
  const isOwnProfile = currentUserId === userId;

  // Danh sách tab tùy thuộc loại profile
  const tabs = profile.isAuthor
    ? [
        { key: 'stories', label: 'Danh sách truyện', icon: 'auto_stories' },
        { key: 'announcements', label: 'Thông báo', icon: 'campaign' },
        { key: 'messages', label: 'Tin nhắn', icon: 'forum' },
        { key: 'comments', label: 'Bình luận', icon: 'chat_bubble_outline' },
        { key: 'following', label: 'Theo dõi', icon: 'person_check' }
      ]
    : [
        { key: 'comments', label: 'Bình luận gần đây', icon: 'chat_bubble_outline' },
        { key: 'following', label: 'Theo dõi', icon: 'person_check' }
      ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Profile Card */}
      <div className="relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Banner */}
        <div className="h-28 bg-gradient-to-r from-primary/80 to-primary/40"></div>

        {/* Follow button — góc trên-phải của vùng trắng */}
        {profile.isAuthor && currentUserId && currentUserId !== userId && (
          <div className="absolute top-[calc(7rem+1rem)] right-4">
            <button
              onClick={handleToggleFollow}
              disabled={followLoading}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold shadow transition-colors disabled:opacity-50 ${
                isFollowing
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 border border-gray-300 dark:border-gray-600'
                  : 'bg-primary text-white hover:bg-primary/90'
              }`}
            >
              <span className="material-symbols-outlined text-sm">
                {isFollowing ? 'person_check' : 'person_add'}
              </span>
              {followLoading ? '...' : isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
            </button>
          </div>
        )}

        {/* Avatar + Info */}
        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="-mt-14 mb-4">
            <div className="w-28 h-28 rounded-full bg-primary text-white flex items-center justify-center text-5xl font-bold overflow-hidden border-4 border-white dark:border-gray-800">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.displayName || profile.username} className="w-full h-full object-cover" />
              ) : (
                (profile.displayName || profile.username)?.charAt(0).toUpperCase()
              )}
            </div>
          </div>

          {/* Name + Role badge */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-1">
            <div className="flex items-center gap-2">
              {profile.role === 'admin' ? (
                <AdminVerifiedIcon size={20} />
              ) : profile.role === 'manager' ? (
                <MedalIcon level="Manager" size={20} />
              ) : (
                <MedalIcon level={memberLevel} size={20} />
              )}
              <h1 className={`text-2xl font-bold ${
                profile.role === 'admin' ? 'text-primary' : 'text-gray-900 dark:text-white'
              }`}>
                {profile.displayName || profile.username}
              </h1>
            </div>

            {profile.isAuthor ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                <span className="material-symbols-outlined text-sm">edit_note</span>
                Tác giả
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                <span className="material-symbols-outlined text-sm">menu_book</span>
                Người đọc
              </span>
            )}
          </div>

          {/* Username */}
          <div className="flex items-center mb-4">
            <p className="text-gray-500 dark:text-gray-400 text-sm">@{profile.username}</p>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 dark:text-gray-400">Tham gia</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(profile.createdAt)}</span>
            </div>

            {/* Ngày trở thành tác giả */}
            {profile.isAuthor && profile.authorApprovedAt && (
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 dark:text-gray-400">Tác giả từ</span>
                <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{formatDate(profile.authorApprovedAt)}</span>
              </div>
            )}

            {profile.role !== 'admin' && (
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 dark:text-gray-400">Cấp thành viên</span>
                <span className={`text-sm font-bold ${getLevelColor(profile.membershipLevel || memberLevel)}`}>
                  {profile.membershipLevel || memberLevel}
                </span>
              </div>
            )}

            {profile.role !== 'admin' && (
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 dark:text-gray-400">Điểm tích lũy</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {(profile.membershipPoints || 0).toLocaleString()}
                </span>
              </div>
            )}

            {profile.isAuthor && (
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 dark:text-gray-400">Truyện đã đăng</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{stories.length}</span>
              </div>
            )}

            <div className="flex flex-col">
              <span className="text-xs text-gray-500 dark:text-gray-400">Bình luận</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{profile.commentCount || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6">
        {/* Tab bar */}
        {tabs.length > 1 && (
          <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                <span className="material-symbols-outlined text-sm">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Tab content */}
        {activeTab === 'stories' && <StoriesTab stories={stories} />}
        {activeTab === 'announcements' && (
          <AnnouncementsTab
            profileUserId={userId}
            currentUserId={currentUserId}
            isOwnProfile={isOwnProfile}
          />
        )}
        {activeTab === 'messages' && (
          <MessageBoardTab
            profileUserId={userId}
            currentUserId={currentUserId}
          />
        )}
        {activeTab === 'comments' && <CommentsTab comments={comments} />}
        {activeTab === 'following' && <FollowingTab userId={userId} />}
      </div>
    </div>
  );
}

export default PublicProfile;
