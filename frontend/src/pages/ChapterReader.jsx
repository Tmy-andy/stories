import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ChapterRenderer from '../components/ChapterRenderer';
import CommentSection from '../components/CommentSection';
import api from '../services/api';

const ChapterReader = () => {
  const { storyId, chapterNumber } = useParams();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState(null);
  const [story, setStory] = useState(null);
  const [allChapters, setAllChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadChapterData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyId, chapterNumber]);

  const loadChapterData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Lấy chapter theo số chương
      const chapterRes = await api.get(`/chapters/story/${storyId}/${chapterNumber}`);
      setChapter(chapterRes.data);

      // Lấy story info
      const storyRes = await api.get(`/stories/${storyId}`);
      setStory(storyRes.data);

      // Lấy danh sách tất cả chapters của story
      const chaptersRes = await api.get(`/chapters/story/${storyId}`);
      setAllChapters(chaptersRes.data);
    } catch (err) {
      console.error('Error loading chapter:', err);
      setError('Không thể tải chương. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const goToChapter = (newChapterNumber) => {
    navigate(`/chapter/${storyId}/${newChapterNumber}`);
  };

  const goToPreviousChapter = () => {
    if (chapter && chapter.chapterNumber > 1) {
      goToChapter(chapter.chapterNumber - 1);
    }
  };

  const goToNextChapter = () => {
    if (chapter && chapter.chapterNumber < allChapters.length) {
      goToChapter(chapter.chapterNumber + 1);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-text-light dark:text-white text-lg">Đang tải...</p>
      </div>
    );
  }

  if (error || !chapter || !story) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-text-light dark:text-white text-lg">{error || 'Không tìm thấy chương'}</p>
        <Link to="/stories" className="text-primary hover:underline">Quay lại danh sách</Link>
      </div>
    );
  }

  const currentChapterNumber = parseInt(chapterNumber);
  const totalChapters = allChapters.length;
  const isPreviousDisabled = currentChapterNumber <= 1;
  const isNextDisabled = currentChapterNumber >= totalChapters;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Main content */}
      <main className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 justify-center py-5 sm:py-10">
          <div className="layout-content-container flex flex-col w-full max-w-4xl flex-1 px-4">
            {/* Breadcrumb */}
            <div className="flex flex-wrap gap-2 px-4 mb-4">
              <Link to="/" className="text-text-muted-light dark:text-text-muted-dark text-sm font-medium leading-normal hover:text-primary">
                Trang chủ
              </Link>
              <span className="text-text-muted-light dark:text-text-muted-dark text-sm font-medium leading-normal">/</span>
              <Link to={`/story/${storyId}`} className="text-text-muted-light dark:text-text-muted-dark text-sm font-medium leading-normal hover:text-primary">
                {story.title}
              </Link>
              <span className="text-text-muted-light dark:text-text-muted-dark text-sm font-medium leading-normal">/</span>
              <span className="text-text-light dark:text-white text-sm font-medium leading-normal">
                {chapter.title}
              </span>
            </div>

            {/* Title section */}
            <div className="flex flex-wrap justify-between gap-3 p-4 mb-6">
              <div className="flex min-w-72 flex-col gap-3">
                <h1 className="text-primary text-4xl font-black leading-tight tracking-[-0.033em]">
                  {story.title} - {chapter.title}
                </h1>
                <p className="text-text-muted-light dark:text-text-muted-dark text-lg font-normal leading-normal">
                  Chương {chapter.chapterNumber} • {chapter.views || 0} lượt xem
                </p>
              </div>
            </div>

            {/* Chapter navigation */}
            <div className="px-4 py-3 mb-8 bg-secondary-light dark:bg-secondary-dark rounded-lg">
              {/* Desktop layout */}
              <div className="hidden sm:flex justify-between items-center gap-4">
                {/* Previous button */}
                <button
                  onClick={goToPreviousChapter}
                  disabled={isPreviousDisabled}
                  className={`w-auto min-w-[84px] max-w-[480px] cursor-pointer flex items-center justify-center overflow-hidden rounded-lg h-10 px-4 text-sm font-bold leading-normal tracking-[0.015em] transition-colors ${
                    isPreviousDisabled
                      ? 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed'
                      : 'bg-primary/20 dark:bg-white/10 text-text-light dark:text-white hover:bg-primary/30 dark:hover:bg-white/20'
                  }`}
                >
                  <span className="truncate">← Chương trước</span>
                </button>

                {/* Dropdown */}
                <select
                  value={currentChapterNumber}
                  onChange={(e) => goToChapter(parseInt(e.target.value))}
                  className="flex-1 sm:w-64 appearance-none bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-lg h-10 px-4 text-sm text-text-light dark:text-white focus:ring-primary focus:border-primary"
                >
                  {allChapters.map((ch, idx) => (
                    <option key={ch._id} value={ch.chapterNumber}>
                      {ch.title}
                    </option>
                  ))}
                </select>

                {/* Home button */}
                <Link 
                  to={`/story/${storyId}`}
                  className="w-auto min-w-[84px] max-w-[480px] cursor-pointer flex items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-gray-200 dark:bg-white/10 text-text-light dark:text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-300 dark:hover:bg-white/20 transition-colors"
                  title="Về trang truyện"
                >
                  <span className="truncate">Về trang truyện</span>
                </Link>

                {/* Next button */}
                <button
                  onClick={goToNextChapter}
                  disabled={isNextDisabled}
                  className={`w-auto min-w-[84px] max-w-[480px] cursor-pointer flex items-center justify-center overflow-hidden rounded-lg h-10 px-4 text-sm font-bold leading-normal tracking-[0.015em] transition-colors ${
                    isNextDisabled
                      ? 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed'
                      : 'bg-primary text-white hover:bg-primary/90'
                  }`}
                >
                  <span className="truncate">Chương sau →</span>
                </button>
              </div>

              {/* Mobile layout - all in one row */}
              <div className="sm:hidden flex items-center justify-center gap-2">
                {/* Previous arrow */}
                <button
                  onClick={goToPreviousChapter}
                  disabled={isPreviousDisabled}
                  className={`flex-shrink-0 flex items-center justify-center overflow-hidden rounded-lg h-10 w-10 text-sm font-bold leading-normal transition-colors ${
                    isPreviousDisabled
                      ? 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed'
                      : 'bg-primary/20 dark:bg-white/10 text-text-light dark:text-white hover:bg-primary/30 dark:hover:bg-white/20'
                  }`}
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>

                {/* Dropdown */}
                <select
                  value={currentChapterNumber}
                  onChange={(e) => goToChapter(parseInt(e.target.value))}
                  className="flex-1 appearance-none bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-lg h-10 px-2 text-xs text-text-light dark:text-white focus:ring-primary focus:border-primary"
                >
                  {allChapters.map((ch, idx) => (
                    <option key={ch._id} value={ch.chapterNumber}>
                      {ch.title}
                    </option>
                  ))}
                </select>

                {/* Home icon */}
                <Link 
                  to={`/story/${storyId}`}
                  className="flex-shrink-0 flex items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-gray-200 dark:bg-white/10 text-text-light dark:text-white hover:bg-gray-300 dark:hover:bg-white/20 transition-colors"
                  title="Về trang truyện"
                >
                  <span className="material-symbols-outlined">home</span>
                </Link>

                {/* Next arrow */}
                <button
                  onClick={goToNextChapter}
                  disabled={isNextDisabled}
                  className={`flex-shrink-0 flex items-center justify-center overflow-hidden rounded-lg h-10 w-10 text-sm font-bold leading-normal transition-colors ${
                    isNextDisabled
                      ? 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed'
                      : 'bg-primary text-white hover:bg-primary/90'
                  }`}
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>

            {/* Chapter content */}
            <article className="prose prose-lg dark:prose-invert max-w-none px-4 text-text-light dark:text-text-dark text-lg leading-loose space-y-6 mb-8">
              <ChapterRenderer 
                content={chapter.content}
                isEditable={false}
              />
            </article>

            {/* Bottom navigation */}
            <div className="flex justify-stretch mb-8">
              <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 justify-between">
                <button
                  onClick={goToPreviousChapter}
                  disabled={isPreviousDisabled}
                  className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 text-sm font-bold leading-normal tracking-[0.015em] transition-colors ${
                    isPreviousDisabled
                      ? 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed'
                      : 'bg-primary/20 dark:bg-white/10 text-text-light dark:text-white hover:bg-primary/30 dark:hover:bg-white/20'
                  }`}
                >
                  <span className="truncate">← Chương trước</span>
                </button>
                <button
                  onClick={goToNextChapter}
                  disabled={isNextDisabled}
                  className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 text-sm font-bold leading-normal tracking-[0.015em] transition-colors ${
                    isNextDisabled
                      ? 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed'
                      : 'bg-primary text-white hover:bg-primary/90'
                  }`}
                >
                  <span className="truncate">Chương sau →</span>
                </button>
              </div>
            </div>

            <hr className="border-gray-200 dark:border-white/10 my-12" />

            {/* Author info */}
            <div className="bg-secondary-light dark:bg-secondary-dark rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 mb-12">
              <img
                src={story.coverImage || 'https://via.placeholder.com/96x96?text=No+Image'}
                alt={story.author}
                className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-background-dark shadow-lg"
              />
              <div className="text-center sm:text-left">
                <h3 className="text-xl font-bold text-text-light dark:text-white">{story.author}</h3>
                <p className="text-text-muted-light dark:text-text-muted-dark mt-2 text-sm leading-relaxed">
                  Cảm ơn các bạn đã theo dõi {story.title}. Mỗi lượt đọc, mỗi bình luận của các bạn là nguồn động lực to lớn để mình tiếp tục viết nên những chương tiếp theo.
                </p>
              </div>
            </div>

            <hr className="border-gray-200 dark:border-white/10 my-12" />

            {/* Comments Section */}
            <div className="px-4 py-3">
              <CommentSection storyId={story._id} chapterId={chapter._id} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChapterReader;
