import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const ErrorPage = ({ code, title, message, Icon, accent = 'text-primary' }) => {
  const navigate = useNavigate();

  return (
    <main className="flex flex-col items-center justify-center py-16 md:py-24 text-center w-full">
      <div className="flex flex-col items-center gap-6 max-w-xl">
        {Icon && (
          <div className={`w-20 h-20 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center ${accent}`}>
            <Icon className="w-10 h-10" />
          </div>
        )}
        <div className={`text-7xl md:text-8xl font-black tracking-tighter ${accent}`}>
          {code}
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-text-light dark:text-white leading-tight">
          {title}
        </h1>
        <p className="text-base text-text-secondary-light dark:text-text-secondary-dark leading-relaxed whitespace-pre-line">
          {message}
        </p>
        <div className="flex flex-wrap gap-3 justify-center mt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Home className="w-4 h-4" /> Về trang chủ
          </Link>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-[#1c182d] border border-gray-200 dark:border-gray-700 text-text-light dark:text-white text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-[#2A2640] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại
          </button>
        </div>
      </div>
    </main>
  );
};

export default ErrorPage;
