import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import readingHistoryService from '../services/readingHistoryService';

const ProfileReadingHistory = () => {
  const navigate = useNavigate();
  const [allHistory, setAllHistory] = useState([]);
  const [recentHistory, setRecentHistory] = useState([]);
  const [olderHistory, setOlderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllReadingHistory();
  }, []);

  const fetchAllReadingHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await readingHistoryService.getAllReadingHistory();
      setAllHistory(data);
      
      // Split into recent (first 5) and older
      setRecentHistory(data.slice(0, 5));
      setOlderHistory(data.slice(5));
    } catch (err) {
      console.error('Error fetching reading history:', err);
      setError('Không thể tải lịch sử đọc');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToStory = (storyId, chapterNumber) => {
    navigate(`/chapter/${storyId}/${chapterNumber}`);
  };

  const handleDeleteReadingHistory = async (storyId, e) => {
    e.stopPropagation();
    try {
      await readingHistoryService.deleteReadingHistory(storyId);
      await fetchAllReadingHistory();
    } catch (err) {
      console.error('Error deleting reading history:', err);
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Bạn có chắc muốn xóa toàn bộ lịch sử đọc?')) {
      try {
        await readingHistoryService.clearAllReadingHistory();
        setAllHistory([]);
        setRecentHistory([]);
        setOlderHistory([]);
      } catch (err) {
        console.error('Error clearing history:', err);
      }
    }
  };

  const ReadingHistoryItem = ({ item }) => (
    <div
      onClick={() => handleNavigateToStory(item.storyId._id, item.chapterNumber)}
      className="py-4 px-4 border-b border-gray-200 dark:border-white/10 last:border-b-0 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer group"
    >
      <div className="flex items-start gap-4">
        {/* Story cover */}
        {item.storyId.coverImage && (
          <div className="flex-shrink-0">
            <img
              src={item.storyId.coverImage}
              alt={item.storyId.title}
              className="w-12 h-16 object-cover rounded"
            />
          </div>
        )}

        {/* Story info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-gray-900 dark:text-white font-bold mb-1 group-hover:text-primary transition-colors truncate">
            {item.storyId.title}
          </h4>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
            Tác giả: {item.storyId.author}
          </p>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-primary font-semibold">Chương {item.chapterNumber}</span>
            <span className="text-gray-500 dark:text-gray-400">
              • {new Date(item.updatedAt).toLocaleDateString('vi-VN')}
            </span>
          </div>
        </div>

        {/* Delete button */}
        <button
          onClick={(e) => handleDeleteReadingHistory(item.storyId._id, e)}
          className="flex-shrink-0 p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          title="Xóa khỏi lịch sử"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-gray-600 dark:text-gray-400">Đang tải lịch sử đọc...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <span className="material-symbols-outlined text-5xl text-red-400 mb-4 block">error</span>
        <p className="text-gray-600 dark:text-gray-400">{error}</p>
      </div>
    );
  }

  if (allHistory.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-10">
        <span className="material-symbols-outlined text-5xl text-gray-400 dark:text-gray-500 mb-4">
          history
        </span>
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Chưa có lịch sử đọc
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Hãy bắt đầu đọc truyện để xây dựng thư viện của riêng bạn!
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-white/10">
      {/* Section: Tiếp tục đọc */}
      <div>
        <div className="py-4 px-4 sticky top-0 bg-white dark:bg-background-dark z-10 flex items-center justify-between">
          <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">play_arrow</span>
            Tiếp tục đọc
          </h4>
          {allHistory.length > 5 && (
            <span className="text-xs px-2 py-1 bg-primary/10 dark:bg-primary/20 text-primary rounded">
              5 truyện gần nhất
            </span>
          )}
        </div>
        <div>
          {recentHistory.map((item) => (
            <ReadingHistoryItem key={item._id} item={item} />
          ))}
        </div>
      </div>

      {/* Section: Lịch sử */}
      {olderHistory.length > 0 && (
        <div>
          <div className="py-4 px-4 sticky top-0 bg-white dark:bg-background-dark z-10 flex items-center justify-between">
            <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">history</span>
              Lịch sử đọc
            </h4>
            <button
              onClick={handleClearAll}
              className="text-xs px-2 py-1 bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-950/50 transition-colors"
            >
              Xóa tất cả
            </button>
          </div>
          <div>
            {olderHistory.map((item) => (
              <ReadingHistoryItem key={item._id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileReadingHistory;
