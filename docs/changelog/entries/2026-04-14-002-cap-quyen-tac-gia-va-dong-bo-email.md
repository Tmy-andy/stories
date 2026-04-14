# [FEATURE] Cấp quyền Tác Giả ở Manager + đồng bộ email contact vào trang tĩnh

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| **Ngày giờ** | 2026-04-14 |
| **Người thực hiện** | Claude (Opus 4.6) |
| **Tag** | `[FEATURE]` |
| **Mức rủi ro** | `MEDIUM` |
| **Commit hash** | `90a9bb4` |
| **Branch** | main |

## Mục đích

Triển khai 2 mục từ `Note để lần sau sửa.md`:

- **#3** — Admin có thể cấp / gỡ quyền Tác giả cho người dùng ở `/manager/users`. `/user-profile` hiển thị trạng thái này trong mục "Cấp Độ Thành Viên".
- **#5** — Email ở `/contact`, `/terms-and-conditions`, `/privacy-policy` đồng bộ từ `settings.contactEmail` (quản lý ở `/manager/settings`). Trang `/about` chưa có → sẽ làm ở entry cho #6.

## Thiết kế

### #3 — Cấp quyền Tác giả
- Dùng field **`isAuthor: Boolean`** sẵn có trên `User` model (không thay `role` enum để không phá các chỗ khác đang bind theo 3 giá trị `user|manager|admin`).
- Backend: thêm `PATCH /api/manager/users/:id/toggle-author` — chỉ `admin` được gọi, flip `isAuthor`. Không đổi role, không đụng membership points.
- Frontend ManagerUsers:
  - Thêm cột "Tác giả" hiển thị badge.
  - Admin có thêm nút cấp / gỡ quyền (song song với nút đổi role). Manager không có quyền này.
- Frontend UserProfile: trong card "Cấp Độ Thành Viên", thêm dòng "Tác giả: Đã xác minh / Chưa cấp quyền" với icon. Giữ nguyên card "Trạng Thái Tác Giả" riêng để mô tả chi tiết.

### #5 — Sync contact email
- Backend đã có `GET /api/settings` public sẵn (`settings.contactEmail`).
- Tạo hook `useContactEmail` (frontend) fetch 1 lần, trả email + fallback mặc định.
- Cập nhật `Contact.jsx`, `TermsAndConditions.jsx`, `PrivacyPolicy.jsx` đọc qua hook thay vì hardcode. `mailto:` cũng dùng giá trị động.

## Phạm vi thay đổi

### File mới tạo
- `frontend/src/hooks/useContactEmail.js` — hook fetch settings.contactEmail với fallback.

### File được sửa nội dung

**Backend**
- `backend/routes/managerAPI.js` — thêm route `PATCH /users/:id/toggle-author` (admin-only).

**Frontend**
- `frontend/src/services/managerAPI.js` — thêm `toggleUserAuthor(id)` client.
- `frontend/src/pages/manager/ManagerUsers.jsx`
  - Thêm `handleToggleAuthor` + optimistic update.
  - Bảng: thêm cột "Tác giả" (badge "Tác giả" nếu true, "-" nếu false).
  - Hàng action: thêm nút "UserCheck/UserX" (admin-only) để cấp/gỡ quyền.
- `frontend/src/pages/UserProfile.jsx` — trong card "Cấp Độ Thành Viên" thêm row "Tác giả".
- `frontend/src/pages/Contact.jsx` — dùng `useContactEmail`, thêm `mailto:` link.
- `frontend/src/pages/TermsAndConditions.jsx` — thay email hardcode bằng hook.
- `frontend/src/pages/PrivacyPolicy.jsx` — thay email hardcode bằng hook.

## Kiểm thử sau khi sửa

- [ ] Admin login → `/manager/users`: thấy cột "Tác giả", click nút cấp → reload vẫn giữ trạng thái.
- [ ] Manager (không phải admin) → không thấy nút cấp/gỡ Tác giả.
- [ ] User được cấp Tác giả → vào `/user-profile`: mục "Cấp Độ Thành Viên" hiện dòng "Tác giả: Đã xác minh".
- [ ] Đổi `contactEmail` ở `/manager/settings` → save → reload `/contact`, `/terms-and-conditions`, `/privacy-policy` thấy email mới.
- [ ] Click mailto ở từng trang mở đúng email mới.
- [ ] Không lỗi console khi settings chưa tải xong (hiển thị fallback).

## Cách rollback

```bash
git revert <commit-hash>
```

Thủ công: xóa route `toggle-author`, xóa hook `useContactEmail.js`, revert các file trong danh sách.

## Ghi chú

- Không thay đổi role enum → filter "author" trong ManagerUsers vẫn trơ (tạm để tay, sẽ xử ở entry sau khi có nhu cầu). Không phải bug mới do thay đổi này.
- Trang `/about` chưa tồn tại, để #6 xử lý luôn.
- Không thêm permission check cho route `toggle-author` ở backend cho non-admin manager token → đã chặn ở role check trong handler (giống pattern `/users/:id/role`).
