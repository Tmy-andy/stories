import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { notificationService } from '../services/notificationService';
import { authService } from '../services/authService';
import { contactService } from '../services/contactService';
import ContactModal from './ContactModal';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [contactData, setContactData] = useState(null);
  const dropdownRef = useRef(null);
  const socketRef = useRef(null);
  const hasLoadedRef = useRef(false);
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  // Load notifications
  const loadNotifications = useCallback(async () => {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading notifications:', error);
      setNotifications([]);
    }
  }, []);

  // Load notifications when dropdown opens
  const handleDropdownClick = useCallback(() => {
    setShowDropdown(prev => {
      const newState = !prev;
      if (newState) {
        loadNotifications();
      }
      return newState;
    });
  }, [loadNotifications]);

  // Load unread count
  const loadUnreadCount = useCallback(async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count || 0);
    } catch (error) {
      console.error('Error loading unread count:', error);
      setUnreadCount(0);
    }
  }, []);

  // Initialize Socket.io connection
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!user) return;

    // Skip if manager is logged in (manager has different auth system)
    const managerToken = localStorage.getItem('managerToken');
    if (managerToken) {
      return;
    }

    // Skip if on manager page (manager has different auth system)
    if (window.location.pathname.startsWith('/manager')) {
      return;
    }

    // Prevent multiple connections
    if (socketRef.current) {
      return;
    }

    try {
      const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5001', {
        auth: {
          token: authService.getToken()
        },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5
      });

      newSocket.on('connect', () => {
        newSocket.emit('join', user._id);
        
        // Only load on first connection
        if (!hasLoadedRef.current) {
          hasLoadedRef.current = true;
          loadNotifications();
          loadUnreadCount();
        }
      });

      newSocket.on('notification', (notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
      });

      newSocket.on('disconnect', () => {});

      socketRef.current = newSocket;

      return () => {
        newSocket.disconnect();
        socketRef.current = null;
      };
    } catch (error) {
      console.error('Error initializing socket:', error);
    }
  }, [user]);

  // Load notifications on component mount (in case Socket already connected)
  useEffect(() => {
    if (user && !hasLoadedRef.current) {
      hasLoadedRef.current = true;
      loadNotifications();
      loadUnreadCount();
    }
  }, [user, loadNotifications, loadUnreadCount]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ...existing code...

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(notifications.map(n =>
        n._id === notificationId ? { ...n, read: true } : n
      ));
      
      // Auto-delete after 2 seconds
      setTimeout(() => {
        handleDeleteNotification(notificationId);
      }, 2000);
      
      loadUnreadCount();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      
      // Auto-delete all after 2 seconds
      setTimeout(() => {
        setNotifications([]);
      }, 2000);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(notifications.filter(n => n._id !== notificationId));
      loadUnreadCount();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Handle notification click - navigate or show modal
  const handleNotificationClickBell = async (notification) => {
    try {
      if (!notification.read) {
        await notificationService.markAsRead(notification._id);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }

    // Handle contact reply - show modal
    if (notification.type === 'contact_reply') {
      const contactId = notification.contactId?._id || notification.contactId;
      if (contactId) {
        setShowDropdown(false);
        setSelectedNotification(notification);
        
        // Load contact details
        try {
          const contact = await contactService.getContactDetails(contactId);
          setContactData(contact);
          setShowContactModal(true);
        } catch (error) {
          console.error('Error loading contact details:', error);
          alert('Không thể tải thông tin liên hệ');
        }
        return;
      }
    }

    // Handle story-related notifications
    const storyId = notification.storyId?._id || notification.storyId;
    const storySlug = notification.storyId?.slug;
    const commentId = notification.commentId?._id || notification.commentId;

    if (notification.type === 'new_chapter' && storySlug) {
      navigate(`/story/${storySlug}`);
    } else if ((notification.type === 'mention' || notification.type === 'reply') && commentId && storySlug) {
      navigate(`/story/${storySlug}?comment=${commentId}`);
    } else if (storySlug) {
      navigate(`/story/${storySlug}`);
    } else if (storyId) {
      navigate(`/story/${storyId}`);
    }
  };

  if (!user) {
    return null;
  }

  // Don't render on manager pages
  if (window.location.pathname.startsWith('/manager')) {
    return null;
  }

  // Check if user has valid token (not manager token)
  const userToken = localStorage.getItem('token');
  if (!userToken) {
    return null;
  }

  return (
    <div ref={dropdownRef} className="relative">
      {/* Bell Button */}
      <button
        onClick={handleDropdownClick}
        className="relative p-2 text-text-light dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
        title="Thông báo"
      >
        <span className="material-symbols-outlined text-base">notifications</span>
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Contact Modal */}
      {showContactModal && (
        <ContactModal
          notification={selectedNotification}
          contact={contactData}
          onClose={() => {
            setShowContactModal(false);
            setSelectedNotification(null);
            setContactData(null);
          }}
          onDelete={handleDeleteNotification}
        />
      )}

      {/* Notification Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#1e1c27] rounded-lg shadow-2xl border border-gray-200 dark:border-white/10 z-50 max-h-96 overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-[#1e1c27] border-b border-gray-200 dark:border-white/10 p-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-text-light dark:text-white">Thông báo</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-primary hover:underline whitespace-nowrap"
              >
                Đánh dấu tất cả
              </button>
            )}
          </div>

          {/* Notifications List */}
          {notifications.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm">
                Không có thông báo nào
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-white/10">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => handleNotificationClickBell(notification)}
                  className={`px-3 py-2 transition-colors cursor-pointer ${
                    notification.read
                      ? 'bg-white dark:bg-[#1e1c27] hover:bg-gray-50 dark:hover:bg-white/5'
                      : 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <div className="min-w-0">
                      <p className="text-xs text-text-light dark:text-white hover:text-primary transition-colors leading-tight whitespace-normal break-all" style={{wordWrap: 'break-word', overflowWrap: 'break-word'}}>
                        {notification.message}
                      </p>
                      {notification.storyId && (
                        <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-0.5 line-clamp-1">
                          Truyện: {notification.storyId.title}
                        </p>
                      )}
                      <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-0.5">
                        {new Date(notification.createdAt).toLocaleDateString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-1 pt-1 border-t border-gray-200 dark:border-white/10">
                      {!notification.read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(notification._id);
                          }}
                          className="text-xs text-primary hover:underline"
                        >
                          Đánh dấu
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNotification(notification._id);
                        }}
                        className="text-xs text-red-500 hover:text-red-600"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="sticky bottom-0 bg-white dark:bg-[#1e1c27] border-t border-gray-200 dark:border-white/10 p-3">
            <button
              onClick={() => {
                setShowDropdown(false);
                navigate('/notifications');
              }}
              className="block w-full text-center text-sm text-primary hover:underline font-medium"
            >
              Xem tất cả
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
