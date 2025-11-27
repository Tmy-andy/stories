import React, { useState, useEffect } from 'react';
import { managerAPI } from '../../services/managerAPI';
import { BookOpen, Users, MessageSquare, Mail, TrendingUp, AlertCircle } from 'lucide-react';
import ManagerLayout from '../../components/manager/ManagerLayout';

const ManagerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
    // Refresh every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await managerAPI.getDashboardData();
      setStats(response.data.stats);
      setActivities(response.data.activities || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải dữ liệu dashboard');
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, color = 'blue' }) => {
    const colorClasses = {
      blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600',
      purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600',
      green: 'bg-green-50 dark:bg-green-900/20 text-green-600',
      yellow: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600',
    };

    return (
      <div className="flex flex-col gap-4 rounded-xl p-6 bg-white dark:bg-[#1C182F] border border-gray-200 dark:border-[#2A2640]">
        <div className="flex items-center gap-3">
          <div className={`flex items-center justify-center size-10 rounded-lg ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
          <h3 className="text-gray-900 dark:text-white text-lg font-bold">{label}</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Tổng số: <span className="font-semibold text-gray-900 dark:text-white text-2xl">{value || 0}</span>
        </p>
      </div>
    );
  };

  const ActivityItem = ({ activity }) => {
    const iconMap = {
      story_added: BookOpen,
      user_registered: Users,
      comment_created: MessageSquare,
      contact_submitted: Mail,
    };

    const Icon = iconMap[activity.type] || AlertCircle;

    return (
      <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-[#2A2640] transition-colors">
        <div className="flex-shrink-0">
          <div className="flex items-center justify-center size-8 rounded-full bg-gray-100 dark:bg-[#2A2640]">
            <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {new Date(activity.timestamp).toLocaleString('vi-VN')}
          </p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <ManagerLayout>
        <div className="space-y-8 animate-pulse">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-[#2A2640] rounded-xl" />
            ))}
          </div>
        </div>
      </ManagerLayout>
    );
  }

  return (
    <ManagerLayout>
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-gray-900 dark:text-white text-3xl md:text-4xl font-black leading-tight">
            Bảng điều khiển
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-base font-normal leading-normal">
            Chào mừng trở lại, Manager!
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span className="text-red-700 dark:text-red-300 text-sm">{error}</span>
        </div>
      )}

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={BookOpen} label="Truyện" value={stats.totalStories} color="blue" />
          <StatCard icon={Users} label="Tác giả" value={stats.totalAuthors} color="purple" />
          <StatCard icon={Users} label="Người dùng" value={stats.totalUsers} color="green" />
          <StatCard icon={Mail} label="Liên hệ chưa xử lý" value={stats.pendingContacts} color="yellow" />
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Stories */}
        <div className="bg-white dark:bg-[#1C182F] rounded-xl border border-gray-200 dark:border-[#2A2640] p-6">
          <h3 className="text-gray-900 dark:text-white text-lg font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Truyện phổ biến nhất
          </h3>
          <div className="space-y-3">
            {activities.slice(0, 5).map((activity, idx) => (
              <div key={idx} className="flex justify-between items-center p-2 hover:bg-gray-50 dark:hover:bg-[#2A2640] rounded transition-colors">
                <span className="text-sm text-gray-700 dark:text-gray-300">{activity.title}</span>
                <span className="text-xs font-medium text-primary">{activity.count || 0}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-[#1C182F] rounded-xl border border-gray-200 dark:border-[#2A2640] p-6">
          <h3 className="text-gray-900 dark:text-white text-lg font-bold mb-4">Hoạt động gần đây</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {activities.length > 0 ? (
              activities.map((activity, idx) => (
                <ActivityItem key={idx} activity={activity} />
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">Không có hoạt động gần đây</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-[#1C182F] rounded-xl border border-gray-200 dark:border-[#2A2640] p-6">
        <h3 className="text-gray-900 dark:text-white text-lg font-bold mb-4">Hành động nhanh</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <a
            href="/manager/stories"
            className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group"
          >
            <BookOpen className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-blue-900 dark:text-blue-300">Xem tất cả truyện</span>
          </a>
          <a
            href="/manager/comments"
            className="flex items-center gap-3 p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors group"
          >
            <MessageSquare className="w-6 h-6 text-purple-600 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-purple-900 dark:text-purple-300">Bình luận chưa duyệt</span>
          </a>
          <a
            href="/manager/contacts"
            className="flex items-center gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors group"
          >
            <Mail className="w-6 h-6 text-green-600 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-green-900 dark:text-green-300">Liên hệ chưa xử lý</span>
          </a>
        </div>
      </div>
    </ManagerLayout>
  );
};

export default ManagerDashboard;
