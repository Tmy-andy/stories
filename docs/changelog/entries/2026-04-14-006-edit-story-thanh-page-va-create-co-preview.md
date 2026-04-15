# [FEATURE] Edit/Create story thành page riêng + live preview

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| **Ngày giờ** | 2026-04-14 |
| **Người thực hiện** | Claude (Opus 4.6) |
| **Tag** | `[FEATURE]` |
| **Mức rủi ro** | `MEDIUM` |
| **Commit hash** | (điền sau khi commit) |
| **Branch** | main |

## Mục đích

Giải quyết #4 trong `Note để lần sau sửa.md`: ở `/manager/stories`:
- Bỏ modal edit truyện → chuyển thành trang riêng `/manager/stories/:id/edit`.
- Thêm nút "Thêm truyện" → trang riêng `/manager/stories/new` với **live preview** (form bên trái, preview layout bên phải) để vừa viết vừa xem.

## Thiết kế

- 1 component chung `ManagerStoryForm.jsx` dùng cho cả create + edit (detect qua `useParams`).
- Preview panel render giống card hiển thị ở trang `/` (cover + title + mô tả + categories + status badge).
- Submit xong → `navigate('/manager/stories')`.

### API
- Backend POST `/api/manager/stories` — tạo truyện mới. `authorId` = `req.user.id` nếu có, fallback findOne admin user.
- PUT `/api/manager/stories/:id` — thêm field `coverImage`, `featured` (trước chỉ nhận title/description/category/status).

## Phạm vi thay đổi

### File mới
- `frontend/src/pages/manager/ManagerStoryForm.jsx`

### File sửa
**Backend**
- `backend/routes/managerAPI.js` — thêm POST `/stories`, mở rộng PUT `/stories/:id` với coverImage + featured.

**Frontend**
- `frontend/src/App.jsx` — thêm route `/manager/stories/new`, `/manager/stories/:id/edit`.
- `frontend/src/services/managerAPI.js` — thêm `createStory`.
- `frontend/src/pages/manager/ManagerStories.jsx` — bỏ edit modal + state; nút "Thêm truyện" + Edit button → `Link`.

## Kiểm thử

- [ ] `/manager/stories` → nút "Thêm truyện" dẫn tới `/manager/stories/new`.
- [ ] Tạo truyện mới → thấy trong list.
- [ ] Click Edit → route `/manager/stories/:id/edit`, form pre-fill.
- [ ] Lưu edit → quay lại list, thông tin đã update.
- [ ] Preview pane cập nhật khi gõ tiêu đề/mô tả/cover URL.

## Cách rollback

```bash
git revert <commit-hash>
```

## Ghi chú

- Chapter editing vẫn trong modal (ngoài scope #4 phần "edit-story").
