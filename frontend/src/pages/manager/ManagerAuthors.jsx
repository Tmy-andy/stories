import React, { useState, useEffect } from 'react';
import { managerAPI } from '../../services/managerAPI';
import { Users, Search, Edit2, Trash2, Lock, Unlock, AlertCircle, Loader } from 'lucide-react';
import ManagerLayout from '../../components/manager/ManagerLayout';

const ManagerAuthors = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [pageInfo, setPageInfo] = useState({ page: 1, totalPages: 1 });

  useEffect(() => {
    loadAuthors();
  }, [pageInfo.page, filterStatus, searchTerm]);

  const loadAuthors = async () => {
    try {
      setLoading(true);
      const response = await managerAPI.getAuthors({
        page: pageInfo.page,
        limit: 10,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        search: searchTerm || undefined,
      });

      setAuthors(response.data.authors);
      setPageInfo(response.data.pageInfo);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải danh sách tác giả');
      console.error('Error loading authors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await managerAPI.toggleAuthorStatus(id);
      setAuthors(authors.map(author =>
        author._id === id
          ? { ...author, isActive: !author.isActive }
          : author
      ));
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi cập nhật trạng thái');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tác giả này?')) return;

    try {
      await managerAPI.deleteAuthor(id);
      setAuthors(authors.filter(author => author._id !== id));
      alert('Xóa tác giả thành công');
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi xóa tác giả');
    }
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

  if (loading && authors.length === 0) {
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
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-gray-900 dark:text-white text-3xl font-bold">Quản lý Tác giả</h1>
          <p className="text-gray-600 dark:text-gray-400 text-base">Tìm kiếm, lọc và quản lý tài khoản tác giả</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span className="text-red-700 dark:text-red-300 text-sm">{error}</span>
        </div>
      )}

      <div className="mb-6 bg-white dark:bg-[#1C182F] rounded-xl border border-gray-200 dark:border-[#2A2640] p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm tác giả bằng tên hoặc email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPageInfo({ ...pageInfo, page: 1 });
              }}
              className="w-full h-11 pl-10 pr-4 bg-gray-50 dark:bg-[#2A2640] border border-gray-300 dark:border-[#3c3858] rounded-lg text-sm text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setPageInfo({ ...pageInfo, page: 1 });
            }}
            className="h-11 px-4 bg-gray-50 dark:bg-[#2A2640] border border-gray-300 dark:border-[#3c3858] rounded-lg text-sm text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
          >
            <option value="all">Lọc theo trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="locked">Bị khóa</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1C182F] rounded-xl border border-gray-200 dark:border-[#2A2640] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600 dark:text-gray-300">
            <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-[#2A2640]">
              <tr>
                <th className="px-6 py-3">Tên tác giả</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Trạng thái</th>
                <th className="px-6 py-3">Ngày tham gia</th>
                <th className="px-6 py-3">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {authors.length > 0 ? (
                authors.map((author) => (
                  <tr key={author._id} className="bg-white dark:bg-[#1C182F] border-b dark:border-[#2A2640] hover:bg-gray-50 dark:hover:bg-[#2A2640]/50">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {author.name}
                    </td>
                    <td className="px-6 py-4 text-xs">{author.email}</td>
                    <td className="px-6 py-4">{getStatusBadge(author.isActive)}</td>
                    <td className="px-6 py-4 text-xs">
                      {new Date(author.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleStatus(author._id)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-[#2A2640] rounded transition-colors"
                        >
                          {author.isActive ? (
                            <Unlock className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Lock className="w-4 h-4 text-red-600" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(author._id)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-[#2A2640] rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    Không tìm thấy tác giả nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ManagerLayout>
  );
};

export default ManagerAuthors;
