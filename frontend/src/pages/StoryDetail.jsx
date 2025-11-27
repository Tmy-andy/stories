import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { storyService, getChaptersByStory } from '../services/storyService';
import CommentSection from '../components/CommentSection';
import FavoriteButton from '../components/FavoriteButton';

const StoryDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const chaptersPerPage = 20;
  const commentId = searchParams.get('comment');

  const statusLabels = {
    publishing: 'Đang ra',
    completed: 'Hoàn thành',
    paused_indefinite: 'Tạm dừng vô thời hạn',
    paused_timed: 'Tạm dừng có thời hạn',
    dropped: 'Ngừng xuất bản'
  };

  const getStatusLabel = (status) => {
    return statusLabels[status] || status;
  };

  useEffect(() => {
    loadStoryData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Scroll to comment when it's loaded
  useEffect(() => {
    if (commentId) {
      setTimeout(() => {
        const element = document.getElementById(`comment-${commentId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 500);
    }
  }, [commentId, loading]);

  const loadStoryData = async () => {
    try {
      setLoading(true);
      const storyData = await storyService.getStoryById(id);
      const chaptersData = await getChaptersByStory(id);
      setStory(storyData);
      setChapters(chaptersData);
    } catch (error) {
      console.error('Error loading story:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-text-light dark:text-white text-lg">Đang tải...</p>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-text-light dark:text-white text-lg">Không tìm thấy truyện</p>
        <Link to="/stories" className="text-primary hover:underline">Quay lại danh sách</Link>
      </div>
    );
  }

  const indexOfLastChapter = currentPage * chaptersPerPage;
  const indexOfFirstChapter = indexOfLastChapter - chaptersPerPage;
  const currentChapters = chapters.slice(indexOfFirstChapter, indexOfLastChapter);
  const totalPages = Math.ceil(chapters.length / chaptersPerPage);

  return (
    <main className="px-4 sm:px-6 lg:px-8 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col w-full max-w-4xl flex-1">
        <div className="flex flex-wrap gap-2 p-4">
          <Link className="text-gray-500 dark:text-[#a29db9] text-sm font-medium hover:text-primary transition-colors" to="/">Trang chủ</Link>
          <span className="text-gray-500 dark:text-[#a29db9] text-sm font-medium">/</span>
          <Link className="text-gray-500 dark:text-[#a29db9] text-sm font-medium hover:text-primary transition-colors" to="/stories">Tiểu thuyết</Link>
          <span className="text-gray-500 dark:text-[#a29db9] text-sm font-medium">/</span>
          <span className="text-gray-900 dark:text-white text-sm font-medium">{story.title}</span>
        </div>

        <div className="flex p-4 border-b border-gray-200 dark:border-white/10">
          <div className="flex w-full flex-col gap-6 sm:flex-row">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-lg w-48 shrink-0 mx-auto sm:mx-0" style={{ backgroundImage: `url("${story.coverImage || 'https://via.placeholder.com/300x400?text=No+Image'}")` }}></div>
              <div className="flex flex-col gap-2">
                <h1 className="text-gray-900 dark:text-white text-3xl font-display font-bold">{story.title}</h1>
                <p className="text-primary text-base font-medium">Tác giả: {typeof story.authorId === 'object' ? (story.authorId?.displayName || story.authorId?.username) : 'N/A'}</p>
                <div className="flex gap-2 flex-wrap pt-2">
                  <div className="flex h-7 items-center justify-center rounded-full bg-gray-200 dark:bg-white/10 px-3"><p className="text-gray-800 dark:text-white text-xs font-medium">
                    {Array.isArray(story.category) 
                      ? story.category.map(c => c.name || c).join(', ')
                      : story.category}
                  </p></div>
                  <div className="flex h-7 items-center justify-center rounded-full bg-gray-200 dark:bg-white/10 px-3"><p className="text-gray-800 dark:text-white text-xs font-medium">{getStatusLabel(story.status)}</p></div>
                </div>
                <p className="text-gray-600 dark:text-[#a29db9] text-base mt-2">{story.description}</p>
                <div className="pt-4">
                  <FavoriteButton storyId={story._id} size={28} className="text-gray-600 dark:text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row-reverse gap-4 p-4">
          <div className="flex w-full flex-col sm:flex-row gap-3 sm:w-auto">
            {chapters.length > 0 && <Link to={`/chapter/${story.slug || id}/1`} className="flex items-center justify-center h-11 px-5 bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors rounded-lg">Đọc từ đầu</Link>}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 flex-1">
            <div className="flex flex-col gap-1 rounded-lg p-4 bg-gray-100 dark:bg-white/5"><p className="text-gray-600 dark:text-[#a29db9] text-sm font-medium">Lượt xem</p><p className="text-gray-900 dark:text-white text-xl font-bold">{story.views}</p></div>
            <div className="flex flex-col gap-1 rounded-lg p-4 bg-gray-100 dark:bg-white/5"><p className="text-gray-600 dark:text-[#a29db9] text-sm font-medium">Số chương</p><p className="text-gray-900 dark:text-white text-xl font-bold">{chapters.length}</p></div>
            <div className="flex flex-col gap-1 rounded-lg p-4 bg-gray-100 dark:bg-white/5"><p className="text-gray-600 dark:text-[#a29db9] text-sm font-medium">Trạng thái</p><p className="text-gray-900 dark:text-white text-xl font-bold">{getStatusLabel(story.status)}</p></div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-gray-900 dark:text-white text-2xl font-display font-bold px-4 pb-3 pt-5 border-b border-gray-200 dark:border-white/10">Danh sách chương</h2>
          <div className="flex flex-col">
            {currentChapters.length > 0 ? currentChapters.map((chapter) => (
              <Link key={chapter._id} to={`/chapter/${story.slug || id}/${chapter.chapterNumber}`} className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                <div className="flex flex-col"><p className="text-gray-800 dark:text-gray-200 text-base font-medium">{chapter.title}</p><p className="text-gray-500 dark:text-gray-400 text-sm">Ngày đăng: {new Date(chapter.createdAt).toLocaleDateString('vi-VN')}</p></div>
                <span className="material-symbols-outlined text-gray-400">chevron_right</span>
              </Link>
            )) : (
              <div className="flex flex-col items-center justify-center py-20"><span className="material-symbols-outlined text-6xl text-gray-400 mb-4">menu_book</span><p className="text-gray-600 dark:text-gray-400 text-lg font-medium">Chưa có chương nào</p></div>
            )}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 p-6 mt-4">
              <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="flex items-center justify-center h-9 w-9 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors disabled:opacity-50"><span className="material-symbols-outlined">chevron_left</span></button>
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                const pageNum = currentPage > 3 ? currentPage - 2 + i : i + 1;
                return pageNum <= totalPages ? <button key={pageNum} onClick={() => setCurrentPage(pageNum)} className={`flex items-center justify-center h-9 w-9 rounded-lg text-sm font-medium transition-colors ${currentPage === pageNum ? 'bg-primary text-white' : 'hover:bg-gray-200 dark:hover:bg-white/20 text-gray-600 dark:text-gray-300'}`}>{pageNum}</button> : null;
              })}
              {totalPages > 5 && currentPage < totalPages - 2 && <span className="text-gray-500">...</span>}
              <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className="flex items-center justify-center h-9 w-9 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors disabled:opacity-50"><span className="material-symbols-outlined">chevron_right</span></button>
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="mt-12 border-t border-gray-200 dark:border-white/10 pt-8">
          <CommentSection storyId={story._id} />
        </div>
      </div>
    </main>
  );
};

export default StoryDetail;
