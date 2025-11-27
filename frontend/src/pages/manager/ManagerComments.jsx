import React, { useState, useEffect } from 'react';
import { managerAPI } from '../../services/managerAPI';
import { MessageSquare, Search, Trash2, Check, AlertCircle, Loader } from 'lucide-react';
import ManagerLayout from '../../components/manager/ManagerLayout';

const ManagerComments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('pending');
  const [pageInfo, setPageInfo] = useState({ page: 1, totalPages: 1 });

  useEffect(() => {
    loadComments();
  }, [pageInfo.page, filterStatus]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const response = await managerAPI.getComments({
        page: pageInfo.page,
        limit: 10,
        status: filterStatus,
      });

      setComments(response.data.comments);
      setPageInfo(response.data.pageInfo);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải danh sách bình luận');
      console.error('Error loading comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await managerAPI.approveComment(id);
      setComments(comments.filter(comment => comment._id !== id));
      alert('Duyệt bình luận thành công');
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi duyệt bình luận');
    }
  };

  const handleReject = async (id) => {
    try {
      await managerAPI.rejectComment(id);
      setComments(comments.filter(comment => comment._id !== id));
      alert('Từ chối bình luận thành công');
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi từ chối bình luận');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bình luận này?')) return;

    try {
      await managerAPI.deleteComment(id);
      setComments(comments.filter(comment => comment._id !== id));
      alert('Xóa bình luận thành công');
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi xóa bình luận');
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: 'Chờ duyệt', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
      approved: { label: 'Đã duyệt', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
      rejected: { label: 'Từ chối', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
    };
    const statusInfo = statusMap[status] || statusMap.pending;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
  };

  if (loading && comments.length === 0) {
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
          <h1 className="text-gray-900 dark:text-white text-3xl font-bold">Quản lý bình luận</h1>
          <p className="text-gray-600 dark:text-gray-400 text-base">Duyệt, chỉnh sửa và quản lý tất cả bình luận</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span className="text-red-700 dark:text-red-300 text-sm">{error}</span>
        </div>
      )}

      <div className="mb-6 bg-white dark:bg-[#1C182F] rounded-xl border border-gray-200 dark:border-[#2A2640] p-4">
        <div className="flex gap-4">
          <button
            onClick={() => {
              setFilterStatus('pending');
              setPageInfo({ ...pageInfo, page: 1 });
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'pending'
                ? 'bg-primary text-white'
                : 'bg-gray-100 dark:bg-[#2A2640] text-gray-700 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            Chờ duyệt
          </button>
          <button
            onClick={() => {
              setFilterStatus('approved');
              setPageInfo({ ...pageInfo, page: 1 });
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'approved'
                ? 'bg-primary text-white'
                : 'bg-gray-100 dark:bg-[#2A2640] text-gray-700 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            Đã duyệt
          </button>
          <button
            onClick={() => {
              setFilterStatus('rejected');
              setPageInfo({ ...pageInfo, page: 1 });
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'rejected'
                ? 'bg-primary text-white'
                : 'bg-gray-100 dark:bg-[#2A2640] text-gray-700 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            Từ chối
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1C182F] rounded-xl border border-gray-200 dark:border-[#2A2640] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600 dark:text-gray-300">
            <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-[#2A2640]">
              <tr>
                <th className="px-6 py-3 w-2/5">Nội dung bình luận</th>
                <th className="px-6 py-3">Tác giả</th>
                <th className="px-6 py-3">Ngày gửi</th>
                <th className="px-6 py-3">Trạng thái</th>
                <th className="px-6 py-3">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <tr key={comment._id} className="bg-white dark:bg-[#1C182F] border-b dark:border-[#2A2640] hover:bg-gray-50 dark:hover:bg-[#2A2640]/50">
                    <td className="px-6 py-4 max-w-xs truncate">{comment.content}</td>
                    <td className="px-6 py-4">{comment.user?.name || 'Anonymous'}</td>
                    <td className="px-6 py-4 text-xs">
                      {new Date(comment.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(comment.status)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {comment.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(comment._id)}
                              title="Duyệt"
                              className="p-1 hover:bg-gray-100 dark:hover:bg-[#2A2640] rounded transition-colors"
                            >
                              <Check className="w-4 h-4 text-green-600" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(comment._id)}
                          title="Xóa"
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
                    Không tìm thấy bình luận nào
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

export default ManagerComments;
