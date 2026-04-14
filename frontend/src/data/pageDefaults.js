// Mirror của backend/data/pageDefaults.js — fallback khi API chưa tải xong.
// PHẢI GIỮ ĐỒNG BỘ với backend.

export const pageDefaults = {
  about: {
    title: 'Về Chúng Tôi',
    subtitle: 'Nơi những câu chuyện được chắp cánh.',
    fields: [
      { key: 'hero_intro', label: 'Đoạn giới thiệu đầu trang', default: 'Lam Điệp Cô Ảnh là nơi tác giả gửi gắm những câu chuyện chất chứa tâm huyết, được viết bằng đam mê và sự cẩn thận. Chúng tôi tin rằng mỗi câu chuyện đều xứng đáng có một khoảng trời riêng.' },
      { key: 'mission_title', label: 'Tiêu đề — Sứ Mệnh', default: 'Sứ Mệnh' },
      { key: 'mission_body', label: 'Nội dung — Sứ Mệnh', default: 'Mang đến một không gian đọc truyện lành mạnh, tôn trọng bản quyền, đồng thời khuyến khích sáng tạo. Độc giả là người đồng hành — không đơn thuần là người tiêu thụ nội dung.' },
      { key: 'story_title', label: 'Tiêu đề — Câu Chuyện Của Chúng Tôi', default: 'Câu Chuyện Của Chúng Tôi' },
      { key: 'story_body', label: 'Nội dung — Câu Chuyện', default: 'Khởi nguồn từ sở thích cá nhân, website dần trở thành nơi lưu giữ các sáng tác và chia sẻ với cộng đồng yêu văn học. Mỗi chương, mỗi nhân vật đều là một mảnh ghép nhỏ của hành trình viết lách.' },
      { key: 'values_title', label: 'Tiêu đề — Giá Trị', default: 'Giá Trị Cốt Lõi' },
      { key: 'value_1', label: 'Giá trị 1', default: 'Tôn trọng bản quyền và sáng tạo nguyên bản.' },
      { key: 'value_2', label: 'Giá trị 2', default: 'Xây dựng cộng đồng đọc giả văn minh.' },
      { key: 'value_3', label: 'Giá trị 3', default: 'Lắng nghe và cải thiện dựa trên phản hồi.' },
      { key: 'contact_cta_title', label: 'Tiêu đề — Liên Hệ', default: 'Giữ Liên Lạc' },
      { key: 'contact_cta_body', label: 'Nội dung — Liên Hệ', default: 'Bạn có góp ý, chia sẻ hoặc muốn hợp tác? Đừng ngần ngại liên hệ qua trang Contact — chúng tôi luôn trân trọng mọi phản hồi.' }
    ]
  },
  'terms-and-conditions': {
    title: 'Điều Khoản & Điều Kiện',
    subtitle: 'Những quy tắc cơ bản được đặt ra để xây dựng một cộng đồng đọc truyện văn minh, lành mạnh và phát triển bền vững.',
    fields: [
      { key: 'announcement', label: 'Thông báo bổ sung (hiện trên cùng, để trống nếu không cần)', default: '' }
    ]
  },
  'privacy-policy': {
    title: 'Chính Sách Bảo Mật',
    subtitle: '',
    fields: [
      { key: 'announcement', label: 'Thông báo bổ sung (hiện trên cùng, để trống nếu không cần)', default: '' }
    ]
  }
};

export function getPageDefaults(slug) {
  return pageDefaults[slug] || null;
}

export function buildFallback(slug) {
  const def = pageDefaults[slug];
  if (!def) return null;
  const fields = def.fields.map(f => ({ ...f, value: f.default, type: 'textarea' }));
  return { slug, title: def.title, subtitle: def.subtitle, fields };
}
