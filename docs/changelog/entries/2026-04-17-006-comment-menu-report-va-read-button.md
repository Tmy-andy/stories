# [FEATURE] Comment 3-dot menu (báo cáo, liên kết, quy tắc) + nút Đọc tiếp ở StoryDetail

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| **Ngày giờ** | 2026-04-17 (giờ Việt Nam) |
| **Người thực hiện** | Claude |
| **Tag** | `[FEATURE]` |
| **Mức rủi ro** | `MEDIUM` |
| **Commit hash** | (chưa commit) |
| **Branch** | main |

## Mục đích

1. Thêm nút 3 chấm ở góc dưới phải bình luận với menu: Báo cáo, Liên kết đến bình luận, Quy tắc ứng xử, Xóa (chỉ chủ cmt hoặc tác giả truyện)
2. Modal báo cáo với 3 lý do: Nội dung không phù hợp, Vi phạm bản quyền, Tôi không muốn nhìn thấy nội dung này
3. Manager dashboard có thể xem + xử lý báo cáo bình luận
4. Nút "Đọc tiếp" / "Bắt đầu đọc truyện" ở trang chi tiết truyện

## Phạm vi thay đổi

### File mới tạo
- `backend/models/Report.js` — Schema báo cáo bình luận
- `backend/controllers/reportController.js` — CRUD báo cáo
- `backend/routes/reports.js` — API routes báo cáo
- `frontend/src/components/CommentMenu.jsx` — Dropdown 3-dot menu
- `frontend/src/components/ReportModal.jsx` — Modal chọn lý do báo cáo
- `frontend/src/pages/manager/ManagerReports.jsx` — Trang quản lý báo cáo

### File được sửa nội dung
- `backend/server.js` — Đăng ký route /api/reports
- `frontend/src/components/CommentSection.jsx` — Dùng CommentMenu thay nút Xóa trực tiếp
- `frontend/src/components/ReplyList.jsx` — Dùng CommentMenu thay nút Xóa trực tiếp
- `frontend/src/pages/StoryDetail.jsx` — Thêm nút Đọc tiếp/Bắt đầu đọc
- `frontend/src/App.jsx` — Thêm route /manager/reports
- `frontend/src/pages/manager/ManagerDashboard.jsx` — Link tới Reports

## Kiểm thử sau khi sửa

- [ ] Bấm 3 chấm → hiện menu (báo cáo, liên kết, quy tắc, xóa nếu được phép)
- [ ] Bấm "Báo cáo" → hiện modal chọn lý do → gửi thành công
- [ ] Bấm "Liên kết đến bình luận" → copy URL có #comment-xxx vào clipboard
- [ ] Bấm "Xóa" → chỉ hiện với chủ cmt hoặc tác giả truyện
- [ ] Manager dashboard → /manager/reports → xem danh sách báo cáo
- [ ] StoryDetail: user chưa đọc → "Bắt đầu đọc truyện", đã đọc → "Đọc tiếp Chương X"

## Cách rollback

```bash
git revert <commit-hash>
```
