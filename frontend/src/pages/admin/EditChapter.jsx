import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import ChapterRenderer from '../../components/ChapterRenderer';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

function EditChapter() {
  const { storyId, chapterId } = useParams();
  const navigate = useNavigate();
  const contentRef = useRef(null);
  
  const [user, setUser] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [inNoteMode, setInNoteMode] = useState(false);
  const [story, setStory] = useState(null);
  const [isPreview, setIsPreview] = useState(false);
  const [chapterStatus, setChapterStatus] = useState('published'); // draft, published, archived
  const [pauseDate, setPauseDate] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/');
      return;
    }
    setUser(currentUser);
    loadChapter();
  }, [chapterId, navigate]);

  // Auto-save draft every 1 minute
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (formData.title.trim() && formData.content.trim() && !saving) {
        handleSaveDraft();
      }
    }, 60000); // 1 phút

    return () => clearInterval(autoSaveInterval);
  }, [formData, saving]);

  const loadChapter = async () => {
    try {
      setLoading(true);
      const token = authService.getToken();
      const res = await axios.get(`${API_URL}/chapters/${chapterId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChapter(res.data);
      setFormData({
        title: res.data.title,
        content: res.data.content
      });
      setChapterStatus(res.data.status || 'published');
      
      // Load story info - handle storyId as object or string
      const storyIdValue = typeof res.data.storyId === 'object' ? res.data.storyId._id : res.data.storyId;
      const storyRes = await axios.get(`${API_URL}/stories/${storyIdValue}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStory(storyRes.data);
    } catch (error) {
      console.error('Error loading chapter:', error);
      alert('Lỗi tải chương: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const applyFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    contentRef.current?.focus();
  };

  const handleNoteClick = () => {
    if (inNoteMode) {
      setInNoteMode(false);
    } else {
      setInNoteMode(true);
      setTimeout(() => {
        const selection = window.getSelection();
        if (selection.toString().length > 0) {
          applyFormat('foreColor', '#8b5cf6'); // Purple highlight
        }
      }, 0);
    }
  };

  const handleContentChange = (e) => {
    setFormData(prev => ({ ...prev, content: e.target.value }));
  };

  const handleSaveDraft = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      setSaving(true);
      const token = authService.getToken();
      // Lưu vào localStorage để hiển thị thông báo
      const draftData = {
        ...formData,
        chapterId,
        storyId,
        savedAt: new Date().toLocaleTimeString()
      };
      localStorage.setItem(`draft_${chapterId}`, JSON.stringify(draftData));
      alert('Nháp đã được lưu tại: ' + draftData.savedAt);
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Lỗi khi lưu nháp');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      setSaving(true);
      const token = authService.getToken();
      await axios.put(
        `${API_URL}/chapters/${chapterId}`,
        {
          title: formData.title,
          content: formData.content,
          status: chapterStatus
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Xóa draft sau khi save thành công
      localStorage.removeItem(`draft_${chapterId}`);
      alert('Cập nhật chương thành công!');
      navigate(`/admin/manage-chapters/${storyId}`);
    } catch (error) {
      console.error('Error updating chapter:', error);
      alert('Lỗi khi cập nhật chương: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p>Đang tải...</p>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p>Không tìm thấy chương</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-1 justify-center p-4 sm:p-6 md:p-8">
      <div className="flex w-full max-w-7xl flex-col gap-6 lg:flex-row lg:gap-8">
        {/* Main Content */}
        <main className="flex flex-1 flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3 mb-4">
              <Link
                to={`/admin/manage-chapters/${storyId}`}
                className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </Link>
              <div className="flex-1">
                <h1 className="text-3xl font-black leading-tight tracking-[-0.033em] text-gray-900 dark:text-white">
                  Chỉnh sửa chương: {chapter.title}
                </h1>
                <p className="text-base font-normal leading-normal text-gray-500 dark:text-[#a29db9]">
                  Thuộc truyện: {story?.title}
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title & Chapter Number */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="flex flex-col gap-2 md:col-span-2">
                <p className="text-base font-medium leading-normal text-gray-800 dark:text-white">
                  Tiêu đề chương
                </p>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-input h-14 w-full flex-1 resize-none overflow-hidden rounded-lg border border-gray-300 bg-white p-4 text-base font-normal leading-normal text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20 dark:border-[#403b54] dark:bg-[#1e1c27] dark:text-white dark:placeholder:text-[#a29db9] dark:focus:border-primary"
                />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-base font-medium leading-normal text-gray-800 dark:text-white">
                  Số thứ tự
                </p>
                <input
                  type="number"
                  value={chapter.chapterNumber}
                  disabled
                  className="form-input h-14 w-full flex-1 resize-none overflow-hidden rounded-lg border border-gray-300 bg-gray-100 p-4 text-base font-normal leading-normal text-gray-900 dark:border-[#403b54] dark:bg-[#2b2839] dark:text-gray-400"
                />
              </div>
            </div>

            {/* Content Editor */}
            <div className="flex flex-col gap-2">
              <p className="text-base font-medium leading-normal text-gray-800 dark:text-white">
                Nội dung chương
              </p>
              <div className="flex h-full min-h-[400px] w-full flex-col rounded-lg border border-gray-300 bg-white dark:border-[#403b54] dark:bg-[#1e1c27] overflow-hidden">
                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-1 border-b border-gray-300 p-2 dark:border-[#403b54] bg-gray-50 dark:bg-[#2b2839]">
                  <button
                    type="button"
                    onClick={() => applyFormat('bold')}
                    className="flex h-9 w-9 items-center justify-center rounded text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-white/10 transition-colors"
                    title="In đậm"
                  >
                    <span className="material-symbols-outlined text-xl">format_bold</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFormat('italic')}
                    className="flex h-9 w-9 items-center justify-center rounded text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-white/10 transition-colors"
                    title="In nghiêng"
                  >
                    <span className="material-symbols-outlined text-xl">format_italic</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFormat('underline')}
                    className="flex h-9 w-9 items-center justify-center rounded text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-white/10 transition-colors"
                    title="Gạch chân"
                  >
                    <span className="material-symbols-outlined text-xl">format_underlined</span>
                  </button>

                  <div className="mx-1 h-5 w-px bg-gray-300 dark:bg-[#403b54]"></div>

                  <button
                    type="button"
                    onClick={() => applyFormat('justifyLeft')}
                    className="flex h-9 w-9 items-center justify-center rounded text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-white/10 transition-colors"
                    title="Căn trái"
                  >
                    <span className="material-symbols-outlined text-xl">format_align_left</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFormat('justifyCenter')}
                    className="flex h-9 w-9 items-center justify-center rounded text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-white/10 transition-colors"
                    title="Căn giữa"
                  >
                    <span className="material-symbols-outlined text-xl">format_align_center</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFormat('justifyRight')}
                    className="flex h-9 w-9 items-center justify-center rounded text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-white/10 transition-colors"
                    title="Căn phải"
                  >
                    <span className="material-symbols-outlined text-xl">format_align_right</span>
                  </button>

                  <div className="mx-1 h-5 w-px bg-gray-300 dark:bg-[#403b54]"></div>

                  <button
                    type="button"
                    onClick={handleNoteClick}
                    className={`flex h-9 w-9 items-center justify-center rounded transition-colors ${
                      inNoteMode
                        ? 'bg-primary/10 text-primary dark:bg-primary/20'
                        : 'text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-white/10'
                    }`}
                    title="Thêm ghi chú"
                  >
                    <span className="material-symbols-outlined text-xl">sticky_note_2</span>
                  </button>

                  {inNoteMode && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          content: prev.content + '\n> Ghi chú: \n'
                        }));
                        setInNoteMode(false);
                      }}
                      className="flex h-9 px-3 items-center justify-center rounded text-white bg-primary hover:bg-primary/90 transition-colors text-sm font-semibold"
                    >
                      Chèn ghi chú
                    </button>
                  )}
                </div>

                {/* Content Area */}
                {isPreview ? (
                  <div className="flex-1 overflow-y-auto">
                    <ChapterRenderer 
                      content={formData.content} 
                      isEditable={false}
                    />
                  </div>
                ) : (
                  <textarea
                    ref={contentRef}
                    value={formData.content}
                    onChange={handleContentChange}
                    placeholder="Nhập nội dung chương..."
                    className="flex-1 p-4 text-base font-normal leading-relaxed text-gray-900 dark:text-white bg-white dark:bg-[#1e1c27] outline-none resize-none"
                  />
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formData.content.replace(/<[^>]*>/g, '').length} ký tự
              </p>
            </div>
          </form>
        </main>

        {/* Sidebar */}
        <aside className="flex w-full flex-col gap-6 lg:w-80 lg:flex-shrink-0">
          {/* Actions */}
          <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-[#403b54] dark:bg-[#1e1c27]">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Hành động</h2>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleSubmit}
                disabled={saving || isPreview}
                className="flex h-12 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary text-base font-bold leading-normal text-white transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="truncate">{saving ? 'Đang lưu...' : 'Lưu Thay đổi'}</span>
              </button>
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={saving}
                className="flex h-12 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-primary bg-transparent text-base font-bold leading-normal text-primary transition-colors hover:bg-primary/10 dark:hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="truncate">Lưu nháp</span>
              </button>
              <button
                type="button"
                onClick={() => setIsPreview(!isPreview)}
                className={`flex h-12 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg text-base font-bold leading-normal transition-colors ${
                  isPreview
                    ? 'bg-primary text-white hover:bg-primary/90'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-[#2b2839] dark:text-white dark:hover:bg-[#3c394d]'
                }`}
              >
                <span className="truncate">{isPreview ? 'Quay lại soạn thảo' : 'Xem trước'}</span>
              </button>
              <Link
                to={`/admin/manage-chapters/${storyId}`}
                className="flex h-12 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg text-base font-bold leading-normal text-red-600 transition-colors hover:bg-red-500/10 dark:text-red-500"
              >
                <span className="truncate">Hủy bỏ</span>
              </Link>
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-[#403b54] dark:bg-[#1e1c27] relative">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Thông tin & Cài đặt
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-xl text-gray-500 dark:text-gray-400">
                    visibility
                  </span>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Trạng thái
                  </p>
                </div>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowStatusModal(!showStatusModal)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                      chapterStatus === 'published'
                        ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-500/30'
                        : chapterStatus === 'draft'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-500/30'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-500/20 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500/30'
                    }`}
                  >
                    {chapterStatus === 'published' ? 'Công khai' : 
                     chapterStatus === 'draft' ? 'Nháp' :
                     'Lưu trữ'}
                  </button>

                  {/* Status Modal */}
                  {showStatusModal && (
                    <div className="absolute right-0 top-full mt-2 bg-white dark:bg-[#2a2640] border border-gray-200 dark:border-[#403b54] rounded-lg shadow-lg z-50 p-3 min-w-[200px]">
                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setChapterStatus('published');
                            setShowStatusModal(false);
                          }}
                          className={`px-3 py-2 rounded text-sm text-left transition-colors ${
                            chapterStatus === 'published'
                              ? 'bg-primary text-white'
                              : 'hover:bg-gray-100 dark:hover:bg-white/10'
                          }`}
                        >
                          Công khai
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setChapterStatus('draft');
                            setShowStatusModal(false);
                          }}
                          className={`px-3 py-2 rounded text-sm text-left transition-colors ${
                            chapterStatus === 'draft'
                              ? 'bg-primary text-white'
                              : 'hover:bg-gray-100 dark:hover:bg-white/10'
                          }`}
                        >
                          Nháp
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setChapterStatus('archived');
                            setShowStatusModal(false);
                          }}
                          className={`px-3 py-2 rounded text-sm text-left transition-colors ${
                            chapterStatus === 'archived'
                              ? 'bg-primary text-white'
                              : 'hover:bg-gray-100 dark:hover:bg-white/10'
                          }`}
                        >
                          Lưu trữ
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-xl text-gray-500 dark:text-gray-400">
                    calendar_month
                  </span>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Ngày đăng
                  </p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {chapter && new Date(chapter.createdAt).toLocaleDateString('vi-VN')}
                </p>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <div>
                  <p>Lượt xem: <span className="font-semibold">{chapter?.views || 0}</span></p>
                  <p className="text-xs mt-1">Tự động lưu mỗi 30 giây</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default EditChapter;

