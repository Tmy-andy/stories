import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import ManagerLayout from '../../components/manager/ManagerLayout';

const ManagerCategories = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([
    { _id: '1', name: 'Tiên hiệp', storyCount: 0 },
    { _id: '2', name: 'Kiếm hiệp', storyCount: 0 },
    { _id: '3', name: 'Huyền huyễn', storyCount: 0 },
    { _id: '4', name: 'Ngôn tình', storyCount: 0 },
    { _id: '5', name: 'Đô thị', storyCount: 0 },
    { _id: '6', name: 'Khoa huyễn', storyCount: 0 },
    { _id: '7', name: 'Lịch sử', storyCount: 0 },
    { _id: '8', name: 'Đồng nhân', storyCount: 0 },
    { _id: '9', name: 'Linh dị', storyCount: 0 },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const manager = authService.getManager();
    if (!manager) {
      navigate('/manager/login');
    }
    loadCategories();
  }, [navigate]);

  const loadCategories = async () => {
    try {
      // Load từ localStorage hoặc API
      const savedCategories = localStorage.getItem('categories');
      if (savedCategories) {
        setCategories(JSON.parse(savedCategories));
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleAddNew = () => {
    setEditingId(null);
    setCategoryName('');
    setShowAddModal(true);
  };

  const handleEdit = (category) => {
    setEditingId(category._id);
    setCategoryName(category.name);
    setShowAddModal(true);
  };

  const handleSave = async () => {
    if (!categoryName.trim()) {
      alert('Vui lòng nhập tên thể loại');
      return;
    }

    try {
      setLoading(true);
      let updatedCategories;

      if (editingId) {
        updatedCategories = categories.map(c =>
          c._id === editingId
            ? { ...c, name: categoryName }
            : c
        );
      } else {
        updatedCategories = [
          ...categories,
          { _id: Date.now().toString(), name: categoryName, storyCount: 0 }
        ];
      }

      setCategories(updatedCategories);
      localStorage.setItem('categories', JSON.stringify(updatedCategories));
      setShowAddModal(false);
      setSuccessMessage(editingId ? 'Cập nhật thể loại thành công!' : 'Thêm thể loại thành công!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Lỗi khi lưu thể loại');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const updatedCategories = categories.filter(c => c._id !== deleteId);
      setCategories(updatedCategories);
      localStorage.setItem('categories', JSON.stringify(updatedCategories));
      setSuccessMessage('Xóa thể loại thành công!');
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Lỗi khi xóa thể loại');
    }
  };

  return (
    <ManagerLayout>
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex flex-col">
              <h1 className="text-gray-900 dark:text-white text-3xl font-bold leading-tight">
                Quản lý Thể loại
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">
                Thêm, sửa, hoặc xóa các thể loại truyện.
              </p>
            </div>
            <button
              onClick={handleAddNew}
              className="flex items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-wide shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <span className="material-symbols-outlined text-xl">add_circle</span>
              <span className="truncate">Thêm Thể loại Mới</span>
            </button>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg">
              {successMessage}
            </div>
          )}

          {/* Table */}
          <div className="flex flex-col @container">
            <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1D1B2E] shadow-sm">
              <table className="min-w-full">
                <thead className="bg-gray-50 dark:bg-white/5">
                  <tr className="border-b border-gray-200 dark:border-white/10">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Tên Thể loại
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Số lượng truyện
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                  {categories.map((category) => (
                    <tr key={category._id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {category.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {category.storyCount} truyện
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end items-center gap-4">
                          <button
                            onClick={() => handleEdit(category)}
                            aria-label="Edit Category"
                            className="text-primary hover:text-primary/80 transition-colors"
                          >
                            <span className="material-symbols-outlined text-xl">edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(category._id)}
                            aria-label="Delete Category"
                            className="text-red-600 hover:text-red-500 transition-colors"
                          >
                            <span className="material-symbols-outlined text-xl">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Info */}
          <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Hiển thị {categories.length} thể loại
          </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative flex w-full max-w-md flex-col rounded-xl bg-white dark:bg-[#1D1B2E] shadow-2xl dark:shadow-black/50">
            <div className="border-b border-gray-200 dark:border-white/10 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Xóa Thể loại
              </h2>
            </div>

            <div className="p-6">
              <p className="text-gray-700 dark:text-gray-300">
                Bạn chắc chắn muốn xóa thể loại này? Hành động này không thể hoàn tác.
              </p>
            </div>

            <div className="border-t border-gray-200 dark:border-white/10 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/10 rounded-lg hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative flex w-full max-w-md flex-col rounded-xl bg-white dark:bg-[#1D1B2E] shadow-2xl dark:shadow-black/50">
            <div className="border-b border-gray-200 dark:border-white/10 px-6 py-4 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {editingId ? 'Chỉnh Sửa Thể loại' : 'Thêm Thể loại Mới'}
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6">
              <label className="flex flex-col">
                <p className="text-gray-900 dark:text-white text-sm font-medium leading-normal pb-2">
                  Tên Thể loại
                </p>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSave()}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Nhập tên thể loại"
                  autoFocus
                />
              </label>
            </div>

            <div className="border-t border-gray-200 dark:border-white/10 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/10 rounded-lg hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={loading || !categoryName.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {editingId ? 'Cập Nhật' : 'Thêm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ManagerLayout>
  );
};

export default ManagerCategories;
