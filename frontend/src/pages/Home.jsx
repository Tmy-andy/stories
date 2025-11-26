import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import heroBanner from '../assets/images/hero-banner.png';
import { storyService } from '../services/storyService';

const Home = () => {
  const [featuredStories, setFeaturedStories] = useState([]);
  const [newStories, setNewStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featured, latest] = await Promise.all([
          storyService.getFeaturedStories(),
          storyService.getLatestStories(4)
        ]);
        setFeaturedStories(featured);
        setNewStories(latest);
      } catch (error) {
        console.error('Error fetching stories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-text-light dark:text-white text-lg">Đang tải...</div>
      </div>
    );
  }

  return (
    <main className="flex flex-col gap-8 md:gap-12">
      {/* Hero Section */}
      <div className="w-full mt-5">
        <div className="@container">
          <div className="@[480px]:p-4">
            <div
              className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-xl items-start justify-end px-4 pb-4 @[480px]:px-10"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.5) 100%), url(${heroBanner})`
              }}
            >
              <div className="flex flex-col gap-2 text-left">
                <h1 className="text-white font-semibold leading-tight tracking-[-0.033em] @[480px]:text-3xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] pb-2" style={{ fontFamily: "'Noto Serif Display', serif", fontSize: '2.7rem' }}>
                  Lam Điệp Cô Ảnh
                </h1>
                <h2 className="text-white text-base font-normal leading-relaxed @[480px]:text-lg @[480px]:leading-relaxed max-w-xl">
                  {/* Tiếng Việt */}
                  <span className="block mb-4">
                    Lam điệp cô ảnh, chấn dực ư vô quang chi dạ.<br />
                    Truyền kỳ dị sử, ngưỡng mộ chi tâm.
                  </span>

                  {/* Chữ Hán */}
                  <span
                    className="block text-xl @[480px]:text-2xl tracking-wide leading-relaxed"
                    style={{ fontFamily: "'Noto Serif TC', serif" }}
                  >
                    藍蝶孤影，振翼於無光之夜。<br />
                    傳奇異事，令人心生仰慕。
                  </span>
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Stories */}
      <section>
        <h2 className="text-text-light dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5 font-display">Truyện Nổi Bật</h2>
        <div className="flex overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4">
          <div className="flex items-stretch p-4 gap-4">
            {featuredStories.map((story) => (
              <div key={story._id} className="flex h-full flex-1 flex-col gap-4 rounded-lg bg-white dark:bg-[#1e1c27] shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-[0_0_4px_rgba(0,0,0,0.1)] min-w-60 transition-transform duration-300 hover:-translate-y-1">
                <div
                  className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-t-lg flex flex-col"
                  style={{ backgroundImage: `url("${story.coverImage}")` }}
                ></div>
                <div className="flex flex-col flex-1 justify-between p-4 pt-0 gap-4">
                  <div>
                    <p className="text-text-light dark:text-white text-base font-medium leading-normal font-display">{story.title}</p>
                    <p className="text-text-muted-light dark:text-text-muted-dark text-sm font-normal leading-normal">Tác giả: {story.author}</p>
                  </div>
                  <Link
                    to={`/story/${story._id}`}
                    className="flex w-full min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary/10 dark:bg-[#2b2839] text-primary dark:text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors"
                  >
                    <span className="truncate">Xem chi tiết</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Updates */}
      <section>
        <h2 className="text-text-light dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5 font-display">Mới Cập Nhật</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
          {newStories.map((story) => (
            <Link key={story._id} to={`/story/${story._id}`} className="flex flex-col gap-3 group">
              <div
                className="w-full bg-center bg-no-repeat aspect-[3/4] bg-cover rounded-lg flex flex-col transition-transform duration-300 group-hover:scale-105"
                style={{ backgroundImage: `url("${story.coverImage}")` }}
              ></div>
              <div>
                <h3 className="text-text-light dark:text-white text-base font-medium leading-normal font-display group-hover:text-primary dark:group-hover:text-primary transition-colors">{story.title}</h3>
                <p className="text-text-muted-light dark:text-text-muted-dark text-sm font-normal leading-normal">Chương {story.chapterCount}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;
