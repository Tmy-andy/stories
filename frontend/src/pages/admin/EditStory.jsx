import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { authService } from '../../services/authService';
import { getStoryById, updateStory } from '../../services/storyService';
import { MedalIcon, calculateLevel } from '../../utils/tierSystem';

function EditStory() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    coverImage: '',
    category: ['Tiên hiệp'],
    status: 'publishing',
    featured: false
  });
  const navigate = useNavigate();

  const categories = [
    'Tiên hiệp',
    'Kiếm hiệp',
    'Huyền huyễn',
    'Ngôn tình',
    'Đô thị',
    'Khoa huyễn',
    'Lịch sử',
    'Đồng nhân',
    'Linh dị'
  ];

  const statuses = [
    { label: 'Đang ra', value: 'publishing' },
    { label: 'Hoàn thành', value: 'completed' },
    { label: 'Hoãn vô thời hạn', value: 'paused_indefinite' },
    { label: 'Hoãn có thời hạn', value: 'paused_timed' },
    { label: 'Ngừng xuất bản', value: 'dropped' }
  ];

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/');
      return;
    }
    setUser(currentUser);
    // Set author to current user's username
    setFormData(prevData => ({
      ...prevData,
      author: currentUser.username
    }));
    loadStory();
  }, [id, navigate]);

  const loadStory = async () => {
    try {
      setLoading(true);
      const story = await getStoryById(id);
      const currentUser = authService.getCurrentUser();
      setFormData({
        title: story.title || '',
        author: currentUser.username,
        description: story.description || '',
        coverImage: story.coverImage || '',
        category: Array.isArray(story.category) ? story.category : [story.category || 'Tiên hiệp'],
        status: story.status || 'publishing',
        featured: story.featured || false
      });
    } catch (err) {
      setError('Không thể tải thông tin truyện');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'category') {
      // Handle category checkbox toggle
      const newCategory = [...formData.category];
      if (checked) {
        if (!newCategory.includes(value)) {
          newCategory.push(value);
        }
      } else {
        const index = newCategory.indexOf(value);
        if (index > -1) {
          newCategory.splice(index, 1);
        }
      }
      setFormData({
        ...formData,
        category: newCategory
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.description) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      setSubmitting(true);
      await updateStory(id, formData);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi cập nhật truyện');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/');
    window.location.reload();
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
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-text-light dark:text-text-dark"
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
          <div className="flex flex-wrap justify-between items-center gap-3 p-4 mb-6">
            <p className="text-text-light dark:text-text-dark text-4xl font-black leading-tight tracking-[-0.033em] font-display">
              Chỉnh sửa truyện
            </p>
            <Link
              to="/admin"
              className="flex items-center gap-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              <span className="text-sm font-medium">Quay lại</span>
            </Link>
          </div>

          {/* Form */}
          <div className="px-4">
            {loading ? (
              <div className="max-w-4xl mx-auto bg-white dark:bg-[#1c182d] rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
                <p className="text-text-secondary-light dark:text-text-secondary-dark">Đang tải...</p>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto bg-white dark:bg-[#1c182d] rounded-xl border border-gray-200 dark:border-gray-700 p-8">
                {error && (
                  <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-text-light dark:text-text-dark text-sm font-medium mb-2">
                      Tên truyện <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full h-12 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 text-text-light dark:text-text-dark focus:border-primary focus:ring-primary"
                      placeholder="Nhập tên truyện..."
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-text-light dark:text-text-dark text-sm font-medium mb-2">
                      Mô tả <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="6"
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-text-light dark:text-text-dark focus:border-primary focus:ring-primary"
                      placeholder="Nhập mô tả truyện..."
                      required
                    />
                  </div>

                  {/* Cover Image URL */}
                  <div>
                    <label className="block text-text-light dark:text-text-dark text-sm font-medium mb-2">
                      URL ảnh bìa
                    </label>
                    <input
                      type="text"
                      name="coverImage"
                      value={formData.coverImage}
                      onChange={handleChange}
                      className="w-full h-12 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 text-text-light dark:text-text-dark focus:border-primary focus:ring-primary"
                      placeholder="https://example.com/cover.jpg"
                    />
                    {formData.coverImage && (
                      <div className="mt-4">
                        <img
                          src={formData.coverImage}
                          alt="Preview"
                          className="h-48 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Category and Status */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-text-light dark:text-text-dark text-sm font-medium mb-2">
                        Thể loại (có thể chọn nhiều)
                      </label>
                      <div className="flex flex-col gap-2 p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                        {categories.map((cat) => (
                          <label key={cat} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              name="category"
                              value={cat}
                              checked={formData.category.includes(cat)}
                              onChange={handleChange}
                              className="w-4 h-4 rounded border-gray-300 dark:border-gray-700 text-primary focus:ring-primary"
                            />
                            <span className="text-text-light dark:text-text-dark text-sm">
                              {cat}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-text-light dark:text-text-dark text-sm font-medium mb-2">
                        Trạng thái
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full h-12 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 text-text-light dark:text-text-dark focus:border-primary focus:ring-primary"
                      >
                        {statuses.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Featured */}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      name="featured"
                      id="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-gray-300 dark:border-gray-700 text-primary focus:ring-primary"
                    />
                    <label htmlFor="featured" className="text-text-light dark:text-text-dark text-sm font-medium">
                      Đánh dấu là truyện nổi bật
                    </label>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex items-center gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 h-12 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                    <Link
                      to="/admin"
                      className="flex-1 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-700 text-text-light dark:text-text-dark font-bold hover:bg-gray-100 dark:hover:bg-white/10 transition-colors flex items-center justify-center"
                    >
                      Hủy
                    </Link>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default EditStory;
