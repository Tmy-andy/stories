import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

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
                    <ul className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                <li className="flex items-start gap-2">
                  <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={20} />
                  <span>Luôn kiểm tra tags trước khi đọc truyện</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={20} />
                  <span>Nếu bạn nhạy cảm với nội dung nào, hãy bỏ qua truyện đó</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={20} />
                  <span>Chúng tôi không chịu trách nhiệm nếu bạn phớt lờ các cảnh báo</span>
                </li>
              </ul>
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
                Tác giả khá tuỳ hứng thế nên có thể sẽ có lối trong chuyện bất ngờ mà chưa gắn vào thể loại hay văn án. Tuy nhiên tác giả sẽ <b>cảnh báo trước</b> và có hẳn 1 chương tóm tắt kết thúc cho bạn.
              </p>
              
              <div className="space-y-4 mb-6">
                <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg">
                  <div className="flex items-start gap-2 mb-2">
                    <span className="material-symbols-outlined text-2xl text-red-600 dark:text-red-400 flex-shrink-0">error</span>
                    <h3 className="text-red-600 dark:text-red-400 font-bold text-lg">
                      Cảnh Báo Nội Dung
                    </h3>
                  </div>
                  <p className="text-red-700 dark:text-red-300 text-base">
                    Nếu truyện có nội dung nhạy cảm hoặc yếu tố không phù hợp với tam quan (nói thẳng ra là hố / lôi có thể nổ bạn bùm bùm) sẽ có cảnh báo ở đầu chương đó.
                  </p>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-lg">
                  <div className="flex items-start gap-2 mb-2">
                    <span className="material-symbols-outlined text-2xl text-blue-600 dark:text-blue-400 flex-shrink-0">info</span>
                    <h3 className="text-blue-600 dark:text-blue-400 font-bold text-lg">
                      Tóm Tắt
                    </h3>
                  </div>
                  <p className="text-blue-700 dark:text-blue-300 text-base">
                    Để bạn có thể trải nghiệm truyện đầy đủ mà không lọt hố, chương nào có cảnh báo đều sẽ có thêm 1 chương tóm tắt nội dung hoặc thêm một đầy đủ và tóm gọn nội dung bị cảnh báo lại.
                  </p>
                </div>
              </div>

              <div className="p-5 bg-yellow-400/10 dark:bg-yellow-500/20 rounded-lg">
                <div className="flex flex-col items-stretch justify-start gap-4 sm:flex-row sm:items-start">
                  <div className="flex-shrink-0 text-yellow-500 dark:text-yellow-400">
                    <span className="material-symbols-outlined text-4xl">warning</span>
                  </div>
                  <div className="flex w-full min-w-0 grow flex-col items-stretch justify-center gap-1">
                    <p className="text-text-light dark:text-text-dark text-lg font-bold leading-tight tracking-tight">
                      Trigger Warning (Cảnh báo kích hoạt)
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
              <ul className="space-y-3 ml-8 text-text-light dark:text-text-dark">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 font-bold text-lg flex-shrink-0">✓</span>
                  <span>Tôn trọng quan điểm của tác giả và những người dùng khác</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 dark:text-red-400 font-bold text-lg flex-shrink-0">✗</span>
                  <span>Không sử dụng ngôn ngữ thù địch, xúc phạm, hay phân biệt đối xử.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 font-bold text-lg flex-shrink-0">✓</span>
                  <span>Tránh tiết lộ trước nội dung truyện (spoiler) mà không có cảnh báo.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 dark:text-red-400 font-bold text-lg flex-shrink-0">✗</span>
                  <span>Không đăng tải các liên kết spam, quảng cáo hoặc nội dung không liên quan.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-400 font-bold text-lg flex-shrink-0">✓</span>
                  <span>Góp ý một cách văn minh, xây dựng và mang tính cá nhân.</span>
                </li>
              </ul>
            </div>

            {/* Section: Author & Site Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              <div className="bg-white dark:bg-[#1c182d] border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                <h3 className="text-primary text-xl font-bold leading-tight tracking-tight mb-3">
                  Về Nhân Vật OC (Original Character)
                </h3>
                <p className="text-text-light dark:text-text-dark text-base font-normal leading-relaxed">
                  OC là tài sản trí tuệ của tác giả. Không được sử dụng OC để tạo nội dung khác mà không xin phép. Nếu muốn sử dụng OC, hãy liên hệ tác giả trước.
                </p>
              </div>
            </div>

            {/* Section: Legal & Contact */}
            <div className="bg-white dark:bg-[#1c182d] border border-gray-200 dark:border-gray-700 rounded-xl p-6 md:p-8">
              <div className="flex items-start gap-3 mb-4">
                <span className="material-symbols-outlined text-2xl text-primary flex-shrink-0">description</span>
                <h2 className="text-primary text-2xl font-bold leading-tight tracking-tight">
                  Điều Khoản Sử Dụng Trang Web
                </h2>
              </div>
              
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg p-6 mb-6">
                <div className="flex items-start gap-3 mb-4">
                  <span className="material-symbols-outlined text-2xl text-red-600 dark:text-red-400 flex-shrink-0">description</span>
                  <h3 className="text-red-600 dark:text-red-400 font-bold text-lg">
                    Quy Định Chung:
                  </h3>
                </div>
                <ol className="space-y-3 ml-8 text-red-700 dark:text-red-300">
                  <li className="flex gap-2">
                    <span className="font-bold flex-shrink-0">1.</span>
                    <span><b>Bản quyền:</b> Tất cả nội dung trên trang đều thuộc quyền sở hữu của tác giả. Nghiêm cấm sao chép, tái bản hoặc sử dụng trái phép.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold flex-shrink-0">2.</span>
                    <span><b>Sử dụng cá nhân:</b> Bạn chỉ được phép đọc và lưu lại nội dung cho mục đích cá nhân, không để tiếp tục phát tán.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold flex-shrink-0">3.</span>
                    <span><b>Cấm hoạt động:</b> Không được tải lên nội dung có bản quyền, spam, quảng cáo trái phép trong bình luận.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold flex-shrink-0">4.</span>
                    <span><b>Trách nhiệm:</b> Tác giả không chịu trách nhiệm về nội dung từ người dùng khác. Bạn tự chịu trách nhiệm về hành vi của mình.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold flex-shrink-0">5.</span>
                    <span><b>Thay đổi điều khoản:</b> Tác giả có quyền thay đổi điều khoản này bất cứ lúc nào mà không cần thông báo trước.</span>
                  </li>
                </ol>
              </div>

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
