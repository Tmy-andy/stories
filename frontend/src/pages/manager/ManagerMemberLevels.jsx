import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import ManagerTopBar from '../../components/manager/ManagerTopBar';

const ManagerMemberLevels = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [levels, setLevels] = useState([
    { _id: 1, name: 'Đồng', pointsRequired: 100, benefit: 'Huy hiệu Đồng trên hồ sơ' },
    { _id: 2, name: 'Bạc', pointsRequired: 500, benefit: 'Đọc trước 1 chương mới' },
    { _id: 3, name: 'Vàng', pointsRequired: 2000, benefit: 'Huy hiệu Vàng và tùy chỉnh giao diện' },
    { _id: 4, name: 'Kim Cương', pointsRequired: 5000, benefit: 'Tất cả lợi ích và quà tặng đặc biệt' },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    pointsRequired: '',
    benefit: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const manager = authService.getManager();
    if (!manager) {
      navigate('/manager/login');
    }
    // Load levels from localStorage
    const savedLevels = localStorage.getItem('memberLevels');
    if (savedLevels) {
      setLevels(JSON.parse(savedLevels));
    }
  }, [navigate]);

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({ name: '', pointsRequired: '', benefit: '' });
    setShowAddModal(true);
  };

  const handleEdit = (level) => {
    setEditingId(level._id);
    setFormData({
      name: level.name,
      pointsRequired: level.pointsRequired,
      benefit: level.benefit,
    });
    setShowAddModal(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      let updatedLevels;
      
      if (editingId) {
        updatedLevels = levels.map(l =>
          l._id === editingId
            ? { ...l, ...formData }
            : l
        );
      } else {
        updatedLevels = [
          ...levels,
          { _id: Date.now(), ...formData, pointsRequired: parseInt(formData.pointsRequired) }
        ];
      }
      
      setLevels(updatedLevels);
      localStorage.setItem('memberLevels', JSON.stringify(updatedLevels));
      setShowAddModal(false);
      setSuccessMessage(editingId ? 'Cập nhật cấp độ thành công!' : 'Thêm cấp độ thành công!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving level:', error);
      alert('Lỗi khi lưu cấp độ');
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
      const updatedLevels = levels.filter(l => l._id !== deleteId);
      setLevels(updatedLevels);
      localStorage.setItem('memberLevels', JSON.stringify(updatedLevels));
      setSuccessMessage('Xóa cấp độ thành công!');
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting level:', error);
      alert('Lỗi khi xóa cấp độ');
    }
  };

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      <ManagerTopBar currentPage="Member Levels" />
      
      <main className="flex-1 p-6 lg:p-10">
        <div className="w-full max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <div className="flex flex-col">
              <h1 className="text-gray-900 dark:text-white text-3xl font-bold leading-tight">
                Quản Lý Cấp Độ Thành Viên
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">
                Thêm, sửa, hoặc xóa các cấp độ thành viên và lợi ích.
              </p>
            </div>
            <button
              onClick={handleAddNew}
              className="flex items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-wide shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <span className="material-symbols-outlined text-xl">add_circle</span>
              <span className="truncate">Thêm Cấp Độ Mới</span>
            </button>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg">
              {successMessage}
            </div>
          )}

          {/* Table */}
          <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1D1B2E] shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-[#9f9db9]">
                      Tên Cấp Độ
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-[#9f9db9]">
                      Điểm Yêu Cầu
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-[#9f9db9]">
                      Mô Tả Lợi Ích
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-[#9f9db9]">
                      Hành Động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                  {levels.map((level) => (
                    <tr key={level._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {level.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-[#9f9db9]">
                        {level.pointsRequired.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-[#9f9db9]">
                        {level.benefit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => handleEdit(level)}
                            className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors"
                          >
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(level._id)}
                            className="text-red-500/70 hover:text-red-500 transition-colors"
                          >
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative flex w-full max-w-md flex-col rounded-xl bg-white dark:bg-[#1D1B2E] shadow-2xl dark:shadow-black/50">
            <div className="border-b border-gray-200 dark:border-white/10 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Xóa Cấp Độ
              </h2>
            </div>

            <div className="p-6">
              <p className="text-gray-700 dark:text-gray-300">
                Bạn chắc chắn muốn xóa cấp độ này? Hành động này không thể hoàn tác.
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
                {editingId ? 'Chỉnh Sửa Cấp Độ' : 'Thêm Cấp Độ Mới'}
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <label className="flex flex-col">
                <p className="text-gray-900 dark:text-white text-sm font-medium leading-normal pb-2">
                  Tên Cấp Độ
                </p>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Nhập tên cấp độ"
                />
              </label>

              <label className="flex flex-col">
                <p className="text-gray-900 dark:text-white text-sm font-medium leading-normal pb-2">
                  Điểm Yêu Cầu
                </p>
                <input
                  type="number"
                  value={formData.pointsRequired}
                  onChange={(e) => setFormData({ ...formData, pointsRequired: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Nhập điểm yêu cầu"
                />
              </label>

              <label className="flex flex-col">
                <p className="text-gray-900 dark:text-white text-sm font-medium leading-normal pb-2">
                  Mô Tả Lợi Ích
                </p>
                <input
                  type="text"
                  value={formData.benefit}
                  onChange={(e) => setFormData({ ...formData, benefit: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Nhập mô tả lợi ích"
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
                disabled={loading || !formData.name || !formData.pointsRequired || !formData.benefit}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {editingId ? 'Cập Nhật' : 'Thêm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerMemberLevels;
