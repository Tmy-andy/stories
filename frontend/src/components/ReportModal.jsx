import React, { useState } from 'react';
import api from '../services/api';

const REASONS = [
  { key: 'inappropriate', label: 'Nội dung không phù hợp' },
  { key: 'copyright', label: 'Vi phạm bản quyền' },
  { key: 'unwanted', label: 'Tôi không muốn nhìn thấy nội dung này' }
];

/**
 * Modal báo cáo bình luận
 * Props:
 *   commentId   — ID bình luận gốc
 *   replyId     — ID reply (nếu báo cáo reply)
 *   onClose     — callback đóng modal
 */
const ReportModal = ({ commentId, replyId, onClose }) => {
  const [selected, setSelected] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!selected) return;
    setSubmitting(true);
    setError('');
    try {
      await api.post('/reports', { commentId, replyId: replyId || null, reason: selected });
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Báo cáo Bình luận</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {done ? (
          <div className="px-5 py-8 flex flex-col items-center gap-3 text-center">
            <span className="material-symbols-outlined text-4xl text-green-500">check_circle</span>
            <p className="text-gray-800 dark:text-gray-200 font-medium">Báo cáo đã được gửi</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Chúng tôi sẽ xem xét và xử lý trong thời gian sớm nhất.</p>
            <button
              onClick={onClose}
              className="mt-2 px-5 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors"
            >
              Đóng
            </button>
          </div>
        ) : (
          <>
            <p className="px-5 pt-4 pb-2 text-sm text-gray-500 dark:text-gray-400">Vì sao bạn báo cáo bình luận này?</p>

            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {REASONS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setSelected(key)}
                  className={`flex items-center justify-between w-full px-5 py-3.5 text-sm transition-colors text-left ${
                    selected === key
                      ? 'bg-primary/10 text-primary dark:text-primary'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <span>{label}</span>
                  <span className="material-symbols-outlined text-base text-gray-400">chevron_right</span>
                </button>
              ))}
            </div>

            {error && (
              <p className="px-5 pt-2 text-xs text-red-500">{error}</p>
            )}

            <div className="px-5 py-4 flex justify-end gap-2 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selected || submitting}
                className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Đang gửi...' : 'Gửi báo cáo'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportModal;
