import React, { useState, useEffect } from 'react';
import ManagerLayout from '../../components/manager/ManagerLayout';
import api from '../../services/managerAPI';

const STATUS_LABELS = {
  pending: { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  reviewed: { label: 'Đã xử lý', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  dismissed: { label: 'Bỏ qua', color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400' }
};

const REASON_LABELS = {
  inappropriate: 'Nội dung không phù hợp',
  copyright: 'Vi phạm bản quyền',
  unwanted: 'Không muốn nhìn thấy'
};

const ManagerReports = () => {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({ pending: 0, reviewed: 0, dismissed: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('pending');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadReports();
  }, [filterStatus, page]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/reports?status=${filterStatus}&page=${page}&limit=20`);
      setReports(res.data.reports);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const res = await api.get('/api/reports/stats');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (id, status) => {
    try {
      await api.patch(`/api/reports/${id}`, { status });
      setReports(prev => prev.filter(r => r._id !== id));
      setStats(prev => ({
        ...prev,
        pending: status !== 'pending' ? Math.max(0, prev.pending - 1) : prev.pending,
        [status]: prev[status] + 1
      }));
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  return (
    <ManagerLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Báo cáo Bình luận</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { key: 'total', label: 'Tổng', color: 'text-gray-700 dark:text-gray-200' },
            { key: 'pending', label: 'Chờ xử lý', color: 'text-yellow-600 dark:text-yellow-400' },
            { key: 'reviewed', label: 'Đã xử lý', color: 'text-green-600 dark:text-green-400' },
            { key: 'dismissed', label: 'Bỏ qua', color: 'text-gray-500 dark:text-gray-400' }
          ].map(({ key, label, color }) => (
            <div key={key} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
              <p className={`text-2xl font-bold ${color}`}>{stats[key]}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {[
            { value: 'pending', label: 'Chờ xử lý' },
            { value: 'reviewed', label: 'Đã xử lý' },
            { value: 'dismissed', label: 'Bỏ qua' },
            { value: 'all', label: 'Tất cả' }
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => { setFilterStatus(value); setPage(1); }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filterStatus === value
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            Không có báo cáo nào
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((report) => (
              <div key={report._id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Reason + status */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {REASON_LABELS[report.reason] || report.reason}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_LABELS[report.status]?.color}`}>
                        {STATUS_LABELS[report.status]?.label}
                      </span>
                    </div>

                    {/* Comment content */}
                    {report.commentId?.content && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2 mb-2 line-clamp-3">
                        "{report.commentId.content}"
                      </p>
                    )}

                    {/* Detail */}
                    {report.detail && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 italic mb-1.5">
                        Chi tiết: "{report.detail}"
                      </p>
                    )}

                    {/* Reporter */}
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Báo cáo bởi:{' '}
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {report.reportedBy?.displayName || report.reportedBy?.username || 'Ẩn danh'}
                      </span>
                      {' · '}
                      {new Date(report.createdAt).toLocaleDateString('vi-VN', {
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>

                  {/* Actions */}
                  {report.status === 'pending' && (
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleUpdate(report._id, 'reviewed')}
                        className="px-3 py-1.5 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                      >
                        Đã xử lý
                      </button>
                      <button
                        onClick={() => handleUpdate(report._id, 'dismissed')}
                        className="px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        Bỏ qua
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm disabled:opacity-40 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              ‹
            </button>
            <span className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300">{page} / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm disabled:opacity-40 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              ›
            </button>
          </div>
        )}
      </div>
    </ManagerLayout>
  );
};

export default ManagerReports;
