import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import axios from 'axios';
import { MedalIcon, calculateLevel } from '../utils/tierSystem';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

function EditProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    displayName: '',
    avatar: ''
  });
  const [previewAvatar, setPreviewAvatar] = useState('');
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    loadProfile();
  }, [navigate]);

  const loadProfile = async () => {
    try {
      const token = authService.getToken();
      const response = await axios.get(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userData = response.data.user;
      setUser(userData);
      setFormData({
        displayName: userData.displayName || userData.username || '',
        avatar: userData.avatar || ''
      });
      setPreviewAvatar(userData.avatar || '');
      setIsAgeVerified(userData.isAgeVerified || false);
    } catch (error) {
      console.error('Error loading profile:', error);
      setErrorMessage('Không thể tải thông tin hồ sơ');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa xác minh';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (e) {
      return 'Ngày không hợp lệ';
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Vui lòng chọn một file ảnh');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage('Kích thước ảnh không được vượt quá 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target.result;
      
      // Nén ảnh nếu quá lớn
      const img = new Image();
      img.src = base64String;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Giới hạn kích thước (max 300px)
        const maxSize = 300;
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Nén với quality 0.7
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        setPreviewAvatar(compressedBase64);
        setFormData(prev => ({
          ...prev,
          avatar: compressedBase64
        }));
      };
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrorMessage('');
  };

  const handleVerifyAge = async () => {
    if (!agreeTerms) {
      setErrorMessage('Bạn phải xác nhận đã đủ 18 tuổi và chịu trách nhiệm về thông tin khai báo');
      return;
    }

    try {
      setLoading(true);
      const token = authService.getToken();
      const response = await axios.put(
        `${API_URL}/auth/verify-age`,
        { isAgeVerified: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsAgeVerified(true);
      setUser(prev => ({
        ...prev,
        isAgeVerified: true,
        ageVerifiedAt: response.data.user.ageVerifiedAt
      }));
      setSuccessMessage('Xác minh độ tuổi thành công!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error verifying age:', error);
      setErrorMessage(error.response?.data?.message || 'Xác minh thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.displayName.trim()) {
      setErrorMessage('Tên hiển thị không được trống');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');
      setSuccessMessage('');

      const token = authService.getToken();
      const response = await axios.put(
        `${API_URL}/auth/profile`,
        {
          displayName: formData.displayName,
          avatar: formData.avatar
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local storage
      const updatedUser = {
        ...user,
        ...response.data.user
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      setSuccessMessage('Cập nhật hồ sơ thành công!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage(error.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-light dark:text-white mb-2">
          Trang Thông Tin Tài Khoản
        </h1>
        <p className="text-text-muted-light dark:text-text-muted-dark">
          Quản lý thông tin cá nhân và cài đặt tài khoản của bạn
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-white/10">
        <button
          onClick={() => setActiveTab('info')}
          className={`pb-3 font-semibold transition-colors ${
            activeTab === 'info'
              ? 'text-primary border-b-2 border-primary'
              : 'text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-white'
          }`}
        >
          Thông Tin Cá Nhân
        </button>
        <button
          onClick={() => setActiveTab('verification')}
          className={`pb-3 font-semibold transition-colors ${
            activeTab === 'verification'
              ? 'text-primary border-b-2 border-primary'
              : 'text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-white'
          }`}
        >
          Xác Minh Độ Tuổi
        </button>
        <button
          onClick={() => setActiveTab('status')}
          className={`pb-3 font-semibold transition-colors ${
            activeTab === 'status'
              ? 'text-primary border-b-2 border-primary'
              : 'text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-white'
          }`}
        >
          Cấp Độ & Huy Chương
        </button>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400">
          ✓ {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
          ✕ {errorMessage}
        </div>
      )}

      {/* Tab Content */}
      {activeTab === 'info' && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-[#1e1c27] rounded-lg p-6 border border-gray-200 dark:border-white/10">
          {/* Avatar Section */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-text-light dark:text-white mb-4">
              Ảnh Đại Diện
            </h2>
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24">
                {previewAvatar ? (
                  <img
                    src={previewAvatar}
                    alt="Avatar preview"
                    className="w-24 h-24 rounded-full object-cover border-2 border-primary"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-4xl font-bold text-primary border-2 border-primary">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mb-2 flex px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  <span className="material-symbols-outlined mr-2">upload</span>
                  Chọn Ảnh
                </button>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                  Chấp nhận JPG, PNG (tối đa 2MB, tự động nén)
                </p>
              </div>
            </div>
          </div>

          {/* Display Name Section */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-text-light dark:text-white mb-2">
              Tên Hiển Thị
            </label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleInputChange}
              placeholder="Nhập tên hiển thị của bạn"
              className="w-full px-4 py-2 border border-gray-300 dark:border-white/10 rounded-lg bg-background-light dark:bg-background-dark text-text-light dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-1">
              Tên này sẽ hiển thị trên hồ sơ công khai của bạn
            </p>
          </div>

          {/* Account Info */}
          <div className="mb-8 bg-gray-50 dark:bg-white/5 p-4 rounded-lg">
            <h3 className="font-semibold text-text-light dark:text-white mb-3">
              Thông Tin Tài Khoản
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted-light dark:text-text-muted-dark">Tên đăng nhập:</span>
                <div className="flex items-center gap-2">
                  <MedalIcon level={calculateLevel(user.membershipPoints || 0)} size={14} />
                  <span className="font-semibold text-text-light dark:text-white">{user.username}</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted-light dark:text-text-muted-dark">Email:</span>
                <span className="font-semibold text-text-light dark:text-white">{user.email}</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Đang cập nhật...' : 'Lưu Thay Đổi'}
          </button>
        </form>
      )}

      {activeTab === 'verification' && (
        <div className="bg-white dark:bg-[#1e1c27] rounded-lg p-6 border border-gray-200 dark:border-white/10">
          {isAgeVerified ? (
            <div className="text-center py-8">
              <div className="mb-4">
                <span className="material-symbols-outlined text-5xl text-green-500">
                  verified_user
                </span>
              </div>
              <h2 className="text-2xl font-bold text-text-light dark:text-white mb-2">
                Đã Xác Minh
              </h2>
              <p className="text-text-muted-light dark:text-text-muted-dark mb-4">
                Tài khoản của bạn đã được xác minh tuổi từ{' '}
                <span className="font-semibold text-text-light dark:text-white">
                  {formatDate(user.ageVerifiedAt)}
                </span>
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined">warning</span>
                  Xác Minh Độ Tuổi Bắt Buộc
                </h3>
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  Để tiếp tục sử dụng nền tảng này, bạn cần xác minh rằng bạn đã đủ 18 tuổi.
                  Điều này giúp bảo vệ cộng đồng của chúng tôi.
                </p>
              </div>

              <div className="border-t border-gray-200 dark:border-white/10 pt-6">
                <h3 className="font-semibold text-text-light dark:text-white mb-4">
                  Xác Nhận Thông Tin
                </h3>
                
                <div className="space-y-4 mb-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                    />
                    <span className="text-sm text-text-light dark:text-white">
                      Tôi xác nhận rằng tôi đã đủ 18 tuổi và chịu trách nhiệm hoàn toàn về 
                      những thông tin mà tôi khai báo trên nền tảng này.
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      disabled
                      className="mt-1 w-4 h-4 rounded border-gray-300 text-primary cursor-not-allowed"
                    />
                    <span className="text-sm text-text-muted-light dark:text-text-muted-dark">
                      Tôi đã đọc và chấp nhận{' '}
                      <a href="#" className="text-primary hover:underline">
                        Điều Khoản Dịch Vụ
                      </a>
                    </span>
                  </label>
                </div>

                <button
                  onClick={handleVerifyAge}
                  disabled={!agreeTerms || loading}
                  className="w-full px-4 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Đang xác minh...' : 'Xác Minh Độ Tuổi'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'status' && (
        <div className="bg-white dark:bg-[#1e1c27] rounded-lg p-6 border border-gray-200 dark:border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Membership Section */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-lg p-6 border border-primary/20">
              <h3 className="text-lg font-bold text-text-light dark:text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-2xl text-primary">workspace_premium</span>
                Cấp Độ Thành Viên
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-text-muted-light dark:text-text-muted-dark">Cấp độ hiện tại:</span>
                  <span className="font-bold text-lg text-primary">{user.membershipLevel}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted-light dark:text-text-muted-dark">Điểm tích lũy:</span>
                  <span className="font-bold text-lg text-text-light dark:text-white">
                    {(user.membershipPoints || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Author Badge Section */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-50/50 dark:from-yellow-900/20 dark:to-yellow-900/10 rounded-lg p-6 border border-yellow-200/50 dark:border-yellow-800/50">
              <h3 className="text-lg font-bold text-text-light dark:text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-2xl">edit</span>
                Trạng Thái Tác Giả
              </h3>
              <div className="space-y-3">
                {user.isAuthor ? (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-xl text-yellow-600 dark:text-yellow-400">
                        verified
                      </span>
                      <span className="font-semibold text-text-light dark:text-white">
                        Tác Giả Đã Xác Minh
                      </span>
                    </div>
                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                      Bạn có quyền xuất bản truyện trên nền tảng.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-xl text-gray-400">
                        lock
                      </span>
                      <span className="font-semibold text-text-muted-light dark:text-text-muted-dark">
                        Người Dùng Thường
                      </span>
                    </div>
                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                      Liên hệ quản trị viên để yêu cầu quyền tác giả.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Membership Levels Info */}
          <div className="mt-8 border-t border-gray-200 dark:border-white/10 pt-8">
            <h3 className="text-lg font-bold text-text-light dark:text-white mb-4">
              Hệ Thống Cấp Độ
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { level: 'Đồng', points: '0 - 499', color: 'orange' },
                { level: 'Bạc', points: '500 - 1.999', color: 'gray' },
                { level: 'Vàng', points: '2.000 - 4.999', color: 'yellow' },
                { level: 'Kim Cương', points: '5.000+', color: 'blue' }
              ].map((tier) => (
                <div key={tier.level} className={`p-3 rounded-lg bg-${tier.color}-50 dark:bg-${tier.color}-900/20 border border-${tier.color}-200 dark:border-${tier.color}-800`}>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {tier.level}
                  </div>
                  <div className={`text-sm text-${tier.color}-700 dark:text-${tier.color}-300`}>
                    {tier.points} điểm
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditProfile;
