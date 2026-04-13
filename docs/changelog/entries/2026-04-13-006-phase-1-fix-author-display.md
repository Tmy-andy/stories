# [FIX] Hiển thị tên tác giả ở Home (Phase 1)

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| **Ngày giờ** | 2026-04-13 |
| **Người thực hiện** | Tmy-andy |
| **Tag** | `[FIX]` |
| **Mức rủi ro** | `LOW` |
| **Commit hash** | `553bbf5` |
| **Branch** | main |

## Mục đích

Ở trang Home, dưới tên truyện không hiển thị tên tác giả (chỉ thấy "Tác giả: " rỗng). Nguyên nhân: code dùng `story.author` — field này **không tồn tại** trong schema `Story` (schema chỉ có `authorId: ObjectId ref User`). Đồng thời API `/stories/featured` và `/stories/new` không populate `authorId`, nên frontend không có dữ liệu tác giả để hiển thị.

Đây là Phase 1 / 4 của feature author (xem plan trong cuộc trò chuyện). Các phase sau sẽ thêm: trang profile tác giả, follow/favorite tác giả, thông báo chương mới / truyện mới.

## Phạm vi thay đổi

### File được sửa

#### `backend/controllers/storyController.js`
- **Trước:** `getFeaturedStories` và `getLatestStories` chỉ populate `category`, không populate `authorId`.
- **Sau:** Thêm `.populate('authorId', 'displayName username avatar')` cho cả hai hàm.
- **Lý do:** Frontend cần `authorId.displayName` để render. Các hàm khác (`getAllStories`, `getStoryById`) đã populate sẵn nên không cần sửa.

#### `frontend/src/pages/Home.jsx`
- **Trước (line 90):**
  ```jsx
  <p>Tác giả: {story.author}</p>
  ```
  `story.author` undefined → render ra "Tác giả: " trống.
- **Sau:**
  ```jsx
  <p>Tác giả: {story.authorId?.displayName || story.authorId?.username || 'Ẩn danh'}</p>
  ```
- **Thêm:** Ở section "Mới Cập Nhật" (line ~117) thêm dòng hiển thị tác giả bên dưới số chương.
- **Lý do:** Đồng bộ pattern `authorId?.displayName || authorId?.username` đã dùng ở các chỗ khác (StoryDetail, Stories page sẽ dùng sau). Fallback `'Ẩn danh'` an toàn khi authorId chưa populate hoặc user bị xóa.

### File bị xóa / di chuyển / mới tạo
_(không có)_

## Kiểm thử sau khi sửa

- [ ] Mở trang Home → section "Truyện Nổi Bật" hiện "Tác giả: {tên}" cho mỗi card.
- [ ] Section "Mới Cập Nhật" hiện tên tác giả dưới số chương.
- [ ] User có displayName → hiện displayName. User chỉ có username → hiện username. Không có cả hai → hiện "Ẩn danh".
- [ ] Các trang khác (Stories list, StoryDetail) không bị ảnh hưởng.

## Cách rollback

```bash
git revert <commit-hash>
```

## Ghi chú

- Field `author: String` ở [storyController.js:93](backend/controllers/storyController.js#L93) khi tạo story là dư thừa (không có trong schema, bị mongoose bỏ qua). Search regex ở line 26 match `author` cũng vô hiệu. Sẽ xử lý ở phase sau khi refactor search theo `authorId`.
- Phase 1 chỉ đụng display, không đổi data shape — an toàn revert.
