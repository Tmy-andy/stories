import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { MedalIcon, calculateLevel, AdminVerifiedIcon } from '../utils/tierSystem';
import UserTooltip from '../components/UserTooltip';
import ReadingHistory from '../components/ReadingHistory';
import ProfileReadingHistory from '../components/ProfileReadingHistory';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

function Profile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [comments, setComments] = useState([]);
  const [activeTab, setActiveTab] = useState('comments');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    loadProfile();
  }, [navigate]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const token = authService.getToken();
      const response = await axios.get(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data.user);
      setComments(response.data.recentComments);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMembershipLevelColor = (level) => {
    const colors = {
      'Đồng': 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300',
      'Bạc': 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
      'Vàng': 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300',
      'Kim Cương': 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
    };
    return colors[level] || colors['Đồng'];
  };

  const getNextLevelPoints = (level) => {
    const levels = { 'Đồng': 500, 'Bạc': 2000, 'Vàng': 5000, 'Kim Cương': 0 };
    return levels[level] || 0;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-text-secondary-light dark:text-text-secondary-dark">Đang tải...</p>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="max-w-4xl mx-auto">
      {/* User Info Section */}
      <div className="flex flex-col p-4 border-b border-gray-200 dark:border-white/10">
        <div className="flex w-full flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <div className="flex gap-4">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-primary text-white flex items-center justify-center text-4xl font-bold overflow-hidden">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.displayName || profile.username} className="w-full h-full object-cover" />
              ) : (
                (profile.displayName || profile.username)?.charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <UserTooltip profile={profile} placement="bottom">
                  {profile.role === 'admin' ? (
                    <>
                      <AdminVerifiedIcon size={18} />
                      <p className="text-primary text-[22px] font-bold leading-tight tracking-[-0.015em]">
                        {profile.displayName || profile.username}
                      </p>
                    </>
                  ) : profile.role === 'manager' ? (
                    <>
                      <MedalIcon level="Manager" size={18} />
                      <p className="text-gray-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">
                        {profile.displayName || profile.username}
                      </p>
                    </>
                  ) : (
                    <>
                      <MedalIcon level={calculateLevel(profile.membershipPoints || 0)} size={18} />
                      <p className="text-gray-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">
                        {profile.displayName || profile.username}
                      </p>
                    </>
                  )}
                </UserTooltip>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">
                @{profile.username.toLowerCase().replace(/\s+/g, '')}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">
                Đã tham gia: {formatDate(profile.createdAt)}
              </p>
            </div>
          </div>
          <Link
            to="/user-profile"
            className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors"
          >
            <span className="truncate">Chỉnh sửa hồ sơ</span>
          </Link>
        </div>

        {/* Membership Card */}
        {profile.role !== 'admin' && (
        <div className="mt-6 rounded-lg bg-primary/10 dark:bg-primary/20 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
                <span className="material-symbols-outlined text-3xl">workspace_premium</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Thành viên {profile.membershipLevel}
                </h3>
                <p className="text-sm text-primary dark:text-gray-300">
                  Cấp độ thành viên của bạn
                </p>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-2xl font-bold text-primary dark:text-white">
                {profile.membershipPoints.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Điểm tích lũy</p>
            </div>
          </div>
          {profile.membershipLevel !== 'Kim Cương' && (
            <div className="mt-4">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Cần thêm {(getNextLevelPoints(profile.membershipLevel) - profile.membershipPoints).toLocaleString()} điểm để đạt cấp độ tiếp theo. 
                Đọc truyện để tích lũy thêm điểm nhé!
              </p>
            </div>
          )}
          <div className="mt-3 flex gap-6 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Đã đọc: </span>
              <span className="font-bold text-gray-900 dark:text-white">{profile.readCount} chương</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Bình luận: </span>
              <span className="font-bold text-gray-900 dark:text-white">{profile.commentCount}</span>
            </div>
          </div>
        </div>
        )}
      </div>

      {/* Tabs */}
      <div className="pb-3 pt-4">
        <div className="flex border-b border-gray-200 dark:border-white/10 px-4 gap-8">
          <button
            onClick={() => setActiveTab('comments')}
            className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${
              activeTab === 'comments'
                ? 'border-b-primary text-primary'
                : 'border-b-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            } transition-colors`}
          >
            <p className="text-sm font-bold leading-normal tracking-[0.015em]">
              Bình luận gần đây
            </p>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${
              activeTab === 'history'
                ? 'border-b-primary text-primary'
                : 'border-b-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            } transition-colors`}
          >
            <p className="text-sm font-bold leading-normal tracking-[0.015em]">
              Lịch sử đọc
            </p>
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${
              activeTab === 'favorites'
                ? 'border-b-primary text-primary'
                : 'border-b-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            } transition-colors`}
          >
            <p className="text-sm font-bold leading-normal tracking-[0.015em]">
              Truyện yêu thích
            </p>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex flex-col divide-y divide-gray-200 dark:divide-white/10">
        {activeTab === 'comments' && (
          <>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment._id} className="py-4">
                  <div className="flex w-full flex-row items-start justify-start gap-3 p-4">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0">
                      {(profile.displayName || profile.username)?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex h-full flex-1 flex-col items-start justify-start">
                      <div className="flex w-full flex-row items-center justify-start gap-x-2 flex-wrap">
                        <div className="flex items-center gap-1">
                          {profile.role === 'admin' ? (
                            <AdminVerifiedIcon size={16} />
                          ) : profile.role === 'manager' ? (
                            <MedalIcon level="Manager" size={16} />
                          ) : (
                            <MedalIcon level={calculateLevel(profile.membershipPoints || 0)} size={16} />
                          )}
                        </div>
                        <UserTooltip profile={profile} placement="right">
                          <p className={`text-sm font-bold leading-normal tracking-[0.015em] ${
                            profile.role === 'admin' 
                              ? 'text-primary' 
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {profile.displayName || profile.username}
                          </p>
                        </UserTooltip>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">
                          {getTimeAgo(comment.createdAt)}
                        </p>
                      </div>
                      <p className="text-gray-800 dark:text-gray-300 text-sm font-normal leading-normal mt-1">
                        {comment.content}
                      </p>
                      <Link
                        to={`/story/${comment.storyId._id}`}
                        className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal pt-2 px-0 underline hover:text-primary transition-colors"
                      >
                        trong truyện '{comment.storyId.title}'
                      </Link>
                      <div className="flex w-full flex-row items-center justify-start gap-9 pt-2">
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                          <span className="material-symbols-outlined text-base">thumb_up</span>
                          <p className="text-sm font-normal leading-normal">{comment.likes}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-10 bg-white dark:bg-background-dark rounded-lg mt-4">
                <span className="material-symbols-outlined text-5xl text-gray-400 dark:text-gray-500 mb-4">
                  forum
                </span>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                  Chưa có bình luận nào
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Hãy bắt đầu chia sẻ cảm nhận của bạn về những câu chuyện nhé!
                </p>
                <Link
                  to="/stories"
                  className="mt-4 flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors"
                >
                  <span className="truncate">Khám phá truyện mới</span>
                </Link>
              </div>
            )}
          </>
        )}

        {activeTab === 'history' && (
          <ProfileReadingHistory />
        )}

        {activeTab === 'favorites' && (
          <>
            {profile.favorites && profile.favorites.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
                {profile.favorites.map((story) => (
                  <Link
                    key={story._id}
                    to={`/story/${story._id}`}
                    className="flex flex-col gap-2 hover:opacity-80 transition-opacity"
                  >
                    <img
                      src={story.coverImage || 'https://via.placeholder.com/150x200'}
                      alt={story.title}
                      className="w-full aspect-[3/4] object-cover rounded-lg"
                    />
                    <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                      {story.title}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-10 bg-white dark:bg-background-dark rounded-lg mt-4">
                <span className="material-symbols-outlined text-5xl text-gray-400 dark:text-gray-500 mb-4">
                  favorite_border
                </span>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                  Chưa có truyện yêu thích
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Thêm truyện yêu thích để dễ dàng theo dõi!
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;
