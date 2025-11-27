import React, { useState, useEffect } from 'react';
import { managerAPI } from '../../services/managerAPI';
import { Users, Search, Edit2, Trash2, Lock, Unlock, AlertCircle, Loader } from 'lucide-react';
import ManagerLayout from '../../components/manager/ManagerLayout';

const ManagerUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [pageInfo, setPageInfo] = useState({ page: 1, totalPages: 1 });
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    loadUsers();
  }, [pageInfo.page, filterRole, filterStatus, searchTerm]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await managerAPI.getUsers({
        page: pageInfo.page,
        limit: 10,
        role: filterRole !== 'all' ? filterRole : undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        search: searchTerm || undefined,
      });

      setUsers(response.data.users);
      setPageInfo(response.data.pageInfo);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải danh sách người dùng');
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await managerAPI.toggleUserStatus(id);
      setUsers(users.map(user =>
        user._id === id
          ? { ...user, isActive: !user.isActive }
          : user
      ));
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi cập nhật trạng thái');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;

    try {
      setDeleting(id);
      await managerAPI.deleteUser(id);
      setUsers(users.filter(user => user._id !== id));
      alert('Xóa người dùng thành công');
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi xóa người dùng');
    } finally {
      setDeleting(null);
    }
  };

  const getRoleBadge = (role) => {
    const roleMap = {
      admin: { label: 'Quản trị viên', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
      author: { label: 'Tác giả', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
      user: { label: 'Người dùng', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
    };
    const roleInfo = roleMap[role] || roleMap.user;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${roleInfo.color}`}>
        {roleInfo.label}
      </span>
    );
  };

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
        Hoạt động
      </span>
    ) : (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
        Đã khóa
      </span>
    );
  };

  if (loading && users.length === 0) {
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
          <h1 className="text-gray-900 dark:text-white text-3xl font-bold">Quản lý người dùng</h1>
          <p className="text-gray-600 dark:text-gray-400 text-base">Xem, tìm kiếm, và quản lý tất cả người dùng</p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPageInfo({ ...pageInfo, page: 1 });
              }}
              className="w-full h-11 pl-10 pr-4 bg-gray-50 dark:bg-[#2A2640] border border-gray-300 dark:border-[#3c3858] rounded-lg text-sm text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <select
              value={filterRole}
              onChange={(e) => {
                setFilterRole(e.target.value);
                setPageInfo({ ...pageInfo, page: 1 });
              }}
              className="h-11 px-4 bg-gray-50 dark:bg-[#2A2640] border border-gray-300 dark:border-[#3c3858] rounded-lg text-sm text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
            >
              <option value="all">Lọc vai trò</option>
              <option value="admin">Quản trị viên</option>
              <option value="author">Tác giả</option>
              <option value="user">Người dùng</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setPageInfo({ ...pageInfo, page: 1 });
              }}
              className="h-11 px-4 bg-gray-50 dark:bg-[#2A2640] border border-gray-300 dark:border-[#3c3858] rounded-lg text-sm text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
            >
              <option value="all">Lọc trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="locked">Khóa</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#1C182F] rounded-xl border border-gray-200 dark:border-[#2A2640] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600 dark:text-gray-300">
            <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-[#2A2640]">
              <tr>
                <th className="px-6 py-3">Tên người dùng</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Vai trò</th>
                <th className="px-6 py-3">Trạng thái</th>
                <th className="px-6 py-3">Ngày đăng ký</th>
                <th className="px-6 py-3">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className="bg-white dark:bg-[#1C182F] border-b dark:border-[#2A2640] hover:bg-gray-50 dark:hover:bg-[#2A2640]/50">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 text-xs">{user.email}</td>
                    <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                    <td className="px-6 py-4">{getStatusBadge(user.isActive)}</td>
                    <td className="px-6 py-4 text-xs">
                      {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleStatus(user._id, user.isActive)}
                          title={user.isActive ? 'Khóa' : 'Mở khóa'}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-[#2A2640] rounded transition-colors"
                        >
                          {user.isActive ? (
                            <Unlock className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Lock className="w-4 h-4 text-red-600" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          disabled={deleting === user._id}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-[#2A2640] rounded transition-colors disabled:opacity-50"
                        >
                          {deleting === user._id ? (
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
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    Không tìm thấy người dùng nào
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

export default ManagerUsers;
