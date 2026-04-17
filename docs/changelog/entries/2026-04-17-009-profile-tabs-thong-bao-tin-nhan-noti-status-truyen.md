# [FEATURE] Profile tabs (Thông báo / Tin nhắn), noti đổi trạng thái truyện

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| **Ngày giờ** | 2026-04-17 (giờ Việt Nam) |
| **Người thực hiện** | Claude Code |
| **Tag** | `[FEATURE]` |
| **Mức rủi ro** | `HIGH` |
| **Commit hash** | _(chưa commit)_ |
| **Branch** | main |

## Mục đích

Nâng cấp trang `/profile/:userId` với các tính năng:
1. Mở rộng layout (bỏ khoảng trống 2 bên).
2. Thêm "Bắt đầu trở thành tác giả từ" dựa trên `authorApprovedAt`.
3. Chuyển Danh sách truyện + Bình luận sang dạng **tab** (4 tab: Truyện / Thông báo / Tin nhắn / Bình luận).
4. **Tab Thông báo**: tác giả đăng bài, người theo dõi nhận noti + cmt được.
5. **Tab Tin nhắn**: bất kỳ ai đăng bài (Thắc mắc / Giao lưu), tác giả nhận noti khi có bài mới.
6. Thêm notification khi tác giả đổi trạng thái truyện (Hoàn thành / Hoãn / ...) → gửi cho người đã thêm truyện vào yêu thích.

## Phạm vi thay đổi

### File mới tạo
- `backend/models/AuthorPost.js` — model bài đăng (Thông báo + Tin nhắn)
- `backend/models/PostComment.js` — model bình luận bài đăng
- `backend/controllers/authorPostController.js` — CRUD bài đăng + cmt + noti
- `backend/routes/authorPosts.js` — routes cho author posts

### File được sửa nội dung
- `backend/models/User.js` — thêm field `authorApprovedAt: Date`
- `backend/models/Notification.js` — thêm types: `author_announcement`, `story_status_change`, `message_board_post`
- `backend/routes/managerAPI.js` — set `authorApprovedAt` khi grant isAuthor
- `backend/controllers/storyController.js` — `updateStory` check status thay đổi → noti người theo dõi truyện
- `backend/controllers/authController.js` — trả thêm `authorApprovedAt` trong profile response
- `backend/server.js` — đăng ký route `/api/author-posts`
- `frontend/src/pages/PublicProfile.jsx` — layout rộng hơn, authorApprovedAt, hệ thống 4 tab

## Chi tiết thay đổi

### AuthorPost model
```
profileUserId (ref User) | userId (ref User) | type: announcement|message_board
title (message_board) | subtitle: thac_mac|giao_luu | content
```

### Notification flow
- Announcement mới → noti tất cả follower của tác giả (type: author_announcement)
- Message board post mới → noti tác giả (type: message_board_post)
- Comment @mention → noti người được mention
- Story status thay đổi → noti tất cả người đã thêm truyện vào yêu thích (type: story_status_change)

### Tabs (frontend)
- Tab 1: Danh sách truyện (chỉ tác giả)
- Tab 2: Thông báo (chỉ tác giả)
- Tab 3: Tin nhắn (chỉ tác giả)
- Tab 4: Bình luận gần đây (tất cả)

## Kiểm thử sau khi sửa

- [ ] Backend khởi động bình thường
- [ ] Tạo announcement → follower nhận noti
- [ ] Post tin nhắn → tác giả nhận noti
- [ ] Đổi status truyện → người follow nhận noti
- [ ] Tab switching hoạt động mượt
- [ ] Non-author profile chỉ thấy tab Bình luận

## Cách rollback

```bash
git revert <commit-hash>
```

**Thủ công:**
1. Xóa `backend/models/AuthorPost.js`, `PostComment.js`
2. Xóa `backend/controllers/authorPostController.js`
3. Xóa `backend/routes/authorPosts.js`
4. Revert `User.js`, `Notification.js`, `managerAPI.js`, `storyController.js`, `authController.js`, `server.js`
5. Revert `frontend/src/pages/PublicProfile.jsx`

## Ghi chú

- `authorApprovedAt` không retroactive cho tác giả cũ (chỉ set từ lần grant mới)
- Mention detection trong PostComment dùng regex `/@(\w+)/g`
