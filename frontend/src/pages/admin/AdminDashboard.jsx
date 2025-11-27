import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { getAllStories, deleteStory } from '../../services/storyService';
import { MedalIcon, calculateLevel } from '../../utils/tierSystem';

function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/');
      return;
    }
    setUser(currentUser);
    loadStories();
  }, [navigate]);

  const loadStories = async () => {
    try {
      setLoading(true);
      const data = await getAllStories();
      setStories(data);
    } catch (error) {
      console.error('Error loading stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa truyện "${title}"?`)) {
      try {
        await deleteStory(id);
        setStories(stories.filter(story => story._id !== id));
      } catch (error) {
        alert('Lỗi khi xóa truyện: ' + error.message);
      }
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/');
    window.location.reload();
  };

  const getStatusBadge = (status) => {
    const badges = {
      'publishing': 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300',
      'completed': 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300',
      'paused_indefinite': 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
      'paused_timed': 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300',
      'dropped': 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300'
    };
    return badges[status] || badges['publishing'];
  };

  const getStatusLabel = (status) => {
    const labels = {
      'publishing': 'Đang ra',
      'completed': 'Hoàn thành',
      'paused_indefinite': 'Hoãn vô thời hạn',
      'paused_timed': 'Hoãn có thời hạn',
      'dropped': 'Ngừng xuất bản'
    };
    return labels[status] || 'Đang ra';
  };

  if (!user) return null;

  return (
    <div className="flex h-full min-h-screen">
      {/* Sidebar */}
      <aside className="flex h-screen min-h-[700px] w-64 flex-col justify-between bg-white dark:bg-[#1c182d] p-4 border-r border-gray-200 dark:border-gray-800 sticky top-16">
        <div className="flex flex-col gap-8">
          {/* User Profile */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold">
                {user.username?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <MedalIcon level={calculateLevel(user.membershipPoints || 0)} size={16} />
                  <h1 className="text-text-light dark:text-text-dark text-base font-medium leading-normal">
                    {user.username}
                  </h1>
                </div>
                <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-normal leading-normal">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-1">
            <Link
              to="/admin"
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary"
            >
              <span className="material-symbols-outlined">dashboard</span>
              <p className="text-sm font-medium leading-normal">Bảng điều khiển</p>
            </Link>
            <Link
              to="/admin/create-story"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-text-light dark:text-text-dark"
            >
              <span className="material-symbols-outlined">add_circle</span>
              <p className="text-sm font-medium leading-normal">Đăng truyện mới</p>
            </Link>
            <Link
              to="/change-password"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-text-light dark:text-text-dark"
            >
              <span className="material-symbols-outlined">settings</span>
              <p className="text-sm font-medium leading-normal">Cài đặt tài khoản</p>
            </Link>
          </div>
        </div>

        {/* Logout */}
        <div className="flex flex-col gap-1">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-text-light dark:text-text-dark w-full text-left"
          >
            <span className="material-symbols-outlined">logout</span>
            <p className="text-sm font-medium leading-normal">Đăng xuất</p>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <div className="p-4 sm:p-6 lg:p-10 flex-grow">
          {/* Header */}
          <div className="flex flex-wrap justify-between items-center gap-3 p-4">
            <p className="text-text-light dark:text-text-dark text-4xl font-black leading-tight tracking-[-0.033em] min-w-72 font-display">
              Truyện của bạn
            </p>
            <Link
              to="/admin/create-story"
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors"
            >
              <span className="truncate">Đăng truyện mới</span>
            </Link>
          </div>

          {/* Stories Table */}
          {loading ? (
            <div className="px-4 py-8 text-center">
              <p className="text-text-secondary-light dark:text-text-secondary-dark">Đang tải...</p>
            </div>
          ) : stories.length > 0 ? (
            <div className="px-4 py-3">
              <div className="flex overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1c182d]">
                <table className="flex-1 w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-white/5">
                      <th className="px-4 py-3 text-left text-text-secondary-light dark:text-text-secondary-dark w-[40%] text-sm font-medium leading-normal">
                        Tên truyện
                      </th>
                      <th className="px-4 py-3 text-left text-text-secondary-light dark:text-text-secondary-dark w-[15%] text-sm font-medium leading-normal">
                        Trạng thái
                      </th>
                      <th className="px-4 py-3 text-left text-text-secondary-light dark:text-text-secondary-dark w-[15%] text-sm font-medium leading-normal">
                        Lượt xem
                      </th>
                      <th className="px-4 py-3 text-left text-text-secondary-light dark:text-text-secondary-dark w-[15%] text-sm font-medium leading-normal">
                        Chương
                      </th>
                      <th className="px-4 py-3 text-left text-text-secondary-light dark:text-text-secondary-dark w-[15%] text-sm font-medium leading-normal">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stories.map((story) => (
                      <tr
                        key={story._id}
                        className="border-t border-t-gray-200 dark:border-t-gray-700 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors"
                      >
                        <td className="h-[72px] px-4 py-2 text-text-light dark:text-text-dark text-sm font-medium leading-normal">
                          {story.title}
                        </td>
                        <td className="h-[72px] px-4 py-2 text-sm font-normal leading-normal">
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getStatusBadge(story.status)}`}>
                            {getStatusLabel(story.status)}
                          </span>
                        </td>
                        <td className="h-[72px] px-4 py-2 text-text-secondary-light dark:text-text-secondary-dark text-sm font-normal leading-normal">
                          {story.views?.toLocaleString() || 0}
                        </td>
                        <td className="h-[72px] px-4 py-2 text-text-secondary-light dark:text-text-secondary-dark text-sm font-normal leading-normal">
                          {story.chapterCount || 0}
                        </td>
                        <td className="h-[72px] px-4 py-2 text-sm font-bold leading-normal tracking-[0.015em] space-x-2">
                          <Link
                            to={`/admin/manage-chapters/${story._id}`}
                            className="p-2 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 inline-block"
                            title="Quản lý chương"
                          >
                            <span className="material-symbols-outlined text-base">folder_open</span>
                          </Link>
                          <Link
                            to={`/admin/edit-story/${story._id}`}
                            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-text-secondary-light dark:text-text-secondary-dark inline-block"
                            title="Chỉnh sửa truyện"
                          >
                            <span className="material-symbols-outlined text-base">edit</span>
                          </Link>
                          <button
                            onClick={() => handleDelete(story._id, story.title)}
                            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-text-secondary-light dark:text-text-secondary-dark"
                            title="Xóa truyện"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="flex flex-col p-4 mt-8">
              <div className="flex flex-col items-center gap-6 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 px-6 py-14 bg-white dark:bg-background-dark/30">
                <div className="flex max-w-[480px] flex-col items-center gap-2">
                  <p className="text-text-light dark:text-text-dark text-lg font-bold leading-tight tracking-[-0.015em] max-w-[480px] text-center font-display">
                    Bạn chưa có truyện nào
                  </p>
                  <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-normal leading-normal max-w-[480px] text-center">
                    Hãy bắt đầu hành trình sáng tác của bạn ngay hôm nay bằng cách đăng tải tác phẩm đầu tiên.
                  </p>
                </div>
                <Link
                  to="/admin/create-story"
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors"
                >
                  <span className="truncate">Đăng truyện mới</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
