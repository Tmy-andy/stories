import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import ManagerLayout from '../../components/manager/ManagerLayout';
import settingsService from '../../services/settingsService';

const ManagerSettings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general');
  const [bannerFile, setBannerFile] = useState(null);
  const [settings, setSettings] = useState({
    siteTitle: '',
    tagline: '',
    siteDescription: '',
    contactEmail: '',
    bannerTitle: '',
    bannerSubtitle: '',
    bannerButtonText: '',
    bannerImage: null,
    maintenanceMode: false,
    requireEmailVerification: true,
    maxStoriesPerUser: 10,
    maxChaptersPerStory: 1000,
    enableComments: true,
    enableFavorites: true,
    enableReadingHistory: true,
  });
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const manager = authService.getManager();
    if (!manager) {
      navigate('/manager/login');
    }
    loadSettings();
  }, [navigate]);

  const loadSettings = async () => {
    try {
      setPageLoading(true);
      const response = await settingsService.getSettings();
      setSettings(response.data || {});
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setPageLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleBannerImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      // Upload banner image if selected
      if (bannerFile) {
        const uploadResponse = await settingsService.uploadBannerImage(bannerFile);
        settings.bannerImage = uploadResponse.bannerImage;
        setBannerFile(null);
      }

      // Save settings to API
      const response = await settingsService.updateSettings(settings);
      setSettings(response.data);
      setSuccessMessage('Lưu cài đặt thành công!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Lỗi khi lưu cài đặt: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
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
      <div className="w-full mx-auto">
        {/* Header */}
        <header className="flex flex-wrap justify-between gap-4 items-center mb-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-neutral-text-light dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
                Cài Đặt Site
              </h1>
              <p className="text-neutral-text-dark text-base font-normal leading-normal">
                Quản lý thông tin chung, nội dung trang chủ, SEO và bảo mật.
              </p>
            </div>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center justify-center gap-2 h-10 px-6 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-base">save</span>
              Lưu Thay Đổi
            </button>
          </header>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg">
              {successMessage}
            </div>
          )}

          {/* Tabs */}
          <div className="mb-8 pb-3 border-b border-neutral-border-light dark:border-neutral-border-dark">
            <div className="flex gap-8">
              {['general', 'homepage', 'security'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-[13px] pt-4 border-b-[3px] transition-colors ${
                    activeTab === tab
                      ? 'border-primary text-primary dark:text-white'
                      : 'border-transparent text-neutral-text-dark hover:text-primary dark:hover:text-white'
                  }`}
                >
                  <p className="text-sm font-bold leading-normal tracking-[0.015em] capitalize">
                    {tab === 'general' && 'Thông Tin Chung'}
                    {tab === 'homepage' && 'Trang Chủ'}
                    {tab === 'security' && 'Bảo Mật'}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-10">
            {/* General Information */}
            {activeTab === 'general' && (
              <section>
                <h2 className="text-neutral-text-light dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-4">
                  Thông Tin Chung
                </h2>
                <div className="p-6 bg-container-light dark:bg-container-dark rounded-xl border border-neutral-border-light dark:border-neutral-border-dark space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label className="flex flex-col">
                      <p className="text-neutral-text-light dark:text-white text-base font-medium leading-normal pb-2">
                        Tên Site
                      </p>
                      <input
                        type="text"
                        name="siteTitle"
                        value={settings.siteTitle}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-neutral-border-light dark:border-neutral-border-dark bg-background-light dark:bg-background-dark text-neutral-text-light dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </label>
                    <label className="flex flex-col">
                      <p className="text-neutral-text-light dark:text-white text-base font-medium leading-normal pb-2">
                        Slogan
                      </p>
                      <input
                        type="text"
                        name="tagline"
                        value={settings.tagline}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-neutral-border-light dark:border-neutral-border-dark bg-background-light dark:bg-background-dark text-neutral-text-light dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </label>
                  </div>
                  <label className="flex flex-col">
                    <p className="text-neutral-text-light dark:text-white text-base font-medium leading-normal pb-2">
                      Email Liên Hệ
                    </p>
                    <input
                      type="email"
                      name="contactEmail"
                      value={settings.contactEmail}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-neutral-border-light dark:border-neutral-border-dark bg-background-light dark:bg-background-dark text-neutral-text-light dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </label>
                </div>
              </section>
            )}

            {/* Homepage Customization */}
            {activeTab === 'homepage' && (
              <section>
                <h2 className="text-neutral-text-light dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-4">
                  Tùy Chỉnh Trang Chủ
                </h2>
                <div className="p-6 bg-container-light dark:bg-container-dark rounded-xl border border-neutral-border-light dark:border-neutral-border-dark space-y-6">
                  <h3 className="text-lg font-semibold text-neutral-text-light dark:text-white">
                    Banner Hero
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label className="flex flex-col">
                      <p className="text-neutral-text-light dark:text-white text-base font-medium leading-normal pb-2">
                        Tiêu Đề Banner
                      </p>
                      <input
                        type="text"
                        name="bannerTitle"
                        value={settings.bannerTitle}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-neutral-border-light dark:border-neutral-border-dark bg-background-light dark:bg-background-dark text-neutral-text-light dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </label>
                    <label className="flex flex-col">
                      <p className="text-neutral-text-light dark:text-white text-base font-medium leading-normal pb-2">
                        Text Nút CTA
                      </p>
                      <input
                        type="text"
                        name="bannerButtonText"
                        value={settings.bannerButtonText}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-neutral-border-light dark:border-neutral-border-dark bg-background-light dark:bg-background-dark text-neutral-text-light dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </label>
                  </div>
                  
                  <div className="border-t border-neutral-border-light dark:border-neutral-border-dark pt-6">
                    <h3 className="text-lg font-semibold text-neutral-text-light dark:text-white mb-4">
                      Ảnh Banner
                    </h3>
                    {settings.bannerImage && (
                      <div className="mb-4">
                        <img src={settings.bannerImage} alt="Banner preview" className="w-full h-48 object-cover rounded-lg" />
                      </div>
                    )}
                    <label className="flex flex-col">
                      <p className="text-neutral-text-light dark:text-white text-base font-medium leading-normal pb-2">
                        Tải Lên Ảnh Banner Mới
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBannerImageChange}
                        className="w-full px-4 py-2 rounded-lg border border-neutral-border-light dark:border-neutral-border-dark bg-background-light dark:bg-background-dark text-neutral-text-light dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                      {bannerFile && (
                        <p className="text-sm text-primary mt-2">
                          ✓ File được chọn: {bannerFile.name}
                        </p>
                      )}
                    </label>
                  </div>
                </div>
              </section>
            )}

            {/* Security */}
            {activeTab === 'security' && (
              <section>
                <h2 className="text-neutral-text-light dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-4">
                  Bảo Mật
                </h2>
                <div className="p-6 bg-container-light dark:bg-container-dark rounded-xl border border-neutral-border-light dark:border-neutral-border-dark space-y-6">
                  <div className="space-y-4">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="maintenanceMode"
                        checked={settings.maintenanceMode}
                        onChange={handleInputChange}
                        className="w-4 h-4 rounded border-neutral-border-light dark:border-neutral-border-dark"
                      />
                      <div className="flex flex-col">
                        <p className="text-neutral-text-light dark:text-white text-base font-medium">
                          Chế Độ Bảo Trì
                        </p>
                        <p className="text-neutral-text-dark text-sm">
                          Tạm dừng hoạt động site để bảo trì
                        </p>
                      </div>
                    </label>
                  </div>
                  <div className="pt-4 border-t border-neutral-border-light dark:border-neutral-border-dark">
                    <label className="flex flex-col">
                      <p className="text-neutral-text-light dark:text-white text-base font-medium leading-normal pb-2">
                        Số Truyện Tối Đa Mỗi Người Dùng
                      </p>
                      <input
                        type="number"
                        name="maxStoriesPerUser"
                        value={settings.maxStoriesPerUser}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg border border-neutral-border-light dark:border-neutral-border-dark bg-background-light dark:bg-background-dark text-neutral-text-light dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </label>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Footer */}
          <footer className="mt-10 border-t border-neutral-border-light dark:border-neutral-border-dark pt-6 flex justify-end">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center justify-center gap-2 h-10 px-6 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-base">save</span>
              Lưu Thay Đổi
            </button>
          </footer>
      </div>
    </ManagerLayout>
  );
};

export default ManagerSettings;
