import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Categories = () => {
  const navigate = useNavigate();
  const [categoryCounts, setCategoryCounts] = useState({});
  const [loading, setLoading] = useState(true);

  const categories = [
    'Tiên hiệp',
    'Kiếm hiệp',
    'Huyền huyễn',
    'Ngôn tình',
    'Đô thị',
    'Khoa huyễn',
    'Lịch sử',
    'Đồng nhân',
    'Linh dị'
  ];

  useEffect(() => {
    loadCategoryCounts();
  }, []);

  const loadCategoryCounts = async () => {
    try {
      setLoading(true);
      // Fetch từ API để lấy số lượng truyện theo thể loại
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
      const response = await fetch(`${API_URL}/stories`);
      const stories = await response.json();

      // Đếm số truyện theo thể loại
      const counts = {};
      categories.forEach(cat => counts[cat] = 0);
      
      stories.forEach(story => {
        if (Array.isArray(story.category)) {
          story.category.forEach(cat => {
            if (counts.hasOwnProperty(cat)) {
              counts[cat]++;
            }
          });
        } else if (story.category) {
          if (counts.hasOwnProperty(story.category)) {
            counts[story.category]++;
          }
        }
      });

      setCategoryCounts(counts);
    } catch (error) {
      console.error('Error loading category counts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    // Chuyển đến trang Stories với category filter
    navigate(`/stories?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* Main Content */}
      <main className="flex-1">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="flex flex-col gap-8">
            {/* Title */}
            <div className="flex flex-col items-center text-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Khám phá Thể loại
              </h1>
              <p className="max-w-2xl text-base text-gray-600 dark:text-gray-400">
                Tìm kiếm câu chuyện tiếp theo của bạn từ bộ sưu tập các thể loại phong phú của chúng tôi.
              </p>
            </div>

            {/* Categories Grid */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className="group relative flex flex-row items-center justify-between overflow-hidden rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1c182d] p-4 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary dark:hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 text-left"
                  >
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                      {category}
                    </h2>
                    <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/10 rounded-full px-2.5 py-0.5">
                      {categoryCounts[category] || 0}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Categories;
