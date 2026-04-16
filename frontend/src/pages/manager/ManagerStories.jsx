import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { managerAPI } from '../../services/managerAPI';
import { BookOpen, Search, Edit2, Trash2, Eye, EyeOff, AlertCircle, Loader, Plus, Folder } from 'lucide-react';
import ManagerLayout from '../../components/manager/ManagerLayout';

const ManagerStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [pageInfo, setPageInfo] = useState({ page: 1, totalPages: 1 });
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    loadStories();
  }, [pageInfo.page, filterStatus, searchTerm]);

  const loadStories = async () => {
    try {
      setLoading(true);
      const response = await managerAPI.getStories({
        page: pageInfo.page,
        limit: 10,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        search: searchTerm || undefined,
      });

      setStories(response.data.stories);
      setPageInfo(response.data.pageInfo);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải danh sách truyện');
      console.error('Error loading stories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await managerAPI.toggleStoryStatus(id);
      // Toggle between publishing and paused_indefinite
      const newStatus = currentStatus === 'publishing' ? 'paused_indefinite' : 'publishing';
      setStories(stories.map(story =>
        story._id === id
          ? { ...story, status: newStatus }
          : story
      ));
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi cập nhật trạng thái');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa truyện này?')) return;

    try {
      setDeleting(id);
      await managerAPI.deleteStory(id);
      setStories(stories.filter(story => story._id !== id));
      alert('Xóa truyện thành công');
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi xóa truyện');
    } finally {
      setDeleting(null);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      publishing: { label: 'Đang ra', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
      completed: { label: 'Hoàn thành', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
      paused_indefinite: { label: 'Hoãn vô thời hạn', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
      paused_timed: { label: 'Hoãn có thời hạn', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' },
      dropped: { label: 'Ngừng xuất bản', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
    };
    const statusInfo = statusMap[status] || statusMap.publishing;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
  };



  if (loading && stories.length === 0) {
    return (
      <ManagerLayout>
        <div className="space-y-4">
          <div className="h-10 bg-gray-200 dark:bg-[#2A2640] rounded w-1/4 animate-pulse" />
          <div className="h-96 bg-gray-200 dark:bg-[#2A2640] rounded animate-pulse" />
        </div>
      </ManagerLayout>
    );
  }

  return (
    <ManagerLayout>
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-gray-900 dark:text-white text-3xl font-bold">Quản lý truyện</h1>
          <p className="text-gray-600 dark:text-gray-400 text-base">Hiển thị tất cả truyện trên hệ thống</p>
        </div>
        <Link
          to="/manager/stories/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Thêm truyện
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span className="text-red-700 dark:text-red-300 text-sm">{error}</span>
        </div>
      )}

      {/* Search and Filters */}
      <div className="mb-6 bg-white dark:bg-[#1C182F] rounded-xl border border-gray-200 dark:border-[#2A2640] p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative sm:col-span-2 lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm tên truyện..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPageInfo({ ...pageInfo, page: 1 });
              }}
              className="w-full h-11 pl-10 pr-4 bg-gray-50 dark:bg-[#2A2640] border border-gray-300 dark:border-[#3c3858] rounded-lg text-sm text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Filter by status */}
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setPageInfo({ ...pageInfo, page: 1 });
            }}
            className="h-11 px-4 bg-gray-50 dark:bg-[#2A2640] border border-gray-300 dark:border-[#3c3858] rounded-lg text-sm text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
          >
            <option value="all">Lọc theo trạng thái</option>
            <option value="publishing">Đang ra</option>
            <option value="completed">Hoàn thành</option>
            <option value="paused_indefinite">Hoãn vô thời hạn</option>
            <option value="paused_timed">Hoãn có thời hạn</option>
            <option value="dropped">Ngừng xuất bản</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#1C182F] rounded-xl border border-gray-200 dark:border-[#2A2640] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600 dark:text-gray-300">
            <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-[#2A2640]">
              <tr>
                <th className="px-6 py-3">Tên truyện</th>
                <th className="px-6 py-3">Tác giả</th>
                <th className="px-6 py-3">Ngày đăng</th>
                <th className="px-6 py-3">Trạng thái</th>
                <th className="px-6 py-3">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {stories.length > 0 ? (
                stories.map((story) => (
                  <tr key={story._id} className="bg-white dark:bg-[#1C182F] border-b dark:border-[#2A2640] hover:bg-gray-50 dark:hover:bg-[#2A2640]/50">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white max-w-xs truncate">
                      {story.title}
                    </td>
                    <td className="px-6 py-4">{story.authorId?.displayName || story.authorId?.username || 'N/A'}</td>
                    <td className="px-6 py-4 text-xs">
                      {new Date(story.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(story.status)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/manager/stories/${story._id}/chapters`}
                          title="Quản lý chương"
                          className="p-1 hover:bg-gray-100 dark:hover:bg-[#2A2640] rounded transition-colors"
                        >
                          <Folder className="w-4 h-4 text-blue-600" />
                        </Link>
                        <Link
                          to={`/manager/stories/${story._id}/edit`}
                          title="Chỉnh sửa truyện"
                          className="p-1 hover:bg-gray-100 dark:hover:bg-[#2A2640] rounded transition-colors"
                        >
                          <Edit2 className="w-4 h-4 text-blue-600" />
                        </Link>
                        <button
                          onClick={() => handleToggleStatus(story._id, story.status)}
                          title={story.status === 'publishing' ? 'Tạm hoãn' : 'Tiếp tục'}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-[#2A2640] rounded transition-colors"
                        >
                          {story.status === 'publishing' ? (
                            <Eye className="w-4 h-4 text-blue-600" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(story._id)}
                          disabled={deleting === story._id}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-[#2A2640] rounded transition-colors disabled:opacity-50"
                        >
                          {deleting === story._id ? (
                            <Loader className="w-4 h-4 text-red-600 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4 text-red-600" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    Không tìm thấy truyện nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pageInfo.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-[#2A2640]">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Trang {pageInfo.page} / {pageInfo.totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPageInfo({ ...pageInfo, page: pageInfo.page - 1 })}
                disabled={pageInfo.page === 1}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-[#2A2640] text-sm font-medium hover:bg-gray-200 dark:hover:bg-[#3c3858] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Trước
              </button>
              <button
                onClick={() => setPageInfo({ ...pageInfo, page: pageInfo.page + 1 })}
                disabled={pageInfo.page === pageInfo.totalPages}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-[#2A2640] text-sm font-medium hover:bg-gray-200 dark:hover:bg-[#3c3858] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Tiếp
              </button>
            </div>
          </div>
        )}
      </div>

    </ManagerLayout>
  );
};

export default ManagerStories;
