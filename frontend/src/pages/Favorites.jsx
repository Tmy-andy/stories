import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { favoriteService } from '../services/favoriteService';
import { authService } from '../services/authService';
import FavoriteButton from '../components/FavoriteButton';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }
    loadFavorites();
  }, [navigate]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const favorites = await favoriteService.getUserFavorites();
      setFavorites(Array.isArray(favorites) ? favorites : []);
    } catch (error) {
      console.error('Error loading favorites:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (storyId) => {
    try {
      await favoriteService.removeFavorite(storyId);
      setFavorites(favorites.filter(fav => fav.storyId._id !== storyId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-text-light dark:text-white">Đang tải...</p>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-text-light dark:text-white text-[32px] font-bold leading-tight tracking-[-0.015em] mb-4">
          Danh sách yêu thích
        </h1>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <p className="text-text-secondary-light dark:text-text-secondary-dark text-lg">
            Chưa có truyện yêu thích nào
          </p>
          <Link
            to="/"
            className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors"
          >
            <span className="truncate">Khám phá truyện</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-text-light dark:text-white text-[32px] font-bold leading-tight tracking-[-0.015em] mb-6">
        Danh sách yêu thích ({favorites.length})
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {favorites.map((favorite) => (
          <div
            key={favorite._id}
            className="flex flex-col gap-3 group rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative">
              <Link to={`/story/${favorite.storyId._id}`}>
                <div
                  className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-lg flex flex-col transition-transform duration-300 group-hover:scale-105"
                  style={{ backgroundImage: `url("${favorite.storyId.coverImage}")` }}
                ></div>
              </Link>
              <div className="absolute top-2 right-2">
                <FavoriteButton
                  storyId={favorite.storyId._id}
                  size={28}
                  className="bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg"
                />
              </div>
            </div>
            <div className="flex-1">
              <Link to={`/story/${favorite.storyId._id}`}>
                <h3 className="text-text-light dark:text-white text-base font-medium leading-normal font-display group-hover:text-primary dark:group-hover:text-primary transition-colors">
                  {favorite.storyId.title}
                </h3>
              </Link>
              <p className="text-text-muted-light dark:text-text-muted-dark text-sm font-normal leading-normal">
                {favorite.storyId.author}
              </p>
              <p className="text-text-muted-light dark:text-text-muted-dark text-sm font-normal leading-normal">
                {favorite.storyId.chapterCount} chương
              </p>
            </div>
            <button
              onClick={() => handleRemove(favorite.storyId._id)}
              className="w-full flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-red-500/10 dark:bg-red-500/20 text-red-500 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-red-500/20 dark:hover:bg-red-500/30 transition-colors"
            >
              <span className="truncate">Xóa khỏi yêu thích</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
