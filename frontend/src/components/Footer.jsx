import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-secondary-light dark:bg-secondary-dark mt-12 w-full">
      <div className="container mx-auto px-4 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-3 text-primary">
              <div className="size-8">
                <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24.7,11.5c-2-0.8-4.1-1.2-6.2-1.2c-5.7,0-10.7,1.9-14,4.5c0.6-0.3,1.3-0.5,2-0.7c3.4-1.1,7.2-1.7,11.2-1.7c1.9,0,3.7,0.2,5.5,0.6c-0.1-0.2-0.2-0.3-0.2-0.5c0-0.3,0.1-0.6,0.2-0.9C23.4,11.3,24,11.3,24.7,11.5z M43.5,15.7c-3.3-2.6-8.3-4.5-14-4.5c-4,0-7.8,0.6-11.2,1.7c-0.7,0.2-1.4,0.4-2,0.7c-0.1,0-0.1,0.1-0.2,0.1c0,0.2,0,0.3,0,0.5c0,3.3,4,6.2,9.3,7.6c-5.2,1.4-9.3,4.3-9.3,7.6c0,3.3,4,6.2,9.3,7.6c-5.2,1.4-9.3,4.3-9.3,7.6c0,3.3,4,6.2,9.3,7.6c-0.2,0.5-0.3,1-0.3,1.5c0,0.8,0.2,1.6,0.5,2.3c3.3,2.6,8.3,4.5,14,4.5c11,0,20-3.9,20-8.7c0-2.7-3.6-5.1-8.9-6.4c5.3-1.3,8.9-3.7,8.9-6.4s-3.6-5.1-8.9-6.4C39.9,21.8,43.5,19,43.5,15.7z" fill="currentColor"></path>
                </svg>
              </div>
              <h2 className="text-text-light dark:text-white text-xl font-bold font-display">Lam điệp cô ảnh</h2>
            </div>
            <p className="mt-4 text-sm text-text-muted-light dark:text-text-muted-dark max-w-xs">
              Nơi chắp cánh cho những câu chuyện tiểu thuyết, đưa bạn vào thế giới của trí tưởng tượng.
            </p>
          </div>

          {/* Links Sections */}
          <div className="col-span-1 md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Quick Links */}
            <div className="text-center sm:text-left">
              <h4 className="font-bold text-text-light dark:text-white mb-4">Liên kết nhanh</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-sm text-text-muted-light dark:text-text-muted-dark hover:text-primary dark:hover:text-primary transition-colors">Về chúng tôi</Link></li>
                <li><Link to="/contact" className="text-sm text-text-muted-light dark:text-text-muted-dark hover:text-primary dark:hover:text-primary transition-colors">Liên hệ</Link></li>
                <li><Link to="/terms-and-conditions" className="text-sm text-text-muted-light dark:text-text-muted-dark hover:text-primary dark:hover:text-primary transition-colors">Điều khoản &amp; Điều kiện</Link></li>
                <li><Link to="/privacy" className="text-sm text-text-muted-light dark:text-text-muted-dark hover:text-primary dark:hover:text-primary transition-colors">Chính sách bảo mật</Link></li>
              </ul>
            </div>

            {/* Categories */}
            <div className="text-center sm:text-left">
              <h4 className="font-bold text-text-light dark:text-white mb-4">Danh mục</h4>
              <ul className="space-y-2">
                <li><Link to="/category/tienhiep" className="text-sm text-text-muted-light dark:text-text-muted-dark hover:text-primary dark:hover:text-primary transition-colors">Tiên hiệp</Link></li>
                <li><Link to="/category/kiem" className="text-sm text-text-muted-light dark:text-text-muted-dark hover:text-primary dark:hover:text-primary transition-colors">Kiếm hiệp</Link></li>
                <li><Link to="/category/nguon" className="text-sm text-text-muted-light dark:text-text-muted-dark hover:text-primary dark:hover:text-primary transition-colors">Ngôn tình</Link></li>
              </ul>
            </div>

            {/* Social Links */}
            <div className="text-center sm:text-left">
              <h4 className="font-bold text-text-light dark:text-white mb-4">Theo dõi</h4>
              <div className="flex gap-4 justify-center sm:justify-start">
                <a href="#" className="text-text-muted-light dark:text-text-muted-dark hover:text-primary dark:hover:text-primary transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path clipRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" fillRule="evenodd"></path></svg>
                </a>
                <a href="#" className="text-text-muted-light dark:text-text-muted-dark hover:text-primary dark:hover:text-primary transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg>
                </a>
                <a href="#" className="text-text-muted-light dark:text-text-muted-dark hover:text-primary dark:hover:text-primary transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path clipRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.012-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.345 2.525c.636-.247 1.363-.416 2.427-.465C9.793 2.013 10.147 2 12.315 2zm-1.002 6.363a4.73 4.73 0 11-9.46 0 4.73 4.73 0 019.46 0zm-1.637 0a3.093 3.093 0 11-6.186 0 3.093 3.093 0 016.186 0zM17.436 6.36a1.211 1.211 0 11-2.422 0 1.211 1.211 0 012.422 0z" fillRule="evenodd"></path></svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-300 dark:border-white/10 text-center text-sm text-text-muted-light dark:text-text-muted-dark">
          <p>© 2024 Lam điệp cô ảnh. Mọi quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
