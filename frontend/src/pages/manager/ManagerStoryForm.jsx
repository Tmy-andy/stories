import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader, BookOpen, Image as ImageIcon, Star } from 'lucide-react';
import ManagerLayout from '../../components/manager/ManagerLayout';
import { managerAPI } from '../../services/managerAPI';
import categoryService from '../../services/categoryService';

const STATUS_OPTIONS = [
  { value: 'publishing', label: 'Đang ra', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
  { value: 'completed', label: 'Hoàn thành', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
  { value: 'paused_indefinite', label: 'Hoãn vô thời hạn', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
  { value: 'paused_timed', label: 'Hoãn có thời hạn', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' },
  { value: 'dropped', label: 'Ngừng xuất bản', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
];

const EMPTY = {
  title: '',
  description: '',
  coverImage: '',
  category: [],
  status: 'publishing',
  featured: false,
};

const ManagerStoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [coverOk, setCoverOk] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await categoryService.getCategories();
        if (!cancelled) setCategories(data.categories || []);
      } catch (err) {
        console.error('Lỗi tải thể loại:', err);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await managerAPI.getStoryById(id);
        const s = res.data.story;
        if (cancelled) return;
        const categoryIds = Array.isArray(s.category)
          ? s.category.map(c => (typeof c === 'string' ? c : c._id))
          : [];
        setForm({
          title: s.title || '',
          description: s.description || '',
          coverImage: s.coverImage || '',
          category: categoryIds,
          status: s.status || 'publishing',
          featured: !!s.featured,
        });
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || 'Không tải được truyện');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id, isEdit]);

  const update = (patch) => setForm(prev => ({ ...prev, ...patch }));

  const toggleCategory = (catId) => {
    setForm(prev => ({
      ...prev,
      category: prev.category.includes(catId)
        ? prev.category.filter(c => c !== catId)
        : [...prev.category, catId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim() || !form.description.trim()) {
      setError('Tiêu đề và mô tả là bắt buộc');
      return;
    }
    try {
      setSaving(true);
      if (isEdit) {
        await managerAPI.updateStory(id, form);
      } else {
        await managerAPI.createStory(form);
      }
      navigate('/manager/stories');
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi lưu truyện');
    } finally {
      setSaving(false);
    }
  };

  const selectedCategories = useMemo(
    () => categories.filter(c => form.category.includes(c._id)),
    [categories, form.category]
  );

  const statusInfo = STATUS_OPTIONS.find(s => s.value === form.status) || STATUS_OPTIONS[0];

  return (
    <ManagerLayout>
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/manager/stories')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-[#2A2640] rounded-lg transition-colors"
          aria-label="Quay lại"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
        <div className="flex-1">
          <h1 className="text-gray-900 dark:text-white text-2xl font-bold">
            {isEdit ? 'Chỉnh sửa truyện' : 'Thêm truyện mới'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isEdit ? 'Cập nhật thông tin truyện' : 'Điền thông tin truyện — preview hiển thị bên phải'}
          </p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving || loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Đang lưu...' : (isEdit ? 'Lưu thay đổi' : 'Tạo truyện')}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12 text-gray-500 dark:text-gray-400">
          <Loader className="w-5 h-5 animate-spin mr-2" /> Đang tải...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white dark:bg-[#1C182F] rounded-xl border border-gray-200 dark:border-[#2A2640] p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
                Tiêu đề <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => update({ title: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-[#2A2640] border border-gray-300 dark:border-[#3c3858] rounded-lg text-sm text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
                placeholder="VD: Lam điệp cô ảnh"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
                Mô tả <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => update({ description: e.target.value })}
                rows={6}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-[#2A2640] border border-gray-300 dark:border-[#3c3858] rounded-lg text-sm text-gray-900 dark:text-white focus:ring-primary focus:border-primary resize-y"
                placeholder="Tóm tắt truyện..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
                URL ảnh bìa
              </label>
              <input
                type="text"
                value={form.coverImage}
                onChange={(e) => { update({ coverImage: e.target.value }); setCoverOk(true); }}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-[#2A2640] border border-gray-300 dark:border-[#3c3858] rounded-lg text-sm text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
                Thể loại
              </label>
              <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-[#2A2640] border border-gray-300 dark:border-[#3c3858] rounded-lg max-h-52 overflow-y-auto">
                {categories.length === 0 ? (
                  <p className="text-xs text-gray-500 dark:text-gray-400">Chưa có thể loại</p>
                ) : categories.map(cat => {
                  const active = form.category.includes(cat._id);
                  return (
                    <button
                      key={cat._id}
                      type="button"
                      onClick={() => toggleCategory(cat._id)}
                      className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${active
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white dark:bg-[#1C182F] text-gray-700 dark:text-gray-300 border-gray-300 dark:border-[#3c3858] hover:border-primary'}`}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
                  Trạng thái
                </label>
                <select
                  value={form.status}
                  onChange={(e) => update({ status: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#2A2640] border border-gray-300 dark:border-[#3c3858] rounded-lg text-sm text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => update({ featured: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-900 dark:text-white inline-flex items-center gap-1">
                    <Star className="w-4 h-4" /> Truyện nổi bật
                  </span>
                </label>
              </div>
            </div>
          </form>

          {/* Preview */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <div className="bg-white dark:bg-[#1C182F] rounded-xl border border-gray-200 dark:border-[#2A2640] p-6">
              <div className="flex items-center gap-2 mb-4 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                <BookOpen className="w-4 h-4" /> Xem trước
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-40 flex-shrink-0">
                  <div className="aspect-[2/3] bg-gray-100 dark:bg-[#2A2640] rounded-lg overflow-hidden flex items-center justify-center border border-gray-200 dark:border-[#3c3858]">
                    {form.coverImage && coverOk ? (
                      <img
                        src={form.coverImage}
                        alt="cover"
                        onError={() => setCoverOk(false)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 flex-wrap mb-2">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white break-words">
                      {form.title || 'Tiêu đề truyện'}
                    </h2>
                    {form.featured && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                        <Star className="w-3 h-3" /> Nổi bật
                      </span>
                    )}
                  </div>
                  <div className="mb-3">
                    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                  {selectedCategories.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {selectedCategories.map(c => (
                        <span key={c._id} className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary dark:bg-primary/20">
                          {c.name}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                    {form.description || 'Mô tả truyện sẽ hiển thị ở đây...'}
                  </p>
                </div>
              </div>
            </div>

            {!isEdit && (
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                Sau khi tạo, vào tab Quản lý chương để thêm chương đầu tiên.
              </p>
            )}
          </div>
        </div>
      )}
    </ManagerLayout>
  );
};

export default ManagerStoryForm;
