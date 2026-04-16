import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit2, Trash2, Eye, EyeOff, Loader, BookOpen } from 'lucide-react';
import ManagerLayout from '../../components/manager/ManagerLayout';
import { managerAPI } from '../../services/managerAPI';

const ManagerChapters = () => {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newChapter, setNewChapter] = useState({ title: '', content: '' });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [storyRes, chapRes] = await Promise.all([
          managerAPI.getStoryById(storyId),
          managerAPI.getChapters(storyId),
        ]);
        if (cancelled) return;
        setStory(storyRes.data.story);
        setChapters(chapRes.data.chapters || []);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || 'Lỗi tải dữ liệu');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [storyId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newChapter.title.trim() || !newChapter.content.trim()) {
      alert('Vui lòng điền tiêu đề và nội dung');
      return;
    }
    try {
      setSaving(true);
      await managerAPI.createChapter({
        storyId: story._id,
        chapterNumber: chapters.length + 1,
        title: newChapter.title,
        content: newChapter.content,
      });
      const res = await managerAPI.getChapters(storyId);
      setChapters(res.data.chapters || []);
      setNewChapter({ title: '', content: '' });
      setShowAdd(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi thêm chương');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (chapterId, currentStatus) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    try {
      await managerAPI.updateChapterStatus(chapterId, newStatus);
      setChapters(prev => prev.map(c => c._id === chapterId ? { ...c, status: newStatus } : c));
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi cập nhật trạng thái');
    }
  };

  const handleDelete = async (chapterId, num) => {
    if (!window.confirm(`Xóa chương ${num}?`)) return;
    try {
      setDeleting(chapterId);
      await managerAPI.deleteChapter(chapterId);
      setChapters(prev => prev.filter(c => c._id !== chapterId));
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi xóa chương');
    } finally {
      setDeleting(null);
    }
  };

  const statusBadge = (s) => {
    const map = {
      published: { label: 'Công khai', cls: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
      draft: { label: 'Nháp', cls: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
      archived: { label: 'Lưu trữ', cls: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300' },
    };
    const info = map[s] || map.draft;
    return <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${info.cls}`}>{info.label}</span>;
  };

  return (
    <ManagerLayout>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/manager/stories')} className="p-2 hover:bg-gray-100 dark:hover:bg-[#2A2640] rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
        <div className="flex-1">
          <h1 className="text-gray-900 dark:text-white text-2xl font-bold">
            {loading ? 'Đang tải...' : `Chương — ${story?.title}`}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{chapters.length} chương</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Thêm chương
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      {showAdd && (
        <form onSubmit={handleAdd} className="mb-6 bg-white dark:bg-[#1C182F] rounded-xl border border-gray-200 dark:border-[#2A2640] p-5 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Thêm chương mới (Chương {chapters.length + 1})</h3>
          <input
            type="text"
            value={newChapter.title}
            onChange={(e) => setNewChapter(p => ({ ...p, title: e.target.value }))}
            placeholder="Tiêu đề chương..."
            className="w-full px-3 py-2 bg-gray-50 dark:bg-[#2A2640] border border-gray-300 dark:border-[#3c3858] rounded-lg text-sm text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
          />
          <textarea
            value={newChapter.content}
            onChange={(e) => setNewChapter(p => ({ ...p, content: e.target.value }))}
            placeholder="Nội dung..."
            rows={6}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-[#2A2640] border border-gray-300 dark:border-[#3c3858] rounded-lg text-sm text-gray-900 dark:text-white focus:ring-primary focus:border-primary resize-y"
          />
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors">
              {saving ? 'Đang lưu...' : 'Tạo chương'}
            </button>
            <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 bg-gray-100 dark:bg-[#2A2640] text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-[#3c3858] transition-colors">
              Hủy
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12 text-gray-500 dark:text-gray-400">
          <Loader className="w-5 h-5 animate-spin mr-2" /> Đang tải...
        </div>
      ) : chapters.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-lg font-medium">Chưa có chương nào</p>
          <p className="text-sm mt-1">Bấm "Thêm chương" để bắt đầu.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#1C182F] rounded-xl border border-gray-200 dark:border-[#2A2640] overflow-hidden">
          <table className="w-full text-sm text-left text-gray-600 dark:text-gray-300">
            <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-[#2A2640]">
              <tr>
                <th className="px-4 py-3 w-16">#</th>
                <th className="px-4 py-3">Tiêu đề</th>
                <th className="px-4 py-3 w-28">Trạng thái</th>
                <th className="px-4 py-3 w-28">Ngày tạo</th>
                <th className="px-4 py-3 w-32">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {chapters.map((ch) => (
                <tr key={ch._id} className="border-b dark:border-[#2A2640] hover:bg-gray-50 dark:hover:bg-[#2A2640]/50">
                  <td className="px-4 py-3 font-medium">{ch.chapterNumber}</td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{ch.title}</td>
                  <td className="px-4 py-3">{statusBadge(ch.status)}</td>
                  <td className="px-4 py-3 text-xs">{new Date(ch.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link
                        to={`/manager/stories/${storyId}/chapters/${ch._id}/edit`}
                        title="Chỉnh sửa"
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#2A2640] rounded transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-blue-600" />
                      </Link>
                      <button
                        onClick={() => handleToggleStatus(ch._id, ch.status)}
                        title={ch.status === 'published' ? 'Chuyển nháp' : 'Công khai'}
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#2A2640] rounded transition-colors"
                      >
                        {ch.status === 'published'
                          ? <Eye className="w-4 h-4 text-green-600" />
                          : <EyeOff className="w-4 h-4 text-gray-400" />}
                      </button>
                      <button
                        onClick={() => handleDelete(ch._id, ch.chapterNumber)}
                        disabled={deleting === ch._id}
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#2A2640] rounded transition-colors disabled:opacity-50"
                      >
                        {deleting === ch._id
                          ? <Loader className="w-4 h-4 text-red-600 animate-spin" />
                          : <Trash2 className="w-4 h-4 text-red-600" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </ManagerLayout>
  );
};

export default ManagerChapters;
