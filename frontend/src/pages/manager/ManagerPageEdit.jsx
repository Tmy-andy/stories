import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader, RotateCcw } from 'lucide-react';
import ManagerLayout from '../../components/manager/ManagerLayout';
import { managerAPI } from '../../services/managerAPI';

const ManagerPageEdit = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(null);
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await managerAPI.getPage(slug);
        if (cancelled) return;
        const data = res.data?.data;
        setPage(data);
        const initial = {};
        (data?.fields || []).forEach(f => { initial[f.key] = f.value ?? ''; });
        setValues(initial);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || 'Lỗi khi tải trang');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [slug]);

  const handleChange = (key, v) => {
    setValues(prev => ({ ...prev, [key]: v }));
    setSuccess('');
  };

  const handleReset = (key) => {
    const def = (page?.fields || []).find(f => f.key === key)?.default ?? '';
    setValues(prev => ({ ...prev, [key]: def }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await managerAPI.updatePage(slug, values);
      const data = res.data?.data;
      if (data) {
        setPage(data);
        const next = {};
        (data.fields || []).forEach(f => { next[f.key] = f.value ?? ''; });
        setValues(next);
      }
      setSuccess('Đã lưu thành công');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi lưu');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ManagerLayout>
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/manager/pages')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-[#2A2640] rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
        <div className="flex-1">
          <h1 className="text-gray-900 dark:text-white text-2xl font-bold">
            {page?.title || 'Đang tải...'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">/{slug}</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Đang lưu...' : 'Lưu'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 text-green-700 dark:text-green-300 text-sm">
          {success}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12 text-gray-500 dark:text-gray-400">
          <Loader className="w-5 h-5 animate-spin mr-2" /> Đang tải...
        </div>
      ) : (
        <div className="bg-white dark:bg-[#1C182F] rounded-xl border border-gray-200 dark:border-[#2A2640] p-6 space-y-5">
          {(page?.fields || []).map(f => (
            <div key={f.key} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-900 dark:text-white">
                  {f.label}
                </label>
                <button
                  onClick={() => handleReset(f.key)}
                  className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
                  title="Khôi phục mặc định"
                >
                  <RotateCcw className="w-3 h-3" /> Mặc định
                </button>
              </div>
              {f.type === 'text' ? (
                <input
                  type="text"
                  value={values[f.key] ?? ''}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#2A2640] border border-gray-300 dark:border-[#3c3858] rounded-lg text-sm text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
                />
              ) : (
                <textarea
                  value={values[f.key] ?? ''}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#2A2640] border border-gray-300 dark:border-[#3c3858] rounded-lg text-sm text-gray-900 dark:text-white focus:ring-primary focus:border-primary resize-y"
                />
              )}
              <p className="text-xs text-gray-400 dark:text-gray-500">Key: <code className="font-mono">{f.key}</code></p>
            </div>
          ))}
        </div>
      )}
    </ManagerLayout>
  );
};

export default ManagerPageEdit;
