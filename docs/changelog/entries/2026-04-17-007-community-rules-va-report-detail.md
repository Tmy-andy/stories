# [FEATURE] Trang Quy Tắc Ứng Xử + ô nhập chi tiết khi báo cáo

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| **Ngày giờ** | 2026-04-17 (giờ Việt Nam) |
| **Người thực hiện** | Claude |
| **Tag** | `[FEATURE]` |
| **Mức rủi ro** | `LOW` |
| **Commit hash** | (chưa commit) |
| **Branch** | main |

## Mục đích

1. Tạo trang `/community-rules` hiển thị quy tắc ứng xử cộng đồng
2. Sau khi chọn lý do báo cáo, hiện ô textarea để nhập chi tiết thêm

## Phạm vi thay đổi

### File mới tạo
- `frontend/src/pages/CommunityRules.jsx` — Trang quy tắc ứng xử

### File được sửa nội dung
- `frontend/src/App.jsx` — Thêm route `/community-rules`
- `frontend/src/components/ReportModal.jsx` — Thêm textarea chi tiết sau khi chọn lý do
- `backend/models/Report.js` — Thêm field `detail` (text tùy chọn)
- `backend/controllers/reportController.js` — Lưu `detail` khi tạo báo cáo

## Kiểm thử sau khi sửa

- [ ] `/community-rules` hiển thị đúng nội dung
- [ ] Link từ CommentMenu → /community-rules hoạt động
- [ ] Chọn lý do → hiện ô nhập chi tiết
- [ ] Gửi báo cáo → detail lưu vào DB

## Cách rollback

```bash
git revert <commit-hash>
```
