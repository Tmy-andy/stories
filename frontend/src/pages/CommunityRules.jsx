import React from 'react';
import { Link } from 'react-router-dom';

const RULES = [
  {
    icon: 'handshake',
    title: 'Tôn trọng lẫn nhau',
    body: 'Hãy giữ thái độ lịch sự và tôn trọng với mọi thành viên trong cộng đồng. Không sử dụng ngôn ngữ xúc phạm, miệt thị, hay phân biệt đối xử dưới bất kỳ hình thức nào.'
  },
  {
    icon: 'no_adult_content',
    title: 'Không đăng nội dung không phù hợp',
    body: 'Nghiêm cấm đăng bình luận chứa nội dung khiêu dâm, bạo lực quá mức, hoặc nội dung gây hại cho trẻ em. Các bình luận vi phạm sẽ bị xóa ngay lập tức.'
  },
  {
    icon: 'warning',
    title: 'Cảnh báo spoiler',
    body: 'Nếu bình luận tiết lộ nội dung quan trọng của truyện, hãy bật tùy chọn "Tiết lộ nội dung (Spoiler)" để che nội dung. Điều này giúp những người chưa đọc tới không bị ảnh hưởng.'
  },
  {
    icon: 'gavel',
    title: 'Không vi phạm bản quyền',
    body: 'Không đăng nội dung sao chép nguyên văn từ tác phẩm khác mà không có sự cho phép. Không chia sẻ link hoặc nội dung vi phạm bản quyền của tác giả.'
  },
  {
    icon: 'person_off',
    title: 'Không quấy rối cá nhân',
    body: 'Không nhắm mục tiêu vào một người dùng cụ thể để quấy rối, đe dọa hoặc làm phiền. Tính năng @mention chỉ dùng để thông báo trong ngữ cảnh thảo luận, không để quấy rối.'
  },
  {
    icon: 'ads_click',
    title: 'Không spam',
    body: 'Không đăng bình luận lặp lại nhiều lần, không quảng cáo dịch vụ/sản phẩm, không đăng link không liên quan tới nội dung đang thảo luận.'
  },
  {
    icon: 'campaign',
    title: 'Giữ bình luận liên quan',
    body: 'Hãy bình luận về nội dung truyện hoặc chương đang xem. Tránh lạc đề quá xa khỏi chủ đề và giữ không khí thảo luận lành mạnh, có ích.'
  },
  {
    icon: 'flag',
    title: 'Báo cáo vi phạm',
    body: 'Nếu bạn thấy bình luận vi phạm quy tắc, hãy sử dụng nút 3 chấm → "Báo cáo Bình luận" để thông báo cho quản trị viên. Không tự ý tranh luận hay tấn công lại người vi phạm.'
  }
];

const CommunityRules = () => {
  return (
    <main className="flex flex-col gap-8 md:gap-12 min-h-screen">
      <div className="flex flex-1 justify-center py-10 md:py-16">
        <div className="layout-content-container flex flex-col flex-1 gap-8">
          {/* Header */}
          <div className="flex flex-col gap-3 px-4 text-center items-center">
            <span className="material-symbols-outlined text-5xl text-primary">gavel</span>
            <h1 className="text-text-light dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-tighter">
              Quy Tắc Ứng Xử
            </h1>
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-base md:text-lg font-normal leading-normal max-w-2xl">
              Để cộng đồng luôn là nơi thảo luận thân thiện và an toàn, tất cả thành viên cần tuân thủ các quy tắc dưới đây.
            </p>
          </div>

          {/* Rules list */}
          <div className="px-4 space-y-4">
            {RULES.map((rule, i) => (
              <div key={i} className="flex gap-4 p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-xl">{rule.icon}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{rule.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{rule.body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div className="mx-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl text-sm text-yellow-700 dark:text-yellow-400">
            <span className="font-semibold">Lưu ý:</span> Vi phạm nghiêm trọng hoặc lặp lại có thể dẫn đến tạm khóa hoặc cấm vĩnh viễn tài khoản. Quản trị viên có toàn quyền quyết định về các trường hợp vi phạm.
          </div>

          <div className="px-4 text-center pb-4">
            <Link to="/" className="text-primary hover:underline text-sm">← Quay về trang chủ</Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CommunityRules;
