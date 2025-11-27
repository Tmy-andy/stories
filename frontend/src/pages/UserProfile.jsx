import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { MedalIcon, calculateLevel, getLevelIcon } from '../utils/tierSystem';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

function UserProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    displayName: '',
    avatar: ''
  });
  const [previewAvatar, setPreviewAvatar] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState('personal');
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

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

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Vui lòng chọn một file ảnh');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage('Kích thước ảnh không được vượt quá 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target.result;
      
      const img = new Image();
      img.src = base64String;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
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
        
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
        setPreviewAvatar(compressedBase64);
        setFormData({ ...formData, avatar: compressedBase64 });
      };
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSave = async (e) => {
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
      await axios.put(
        `${API_URL}/auth/profile`,
        {
          displayName: formData.displayName,
          avatar: formData.avatar
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccessMessage('Lưu thay đổi thành công!');
      setTimeout(() => setSuccessMessage(''), 3000);
      loadProfile();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Lỗi khi lưu thay đổi');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const handleVerifyAge = async () => {
    if (!agreeTerms) {
      setErrorMessage('Vui lòng đồng ý với các điều khoản');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage('');
      setSuccessMessage('');

      const token = authService.getToken();
      await axios.put(
        `${API_URL}/auth/verify-age`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccessMessage('Xác minh độ tuổi thành công!');
      setIsAgeVerified(true);
      setAgreeTerms(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Lỗi khi xác minh độ tuổi');
    } finally {
      setSubmitting(false);
    }
  };

  const currentLevel = calculateLevel(user.membershipPoints || 0);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Đang tải hồ sơ...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Không thể tải hồ sơ người dùng</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 py-8 lg:py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Trang Thông Tin Tài Khoản
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Quản lý thông tin cá nhân và cài đặt tài khoản của bạn
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8 overflow-x-auto">
          <div className="flex gap-4 sm:gap-8">
            <button
              onClick={() => setActiveTab('personal')}
              className={`pb-3 px-2 font-bold text-sm border-b-[3px] transition-colors whitespace-nowrap ${
                activeTab === 'personal'
                  ? 'border-b-primary text-primary'
                  : 'border-b-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              Thông Tin Cá Nhân
            </button>
            <button
              onClick={() => setActiveTab('verify')}
              className={`pb-3 px-2 font-bold text-sm border-b-[3px] transition-colors whitespace-nowrap ${
                activeTab === 'verify'
                  ? 'border-b-primary text-primary'
                  : 'border-b-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              Xác Minh Độ Tuổi
            </button>
            <button
              onClick={() => setActiveTab('level')}
              className={`pb-3 px-2 font-bold text-sm border-b-[3px] transition-colors whitespace-nowrap ${
                activeTab === 'level'
                  ? 'border-b-primary text-primary'
                  : 'border-b-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              Cấp Độ &amp; Huy Chương
            </button>
          </div>
        </div>

        {/* Messages */}
        {errorMessage && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-300">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-600 dark:text-green-300">
            {successMessage}
          </div>
        )}

          {/* Tab Content - Personal Info */}
          {activeTab === 'personal' && (
            <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="space-y-8">
                {/* Avatar Section */}
                <div>
                  <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                    Ảnh Đại Diện
                  </h2>
                  <div className="flex items-center gap-4">
                    <div
                      className="w-20 h-20 rounded-full bg-center bg-cover border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center bg-gray-300 dark:bg-gray-600"
                      style={{
                        backgroundImage: previewAvatar ? `url('${previewAvatar}')` : 'none'
                      }}
                    >
                      {!previewAvatar && (
                        <span className="text-gray-600 dark:text-gray-300 font-bold text-2xl">
                          {user?.username?.[0]?.toUpperCase() || 'A'}
                        </span>
                      )}
                    </div>
                    <div>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        <span className="material-symbols-outlined">upload</span>
                        Chọn Ảnh
                      </button>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        JPG, PNG (tối đa 2MB, tự động nén)
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Display Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tên Hiển Thị
                  </label>
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
                    placeholder="Nhập tên hiển thị..."
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Tên này sẽ hiển thị trên hồ sơ công khai của bạn.
                  </p>
                </div>

                {/* Account Info */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                    Thông Tin Tài Khoản
                  </h2>
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <p className="w-full sm:w-32 font-medium text-sm text-gray-600 dark:text-gray-400">
                        Tên đăng nhập:
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-300">
                        <MedalIcon level={calculateLevel(user.membershipPoints || 0)} size={16} role={user.role} />
                        <p>@{user.username}</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <p className="w-full sm:w-32 font-medium text-sm text-gray-600 dark:text-gray-400">
                        Email:
                      </p>
                      <p className="text-sm text-gray-900 dark:text-gray-300">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                </button>
              </div>
            </div>
          )}

          {/* Tab Content - Level & Medals */}
          {activeTab === 'level' && (
            <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              {/* Membership Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-primary/10 dark:bg-primary/20 p-6 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-2xl text-primary">
                      workspace_premium
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Cấp Độ Thành Viên
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Cấp độ hiện tại:
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg text-primary">
                          {currentLevel}
                        </span>
                        <MedalIcon level={currentLevel} size={20} />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Điểm tích lũy:
                      </span>
                      <span className="font-bold text-lg text-gray-900 dark:text-white">
                        {(user.membershipPoints || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-2xl text-yellow-600 dark:text-yellow-400">
                      verified_user
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Trạng Thái Tác Giả
                    </h3>
                  </div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    {user.isAuthor ? 'Tác Giả Đã Xác Minh' : 'Người Dùng Thường'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {user.isAuthor
                      ? 'Bạn có quyền xuất bản truyện trên nền tảng.'
                      : 'Liên hệ quản trị viên để yêu cầu quyền tác giả.'}
                  </p>
                </div>
              </div>

              {/* Level System */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">
                  Hệ Thống Cấp Độ
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { name: 'Đồng', points: '0 - 499', bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-800' },
                    { name: 'Bạc', points: '500 - 1.999', bg: 'bg-gray-50 dark:bg-gray-700', border: 'border-gray-200 dark:border-gray-600' },
                    { name: 'Vàng', points: '2.000 - 4.999', bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-200 dark:border-yellow-800' },
                    { name: 'Kim Cương', points: '5.000+', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800' }
                  ].map((level) => (
                    <div
                      key={level.name}
                      className={`p-4 rounded-lg border ${level.bg} ${level.border} hover:shadow-md transition-shadow`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <MedalIcon level={level.name} size={24} />
                        <h4 className="font-bold text-gray-900 dark:text-white">
                          {level.name}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {level.points} điểm
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab Content - Age Verification */}
        {activeTab === 'verify' && (
          <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            {isAgeVerified ? (
              <div className="text-center py-12">
                <div className="flex justify-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-green-500 dark:text-green-400">
                      verified
                    </span>
                  </div>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Đã Xác Minh
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Tài khoản của bạn đã được xác minh độ tuổi
                </p>
              </div>
            ) : (
              <div className="max-w-md mx-auto py-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Xác Minh Độ Tuổi
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Để truy cập một số nội dung, bạn cần xác minh rằng bạn đã đủ 18 tuổi.
                </p>
                
                <div className="space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Tôi xác nhận rằng tôi đã đủ 18 tuổi và chịu trách nhiệm hoàn toàn về 
                      những thông tin mà tôi khai báo trên nền tảng này.
                    </span>
                  </label>
                </div>

                <button
                  onClick={handleVerifyAge}
                  disabled={!agreeTerms || submitting}
                  className="w-full mt-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? 'Đang xác minh...' : 'Xác Minh Độ Tuổi'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
