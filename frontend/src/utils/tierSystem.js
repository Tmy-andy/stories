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
    'Đồng': { color: '#CD7F32', svg: '<path d="M12 6v12"/><path d="M17.196 9 6.804 15"/><path d="m6.804 9 10.392 6"/>' },
    'Bạc': { color: '#A8A8A8', svg: '<path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/>' },
    'Vàng': { color: '#FFD700', svg: '<path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/><path d="M20 2v4"/><path d="M22 4h-4"/><circle cx="4" cy="20" r="2"/>' },
    'Kim Cương': { color: '#1E90FF', svg: '<path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/>' },
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
export const MedalIcon = ({ level, size = 16 }) => {
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
