# [FIX] Fix @mention gợi ý + hiển thị mention nổi bật + noti dẫn tới chapter

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| **Ngày giờ** | 2026-04-17 (giờ Việt Nam) |
| **Người thực hiện** | Claude |
| **Tag** | `[FIX]` |
| **Mức rủi ro** | `MEDIUM` |
| **Commit hash** | `af64449` |
| **Branch** | main |

## Mục đích

1. **@mention gợi ý không hiện**: Backend trả empty khi query rỗng + frontend không fetch khi vừa gõ `@`. Sửa để gõ `@` hiện ngay danh sách user đã comment. Cũng search theo displayName, không chỉ username.
2. **@mention trong comment là text thuần**: Tạo component `CommentContent` parse `@username` thành text vàng nổi bật, hover hiện UserTooltip.
3. **Notification không dẫn tới chapter**: Thêm `chapterId` vào Notification model, backend ghi tên chương trong message, frontend navigate tới `/chapter/:storyId/:chapterNumber?comment=xxx` + ChapterReader hỗ trợ scroll tới comment.

## Phạm vi thay đổi

### File được sửa nội dung
- `backend/models/Notification.js` — Thêm field `chapterId` ref Chapter
- `backend/controllers/notificationController.js` — Populate `chapterId` (chapterNumber, title)
- `backend/controllers/commentController.js` — Import Chapter/Story/Favorite model, thêm chapterId + tên chương vào notification data/message. getUserSuggestions: rewrite với priority (1) user đã comment → (2) tác giả truyện → (3) tác giả truyện yêu thích → (4) tất cả user. Search theo cả displayName
- `backend/routes/comments.js` — Chuyển /suggestions từ public sang protected (cần auth để biết user hiện tại cho priority)
- `frontend/src/components/CommentInput.jsx` — Fetch suggestions ngay khi gõ @ (không đợi thêm ký tự), regex hỗ trợ Unicode
- `frontend/src/App.jsx` — Thêm route `/profile/:userId` → PublicProfile
- `frontend/src/components/CommentSection.jsx` — Dùng CommentContent thay vì plain text
- `frontend/src/components/ReplyList.jsx` — Dùng CommentContent thay vì plain text
- `frontend/src/components/NotificationBell.jsx` — Navigate tới chapter page khi noti có chapterId
- `frontend/src/pages/AllNotifications.jsx` — Navigate tới chapter page khi noti có chapterId
- `frontend/src/pages/ChapterReader.jsx` — Hỗ trợ `?comment=` query param, scroll tới comment

### File mới tạo
- `frontend/src/components/CommentContent.jsx` — Component parse @mention → Link tới `/profile/:userId` + UserTooltip
- `frontend/src/pages/PublicProfile.jsx` — Trang profile công khai cho user khác (avatar, tên, cấp, bình luận gần đây)

## Kiểm thử sau khi sửa

- [ ] Gõ @ trong comment → hiện dropdown gợi ý (avatar + displayName + @username)
- [ ] Chọn suggestion → chèn @username vào comment
- [ ] @mention trong comment hiển thị màu vàng, hover hiện tooltip
- [ ] Comment trên chapter → notification ghi tên chương
- [ ] Click notification chapter comment → navigate tới chapter page, scroll tới comment
- [ ] Comment cũ không có mentions vẫn hiển thị bình thường

## Cách rollback

```bash
git revert <commit-hash>
```
