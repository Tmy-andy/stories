import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getAllStories } from '../services/storyService';
import { favoriteService } from '../services/favoriteService';
import { authService } from '../services/authService';

const Stories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [selectedStatus, setSelectedStatus] = useState('');
  const [favorites, setFavorites] = useState(new Set());
  const [searchParams] = useSearchParams();
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  const user = authService.getCurrentUser();

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

  // Load từ URL params khi component mount
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategories(new Set([categoryParam]));
    }
  }, [searchParams]);

  // Close category filter when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showCategoryFilter && !e.target.closest('.category-filter-button') && !e.target.closest('.category-filter-dropdown')) {
        setShowCategoryFilter(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showCategoryFilter]);

  useEffect(() => {
    loadStories();
    loadFavorites();
  }, [selectedCategories, selectedStatus]);

  const loadFavorites = async () => {
    if (!user) return;
    try {
      const favList = await favoriteService.getUserFavorites();
      const favIds = new Set(favList.map(fav => fav.storyId._id || fav.storyId));
      setFavorites(favIds);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const loadStories = async () => {
    try {
      setLoading(true);
      const params = {};
      
      // Convert Set to array for API
      if (selectedCategories.size > 0) {
        params.categories = Array.from(selectedCategories);
      }
      if (selectedStatus) params.status = selectedStatus;
      
      const data = await getAllStories(params);
      setStories(data);
    } catch (error) {
      console.error('Error loading stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCategory = (category) => {
    const newCategories = new Set(selectedCategories);
    if (newCategories.has(category)) {
      newCategories.delete(category);
    } else {
      newCategories.add(category);
    }
    setSelectedCategories(newCategories);
  };

  const handleToggleFavorite = async (e, storyId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert('Vui lòng đăng nhập để thêm vào danh sách yêu thích');
      return;
    }

    try {
      const isFavorited = favorites.has(storyId);
      
      if (isFavorited) {
        await favoriteService.removeFavorite(storyId);
        const newFavorites = new Set(favorites);
        newFavorites.delete(storyId);
        setFavorites(newFavorites);
      } else {
        await favoriteService.addFavorite(storyId);
        const newFavorites = new Set(favorites);
        newFavorites.add(storyId);
        setFavorites(newFavorites);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Có lỗi xảy ra khi cập nhật danh sách yêu thích');
    }
  };

  return (
    <div className="py-8 px-4">
      {/* Title and Filters */}
      <div className="flex flex-wrap justify-between gap-3 p-4 mb-4">
        <p className="text-text-light dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] min-w-72 font-display">Danh Sách Truyện</p>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 p-3 mb-6">
        {/* Categories Collapsible Filter */}
        <div className="relative">
          <button
            onClick={() => setShowCategoryFilter(!showCategoryFilter)}
            className={`category-filter-button flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg pl-4 pr-8 text-sm font-medium leading-normal appearance-none cursor-pointer transition-colors relative ${
              selectedCategories.size > 0
                ? 'bg-primary/20 dark:bg-primary/30 text-primary dark:text-primary border border-primary'
                : 'bg-gray-100 dark:bg-[#2b2839] hover:bg-gray-200 dark:hover:bg-primary/30 text-gray-700 dark:text-white'
            }`}
          >
            Thể loại
            {selectedCategories.size > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-bold">
                {selectedCategories.size}
              </span>
            )}
            <span className={`material-symbols-outlined ml-1 transition-transform ${showCategoryFilter ? 'rotate-180' : ''}`} style={{fontSize: '20px'}}>arrow_drop_down</span>
          </button>

          {/* Category Filter Dropdown */}
          {showCategoryFilter && (
            <div className="category-filter-dropdown absolute top-12 left-0 bg-white dark:bg-[#2b2839] border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-10 w-64">
              {/* Search Input */}
              <div className="p-3 border-b border-gray-300 dark:border-gray-700 sticky top-0 bg-white dark:bg-[#2b2839]">
                <input
                  type="text"
                  placeholder="Tìm thể loại..."
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-text-light dark:text-text-dark text-sm focus:border-primary focus:ring-primary focus:outline-none"
                />
              </div>

              {/* Category Checkboxes with Scrollbar */}
              <div className="max-h-64 overflow-y-auto">
                {categories
                  .filter(cat => cat.toLowerCase().includes(categorySearch.toLowerCase()))
                  .map((cat) => (
                    <label key={cat} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                      <input
                        type="checkbox"
                        checked={selectedCategories.has(cat)}
                        onChange={() => handleToggleCategory(cat)}
                        className="w-4 h-4 rounded border-gray-300 dark:border-gray-700 text-primary focus:ring-primary"
                      />
                      <span className={`text-sm ${
                        selectedCategories.has(cat)
                          ? 'text-primary font-medium'
                          : 'text-gray-700 dark:text-white'
                      }`}>
                        {cat}
                      </span>
                    </label>
                  ))}
              </div>

              {/* Close on Click Outside - handled by button click */}
            </div>
          )}
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg pl-4 pr-8 text-sm font-medium leading-normal appearance-none cursor-pointer transition-colors ${
              selectedStatus
                ? 'bg-primary/20 dark:bg-primary/30 text-primary dark:text-primary border border-primary'
                : 'bg-gray-100 dark:bg-[#2b2839] hover:bg-gray-200 dark:hover:bg-primary/30 text-gray-700 dark:text-white'
            }`}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="publishing">Đang ra</option>
            <option value="completed">Hoàn thành</option>
            <option value="paused_indefinite">Hoãn vô thời hạn</option>
            <option value="paused_timed">Hoãn có thời hạn</option>
            <option value="dropped">Ngừng xuất bản</option>
          </select>
          <span className={`material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${selectedStatus ? 'text-primary' : 'text-gray-700 dark:text-white'}`} style={{fontSize: '20px'}}>arrow_drop_down</span>
        </div>

        {(selectedCategories.size > 0 || selectedStatus) && (
          <button
            onClick={() => {
              setSelectedCategories(new Set());
              setSelectedStatus('');
              setCategorySearch('');
            }}
            className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 px-4 text-red-700 dark:text-red-300 text-sm font-medium leading-normal transition-colors"
          >
            Xóa bộ lọc
          </button>
        )}
      </div>

      {/* Stories Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <p className="text-text-secondary-light dark:text-text-secondary-dark">Đang tải...</p>
        </div>
      ) : stories.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4">
          {stories.map((story) => (
            <Link key={story._id} to={`/story/${story.slug || story._id}`} className="flex flex-col gap-3 pb-3 group cursor-pointer relative">
              <div className="relative">
                <div 
                  className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-lg overflow-hidden transform group-hover:scale-105 transition-transform duration-300"
                  style={{ backgroundImage: `url("${story.coverImage || 'https://via.placeholder.com/300x400?text=No+Image'}")` }}
                ></div>
                {/* Heart Button */}
                <button
                  onClick={(e) => handleToggleFavorite(e, story._id)}
                  className={`absolute top-3 right-3 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    favorites.has(story._id)
                      ? 'bg-red-500 text-white shadow-lg'
                      : 'bg-black/40 text-white hover:bg-black/60'
                  }`}
                  title={favorites.has(story._id) ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
                >
                  <span className="material-symbols-outlined text-2xl">
                    {favorites.has(story._id) ? 'favorite' : 'favorite_border'}
                  </span>
                </button>
              </div>
              <div>
                <p className="text-text-light dark:text-white text-base font-medium leading-normal group-hover:text-primary dark:group-hover:text-primary/90 transition-colors">{story.title}</p>
                <p className="text-text-muted-light dark:text-text-muted-dark text-sm font-normal leading-normal">{story.author}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{story.category}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">•</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{story.status}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-500 mb-4">search_off</span>
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">Không tìm thấy truyện nào</p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">Thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
        </div>
      )}
    </div>
  );
};

export default Stories;
