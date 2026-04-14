import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, BookOpen } from 'lucide-react';
import { usePage } from '../hooks/usePage';
import { useContactEmail } from '../hooks/useContactEmail';

const About = () => {
  const { get } = usePage('about');
  const contactEmail = useContactEmail();

  return (
    <main className="flex flex-col gap-8 md:gap-12 min-h-screen">
      <div className="flex flex-1 justify-center py-10 md:py-16">
        <div className="layout-content-container flex flex-col flex-1 gap-8">
          {/* Header */}
          <div className="flex flex-col gap-3 px-4 text-center items-center">
            <h1 className="text-text-light dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-tighter">
              Về Chúng Tôi
            </h1>
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-base md:text-lg font-normal leading-normal max-w-2xl whitespace-pre-line">
              {get('hero_intro')}
            </p>
          </div>

          {/* Mission + Story */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
            <div className="bg-white dark:bg-[#1c182d] border border-gray-200 dark:border-gray-700 rounded-xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
                <h2 className="text-primary text-xl font-bold leading-tight tracking-tight">
                  {get('mission_title')}
                </h2>
              </div>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed whitespace-pre-line">
                {get('mission_body')}
              </p>
            </div>
            <div className="bg-white dark:bg-[#1c182d] border border-gray-200 dark:border-gray-700 rounded-xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-6 h-6 text-primary" />
                <h2 className="text-primary text-xl font-bold leading-tight tracking-tight">
                  {get('story_title')}
                </h2>
              </div>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed whitespace-pre-line">
                {get('story_body')}
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="bg-white dark:bg-[#1c182d] border border-gray-200 dark:border-gray-700 rounded-xl p-6 md:p-8 mx-4">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-6 h-6 text-primary" />
              <h2 className="text-primary text-2xl font-bold leading-tight tracking-tight">
                {get('values_title')}
              </h2>
            </div>
            <ul className="space-y-3 text-text-light dark:text-text-dark">
              {['value_1', 'value_2', 'value_3'].map((k) => {
                const v = get(k);
                if (!v) return null;
                return (
                  <li key={k} className="flex items-start gap-3">
                    <span className="text-primary font-bold text-lg flex-shrink-0">◆</span>
                    <span className="text-base leading-relaxed">{v}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contact CTA */}
          <div className="bg-primary/10 dark:bg-primary/20 border border-primary/30 rounded-xl p-6 md:p-8 mx-4 text-center">
            <h2 className="text-primary text-2xl font-bold leading-tight tracking-tight mb-3">
              {get('contact_cta_title')}
            </h2>
            <p className="text-text-light dark:text-text-dark text-base leading-relaxed max-w-2xl mx-auto whitespace-pre-line mb-4">
              {get('contact_cta_body')}
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
              >
                Gửi liên hệ
              </Link>
              <a
                href={`mailto:${contactEmail}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-[#1c182d] border border-gray-200 dark:border-gray-700 text-text-light dark:text-white text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-[#2A2640] transition-colors"
              >
                {contactEmail}
              </a>
            </div>
          </div>

          {/* Back */}
          <div className="flex justify-center mt-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              <span className="text-sm font-medium">Quay lại trang chủ</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default About;
