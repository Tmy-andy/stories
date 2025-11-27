import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { Settings, Home } from 'lucide-react';

const AdminBar = () => {
  const [user, setUser] = useState(null);
  const [isManager, setIsManager] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    
    // Check if user is the admin/manager (tmy300803@gmail.com)
    if (currentUser && currentUser.email === 'tmy300803@gmail.com') {
      setIsManager(true);
    }
  }, []);

  if (!isManager) {
    return null;
  }

  const isOnManagerPage = window.location.pathname.startsWith('/manager');

  return (
    <div className="h-9 bg-black dark:bg-gray-900 border-b border-gray-700 flex items-center px-4 fixed top-0 left-0 right-0 z-[100]">
      <div className="container mx-auto px-4 flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <span className="text-white text-xs font-medium">
            {isOnManagerPage ? 'Manager' : 'Frontend'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {isOnManagerPage ? (
            <Link
              to="/"
              className="flex items-center gap-2 px-3 py-1.5 text-white text-xs font-medium hover:bg-gray-800 rounded transition-colors"
              title="Quay lại trang chủ"
            >
              <Home className="w-4 h-4" />
              <span>Trang chủ</span>
            </Link>
          ) : (
            <Link
              to="/manager/dashboard"
              className="flex items-center gap-2 px-3 py-1.5 text-white text-xs font-medium hover:bg-gray-800 rounded transition-colors"
              title="Vào trang quản lý"
            >
              <Settings className="w-4 h-4" />
              <span>Manager</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBar;
