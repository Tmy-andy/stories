import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import { authService } from '../services/authService';
import { MedalIcon, calculateLevel, AdminVerifiedIcon } from '../utils/tierSystem';
import NotificationBell from './NotificationBell';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isManager, setIsManager] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    
    // Check if user is the admin/manager
    if (currentUser && currentUser.email === 'tmy300803@gmail.com') {
      setIsManager(true);
    }
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    navigate('/');
    window.location.reload();
  };

  return (
    <header className={`sticky bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-b border-gray-200 dark:border-white/10 ${isManager ? 'top-9 z-40' : 'top-0 z-50'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between whitespace-nowrap py-3 gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1 text-primary">
            <div className="w-10 h-10">
              <img src={logo} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-text-light dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] font-display">Lam điệp cô ảnh</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-text-light dark:text-white text-sm font-medium leading-normal hover:text-primary dark:hover:text-primary transition-colors">Trang chủ</Link>
            <Link to="/stories" className="text-text-light dark:text-white text-sm font-medium leading-normal hover:text-primary dark:hover:text-primary transition-colors">Danh sách truyện</Link>
            <Link to="/categories" className="text-text-light dark:text-white text-sm font-medium leading-normal hover:text-primary dark:hover:text-primary transition-colors">Thể loại</Link>
          </nav>

          {/* Search and Auth */}
          <div className="hidden md:flex flex-1 justify-end items-center gap-4">
            <div className="relative w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark">search</span>
              <input 
                className="w-full h-10 pl-10 pr-4 bg-secondary-light dark:bg-secondary-dark border border-transparent rounded-lg text-sm text-text-light dark:text-white focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark" 
                placeholder="Tìm kiếm truyện..." 
                type="text"
              />
            </div>
            
            {user ? (
              <div className="flex items-center gap-2">
                <NotificationBell />
                <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                >
                  {user.role === 'admin' ? (
                    <AdminVerifiedIcon size={18} />
                  ) : (
                    <MedalIcon level={calculateLevel(user.membershipPoints || 0)} size={18} role={user.role} />
                  )}
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.displayName || user.username} className="w-full h-full object-cover" />
                    ) : (
                      (user.displayName || user.username).charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className={user.role === 'admin' ? "text-primary dark:text-primary text-sm font-medium" : "text-text-light dark:text-white text-sm font-medium"}>
                    {user.displayName || user.username}
                  </span>
                  {user.role === 'admin' && (
                    <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs font-bold rounded">ADMIN</span>
                  )}
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1e1c27] rounded-lg shadow-lg py-2 border border-gray-200 dark:border-white/10">
                    {user.role === 'admin' && (
                      <>
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-sm text-text-light dark:text-white hover:bg-gray-100 dark:hover:bg-white/10"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Quản lý truyện
                        </Link>
                        <hr className="my-2 border-gray-200 dark:border-white/10" />
                      </>
                    )}
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-text-light dark:text-white hover:bg-gray-100 dark:hover:bg-white/10"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Xem hồ sơ
                    </Link>
                    <Link
                      to="/user-profile"
                      className="block px-4 py-2 text-sm text-text-light dark:text-white hover:bg-gray-100 dark:hover:bg-white/10"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Chỉnh sửa hồ sơ
                    </Link>
                    <Link
                      to="/favorites"
                      className="block px-4 py-2 text-sm text-text-light dark:text-white hover:bg-gray-100 dark:hover:bg-white/10"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Danh sách yêu thích
                    </Link>
                    <Link
                      to="/change-password"
                      className="block px-4 py-2 text-sm text-text-light dark:text-white hover:bg-gray-100 dark:hover:bg-white/10"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Đổi mật khẩu
                    </Link>
                    <hr className="my-2 border-gray-200 dark:border-white/10" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-white/10"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </div>
            ) : (
              <>
                <Link to="/login" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors">
                  <span className="truncate">Đăng nhập</span>
                </Link>
                <Link to="/register" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary/20 dark:bg-white/10 text-primary dark:text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/30 dark:hover:bg-white/20 transition-colors">
                  <span className="truncate">Đăng ký</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-md text-text-light dark:text-white hover:bg-gray-100 dark:hover:bg-white/10"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 border-t border-gray-200 dark:border-white/10 mt-4 pt-4 space-y-2">
            <Link to="/" className="block px-4 py-2 text-text-light dark:text-white hover:text-primary dark:hover:text-primary transition-colors">Trang chủ</Link>
            <Link to="/stories" className="block px-4 py-2 text-text-light dark:text-white hover:text-primary dark:hover:text-primary transition-colors">Danh sách truyện</Link>
            <Link to="/categories" className="block px-4 py-2 text-text-light dark:text-white hover:text-primary dark:hover:text-primary transition-colors">Thể loại</Link>
            <div className="px-4 py-4 pt-4 border-t border-gray-200 dark:border-white/10">
              {user ? (
                <>
                  {/* User Card */}
                  <div className="bg-secondary-light dark:bg-white/5 rounded-lg p-4 mb-4 border border-gray-200 dark:border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold overflow-hidden flex-shrink-0">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.displayName || user.username} className="w-full h-full object-cover" />
                        ) : (
                          (user.displayName || user.username).charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-text-light dark:text-white text-sm font-semibold">{user.displayName || user.username}</p>
                        {user.role === 'admin' && (
                          <span className="inline-block px-2 py-1 bg-primary/20 text-primary text-xs font-bold rounded mt-1">ADMIN</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="space-y-1">
                    {user.role === 'admin' && (
                      <>
                        <Link
                          to="/admin"
                          className="flex items-center gap-3 px-4 py-3 text-sm text-text-light dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <span className="material-symbols-outlined text-lg">dashboard</span>
                          Quản lý truyện
                        </Link>
                        <div className="h-px bg-gray-200 dark:bg-white/10 my-2"></div>
                      </>
                    )}
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-text-light dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="material-symbols-outlined text-lg">person</span>
                      Xem hồ sơ
                    </Link>
                    <Link
                      to="/user-profile"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-text-light dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="material-symbols-outlined text-lg">edit</span>
                      Chỉnh sửa hồ sơ
                    </Link>
                    <Link
                      to="/favorites"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-text-light dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="material-symbols-outlined text-lg">favorite</span>
                      Danh sách yêu thích
                    </Link>
                    <Link
                      to="/change-password"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-text-light dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="material-symbols-outlined text-lg">lock</span>
                      Đổi mật khẩu
                    </Link>
                    <div className="h-px bg-gray-200 dark:bg-white/10 my-2"></div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">logout</span>
                      Đăng xuất
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <Link to="/login" className="block text-center px-4 py-3 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors">Đăng nhập</Link>
                  <Link to="/register" className="block text-center px-4 py-3 bg-primary/20 dark:bg-white/10 text-primary dark:text-white rounded-lg text-sm font-bold hover:bg-primary/30 dark:hover:bg-white/20 transition-colors">Đăng ký</Link>
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
