import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import categoryService from '../services/categoryService';

const Categories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getCategoriesWithCounts();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    // Chuyển đến trang Stories với category filter (dùng category ID)
    navigate(`/stories?category=${encodeURIComponent(category._id)}`);
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
                    key={category._id}
                    onClick={() => handleCategoryClick(category)}
                    className="group relative flex flex-row items-center justify-between overflow-hidden rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1c182d] p-4 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary dark:hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 text-left"
                  >
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                      {category.name}
                    </h2>
                    <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/10 rounded-full px-2.5 py-0.5">
                      {category.storyCount || 0}
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
