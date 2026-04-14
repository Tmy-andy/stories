# [FIX] Hiển thị tác giả ở Profile/Manager + slug truyện trong URL

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| **Ngày giờ** | 2026-04-14 |
| **Người thực hiện** | Claude (Opus 4.6) |
| **Tag** | `[FIX]` |
| **Mức rủi ro** | `MEDIUM` |
| **Commit hash** | (điền sau khi commit) |
| **Branch** | main |

## Mục đích

Fix 3 bug từ `Note để lần sau sửa.md`:

- **#1** — `/profile`:
  - Tab "Lịch sử đọc" không hiển thị tên tác giả truyện.
  - Tab "Truyện yêu thích" không hiển thị danh sách (do lấy từ `User.favorites` legacy, trong khi `FavoriteButton` ghi vào collection `Favorite` riêng).
- **#2** — URL truyện ở nhiều trang vẫn dùng `_id` thay vì `slug`. Yêu cầu: mặc định URL truyện hiển thị theo `slug` (fallback `_id` nếu không có slug).
- **#9** — `/manager/stories` cột "Tác giả" luôn hiện N/A.

## Nguyên nhân gốc

| Bug | Root cause |
|-----|-----------|
| #1a | `readingHistoryController` populate field `author` (không tồn tại trên model `Story`). Model dùng `authorId` (ref: User). Frontend đọc `item.storyId.author` → undefined. |
| #1b | `Profile.jsx` tab favorites dùng `profile.favorites` (trường legacy trên model `User`). `FavoriteButton` dùng collection `Favorite` riêng → 2 nguồn không sync, tab hiện rỗng. |
| #2  | Link trong Profile, Favorites, Home, ChapterReader, AllNotifications hardcode `/story/${_id}`. Backend `storyController.getStoryById` vốn đã chấp nhận cả slug và id nên chỉ cần đổi ở FE. |
| #9  | `ManagerStories.jsx` đọc `story.author?.name`. Backend trả về `authorId` đã populate (`displayName`, `username`, `email`). Field `author.name` không tồn tại → `N/A`. |

## Phạm vi thay đổi

### File được sửa nội dung

**Backend**
- `backend/controllers/readingHistoryController.js`
  - `getReadingHistory`: populate `'title coverImage author'` → `'title coverImage slug authorId'` + nested populate `authorId` với `displayName username`.
  - `getAllReadingHistory`: tương tự.

**Frontend**
- `frontend/src/components/ProfileReadingHistory.jsx`
  - Dòng 64 `handleNavigateToStory(item.storyId._id, ...)` → dùng `slug || _id`.
  - Dòng 85 `item.storyId.author` → `item.storyId.authorId?.displayName || item.storyId.authorId?.username || 'Ẩn danh'`.
- `frontend/src/components/ReadingHistory.jsx` (ReadingHistory khác dùng chung field) — tương tự ProfileReadingHistory.
- `frontend/src/pages/Profile.jsx`
  - Tab favorites: thay `profile.favorites` bằng state mới, fetch qua `favoriteService.getUserFavorites()` khi active tab.
  - Link `/story/${comment.storyId._id}` → dùng `slug || _id`. Backend comment populate đã có `storyId.title`, cần thêm `slug`.
- `frontend/src/pages/Favorites.jsx`
  - Link `/story/${favorite.storyId._id}` → dùng `slug || _id`.
  - Hiển thị tác giả `favorite.storyId.author` → `authorId?.displayName || authorId?.username || 'Ẩn danh'`. Backend `favoriteController.getUserFavorites` populate thêm `slug authorId` + nested populate.
- `frontend/src/pages/Home.jsx`
  - 2 Link `/story/${story._id}` → dùng `slug || _id`.
- `frontend/src/pages/ChapterReader.jsx`
  - 3 Link `/story/${storyId}` → dùng `story.slug || storyId`.
- `frontend/src/pages/AllNotifications.jsx`
  - `navigate(/story/${storyId})` dùng `notification.storyId?.slug || storyId` (notification đã populate `title slug`).
- `frontend/src/pages/manager/ManagerStories.jsx`
  - `story.author?.name` → `story.authorId?.displayName || story.authorId?.username || 'N/A'`.
- `backend/controllers/favoriteController.js`
  - `getUserFavorites` populate: `'title author coverImage chapterCount'` → `'title slug coverImage chapterCount authorId'` + nested populate `authorId` (`displayName username`).
- `backend/controllers/authController.js` (`getUserProfile`)
  - `.populate('storyId', 'title')` cho comments → thêm `slug` để Profile comments có thể link bằng slug.

## Kiểm thử sau khi sửa

- [ ] `/profile` → tab "Lịch sử đọc": hiện tên tác giả (không còn `Tác giả: undefined`).
- [ ] `/profile` → tab "Truyện yêu thích": hiện danh sách đúng (tick yêu thích 1 truyện rồi vào xem).
- [ ] `/favorites`: hiện tác giả cho mỗi truyện, click vào → URL dùng slug.
- [ ] `/` (Home): click truyện → URL dùng slug.
- [ ] `/manager/stories`: cột "Tác giả" hiện đúng displayName/username (không N/A cho truyện có tác giả hợp lệ).
- [ ] `/chapter/:slug/:num` hoặc `/chapter/:id/:num`: breadcrumb "Quay lại" trỏ sang `/story/slug`.
- [ ] Click thông báo "chương mới" → đi tới `/story/slug`.

## Cách rollback

**Nhanh nhất:**
```bash
git revert <commit-hash>
```

**Thủ công:** revert từng file theo danh sách "File được sửa nội dung" ở trên. Không có migration DB nên không cần động database.

## Ghi chú

- Không đụng tới `StoryDetail2.jsx` (file không được route).
- Không đụng tới `Header.jsx` search dropdown và `Stories.jsx` (có dùng `story.author` nhưng không nằm trong note #1/#2/#9 — để lần sau).
- Không đụng `chapterController.populate(..., 'title author')` — không gây lỗi hiển thị nào đã note.
- Backend `getStoryById` đã hỗ trợ cả slug và id từ trước, không cần đổi gì phía server.
