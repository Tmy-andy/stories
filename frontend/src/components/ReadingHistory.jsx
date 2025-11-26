import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import readingHistoryService from '../services/readingHistoryService';

const ReadingHistory = () => {
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
    // Navigate to chapter with saved position
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
      key={item._id}
      onClick={() => handleNavigateToStory(item.storyId._id, item.chapterNumber)}
      className="p-4 bg-white dark:bg-[#1c182d] border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md dark:hover:shadow-lg hover:border-primary/50 dark:hover:border-primary/50 transition-all cursor-pointer group"
    >
      <div className="flex gap-4">
        {/* Story cover */}
        {item.storyId.coverImage && (
          <div className="flex-shrink-0">
            <img
              src={item.storyId.coverImage}
              alt={item.storyId.title}
              className="w-16 h-20 object-cover rounded"
            />
          </div>
        )}

        {/* Story info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-text-light dark:text-white font-bold text-base mb-1 group-hover:text-primary transition-colors truncate">
            {item.storyId.title}
          </h4>
          <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm mb-2">
            Tác giả: {item.storyId.author}
          </p>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-primary font-semibold">Chương {item.chapterNumber}</span>
            <span className="text-text-muted-light dark:text-text-muted-dark">
              • Cập nhật: {new Date(item.updatedAt).toLocaleDateString('vi-VN')}
            </span>
          </div>

          {/* Reading position indicator */}
          {item.scrollPosition > 0 && (
            <div className="mt-2 w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-primary/60" style={{ width: `${Math.min(item.scrollPosition / 1000, 100)}%` }} />
            </div>
          )}
        </div>

        {/* Delete button */}
        <button
          onClick={(e) => handleDeleteReadingHistory(item.storyId._id, e)}
          className="flex-shrink-0 p-2 text-text-muted-light dark:text-text-muted-dark hover:text-red-600 dark:hover:text-red-400 transition-colors"
          title="Xóa khỏi lịch sử"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-text-light dark:text-white">Đang tải lịch sử đọc...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg p-4">
        <p className="text-red-700 dark:text-red-300">{error}</p>
      </div>
    );
  }

  if (allHistory.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-text-muted-light dark:text-text-muted-dark mb-4">Bạn chưa có lịch sử đọc nào</p>
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
          Lịch sử đọc sẽ được lưu khi bạn đọc truyện
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Section: Tiếp tục đọc */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-text-light dark:text-white font-bold text-lg flex items-center gap-2">
            <span className="material-symbols-outlined">play_arrow</span>
            Tiếp tục đọc
          </h3>
          {allHistory.length > 5 && (
            <span className="text-xs px-2 py-1 bg-primary/10 dark:bg-primary/20 text-primary rounded">
              5 truyện gần nhất
            </span>
          )}
        </div>

        <div className="space-y-3">
          {recentHistory.map((item) => (
            <ReadingHistoryItem key={item._id} item={item} />
          ))}
        </div>
      </div>

      {/* Section: Lịch sử */}
      {olderHistory.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-text-light dark:text-white font-bold text-lg flex items-center gap-2">
              <span className="material-symbols-outlined">history</span>
              Lịch sử đọc
            </h3>
            <button
              onClick={handleClearAll}
              className="text-xs px-3 py-1 bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-950/50 transition-colors"
            >
              Xóa tất cả
            </button>
          </div>

          <div className="space-y-3">
            {olderHistory.map((item) => (
              <ReadingHistoryItem key={item._id} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* Note */}
      <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-lg">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          <strong>Lưu ý:</strong> Hệ thống chỉ lưu lịch sử của 5 truyện gần nhất. Các truyện cũ hơn sẽ bị xóa nhưng nội dung truyện vẫn được giữ lại.
        </p>
      </div>
    </div>
  );
};

export default ReadingHistory;
