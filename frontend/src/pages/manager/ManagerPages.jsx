import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Edit2, ExternalLink, Loader } from 'lucide-react';
import ManagerLayout from '../../components/manager/ManagerLayout';
import { managerAPI } from '../../services/managerAPI';

const ManagerPages = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await managerAPI.getPages();
        if (!cancelled) setPages(res.data?.data || []);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || 'Lỗi khi tải danh sách trang');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <ManagerLayout>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <FileText className="w-7 h-7 text-primary" />
            <h1 className="text-gray-900 dark:text-white text-3xl font-bold">Trang tĩnh</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-base">
            Cập nhật nội dung 3 trang: Giới thiệu, Điều khoản, Bảo mật.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12 text-gray-500 dark:text-gray-400">
          <Loader className="w-5 h-5 animate-spin mr-2" /> Đang tải...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pages.map((p) => (
            <div key={p.slug} className="bg-white dark:bg-[#1C182F] rounded-xl border border-gray-200 dark:border-[#2A2640] p-6 flex flex-col gap-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{p.title}</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">/{p.slug}</p>
                {p.subtitle && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-3">{p.subtitle}</p>
                )}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {p.fieldCount} trường • {p.updatedAt ? `Sửa lúc ${new Date(p.updatedAt).toLocaleDateString('vi-VN')}` : 'Chưa chỉnh sửa'}
              </div>
              <div className="flex gap-2 mt-auto">
                <Link
                  to={`/manager/pages/${p.slug}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Edit2 className="w-4 h-4" /> Chỉnh sửa
                </Link>
                <Link
                  to={`/${p.slug === 'about' ? 'about' : p.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-3 py-2 bg-gray-100 dark:bg-[#2A2640] text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-[#3c3858] transition-colors"
                  title="Xem trang"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </ManagerLayout>
  );
};

export default ManagerPages;
