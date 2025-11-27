import React, { useState } from 'react';
import { authService } from '../services/authService';
import contactService from '../services/contactService';

const Contact = () => {
  const user = authService.getCurrentUser();
  const [formData, setFormData] = useState({
    name: user?.username || '',
    email: user?.email || '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await contactService.submitContact(formData);
      setSuccess(true);
      // Reset form if not logged in
      if (!user) {
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        setFormData({
          ...formData,
          subject: '',
          message: ''
        });
      }
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-text-light dark:text-white mb-4">Liên hệ với chúng tôi</h1>
            <p className="text-text-muted-light dark:text-text-muted-dark text-lg">
              Có câu hỏi hoặc góp ý? Chúng tôi luôn sẵn sàng lắng nghe!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-secondary-dark p-6 rounded-lg border border-gray-200 dark:border-white/10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-2xl">mail</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-text-light dark:text-white mb-2">Email</h3>
                    <p className="text-text-muted-light dark:text-text-muted-dark">lamdiepcohanh@gmail.com</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-secondary-dark p-6 rounded-lg border border-gray-200 dark:border-white/10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-2xl">schedule</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-text-light dark:text-white mb-2">Thời gian xử lý</h3>
                    <p className="text-text-muted-light dark:text-text-muted-dark">Từ lập tức đến 3-5 ngày làm việc</p>
                    <p className="text-text-muted-light dark:text-text-muted-dark text-sm mt-1">Tùy theo mức độ phức tạp của vấn đề</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-white dark:bg-secondary-dark p-6 rounded-lg border border-gray-200 dark:border-white/10">
                <h3 className="font-bold text-text-light dark:text-white mb-4">Theo dõi chúng tôi</h3>
                <div className="flex gap-3">
                  <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-white/10 text-text-muted-light dark:text-text-muted-dark hover:bg-primary hover:text-white dark:hover:bg-primary transition-all">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path clipRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" fillRule="evenodd"></path></svg>
                  </a>
                  <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-white/10 text-text-muted-light dark:text-text-muted-dark hover:bg-primary hover:text-white dark:hover:bg-primary transition-all">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg>
                  </a>
                  <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-white/10 text-text-muted-light dark:text-text-muted-dark hover:bg-primary hover:text-white dark:hover:bg-primary transition-all">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path clipRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.012-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.345 2.525c.636-.247 1.363-.416 2.427-.465C9.793 2.013 10.147 2 12.315 2zm-1.002 6.363a4.73 4.73 0 11-9.46 0 4.73 4.73 0 019.46 0zm-1.637 0a3.093 3.093 0 11-6.186 0 3.093 3.093 0 016.186 0zM17.436 6.36a1.211 1.211 0 11-2.422 0 1.211 1.211 0 012.422 0z" fillRule="evenodd"></path></svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white dark:bg-secondary-dark p-8 rounded-lg border border-gray-200 dark:border-white/10">
              <h2 className="text-2xl font-bold text-text-light dark:text-white mb-6">Gửi tin nhắn</h2>
              
              {success && (
                <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                    <span className="material-symbols-outlined">check_circle</span>
                    <p className="font-medium">Gửi tin nhắn thành công! Chúng tôi sẽ phản hồi sớm nhất có thể.</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
                    <span className="material-symbols-outlined">error</span>
                    <p className="font-medium">{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-text-light dark:text-white mb-2">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-background-light dark:bg-background-dark border border-gray-300 dark:border-white/10 rounded-lg text-text-light dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Nhập họ và tên của bạn"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-light dark:text-white mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-background-light dark:bg-background-dark border border-gray-300 dark:border-white/10 rounded-lg text-text-light dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-light dark:text-white mb-2">
                    Tiêu đề <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-background-light dark:bg-background-dark border border-gray-300 dark:border-white/10 rounded-lg text-text-light dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Nội dung bạn muốn trao đổi"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-light dark:text-white mb-2">
                    Nội dung <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full px-4 py-3 bg-background-light dark:bg-background-dark border border-gray-300 dark:border-white/10 rounded-lg text-text-light dark:text-white focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                    placeholder="Nhập nội dung chi tiết..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin">refresh</span>
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">send</span>
                      Gửi tin nhắn
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
