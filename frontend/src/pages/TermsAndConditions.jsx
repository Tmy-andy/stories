import React from 'react';
import { Link } from 'react-router-dom';

const TermsAndConditions = () => {
  return (
    <main className="flex flex-col gap-8 md:gap-12 min-h-screen">
      {/* Page Container */}
      <div className="px-4 md:px-10 lg:px-20 xl:px-40 flex flex-1 justify-center py-10 md:py-16">
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1 gap-8">
          {/* Page Header */}
          <div className="flex flex-col gap-3 px-4 text-center items-center">
            <h1 className="text-text-light dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-tighter">
              Điều Khoản &amp; Điều Kiện
            </h1>
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-base md:text-lg font-normal leading-normal max-w-2xl">
              Những quy tắc cơ bản được đặt ra để xây dựng một cộng đồng đọc truyện văn minh, lành mạnh và
              phát triển bền vững.
            </p>
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-normal leading-normal pt-2">
              Cập nhật lần cuối: 24 tháng 07, 2024
            </p>
          </div>

          {/* Content Section */}
          <div className="flex flex-col gap-8">
            {/* Section: Story Genre */}
            <div className="bg-white dark:bg-[#1c182d] border border-gray-200 dark:border-gray-700 rounded-xl p-6 md:p-8">
              <h2 className="text-primary text-2xl font-bold leading-tight tracking-tight mb-4">
                Về Thể Loại Truyện
              </h2>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed mb-6">
                Trang web "Lam điệp cô ảnh" hướng đến đối tượng độc giả trưởng thành và có nhận thức đầy đủ. 
                Vì tác giả tùy hứng và không kén chọn thể loại, cái gì cũng có thể xảy ra kể cả những trường hợp bạn không nghĩ tới.
                <br/>
                <b>Hãy cân nhắc và đọc kỹ mô tả truyện</b> để bạn có thể lựa chọn phù hợp với sở thích của mình.
              </p>
              <div className="p-5 bg-primary/10 dark:bg-primary/20 rounded-lg">
                <div className="flex flex-col items-stretch justify-start gap-4 sm:flex-row sm:items-start">
                  <div className="flex-shrink-0 text-primary">
                    <span className="material-symbols-outlined text-4xl">error</span>
                  </div>
                  <div className="flex w-full min-w-0 grow flex-col items-stretch justify-center gap-1">
                    <p className="text-text-light dark:text-text-dark text-lg font-bold leading-tight tracking-tight">
                      Khuyến cáo quan trọng
                    </p>
                    <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                      Toàn bộ tình tiết, nhân vật, và bối cảnh trong truyện đều là hư cấu. Mọi sự
                      trùng hợp nếu có chỉ là ngẫu nhiên và không phản ánh bất kỳ cá nhân, tổ chức
                      hay sự kiện nào trong thực tế.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Content */}
            <div className="bg-white dark:bg-[#1c182d] border border-gray-200 dark:border-gray-700 rounded-xl p-6 md:p-8">
              <h2 className="text-primary text-2xl font-bold leading-tight tracking-tight mb-4">
                Về Nội Dung Truyện
              </h2>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed mb-6">
                Truyện có thể chứa các yếu tố nhạy cảm. Tác giả luôn cố gắng cân bằng giữa nghệ thuật và
                giới hạn, tuy nhiên khuyến khích độc giả cân nhắc kỹ trước khi đọc.
              </p>
              <div className="p-5 bg-yellow-400/10 dark:bg-yellow-500/20 rounded-lg">
                <div className="flex flex-col items-stretch justify-start gap-4 sm:flex-row sm:items-start">
                  <div className="flex-shrink-0 text-yellow-500 dark:text-yellow-400">
                    <span className="material-symbols-outlined text-4xl">warning</span>
                  </div>
                  <div className="flex w-full min-w-0 grow flex-col items-stretch justify-center gap-1">
                    <p className="text-text-light dark:text-text-dark text-lg font-bold leading-tight tracking-tight">
                      Cảnh báo nội dung (Trigger Warning)
                    </p>
                    <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                      Truyện có thể chứa các chi tiết về bạo lực, xung đột tâm lý, hoặc các chủ đề
                      người lớn khác. Vui lòng đảm bảo bạn đủ 18 tuổi và có tâm lý vững vàng trước
                      khi tiếp tục.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Community Guidelines */}
            <div className="bg-white dark:bg-[#1c182d] border border-gray-200 dark:border-gray-700 rounded-xl p-6 md:p-8">
              <h2 className="text-primary text-2xl font-bold leading-tight tracking-tight mb-4">
                Về Phát Ngôn &amp; Hành Vi
              </h2>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed mb-6">
                Để xây dựng một không gian trao đổi lành mạnh, vui lòng tuân thủ các quy tắc sau trong khu
                vực bình luận và tương tác:
              </p>
              <ul className="list-disc list-inside space-y-3 text-text-light dark:text-text-dark">
                <li>Tôn trọng tác giả và các độc giả khác.</li>
                <li>Không sử dụng ngôn ngữ thù địch, xúc phạm, hay phân biệt đối xử.</li>
                <li>Tránh tiết lộ trước nội dung truyện (spoiler) mà không có cảnh báo.</li>
                <li>Không đăng tải các liên kết spam, quảng cáo hoặc nội dung không liên quan.</li>
                <li>Góp ý một cách văn minh, xây dựng và mang tính cá nhân.</li>
              </ul>
            </div>

            {/* Section: OC Policy */}
            <div className="bg-white dark:bg-[#1c182d] border border-gray-200 dark:border-gray-700 rounded-xl p-6 md:p-8">
              <h2 className="text-primary text-2xl font-bold leading-tight tracking-tight mb-4">
                Về Nhân Vật OC (Original Character)
              </h2>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                Toàn bộ nhân vật trong truyện đều là "con đẻ tinh thần" của tác giả. Nghiêm cấm mọi hành vi sao
                chép, sử dụng hình ảnh hoặc danh tính nhân vật cho mục đích thương mại hoặc phi thương
                mại mà chưa có sự cho phép rõ ràng bằng văn bản.
              </p>
            </div>

            {/* Section: Author & Site Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-[#1c182d] border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                <h3 className="text-primary text-xl font-bold leading-tight tracking-tight mb-3">
                  Về Lịch Cập Nhật
                </h3>
                <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                  Tác giả sẽ cố gắng duy trì tiến độ đều đặn, tuy nhiên lịch có thể thay đổi tùy thuộc vào điều kiện cá nhân.
                </p>
              </div>
              <div className="bg-white dark:bg-[#1c182d] border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                <h3 className="text-primary text-xl font-bold leading-tight tracking-tight mb-3">
                  Về Tác Giả
                </h3>
                <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                  Mọi phản hồi, góp ý hoặc báo lỗi xin vui lòng gửi về trang Liên Hệ. Tác giả luôn trân
                  trọng những đóng góp xây dựng từ phía độc giả.
                </p>
              </div>
            </div>

            {/* Section: Legal & Contact */}
            <div className="bg-white dark:bg-[#1c182d] border border-gray-200 dark:border-gray-700 rounded-xl p-6 md:p-8">
              <h2 className="text-primary text-2xl font-bold leading-tight tracking-tight mb-4">
                Điều Khoản Sử Dụng Trang Web
              </h2>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed mb-4">
                Bằng việc truy cập và đọc truyện trên "Lam điệp cô ảnh", bạn đồng ý không sao chép, tái
                bản, phân phối lại nội dung dưới mọi hình thức khi chưa được sự đồng ý của tác giả. Đây
                là sản phẩm sáng tạo và được bảo hộ bởi luật bản quyền.
              </p>
              <h3 className="text-text-light dark:text-text-dark text-xl font-bold leading-tight tracking-tight mt-6 mb-3">
                Liên Hệ &amp; Hỗ Trợ
              </h3>
              <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                Nếu có bất kỳ câu hỏi nào về các điều khoản này, xin vui lòng liên hệ qua email:{' '}
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

          {/* Footer Notice */}
          <div className="text-center mt-8 px-4">
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-base">
              Việc tiếp tục sử dụng trang web đồng nghĩa với việc bạn đã đọc, hiểu và chấp nhận toàn bộ các
              điều khoản được nêu trên.
            </p>
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm mt-4">
              © 2025 Lam điệp cô ảnh. Bảo lưu mọi quyền.
            </p>
          </div>

          {/* Back Button */}
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

export default TermsAndConditions;
