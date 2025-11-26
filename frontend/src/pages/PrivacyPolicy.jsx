import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <main className="flex flex-col gap-8 md:gap-12 min-h-screen">
      {/* Page Container */}
      <div className="px-4 md:px-10 lg:px-20 xl:px-40 flex flex-1 justify-center py-12 md:py-20">
        <div className="layout-content-container flex flex-col max-w-4xl flex-1">
          {/* Page Header */}
          <div className="flex flex-col items-center text-center gap-4 mb-12">
            <p className="text-primary text-base font-semibold">Chính sách của chúng tôi</p>
            <h1 className="text-text-light dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-tighter">
              Chính Sách Bảo Mật
            </h1>
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-lg md:text-xl max-w-2xl">
              Chúng tôi cam kết bảo vệ quyền riêng tư và thông tin cá nhân của bạn.
            </p>
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-normal">
              Cập nhật lần cuối: 26 tháng 11 năm 2025
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-10">
            {/* Section: Giới thiệu */}
            <div>
              <h2 className="text-primary text-2xl font-bold leading-tight tracking-tight mb-4">
                Giới thiệu
              </h2>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                Chào mừng bạn đến với Lam điệp cô ảnh. Chúng tôi cam kết bảo vệ thông tin cá nhân của
                bạn và tôn trọng quyền riêng tư của bạn. Chính sách này giải thích cách chúng tôi thu
                thập, sử dụng và bảo vệ dữ liệu của bạn khi bạn truy cập và sử dụng trang web của chúng
                tôi.
              </p>
            </div>

            <hr className="border-gray-200 dark:border-gray-700" />

            {/* Section: Thu Thập Thông Tin Cá Nhân */}
            <div>
              <h2 className="text-primary text-2xl font-bold leading-tight tracking-tight mb-4">
                Thu Thập Thông Tin Cá Nhân
              </h2>
              <div className="space-y-4 text-text-light dark:text-text-dark text-base leading-relaxed">
                <p>Chúng tôi có thể thu thập các loại thông tin sau:</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>
                    <strong>Thông tin bạn cung cấp trực tiếp:</strong> Tên, địa chỉ email, tên người
                    dùng, mật khẩu khi bạn đăng ký tài khoản hoặc bình luận trên trang web.
                  </li>
                  <li>
                    <strong>Thông tin thu thập tự động:</strong> Địa chỉ IP, loại trình duyệt, hệ
                    điều hành, thông tin thiết bị, và các trang bạn đã truy cập trên website của
                    chúng tôi.
                  </li>
                  <li>
                    <strong>Thông tin từ hoạt động của bạn:</strong> Các truyện bạn đã đọc, đánh
                    dấu yêu thích, bình luận, và các tương tác khác với nội dung trên trang web.
                  </li>
                </ul>
              </div>
            </div>

            <hr className="border-gray-200 dark:border-gray-700" />

            {/* Section: Cách Chúng Tôi Sử Dụng Thông Tin */}
            <div>
              <h2 className="text-primary text-2xl font-bold leading-tight tracking-tight mb-4">
                Cách Chúng Tôi Sử Dụng Thông Tin
              </h2>
              <div className="space-y-4 text-text-light dark:text-text-dark text-base leading-relaxed">
                <p>Thông tin của bạn được sử dụng cho các mục đích sau:</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                  <li>
                    <strong>Quản lý tài khoản:</strong> Xác thực và quản lý tài khoản người dùng của
                    bạn, cho phép bạn đăng nhập và sử dụng các tính năng cá nhân.
                  </li>
                  <li>
                    <strong>Cải thiện dịch vụ:</strong> Phân tích cách bạn sử dụng trang web để cải
                    thiện nội dung, tính năng và trải nghiệm người dùng.
                  </li>
                  <li>
                    <strong>Thông tin và Hỗ trợ:</strong> Gửi cho bạn các thông báo quan trọng, cập
                    nhật về truyện mới, và hỗ trợ khi bạn cần thiết.
                  </li>
                  <li>
                    <strong>An ninh và Tuân thủ:</strong> Bảo vệ trang web khỏi các hoạt động gian
                    lận, spam và tuân thủ các nghĩa vụ pháp lý.
                  </li>
                </ul>
              </div>
            </div>

            <hr className="border-gray-200 dark:border-gray-700" />

            {/* Section: Cookie & Công Nghệ Theo Dõi */}
            <div>
              <h2 className="text-primary text-2xl font-bold leading-tight tracking-tight mb-4">
                Cookie &amp; Công Nghệ Theo Dõi
              </h2>
              <div className="space-y-4 text-text-light dark:text-text-dark text-base leading-relaxed">
                <p>
                  Chúng tôi sử dụng cookie và các công nghệ tương tự để nâng cao trải nghiệm của bạn,
                  bao gồm ghi nhớ sở thích đọc, thông tin đăng nhập, và thống kê sử dụng. Bạn có thể kiểm soát
                  việc sử dụng cookie thông qua cài đặt trình duyệt của mình.
                </p>
                <div className="bg-primary/10 dark:bg-primary/20 border-l-4 border-primary p-4 rounded-lg">
                  <p className="font-medium text-primary dark:text-blue-200">Lưu ý quan trọng</p>
                  <p className="text-text-light dark:text-text-dark mt-1">
                    Việc vô hiệu hóa cookie có thể ảnh hưởng đến một số tính năng của trang web và trải nghiệm
                    đọc truyện của bạn, bao gồm khả năng lưu lại vị trí đọc.
                  </p>
                </div>
              </div>
            </div>

            <hr className="border-gray-200 dark:border-gray-700" />

            {/* Section: Chia Sẻ Thông Tin Của Bạn */}
            <div>
              <h2 className="text-primary text-2xl font-bold leading-tight tracking-tight mb-4">
                Chia Sẻ Thông Tin Của Bạn
              </h2>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                Chúng tôi cam kết không bán, trao đổi hoặc chia sẻ thông tin cá nhân của bạn với bất kỳ
                bên thứ ba nào vì mục đích thương mại mà không có sự đồng ý rõ ràng của bạn, trừ khi
                được yêu cầu bởi pháp luật hoặc cơ quan có thẩm quyền.
              </p>
            </div>

            <hr className="border-gray-200 dark:border-gray-700" />

            {/* Section: Bảo Vệ Thông Tin Của Bạn */}
            <div>
              <h2 className="text-primary text-2xl font-bold leading-tight tracking-tight mb-4">
                Bảo Vệ Thông Tin Của Bạn
              </h2>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed mb-4">
                Chúng tôi áp dụng các biện pháp bảo mật nghiêm ngặt để bảo vệ dữ liệu của bạn, bao gồm:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3 p-3 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
                  <span className="material-symbols-outlined text-primary mt-1">enhanced_encryption</span>
                  <p className="text-text-light dark:text-text-dark">
                    <strong>Mã hóa dữ liệu:</strong> Dữ liệu nhạy cảm được mã hóa khi truyền và
                    lưu trữ trên máy chủ.
                  </p>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
                  <span className="material-symbols-outlined text-primary mt-1">security</span>
                  <p className="text-text-light dark:text-text-dark">
                    <strong>Giám sát bảo mật:</strong> Hệ thống được giám sát liên tục để phát
                    hiện và ngăn chặn các lỗ hổng.
                  </p>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
                  <span className="material-symbols-outlined text-primary mt-1">manage_accounts</span>
                  <p className="text-text-light dark:text-text-dark">
                    <strong>Quản lý truy cập:</strong> Hạn chế quyền truy cập vào thông tin cá
                    nhân của người dùng.
                  </p>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
                  <span className="material-symbols-outlined text-primary mt-1">backup</span>
                  <p className="text-text-light dark:text-text-dark">
                    <strong>Sao lưu dữ liệu:</strong> Dữ liệu được sao lưu định kỳ để đảm bảo
                    an toàn và khôi phục.
                  </p>
                </div>
              </div>
            </div>

            <hr className="border-gray-200 dark:border-gray-700" />

            {/* Section: Quyền Của Bạn */}
            <div>
              <h2 className="text-primary text-2xl font-bold leading-tight tracking-tight mb-4">
                Quyền Của Bạn
              </h2>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                Bạn có quyền truy cập, sửa đổi, xóa thông tin cá nhân của mình, hoặc phản đối việc xử lý
                dữ liệu của mình. Để thực hiện bất kỳ quyền nào trong số này, vui lòng liên hệ với chúng tôi
                qua các thông tin liên hệ được cung cấp dưới đây.
              </p>
            </div>

            <hr className="border-gray-200 dark:border-gray-700" />

            {/* Section: Thay Đổi Chính Sách & Liên Hệ */}
            <div>
              <h2 className="text-primary text-2xl font-bold leading-tight tracking-tight mb-4">
                Thay Đổi Chính Sách &amp; Liên Hệ
              </h2>
              <div className="space-y-4 text-text-light dark:text-text-dark text-base leading-relaxed">
                <p>
                  Chúng tôi có thể cập nhật chính sách này theo thời gian. Mọi thay đổi sẽ được đăng
                  trên trang này. Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật hoặc cách chúng tôi xử lý
                  dữ liệu của bạn, vui lòng liên hệ với chúng tôi qua email:{' '}
                  <a
                    className="text-primary font-medium hover:underline"
                    href="mailto:khitabolonhauvikhongdatduocten@gmail.com"
                  >
                    khitabolonhauvikhongdatduocten@gmail.com
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>

          {/* Footer Text */}
          <div className="mt-20 text-center text-text-secondary-light dark:text-text-secondary-dark">
            <p>Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của Lam điệp cô ảnh.</p>
            <p className="text-sm mt-2">© 2025 Lam điệp cô ảnh. Bảo lưu mọi quyền.</p>
          </div>

          {/* Back Button */}
          <div className="flex justify-center mt-8">
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

export default PrivacyPolicy;
