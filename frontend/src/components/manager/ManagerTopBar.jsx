import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService';

const ManagerTopBar = ({ currentPage }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const manager = authService.getManager();
    if (!manager) {
      navigate('/manager/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('managerToken');
    navigate('/manager/login');
  };

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { label: 'Tổng quan', icon: 'dashboard', path: '/manager/dashboard' },
    { label: 'Quản lý truyện', icon: 'auto_stories', path: '/manager/stories' },
    { label: 'Người dùng', icon: 'group', path: '/manager/users' },
    { label: 'Liên hệ', icon: 'mail', path: '/manager/contacts' },
    { label: 'Thể loại', icon: 'sell', path: '/manager/categories' },
    { label: 'Cài đặt', icon: 'settings', path: '/manager/settings' },
  ];

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } fixed md:sticky top-0 left-0 h-screen bg-white dark:bg-[#1C182F] border-r border-gray-200 dark:border-[#2A2640] p-4 transition-all duration-300 z-40 md:z-0 flex flex-col overflow-y-auto`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-2 py-4 border-b border-gray-200 dark:border-[#2A2640] mb-4">
          <div className="flex items-center justify-center size-10 rounded-lg bg-primary text-white flex-shrink-0">
            <span className="material-symbols-outlined text-xl">settings</span>
          </div>
          <div className="flex flex-col min-w-0">
            <h1 className="text-gray-900 dark:text-white text-base font-medium leading-normal truncate">
              Manager
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-xs font-normal leading-normal">
              Lam điệp cô ảnh
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 flex-1">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors whitespace-nowrap text-sm font-medium ${
                isActive(item.path)
                  ? 'bg-primary/20 text-primary dark:bg-primary/30 dark:text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-primary/10'
              }`}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors text-sm font-medium border-t border-gray-200 dark:border-[#2A2640] pt-4 mt-4"
        >
          <span className="material-symbols-outlined text-xl">logout</span>
          <span>Đăng xuất</span>
        </button>
      </aside>

      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-[#1C182F] border border-gray-200 dark:border-[#2A2640]"
      >
        <span className="material-symbols-outlined">
          {sidebarOpen ? 'close' : 'menu'}
        </span>
      </button>

      {/* Overlay when sidebar is open on mobile */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default ManagerTopBar;
