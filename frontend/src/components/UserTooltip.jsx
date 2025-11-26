import React, { useState } from 'react';
import { MedalIcon, calculateLevel, AdminVerifiedIcon } from '../utils/tierSystem';

const UserTooltip = ({ profile, children, placement = 'top' }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getPlacementClasses = () => {
    const positions = {
      top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
      bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
      left: 'right-full top-1/2 -translate-y-1/2 mr-2',
      right: 'left-full top-1/2 -translate-y-1/2 ml-2'
    };
    return positions[placement] || positions.top;
  };

  if (!profile) return children;

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="cursor-pointer"
      >
        {children}
      </div>

      {showTooltip && (
        <div
          className={`absolute ${getPlacementClasses()} z-50 bg-gray-900 dark:bg-gray-800 text-white rounded-lg px-4 py-3 shadow-lg whitespace-nowrap text-sm pointer-events-none`}
        >
          <div className="flex items-center gap-2 mb-2">
            {profile.role === 'admin' ? (
              <AdminVerifiedIcon size={14} />
            ) : (
              <MedalIcon level={calculateLevel(profile.membershipPoints || 0)} size={14} />
            )}
            <span className="font-semibold">{profile.displayName || profile.username}</span>
          </div>
          <div className="text-gray-300 text-xs">
            <div>@{profile.username.toLowerCase().replace(/\s+/g, '')}</div>
            {profile.role !== 'admin' && (
              <div>Cấp: {profile.membershipLevel || 'Đồng'}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTooltip;
