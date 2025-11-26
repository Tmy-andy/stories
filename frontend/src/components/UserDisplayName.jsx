import React from 'react';
import { MedalIcon, calculateLevel } from '../utils/tierSystem';

// Component hiển thị tên người dùng với huy chương
export function UserDisplayName({ user, size = 'md' }) {
  if (!user) return null;

  const level = calculateLevel(user.membershipPoints || 0);
  const displayName = user.displayName || user.username;

  const sizeClasses = {
    sm: 'text-sm gap-1',
    md: 'text-base gap-1.5',
    lg: 'text-lg gap-2'
  };

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20
  };

  return (
    <div className={`flex items-center ${sizeClasses[size]}`}>
      <MedalIcon level={level} size={iconSizes[size]} />
      <span>{displayName}</span>
    </div>
  );
}

export default UserDisplayName;
