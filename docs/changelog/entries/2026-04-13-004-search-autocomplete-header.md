# [FEATURE] Search autocomplete dropdown + Enter chuyển sang trang kết quả

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| **Ngày giờ** | 2026-04-13 |
| **Người thực hiện** | Tmy-andy |
| **Tag** | `[FEATURE]` |
| **Mức rủi ro** | `MEDIUM` |
| **Commit hash** | `553bbf5` |
| **Branch** | main |

## Mục đích

Thanh tìm kiếm trên `Header.jsx` chưa hoạt động (chỉ là UI). Cần:
1. Gõ từng ký tự → dropdown hiện kết quả gần giống (autocomplete).
2. Nhấn Enter → chuyển sang trang hiển thị kết quả tìm kiếm (dùng lại trang `Stories.jsx` với param `?search=...`).

Backend endpoint `/api/stories?search=<keyword>` đã có sẵn (regex title + author), không cần sửa backend.

## Phạm vi thay đổi

### File được sửa

#### `frontend/src/components/Header.jsx`
- **Trước:** `<input>` tìm kiếm chỉ là UI, không có state, không có handler.
- **Sau:** 
  - Thêm state `searchQuery`, `searchResults`, `showDropdown`, `searchLoading`.
  - Debounce 300ms: mỗi khi `searchQuery` đổi → gọi `getAllStories({ search, limit: 6 })`.
  - Dropdown absolute-positioned dưới input, hiển thị tối đa 6 kết quả (ảnh bìa + tên + tác giả).
  - Click kết quả → `navigate('/story/:slug')`.
  - Enter trên input → `navigate('/stories?search=<keyword>')` + đóng dropdown.
  - Click outside → đóng dropdown (dùng `useRef` + `mousedown` listener).
  - Clear input khi đổi route.
- **Lý do:** Hiện thực tính năng tìm kiếm theo yêu cầu.

#### `frontend/src/pages/Stories.jsx`
- **Trước:** `useEffect` reload stories khi đổi `selectedCategories` / `selectedStatus`, không đọc `search` từ URL.
- **Sau:** 
  - Đọc `searchParams.get('search')` → truyền vào `params.search` khi gọi API.
  - `useEffect` thêm `searchParams` vào dependency để reload khi query đổi.
  - Khi có search, hiện title phụ "Kết quả tìm kiếm: <keyword>".
- **Lý do:** Để làm trang kết quả tìm kiếm khi user nhấn Enter ở Header.

### File bị xóa / di chuyển / mới tạo
_(không có)_

## Kiểm thử sau khi sửa

- [ ] Chạy frontend local (`npm start`).
- [ ] Gõ "abc" vào thanh search Header → dropdown hiện trong 300ms.
- [ ] Click 1 kết quả → chuyển sang trang truyện đó.
- [ ] Gõ tiếp rồi nhấn **Enter** → chuyển sang `/stories?search=abc` → list hiển thị đúng.
- [ ] Click ngoài dropdown → dropdown đóng.
- [ ] Khi không có kết quả → dropdown hiện "Không tìm thấy".
- [ ] Khi input trống → dropdown ẩn.
- [ ] Trên trang `/stories?search=xyz` đã lọc cate + status → vẫn lọc đúng theo cả 3 tiêu chí.

## Cách rollback

```bash
git revert <commit-hash>
```

Hoặc thủ công: khôi phục 2 file về bản cũ (`Header.jsx`, `Stories.jsx`) từ git history.

## Ghi chú

- **Chưa làm cho mobile menu** — search bar desktop (`hidden md:flex`) là focus chính. Mobile có thể bổ sung sau.
- Debounce 300ms là trade-off giữa UX (đủ nhanh) và số request. Có thể điều chỉnh nếu DB chậm.
- Request autocomplete `limit: 6` để dropdown không quá dài.
