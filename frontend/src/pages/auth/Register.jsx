import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Kiểm tra đồng ý điều khoản
    if (!formData.agreeToTerms) {
      setError('Bạn phải đồng ý với Điều khoản &amp; Điều kiện');
      return;
    }

    // Kiểm tra mật khẩu khớp
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    // Kiểm tra độ dài mật khẩu
    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, agreeToTerms, ...registerData } = formData;
      await authService.register(registerData);
      navigate('/');
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-[#1e1c27] rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center text-text-light dark:text-white mb-2">
            Đăng ký
          </h2>
          <p className="text-center text-text-muted-light dark:text-text-muted-dark mb-8">
            Tạo tài khoản mới để bắt đầu
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-light dark:text-white mb-2">
                Tên người dùng
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                minLength={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-white/10 rounded-lg bg-white dark:bg-secondary-dark text-text-light dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                placeholder="Tên của bạn"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-light dark:text-white mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-white/10 rounded-lg bg-white dark:bg-secondary-dark text-text-light dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-light dark:text-white mb-2">
                Mật khẩu
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-4 py-3 border border-gray-300 dark:border-white/10 rounded-lg bg-white dark:bg-secondary-dark text-text-light dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                placeholder="••••••••"
              />
              <p className="mt-1 text-xs text-text-muted-light dark:text-text-muted-dark">
                Tối thiểu 6 ký tự
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-light dark:text-white mb-2">
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-white/10 rounded-lg bg-white dark:bg-secondary-dark text-text-light dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="agreeToTerms"
                id="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="w-4 h-4 rounded border-gray-300 dark:border-white/10 text-primary focus:ring-2 focus:ring-primary"
              />
              <label htmlFor="agreeToTerms" className="ml-2 text-sm text-text-light dark:text-white">
                Tôi đồng ý với{' '}
                <Link to="/terms-and-conditions" className="text-primary hover:underline font-medium">
                  Điều khoản &amp; Điều kiện
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-text-muted-light dark:text-text-muted-dark">
              Đã có tài khoản?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
