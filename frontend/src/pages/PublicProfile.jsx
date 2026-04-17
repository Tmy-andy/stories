import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MedalIcon, calculateLevel, AdminVerifiedIcon } from '../utils/tierSystem';
import api from '../services/api';

function PublicProfile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [comments, setComments] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProfile();
  }, [userId]);

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

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'Vừa xong';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} phút trước`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} giờ trước`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} ngày trước`;
    return formatDate(date);
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

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Banner */}
        <div className="h-28 bg-gradient-to-r from-primary/80 to-primary/40"></div>

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

            {/* Trạng thái: Tác giả hay Người đọc */}
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

          {/* Username / ID */}
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
            @{profile.username}
          </p>

          {/* Info grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Ngày tham gia */}
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 dark:text-gray-400">Tham gia</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(profile.createdAt)}</span>
            </div>

            {/* Cấp thành viên */}
            {profile.role !== 'admin' && (
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 dark:text-gray-400">Cấp thành viên</span>
                <span className={`text-sm font-bold ${getLevelColor(profile.membershipLevel || memberLevel)}`}>
                  {profile.membershipLevel || memberLevel}
                </span>
              </div>
            )}

            {/* Điểm */}
            {profile.role !== 'admin' && (
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 dark:text-gray-400">Điểm tích lũy</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {(profile.membershipPoints || 0).toLocaleString()}
                </span>
              </div>
            )}

            {/* Truyện đã đăng (chỉ tác giả) */}
            {profile.isAuthor && (
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 dark:text-gray-400">Truyện đã đăng</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{stories.length}</span>
              </div>
            )}

            {/* Bình luận */}
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 dark:text-gray-400">Bình luận</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{profile.commentCount || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Author Stories */}
      {profile.isAuthor && stories.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Danh sách truyện của {profile.displayName || profile.username}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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
        </div>
      )}

      {/* Recent Comments */}
      <div className="mt-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Bình luận gần đây</h2>
        {comments.length > 0 ? (
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
        ) : (
          <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <span className="material-symbols-outlined text-4xl text-gray-400 dark:text-gray-500">forum</span>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Chưa có bình luận nào</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PublicProfile;
