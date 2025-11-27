// Utility functions for medal/tier system

// Calculate user's tier based on membership points
export const calculateLevel = (points) => {
  if (points < 500) return 'Đồng';
  if (points < 2000) return 'Bạc';
  if (points < 5000) return 'Vàng';
  return 'Kim Cương';
};

// Get icon data for each tier
export const getLevelIcon = (level) => {
  const icons = {
    'Đồng': { color: '#CD7F32', svg: '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>' },
    'Bạc': { color: '#A8A8A8', svg: '<path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/>' },
    'Vàng': { color: '#FFD700', svg: '<path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/><path d="M20 2v4"/><path d="M22 4h-4"/><circle cx="4" cy="20" r="2"/>' },
    'Kim Cương': { color: '#1E90FF', svg: '<path d="M4 20a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><path d="m12.474 5.943 1.567 5.34a1 1 0 0 0 1.75.328l2.616-3.402"/><path d="m20 9-3 9"/><path d="m5.594 8.209 2.615 3.403a1 1 0 0 0 1.75-.329l1.567-5.34"/><path d="M7 18 4 9"/><circle cx="12" cy="4" r="2"/><circle cx="20" cy="7" r="2"/><circle cx="4" cy="7" r="2"/>' },
    'Manager': { color: '#FF8C00', svg: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3m0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>' },
    'Admin': { color: '#FFD700', svg: '<path d="M12 3c-2 0-3.5 1.5-3.5 3.5S10 10 12 10s3.5-1.5 3.5-3.5S14 3 12 3M8.5 13c-2.5 0-4.5 2-4.5 4.5v3.5c0 .5.5 1 1 1h14c.5 0 1-.5 1-1v-3.5c0-2.5-2-4.5-4.5-4.5M12 14l-2 2 2 2 2-2-2-2z"/>' }
  };
  return icons[level] || null;
};

// Admin verified icon (butterfly)
export const AdminVerifiedIcon = ({ size = 16 }) => {
  return (
    <img 
      src="/butterfly.png" 
      alt="admin-verified" 
      width={size} 
      height={size} 
      style={{ display: 'inline-block' }}
    />
  );
};

// Medal icon component
export const MedalIcon = ({ level, size = 16, role = null }) => {
  // Nếu có role, kiểm tra manager trước admin
  if (role === 'manager') {
    const iconData = getLevelIcon('Manager');
    if (iconData) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: iconData.color }}
          dangerouslySetInnerHTML={{ __html: iconData.svg }}
        />
      );
    }
  }
  
  const iconData = getLevelIcon(level);
  if (!iconData) return null;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color: iconData.color }}
      dangerouslySetInnerHTML={{ __html: iconData.svg }}
    />
  );
};

export default {
  calculateLevel,
  getLevelIcon,
  MedalIcon,
  AdminVerifiedIcon
};
