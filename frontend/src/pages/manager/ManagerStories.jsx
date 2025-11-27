import React, { useState, useEffect } from 'react';
import { managerAPI } from '../../services/managerAPI';
import { BookOpen, Search, Edit2, Trash2, Eye, EyeOff, AlertCircle, Loader, X, Plus, Folder } from 'lucide-react';
import ManagerLayout from '../../components/manager/ManagerLayout';
import categoryService from '../../services/categoryService';

const ManagerStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [pageInfo, setPageInfo] = useState({ page: 1, totalPages: 1 });
  const [deleting, setDeleting] = useState(null);
  const [categories, setCategories] = useState([]);

  // Modal states
  const [selectedStory, setSelectedStory] = useState(null);
  const [showChaptersModal, setShowChaptersModal] = useState(false);
  const [showEditStoryModal, setShowEditStoryModal] = useState(false);
  const [editingStory, setEditingStory] = useState(null);
  const [savingStory, setSavingStory] = useState(false);
  const [chapters, setChapters] = useState([]);
  const [chaptersLoading, setChaptersLoading] = useState(false);
  const [showAddChapter, setShowAddChapter] = useState(false);
  const [newChapter, setNewChapter] = useState({ title: '', content: '' });
  const [editingChapter, setEditingChapter] = useState(null);
  const [savingChapter, setSavingChapter] = useState(false);
  const [deletingChapter, setDeletingChapter] = useState(null);

  useEffect(() => {
    loadCategories();
    loadStories();
  }, [pageInfo.page, filterStatus, searchTerm]);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

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

  const loadChapters = async (storyId) => {
    try {
      setChaptersLoading(true);
      const response = await managerAPI.getChapters(storyId);
      setChapters(response.data.chapters);
    } catch (err) {
      alert('Lỗi khi tải danh sách chương: ' + (err.response?.data?.message || err.message));
    } finally {
      setChaptersLoading(false);
    }
  };

  const handleViewChapters = (story) => {
    setSelectedStory(story);
    setShowChaptersModal(true);
    loadChapters(story.slug || story._id);
  };

  const handleEditStory = async (story) => {
    try {
      // Fetch full story data
      const response = await managerAPI.getStoryById(story._id);
      setEditingStory({
        _id: response.data.story._id,
        title: response.data.story.title,
        description: response.data.story.description || '',
        category: response.data.story.category || [],
        status: response.data.story.status,
      });
      setShowEditStoryModal(true);
    } catch (err) {
      alert('Lỗi khi tải thông tin truyện: ' + (err.response?.data?.message || err.message));
      console.error('Error loading story:', err);
    }
  };

  const handleSaveStory = async (e) => {
    e.preventDefault();
    if (!editingStory.title.trim()) {
      alert('Vui lòng nhập tiêu đề truyện');
      return;
    }

    try {
      setSavingStory(true);
      await managerAPI.updateStory(editingStory._id, {
        title: editingStory.title,
        description: editingStory.description,
        category: editingStory.category,
        status: editingStory.status,
      });
      
      // Update local state
      setStories(stories.map(s =>
        s._id === editingStory._id
          ? { ...s, ...editingStory }
          : s
      ));
      
      setShowEditStoryModal(false);
      setEditingStory(null);
      alert('Cập nhật truyện thành công!');
    } catch (err) {
      alert('Lỗi khi cập nhật truyện: ' + (err.response?.data?.message || err.message));
    } finally {
      setSavingStory(false);
    }
  };

  const handleAddChapter = async (e) => {
    e.preventDefault();
    if (!newChapter.title.trim() || !newChapter.content.trim()) {
      alert('Vui lòng điền đầy đủ tiêu đề và nội dung chương');
      return;
    }

    try {
      setSavingChapter(true);
      const chapterNumber = chapters.length + 1;
      await managerAPI.createChapter({
        storyId: selectedStory._id,
        chapterNumber,
        title: newChapter.title,
        content: newChapter.content,
      });
      
      setNewChapter({ title: '', content: '' });
      setShowAddChapter(false);
      await loadChapters(selectedStory.slug || selectedStory._id);
      alert('Thêm chương thành công!');
    } catch (err) {
      alert('Lỗi khi thêm chương: ' + (err.response?.data?.message || err.message));
    } finally {
      setSavingChapter(false);
    }
  };

  const handleUpdateChapter = async (e) => {
    e.preventDefault();
    if (!editingChapter.title.trim() || !editingChapter.content.trim()) {
      alert('Vui lòng điền đầy đủ tiêu đề và nội dung chương');
      return;
    }

    try {
      setSavingChapter(true);
      await managerAPI.updateChapter(editingChapter._id, {
        title: editingChapter.title,
        content: editingChapter.content,
        status: editingChapter.status,
      });
      
      setEditingChapter(null);
      await loadChapters(selectedStory.slug || selectedStory._id);
      alert('Cập nhật chương thành công!');
    } catch (err) {
      alert('Lỗi khi cập nhật chương: ' + (err.response?.data?.message || err.message));
    } finally {
      setSavingChapter(false);
    }
  };

  const handleDeleteChapter = async (chapterId, chapterNumber) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa chương ${chapterNumber}?`)) return;

    try {
      setDeletingChapter(chapterId);
      await managerAPI.deleteChapter(chapterId);
      await loadChapters(selectedStory.slug || selectedStory._id);
      alert('Xóa chương thành công!');
    } catch (err) {
      alert('Lỗi khi xóa chương: ' + (err.response?.data?.message || err.message));
    } finally {
      setDeletingChapter(null);
    }
  };

  const handleUpdateChapterStatus = async (chapterId, currentStatus) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    try {
      await managerAPI.updateChapterStatus(chapterId, newStatus);
      await loadChapters(selectedStory.slug || selectedStory._id);
    } catch (err) {
      alert('Lỗi khi cập nhật trạng thái: ' + (err.response?.data?.message || err.message));
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

  const getChapterStatusBadge = (status) => {
    const statusMap = {
      published: { label: 'Công khai', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
      draft: { label: 'Nháp', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
      archived: { label: 'Lưu trữ', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300' },
    };
    const statusInfo = statusMap[status] || statusMap.draft;
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
                    <td className="px-6 py-4">{story.author?.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-xs">
                      {new Date(story.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(story.status)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewChapters(story)}
                          title="Quản lý chương"
                          className="p-1 hover:bg-gray-100 dark:hover:bg-[#2A2640] rounded transition-colors"
                        >
                          <Folder className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleEditStory(story)}
                          title="Chỉnh sửa truyện"
                          className="p-1 hover:bg-gray-100 dark:hover:bg-[#2A2640] rounded transition-colors"
                        >
                          <Edit2 className="w-4 h-4 text-blue-600" />
                        </button>
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

      {/* Chapters Modal */}
      {showChaptersModal && selectedStory && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1C182F] rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 dark:border-[#2A2640] bg-white dark:bg-[#1C182F]">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedStory.title}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Quản lý {chapters.length} chương</p>
              </div>
              <button
                onClick={() => {
                  setShowChaptersModal(false);
                  setEditingChapter(null);
                  setShowAddChapter(false);
                  setNewChapter({ title: '', content: '' });
                }}
                className="p-1 hover:bg-gray-100 dark:hover:bg-[#2A2640] rounded"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Add Chapter Button */}
              {!editingChapter && (
                <button
                  onClick={() => setShowAddChapter(!showAddChapter)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Thêm Chương Mới
                </button>
              )}

              {/* Add Chapter Form */}
              {showAddChapter && !editingChapter && (
                <form onSubmit={handleAddChapter} className="bg-gray-50 dark:bg-[#2A2640] p-4 rounded-lg space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Thêm Chương Mới</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tiêu đề chương</label>
                    <input
                      type="text"
                      value={newChapter.title}
                      onChange={(e) => setNewChapter({...newChapter, title: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-[#3c3858] rounded-lg bg-white dark:bg-[#1C182F] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập tiêu đề chương..."
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nội dung</label>
                    <textarea
                      value={newChapter.content}
                      onChange={(e) => setNewChapter({...newChapter, content: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-[#3c3858] rounded-lg bg-white dark:bg-[#1C182F] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 min-h-64"
                      placeholder="Nhập nội dung chương..."
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={savingChapter}
                      className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
                    >
                      {savingChapter ? 'Đang lưu...' : 'Thêm Chương'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddChapter(false);
                        setNewChapter({ title: '', content: '' });
                      }}
                      className="flex-1 px-4 py-2 bg-gray-300 dark:bg-[#3c3858] hover:bg-gray-400 text-gray-800 dark:text-white font-medium rounded-lg transition-colors"
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              )}

              {/* Edit Chapter Form */}
              {editingChapter && (
                <form onSubmit={handleUpdateChapter} className="bg-gray-50 dark:bg-[#2A2640] p-4 rounded-lg space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Chỉnh Sửa Chương {editingChapter.chapterNumber}</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tiêu đề chương</label>
                    <input
                      type="text"
                      value={editingChapter.title}
                      onChange={(e) => setEditingChapter({...editingChapter, title: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-[#3c3858] rounded-lg bg-white dark:bg-[#1C182F] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập tiêu đề chương..."
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nội dung</label>
                    <textarea
                      value={editingChapter.content}
                      onChange={(e) => setEditingChapter({...editingChapter, content: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-[#3c3858] rounded-lg bg-white dark:bg-[#1C182F] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 min-h-64"
                      placeholder="Nhập nội dung chương..."
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Trạng thái</label>
                    <select
                      value={editingChapter.status}
                      onChange={(e) => setEditingChapter({...editingChapter, status: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-[#3c3858] rounded-lg bg-white dark:bg-[#1C182F] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="draft">Nháp</option>
                      <option value="published">Công khai</option>
                      <option value="archived">Lưu trữ</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={savingChapter}
                      className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
                    >
                      {savingChapter ? 'Đang lưu...' : 'Cập Nhật'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingChapter(null);
                      }}
                      className="flex-1 px-4 py-2 bg-gray-300 dark:bg-[#3c3858] hover:bg-gray-400 text-gray-800 dark:text-white font-medium rounded-lg transition-colors"
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              )}

              {/* Chapters List */}
              <div className="space-y-3">
                {chaptersLoading ? (
                  <div className="text-center py-8">
                    <Loader className="w-6 h-6 animate-spin mx-auto text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Đang tải...</p>
                  </div>
                ) : chapters.length > 0 ? (
                  chapters.map((chapter) => (
                    <div
                      key={chapter._id}
                      className="bg-gray-50 dark:bg-[#2A2640] p-4 rounded-lg border border-gray-200 dark:border-[#3c3858] hover:border-gray-300 dark:hover:border-[#4a5870] transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">Chương {chapter.chapterNumber}: {chapter.title}</h4>
                            {getChapterStatusBadge(chapter.status)}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{chapter.views || 0} lượt xem</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {!editingChapter && (
                        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-[#3c3858]">
                          <button
                            onClick={() => setEditingChapter(chapter)}
                            className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                          >
                            Chỉnh sửa
                          </button>
                          <button
                            onClick={() => handleUpdateChapterStatus(chapter._id, chapter.status)}
                            className={`px-3 py-1 text-sm rounded transition-colors ${
                              chapter.status === 'published'
                                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900/50'
                                : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50'
                            }`}
                          >
                            {chapter.status === 'published' ? 'Đưa về nháp' : 'Công khai'}
                          </button>
                          <button
                            onClick={() => handleDeleteChapter(chapter._id, chapter.chapterNumber)}
                            disabled={deletingChapter === chapter._id}
                            className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors disabled:opacity-50"
                          >
                            {deletingChapter === chapter._id ? 'Đang xóa...' : 'Xóa'}
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                    Chưa có chương nào. Hãy thêm chương đầu tiên!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Story Modal */}
      {showEditStoryModal && editingStory && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1C182F] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 dark:border-[#2A2640] bg-white dark:bg-[#1C182F]">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Chỉnh sửa truyện</h2>
              <button
                onClick={() => {
                  setShowEditStoryModal(false);
                  setEditingStory(null);
                }}
                className="p-1 hover:bg-gray-100 dark:hover:bg-[#2A2640] rounded"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <form onSubmit={handleSaveStory} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tiêu đề truyện</label>
                  <input
                    type="text"
                    value={editingStory.title}
                    onChange={(e) => setEditingStory({...editingStory, title: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-[#3c3858] rounded-lg bg-white dark:bg-[#2A2640] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập tiêu đề truyện..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mô tả</label>
                  <textarea
                    value={editingStory.description}
                    onChange={(e) => setEditingStory({...editingStory, description: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-[#3c3858] rounded-lg bg-white dark:bg-[#2A2640] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 min-h-32"
                    placeholder="Nhập mô tả truyện..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Thể loại</label>
                  <div className="space-y-2 max-h-48 overflow-y-auto p-2 border border-gray-300 dark:border-[#3c3858] rounded-lg bg-white dark:bg-[#2A2640]">
                    {categories.map((cat) => (
                      <label key={cat._id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingStory.category.includes(cat._id)}
                          onChange={(e) => {
                            const newCategory = e.target.checked
                              ? [...editingStory.category, cat._id]
                              : editingStory.category.filter(c => c !== cat._id);
                            setEditingStory({...editingStory, category: newCategory});
                          }}
                          className="w-4 h-4 rounded border-gray-300 dark:border-[#3c3858] text-blue-600 focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{cat.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Trạng thái</label>
                  <select
                    value={editingStory.status}
                    onChange={(e) => setEditingStory({...editingStory, status: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-[#3c3858] rounded-lg bg-white dark:bg-[#2A2640] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="publishing">Đang ra</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="paused_indefinite">Hoãn vô thời hạn</option>
                    <option value="paused_timed">Hoãn có thời hạn</option>
                    <option value="dropped">Ngừng xuất bản</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    disabled={savingStory}
                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
                  >
                    {savingStory ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditStoryModal(false);
                      setEditingStory(null);
                    }}
                    className="flex-1 px-4 py-2 bg-gray-300 dark:bg-[#3c3858] hover:bg-gray-400 text-gray-800 dark:text-white font-medium rounded-lg transition-colors"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </ManagerLayout>
  );
};

export default ManagerStories;
