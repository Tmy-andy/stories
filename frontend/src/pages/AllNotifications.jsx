import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationService } from '../services/notificationService';
import { authService } from '../services/authService';

const AllNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  // Load notifications
  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await notificationService.getNotifications();
      setNotifications(Array.isArray(response) ? response : (response.data || []));
    } catch (err) {
      console.error('Error loading notifications:', err);
      setError('Không thể tải thông báo');
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-700 dark:text-white">Bạn cần đăng nhập để xem thông báo</p>
      </div>
    );
  }

  // Handle notification click - navigate to relevant page
  const handleNotificationClick = async (notification) => {
    // Mark as read first
    try {
      if (!notification.read) {
        await notificationService.markAsRead(notification._id);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }

    // Get the actual ID whether it's an object or string
    const storyId = notification.storyId?._id || notification.storyId;
    const commentId = notification.commentId?._id || notification.commentId;

    // Navigate based on notification type
    if (notification.type === 'new_chapter' && storyId) {
      navigate(`/story/${storyId}`);
    } else if ((notification.type === 'mention' || notification.type === 'reply' || notification.type === 'comment') && commentId && storyId) {
      navigate(`/story/${storyId}?comment=${commentId}`);
    } else if (storyId) {
      navigate(`/story/${storyId}`);
    }
  };

  // Handle mark as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Handle delete notification
  const handleDeleteNotification = async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(notifications.filter(n => n._id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-[#191C2A] shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="text-2xl font-bold text-primary">Lam điệp cô ảnh</div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/notifications')}
              className="text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-white transition-colors"
              title="Thông báo"
            >
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="bg-center bg-no-repeat bg-cover rounded-full size-10"
            >
              {user?.avatar && (
                <img 
                  src={user.avatar} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover"
                />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Page Title & Back Button */}
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
              Tất cả thông báo
            </h1>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 shadow-sm transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <span className="material-symbols-outlined !text-xl -ml-1">arrow_back</span>
              Quay lại
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="flex flex-col items-center justify-center rounded-xl bg-white dark:bg-[#191C2A] py-16 text-center shadow-sm sm:py-24">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-slate-600 dark:text-slate-400">Đang tải thông báo...</p>
            </div>
          )}

          {/* Empty state */}
          {!loading && notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-xl bg-white dark:bg-[#191C2A] py-16 text-center shadow-sm sm:py-24">
              <div className="text-slate-400 dark:text-slate-500">
                <svg
                  className="h-20 w-20 mx-auto"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
                  <path d="M18.5 3.5 3.5 18.5"></path>
                </svg>
              </div>
              <h2 className="mt-4 text-xl font-semibold text-slate-800 dark:text-slate-100">
                Không có thông báo nào
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Khi có cập nhật mới, chúng sẽ xuất hiện ở đây.
              </p>
            </div>
          )}

          {/* Notifications list */}
          {!loading && notifications.length > 0 && (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    notification.read
                      ? 'bg-white dark:bg-[#191C2A] border-slate-200 dark:border-slate-700 hover:shadow-md'
                      : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 hover:shadow-md'
                  }`}
                >
                  <div className="flex gap-4 items-start">
                    {/* Notification icon */}
                    <div className="flex-shrink-0 pt-1">
                      {notification.type === 'new_chapter' && (
                        <span className="material-symbols-outlined text-primary">auto_stories</span>
                      )}
                      {(notification.type === 'mention' || notification.type === 'reply') && (
                        <span className="material-symbols-outlined text-primary">reply</span>
                      )}
                      {notification.type === 'like' && (
                        <span className="material-symbols-outlined text-red-500">favorite</span>
                      )}
                      {notification.type === 'comment' && (
                        <span className="material-symbols-outlined text-primary">comment</span>
                      )}
                      {!['new_chapter', 'mention', 'reply', 'like', 'comment'].includes(notification.type) && (
                        <span className="material-symbols-outlined text-primary">notifications</span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {notification.message}
                          </p>
                          {notification.storyId && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              <span className="font-medium">Truyện:</span> {notification.storyId.title}
                            </p>
                          )}
                        </div>
                        {!notification.read && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 whitespace-nowrap flex-shrink-0">
                            Chưa đọc
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(notification.createdAt).toLocaleDateString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNotificationClick(notification);
                        }}
                        className="inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-lg bg-primary text-white px-3 py-1.5 text-xs font-medium transition-colors hover:bg-primary/90"
                      >
                        <span className="material-symbols-outlined !text-sm">open_in_new</span>
                        Xem
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNotification(notification._id);
                        }}
                        className="inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-slate-300 dark:hover:bg-slate-600"
                      >
                        <span className="material-symbols-outlined !text-sm">close</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#191C2A] shadow-[0_-1px_3px_rgba(0,0,0,0.1)]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              © 2024 Lam điệp cô ảnh. Bảo lưu mọi quyền.
            </p>
            <div className="flex gap-6">
              <a
                href="#"
                className="text-sm text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                Điều khoản
              </a>
              <a
                href="#"
                className="text-sm text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                Riêng tư
              </a>
              <a
                href="#"
                className="text-sm text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                Liên hệ
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AllNotifications;
