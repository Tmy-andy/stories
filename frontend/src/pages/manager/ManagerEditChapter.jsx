import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader } from 'lucide-react';
import ManagerLayout from '../../components/manager/ManagerLayout';
import ChapterRenderer from '../../components/ChapterRenderer';
import { managerAPI } from '../../services/managerAPI';

const STATUS_OPTIONS = [
  { value: 'published', label: 'Công khai', cls: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
  { value: 'draft', label: 'Nháp', cls: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
  { value: 'archived', label: 'Lưu trữ', cls: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300' },
];

const ManagerEditChapter = () => {
  const { storyId, chapterId } = useParams();
  const navigate = useNavigate();
  const contentRef = useRef(null);

  const [chapter, setChapter] = useState(null);
  const [story, setStory] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [status, setStatus] = useState('published');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [chRes, stRes] = await Promise.all([
          managerAPI.getChapterById(chapterId),
          managerAPI.getStoryById(storyId),
        ]);
        if (cancelled) return;
        const ch = chRes.data.chapter || chRes.data;
        setChapter(ch);
        setFormData({ title: ch.title || '', content: ch.content || '' });
        setStatus(ch.status || 'published');
        setStory(stRes.data.story);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || 'Lỗi tải chương');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [chapterId, storyId]);

  // Initialize contentEditable div
  useEffect(() => {
    if (contentRef.current && formData.content && !isPreview && !loading) {
      if (contentRef.current.innerHTML !== formData.content) {
        contentRef.current.innerHTML = formData.content;
      }
    }
  }, [loading, isPreview]);

  const syncContent = () => {
    if (contentRef.current) {
      setFormData(prev => ({ ...prev, content: contentRef.current.innerHTML }));
    }
  };

  const applyFormat = (command, value = null) => {
    if (contentRef.current) {
      contentRef.current.focus();
      document.execCommand(command, false, value);
      syncContent();
    }
  };

  const handleSave = async () => {
    setError('');
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Tiêu đề và nội dung là bắt buộc');
      return;
    }
    try {
      setSaving(true);
      await managerAPI.updateChapter(chapterId, {
        title: formData.title,
        content: formData.content,
        status,
      });
      navigate(`/manager/stories/${storyId}/chapters`);
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi lưu chương');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ManagerLayout>
        <div className="flex items-center justify-center py-12 text-gray-500 dark:text-gray-400">
          <Loader className="w-5 h-5 animate-spin mr-2" /> Đang tải...
        </div>
      </ManagerLayout>
    );
  }

  return (
    <ManagerLayout>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(`/manager/stories/${storyId}/chapters`)} className="p-2 hover:bg-gray-100 dark:hover:bg-[#2A2640] rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-gray-900 dark:text-white text-2xl font-bold truncate">
            Chương {chapter?.chapterNumber}: {formData.title || chapter?.title}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">Truyện: {story?.title}</p>
        </div>
        <button
          onClick={() => setIsPreview(!isPreview)}
          className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isPreview ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-[#2A2640] text-gray-700 dark:text-gray-300'}`}
        >
          {isPreview ? 'Soạn thảo' : 'Xem trước'}
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Đang lưu...' : 'Lưu'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Main editor */}
        <div className="lg:col-span-3 bg-white dark:bg-[#1C182F] rounded-xl border border-gray-200 dark:border-[#2A2640] overflow-hidden flex flex-col">
          {/* Title */}
          <div className="px-5 pt-5 pb-3">
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Tiêu đề chương..."
              className="w-full text-xl font-bold text-gray-900 dark:text-white bg-transparent border-0 outline-none placeholder:text-gray-400"
            />
          </div>

          {/* Toolbar */}
          {!isPreview && (
            <div className="flex flex-wrap items-center gap-1 border-y border-gray-200 dark:border-[#2A2640] px-3 py-2 bg-gray-50 dark:bg-[#2A2640]/50">
              {[
                { cmd: 'bold', icon: 'format_bold', title: 'In đậm' },
                { cmd: 'italic', icon: 'format_italic', title: 'In nghiêng' },
                { cmd: 'underline', icon: 'format_underlined', title: 'Gạch chân' },
              ].map(b => (
                <button key={b.cmd} type="button" onClick={() => applyFormat(b.cmd)} title={b.title}
                  className="flex h-8 w-8 items-center justify-center rounded text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-white/10 transition-colors">
                  <span className="material-symbols-outlined text-lg">{b.icon}</span>
                </button>
              ))}
              <div className="mx-1 h-4 w-px bg-gray-300 dark:bg-[#403b54]" />
              {[
                { cmd: 'justifyLeft', icon: 'format_align_left', title: 'Căn trái' },
                { cmd: 'justifyCenter', icon: 'format_align_center', title: 'Căn giữa' },
                { cmd: 'justifyRight', icon: 'format_align_right', title: 'Căn phải' },
              ].map(b => (
                <button key={b.cmd} type="button" onClick={() => applyFormat(b.cmd)} title={b.title}
                  className="flex h-8 w-8 items-center justify-center rounded text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-white/10 transition-colors">
                  <span className="material-symbols-outlined text-lg">{b.icon}</span>
                </button>
              ))}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-h-[500px]">
            {isPreview ? (
              <div className="overflow-y-auto">
                <ChapterRenderer content={formData.content} isEditable={false} />
              </div>
            ) : (
              <div
                ref={contentRef}
                contentEditable
                suppressContentEditableWarning
                onInput={syncContent}
                onBlur={syncContent}
                data-placeholder="Nhập nội dung chương..."
                className="h-full p-5 text-base leading-relaxed text-gray-900 dark:text-white bg-transparent outline-none overflow-y-auto [&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-gray-400"
              />
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#1C182F] rounded-xl border border-gray-200 dark:border-[#2A2640] p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Thông tin</h3>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Trạng thái</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-2 py-1 text-xs rounded-lg bg-gray-50 dark:bg-[#2A2640] border border-gray-300 dark:border-[#3c3858] text-gray-900 dark:text-white"
              >
                {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            {chapter && (
              <>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Chương số</span>
                  <span className="font-medium text-gray-900 dark:text-white">{chapter.chapterNumber}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Lượt xem</span>
                  <span className="font-medium text-gray-900 dark:text-white">{chapter.views || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Ngày tạo</span>
                  <span className="text-gray-700 dark:text-gray-300">{new Date(chapter.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </ManagerLayout>
  );
};

export default ManagerEditChapter;
