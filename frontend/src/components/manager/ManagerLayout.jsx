import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LogOut, 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  MessageSquare, 
  Mail,
  Settings,
  Menu,
  X
} from 'lucide-react';

const ManagerLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Check if user has token
    const token = localStorage.getItem('managerToken');
    if (!token) {
      navigate('/manager/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('managerToken');
    navigate('/manager/login');
  };

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    {
      label: 'Tổng quan',
      icon: LayoutDashboard,
      path: '/manager/dashboard',
    },
    {
      label: 'Quản lý truyện',
      icon: BookOpen,
      path: '/manager/stories',
    },
    // {
    //   label: 'Tác giả',
    //   icon: Users,
    //   path: '/manager/authors',
    // },
    {
      label: 'Người dùng',
      icon: Users,
      path: '/manager/users',
    },
    {
      label: 'Bình luận',
      icon: MessageSquare,
      path: '/manager/comments',
    },
    {
      label: 'Liên hệ',
      icon: Mail,
      path: '/manager/contacts',
    },
    {
      label: 'Thể loại',
      icon: MessageSquare,
      path: '/manager/categories',
    },
    {
      label: 'Cấp độ',
      icon: Users,
      path: '/manager/levels',
    },
    {
      label: 'Cài đặt',
      icon: Settings,
      path: '/manager/settings',
    },
  ];

  return (
    <div className="relative flex min-h-screen w-full bg-background-light dark:bg-background-dark">
      {/* Sidebar */}
      <aside className={`${
        sidebarOpen ? 'w-64' : 'w-0'
      } fixed md:sticky top-0 left-0 flex flex-col h-screen bg-white dark:bg-[#1C182F] border-r border-gray-200 dark:border-[#2A2640] p-4 transition-all duration-300 z-40 md:z-0`}>
        <div className="flex flex-col gap-4 h-full overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center gap-3 px-2 py-4">
            <div className="flex items-center justify-center size-10 rounded-lg bg-primary text-white flex-shrink-0">
              <Settings className="w-6 h-6" />
            </div>
            <div className="flex flex-col min-w-0">
              <h1 className="text-gray-900 dark:text-white text-base font-medium leading-normal truncate">Manager</h1>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-normal leading-normal">Lam điệp cô ảnh</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
                    isActive(item.path)
                      ? 'bg-primary/20 text-primary dark:bg-primary/30 dark:text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-primary/10'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium leading-normal">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="mt-auto">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium leading-normal">Đăng xuất</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-[#1C182F] border border-gray-200 dark:border-[#2A2640]"
      >
        {sidebarOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <Menu className="w-5 h-5" />
        )}
      </button>

      {/* Overlay when sidebar is open on mobile */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto pt-20 md:pt-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default ManagerLayout;
