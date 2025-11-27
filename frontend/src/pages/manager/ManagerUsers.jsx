import React, { useState, useEffect } from 'react';
import { managerAPI } from '../../services/managerAPI';
import { Users, Search, Edit2, Trash2, Lock, Unlock, AlertCircle, Loader } from 'lucide-react';
import ManagerLayout from '../../components/manager/ManagerLayout';
import { MedalIcon, calculateLevel } from '../../utils/tierSystem';

const ManagerUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [pageInfo, setPageInfo] = useState({ page: 1, totalPages: 1 });
  const [deleting, setDeleting] = useState(null);
  const [blockingUserId, setBlockingUserId] = useState(null);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [sortBy, setSortBy] = useState('membershipPoints'); // 'membershipPoints' or 'createdAt'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
  const [currentUserRole, setCurrentUserRole] = useState('manager'); // Get from token
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUserForRole, setSelectedUserForRole] = useState(null);
  const [newRole, setNewRole] = useState('user');
  const [updatingRole, setUpdatingRole] = useState(false);

  useEffect(() => {
    // Get current user role from token (manager or user token if admin)
    let role = 'manager';
    
    // First try manager token
    const managerToken = localStorage.getItem('managerToken');
    if (managerToken) {
      try {
        const decoded = JSON.parse(atob(managerToken.split('.')[1]));
        role = decoded.role || 'manager';
      } catch (e) {
        // Fallback to user token if manager token is invalid
      }
    }
    
    // If manager token not found, check user token (for admin users)
    if (role === 'manager') {
      const userToken = localStorage.getItem('token');
      if (userToken) {
        try {
          const decoded = JSON.parse(atob(userToken.split('.')[1]));
          if (decoded.role === 'admin') {
            role = 'admin';
          }
        } catch (e) {
          role = 'manager';
        }
      }
    }
    
    setCurrentUserRole(role);
    loadUsers();
  }, [pageInfo.page, filterRole, filterStatus, searchTerm, sortBy, sortOrder]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await managerAPI.getUsers({
        page: pageInfo.page,
        limit: 10,
        role: filterRole !== 'all' ? filterRole : undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        search: searchTerm || undefined,
        sort: sortBy,
        order: sortOrder,
      });

      // Client-side sorting by points for more reliable sorting
      let users = response.data.users;
      if (sortBy === 'membershipPoints') {
        users.sort((a, b) => {
          const aPoints = a.membershipPoints || 0;
          const bPoints = b.membershipPoints || 0;
          return sortOrder === 'desc' ? bPoints - aPoints : aPoints - bPoints;
        });
      }

      setUsers(users);
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

  const handleBlockUser = (id) => {
    setBlockingUserId(id);
    setShowBlockModal(true);
  };

  const confirmBlockUser = async () => {
    if (!blockingUserId) return;

    try {
      const user = users.find(u => u._id === blockingUserId);
      if (!user) return;

      await managerAPI.blockUser(blockingUserId);
      
      // Xóa user khỏi danh sách
      setUsers(users.filter(u => u._id !== blockingUserId));
      setShowBlockModal(false);
      alert(`Đã chặn người dùng ${user.email} thành công${user.ipAddress ? ` (IP: ${user.ipAddress})` : ''}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi chặn người dùng');
    }
  };

  const handleChangeRole = (userId, currentRole) => {
    setSelectedUserForRole(userId);
    setNewRole(currentRole);
    setShowRoleModal(true);
  };

  const confirmChangeRole = async () => {
    if (!selectedUserForRole) return;

    try {
      setUpdatingRole(true);
      await managerAPI.updateUserRole(selectedUserForRole, newRole);
      setUsers(users.map(user =>
        user._id === selectedUserForRole
          ? { ...user, role: newRole }
          : user
      ));
      setShowRoleModal(false);
      alert('Cập nhật vai trò thành công');
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi cập nhật vai trò');
    } finally {
      setUpdatingRole(false);
    }
  };

  const getRoleBadge = (role) => {
    const roleMap = {
      admin: { label: 'Quản trị viên', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
      manager: { label: 'Quản lý', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' },
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
                <th className="px-6 py-3">Cấp độ</th>
                <th className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-[#3c3858]" onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}>
                  Điểm {sortBy === 'membershipPoints' && (sortOrder === 'desc' ? '↓' : '↑')}
                </th>
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
                      {user.displayName || user.name}
                    </td>
                    <td className="px-6 py-4 text-xs">{user.email}</td>
                    <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {user.role === 'admin' ? (
                          <MedalIcon level="Admin" size={18} />
                        ) : (user.membershipPoints || 0) > 0 ? (
                          <>
                            <MedalIcon level={calculateLevel(user.membershipPoints || 0)} size={18} />
                            <span className="text-xs font-medium capitalize">
                              {['Đồng', 'Bạc', 'Vàng', 'Kim Cương'][calculateLevel(user.membershipPoints || 0)]}
                            </span>
                          </>
                        ) : (
                          <span className="text-xs font-medium text-gray-400">Chưa xếp hạng</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-primary">{user.membershipPoints || 0}</td>
                    <td className="px-6 py-4">{getStatusBadge(user.isActive)}</td>
                    <td className="px-6 py-4 text-xs">
                      {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {/* Manager không thể thao tác với admin */}
                        {currentUserRole !== 'admin' && user.role === 'admin' ? (
                          <span className="text-xs text-gray-400">Không có quyền</span>
                        ) : (
                          <>
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
                              onClick={() => handleBlockUser(user._id)}
                              title="Chặn hoàn toàn (IP & Email)"
                              className="p-1 hover:bg-gray-100 dark:hover:bg-[#2A2640] rounded transition-colors text-orange-600"
                            >
                              <AlertCircle className="w-4 h-4" />
                            </button>
                            {/* Admin-only: Change role button */}
                            {currentUserRole === 'admin' && user.role !== 'admin' && (
                              <button
                                onClick={() => handleChangeRole(user._id, user.role)}
                                title="Thay đổi vai trò"
                                className="p-1 hover:bg-gray-100 dark:hover:bg-[#2A2640] rounded transition-colors text-purple-600"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            )}
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
                          </>
                        )}
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

      {/* Change Role Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative flex w-full max-w-md flex-col rounded-xl bg-white dark:bg-[#1C182F] shadow-2xl dark:shadow-black/50">
            <div className="border-b border-gray-200 dark:border-white/10 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Thay Đổi Vai Trò
              </h2>
            </div>

            <div className="p-6 space-y-4">
              {selectedUserForRole && users.find(u => u._id === selectedUserForRole) && (
                <>
                  <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900">
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      Người dùng: <strong>{users.find(u => u._id === selectedUserForRole)?.email}</strong>
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Chọn vai trò mới:
                    </label>
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-[#2A2640] border border-gray-300 dark:border-[#3c3858] rounded-lg text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
                    >
                      <option value="user">Người dùng</option>
                      <option value="manager">Quản lý</option>
                      <option value="admin">Quản trị viên</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            <div className="border-t border-gray-200 dark:border-white/10 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setShowRoleModal(false)}
                disabled={updatingRole}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/10 rounded-lg hover:bg-gray-200 dark:hover:bg-white/20 transition-colors disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={confirmChangeRole}
                disabled={updatingRole}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {updatingRole && <Loader className="w-4 h-4 animate-spin" />}
                {updatingRole ? 'Đang cập nhật...' : 'Xác nhận'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Block User Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative flex w-full max-w-md flex-col rounded-xl bg-white dark:bg-[#1C182F] shadow-2xl dark:shadow-black/50">
            <div className="border-b border-gray-200 dark:border-white/10 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Chặn Người Dùng
              </h2>
            </div>

            <div className="p-6">
              {blockingUserId && users.find(u => u._id === blockingUserId) && (
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-900">
                    <p className="text-sm text-orange-800 dark:text-orange-300">
                      ⚠️ Hành động này sẽ chặn hoàn toàn:
                    </p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Email:</strong> {users.find(u => u._id === blockingUserId)?.email}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>IP Address:</strong> {users.find(u => u._id === blockingUserId)?.ipAddress || 'N/A'}
                    </p>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mt-4">
                    Người dùng này sẽ không thể đăng nhập lại bằng email hoặc IP này.
                  </p>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 dark:border-white/10 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setShowBlockModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/10 rounded-lg hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmBlockUser}
                className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Chặn Ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </ManagerLayout>
  );
};

export default ManagerUsers;
