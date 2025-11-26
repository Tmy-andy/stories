import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

function ManageChapters() {
  const { storyId } = useParams();
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddChapter, setShowAddChapter] = useState(false);
  const [draggedChapter, setDraggedChapter] = useState(null);
  const [newChapter, setNewChapter] = useState({
    title: '',
    content: ''
  });

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/');
      return;
    }
    setUser(currentUser);
    loadData();
  }, [storyId, navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const token = authService.getToken();
      
      const storyRes = await axios.get(`${API_URL}/stories/${storyId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStory(storyRes.data);

      const chaptersRes = await axios.get(`${API_URL}/chapters/admin/story/${storyId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChapters(chaptersRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddChapter = async (e) => {
    e.preventDefault();
    if (!newChapter.title.trim() || !newChapter.content.trim()) {
      alert('Vui lòng điền đầy đủ thông tin chương');
      return;
    }

    try {
      const token = authService.getToken();
      const chapterNumber = chapters.length + 1;
      
      await axios.post(
        `${API_URL}/chapters`,
        {
          storyId,
          chapterNumber,
          title: newChapter.title,
          content: newChapter.content
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNewChapter({ title: '', content: '' });
      setShowAddChapter(false);
      loadData();
      alert('Thêm chương thành công!');
    } catch (error) {
      console.error('Error adding chapter:', error);
      alert('Lỗi khi thêm chương: ' + error.message);
    }
  };

  const handleDeleteChapter = async (chapterId, chapterNumber) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa chương ${chapterNumber}?`)) {
      try {
        const token = authService.getToken();
        await axios.delete(`${API_URL}/chapters/${chapterId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        loadData();
        alert('Xóa chương thành công!');
      } catch (error) {
        console.error('Error deleting chapter:', error);
        alert('Lỗi khi xóa chương: ' + error.message);
      }
    }
  };

  const handleUpdateStatus = async (chapterId, newStatus) => {
    try {
      const token = authService.getToken();
      const chapter = chapters.find(c => c._id === chapterId);
      
      await axios.put(
        `${API_URL}/chapters/${chapterId}`,
        {
          title: chapter.title,
          content: chapter.content,
          status: newStatus
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      loadData();
    } catch (error) {
      console.error('Error updating chapter status:', error);
      alert('Lỗi khi cập nhật trạng thái: ' + error.message);
    }
  };

  const handleDragStart = (e, chapter) => {
    setDraggedChapter(chapter);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, targetChapter) => {
    e.preventDefault();
    if (!draggedChapter || draggedChapter._id === targetChapter._id) {
      setDraggedChapter(null);
      return;
    }

    try {
      const token = authService.getToken();
      const draggedIndex = chapters.findIndex(c => c._id === draggedChapter._id);
      const targetIndex = chapters.findIndex(c => c._id === targetChapter._id);
      
      const newChapters = [...chapters];
      [newChapters[draggedIndex], newChapters[targetIndex]] = [newChapters[targetIndex], newChapters[draggedIndex]];
      
      const updates = [];
      newChapters.forEach((ch, idx) => {
        if (ch.chapterNumber !== idx + 1) {
          updates.push({
            ...ch,
            chapterNumber: idx + 1
          });
        }
      });

      for (const ch of updates) {
        await axios.put(
          `${API_URL}/chapters/${ch._id}`,
          {
            title: ch.title,
            content: ch.content,
            status: ch.status,
            chapterNumber: ch.chapterNumber
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setChapters(newChapters);
      setDraggedChapter(null);
    } catch (error) {
      console.error('Error reordering chapters:', error);
      alert('Lỗi khi sắp xếp chương: ' + error.message);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      draft: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', label: 'Nháp', icon: 'draft' },
      published: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', label: 'Công khai', icon: 'publish' },
      archived: { bg: 'bg-gray-100 dark:bg-gray-900/30', text: 'text-gray-700 dark:text-gray-400', label: 'Lưu trữ', icon: 'archive' }
    };
    return badges[status] || badges.draft;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Đang tải...</p>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Không tìm thấy truyện</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Link to="/admin" className="flex items-center text-primary hover:underline font-medium mb-4">
            <span className="material-symbols-outlined mr-2">arrow_back</span>
            Quay lại
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">{story.title}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Quản lý {chapters.length} chương</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button
            onClick={() => setShowAddChapter(!showAddChapter)}
            className="flex-1 sm:flex-initial flex items-center justify-center bg-primary text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
          >
            <span className="material-symbols-outlined mr-2">add</span>
            Thêm Chương Mới
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            <span className="material-symbols-outlined">swap_vert</span>
            <span>Sắp xếp chương</span>
          </button>
        </div>

        {/* Add Chapter Form */}
        {showAddChapter && (
          <form onSubmit={handleAddChapter} className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Thêm Chương Mới</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tiêu đề chương</label>
                <input
                  type="text"
                  name="title"
                  value={newChapter.title}
                  onChange={(e) => setNewChapter({...newChapter, title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
                  placeholder="Nhập tiêu đề chương..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nội dung</label>
                <textarea
                  name="content"
                  value={newChapter.content}
                  onChange={(e) => setNewChapter({...newChapter, content: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary min-h-48"
                  placeholder="Nhập nội dung chương..."
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  Thêm Chương
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddChapter(false);
                    setNewChapter({ title: '', content: '' });
                  }}
                  className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Hủy
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Chapters List */}
        <div className="space-y-4">
          {chapters.length > 0 ? (
            chapters.map((chapter) => {
              const statusBadge = getStatusBadge(chapter.status);
              return (
                <div
                  key={chapter._id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, chapter)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, chapter)}
                  className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between transition-all hover:shadow-md cursor-move ${
                    draggedChapter?._id === chapter._id ? 'opacity-50 scale-95' : ''
                  }`}
                >
                  {/* Chapter Info */}
                  <div className="flex items-center gap-4 flex-1 mb-4 sm:mb-0">
                    <span className="material-symbols-outlined text-gray-400 dark:text-gray-500">drag_indicator</span>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Chương {chapter.chapterNumber}</p>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{chapter.title}</h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded ${statusBadge.bg} ${statusBadge.text}`}>
                          <span className="material-symbols-outlined text-sm">{statusBadge.icon}</span>
                          {statusBadge.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{chapter.views || 0} lượt xem</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    {chapter.status === 'draft' && (
                      <button
                        onClick={() => handleUpdateStatus(chapter._id, 'published')}
                        className="flex items-center text-sm px-3 py-1.5 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 rounded-md font-medium hover:bg-green-200 dark:hover:bg-green-900/70 transition-colors"
                      >
                        <span className="material-symbols-outlined text-base mr-1">publish</span>
                        Công khai
                      </button>
                    )}
                    {chapter.status === 'published' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(chapter._id, 'draft')}
                          className="flex items-center text-sm px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 rounded-md font-medium hover:bg-yellow-200 dark:hover:bg-yellow-900/70 transition-colors"
                        >
                          <span className="material-symbols-outlined text-base mr-1">draft</span>
                          Nháp
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(chapter._id, 'archived')}
                          className="flex items-center text-sm px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-md font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          <span className="material-symbols-outlined text-base mr-1">archive</span>
                          Lưu trữ
                        </button>
                      </>
                    )}
                    {chapter.status === 'archived' && (
                      <button
                        onClick={() => handleUpdateStatus(chapter._id, 'published')}
                        className="flex items-center text-sm px-3 py-1.5 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 rounded-md font-medium hover:bg-green-200 dark:hover:bg-green-900/70 transition-colors"
                      >
                        <span className="material-symbols-outlined text-base mr-1">restore</span>
                        Khôi phục
                      </button>
                    )}
                    <Link
                      to={`/admin/edit-chapter/${storyId}/${chapter._id}`}
                      className="flex items-center text-sm px-3 py-1.5 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded-md font-medium hover:bg-blue-200 dark:hover:bg-blue-900/70 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base mr-1">edit</span>
                      Chỉnh sửa
                    </Link>
                    <button
                      onClick={() => handleDeleteChapter(chapter._id, chapter.chapterNumber)}
                      className="flex items-center text-sm px-3 py-1.5 bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300 rounded-md font-medium hover:bg-red-200 dark:hover:bg-red-900/70 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base mr-1">delete</span>
                      Xóa
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400 text-lg">Chưa có chương nào. Hãy thêm chương đầu tiên!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default ManageChapters;
