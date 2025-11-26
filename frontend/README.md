# Lam Điệp Cô Ảnh - Frontend React

Frontend của ứng dụng trang web tiểu thuyết "Lam Điệp Cô Ảnh", được xây dựng bằng React và Tailwind CSS.

## Cấu trúc dự án

```
frontend/
├── public/
│   └── index.html           # File HTML chính
├── src/
│   ├── components/
│   │   ├── Header.jsx       # Component Header - tái sử dụng
│   │   └── Footer.jsx       # Component Footer - tái sử dụng
│   ├── pages/
│   │   ├── Home.jsx         # Trang chủ
│   │   ├── Stories.jsx      # Trang danh sách truyện
│   │   └── StoryDetail.jsx  # Trang chi tiết truyện
│   ├── App.jsx              # Component chính
│   ├── index.js             # Entry point
│   └── index.css            # CSS toàn cục
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Cài đặt

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Chạy development server

```bash
npm start
```

Ứng dụng sẽ chạy tại `http://localhost:3000`

### 3. Build cho production

```bash
npm run build
```

## Công nghệ sử dụng

- **React 18** - UI library
- **React Router v6** - Routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client (nếu cần)

## Các trang

### 1. Trang Chủ (`/`)
- Hero section với banner
- Danh sách truyện nổi bật (scrollable)
- Danh sách truyện mới cập nhật

### 2. Danh Sách Truyện (`/stories`)
- Grid hiển thị tất cả truyện
- Bộ lọc theo thể loại, tác giả
- Sắp xếp kết quả
- Phân trang

### 3. Chi Tiết Truyện (`/story/:id`)
- Hiển thị nội dung chương
- Điều hướng chương trước/sau
- Dropdown chọn chương
- Phần bình luận
- Thông tin tác giả

## Component tái sử dụng

### Header Component
- Logo branding
- Navigation menu
- Search bar
- Login/Register buttons
- Mobile menu responsive

**File:** `src/components/Header.jsx`

### Footer Component
- Logo và mô tả
- Liên kết nhanh
- Danh mục
- Social media links
- Copyright

**File:** `src/components/Footer.jsx`

## Theme

Ứng dụng hỗ trợ **Dark Mode** với Tailwind CSS `darkMode: "class"`

Các màu chính:
- Primary: `#290ea0`
- Background Light: `#f6f6f8`
- Background Dark: `#141022`
- Secondary Light: `#F0F4F8`
- Secondary Dark: `#201a38`

## Routing

```javascript
/ → Home
/stories → Stories List
/story/:id → Story Detail
/categories → Categories (tạo sau)
/login → Login (tạo sau)
/register → Register (tạo sau)
```

## Tiếp theo

1. **Kết nối API**: Sửa các page để gọi API từ backend
2. **Authentication**: Thêm login/register
3. **User Profile**: Trang người dùng
4. **Search**: Chức năng tìm kiếm
5. **Comments**: Bình luận thực tế
6. **Dashboard tác giả**: Trang quản lý truyện

## Lưu ý quan trọng

- Header và Footer đã tách rời để dễ bảo trì
- Tất cả style sử dụng Tailwind CSS
- Responsive design cho mobile/tablet/desktop
- Dark mode hỗ trợ đầy đủ

## Build và Deploy

Để build dự án:

```bash
npm run build
```

Thư mục `build/` sẽ chứa các file sản phẩm siêu tối ưu.

Có thể deploy lên:
- Vercel
- Netlify
- GitHub Pages
- Firebase Hosting
