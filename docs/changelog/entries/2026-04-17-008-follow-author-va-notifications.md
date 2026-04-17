# [FEATURE] Theo dõi tác giả + thông báo chương mới / truyện mới

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| **Ngày giờ** | 2026-04-17 |
| **Người thực hiện** | Tmy-andy |
| **Tag** | `[FEATURE]` |
| **Mức rủi ro** | `MEDIUM` |
| **Commit hash** | _(chưa commit)_ |
| **Branch** | main |

## Mục đích

Phase 3 + 4 của feature tác giả:
- Người đọc có thể **theo dõi tác giả** (nút "Theo dõi" trên trang PublicProfile của tác giả).
- Khi **chương mới** được thêm → tất cả user đã Favorite truyện đó nhận thông báo `new_chapter`.
- Khi **truyện mới** được đăng → tất cả user đã follow tác giả đó nhận thông báo `new_story`.

## Phạm vi thay đổi

### File mới tạo

#### `backend/models/AuthorFollow.js`
- Schema: `{ userId: ObjectId ref User, authorId: ObjectId ref User, createdAt }`
- Index unique `{ userId, authorId }` để tránh follow trùng.

#### `backend/controllers/authorFollowController.js`
- `followAuthor`: POST — tạo AuthorFollow record.
- `unfollowAuthor`: DELETE — xóa record.
- `checkIsFollowing`: GET — kiểm tra đang follow không.
- `getFollowedAuthors`: GET — danh sách tác giả đang follow.

#### `backend/routes/authorFollows.js`
- `POST /api/author-follows` — follow
- `DELETE /api/author-follows/:authorId` — unfollow
- `GET /api/author-follows/my-follows` — danh sách
- `GET /api/author-follows/check/:authorId` — kiểm tra

### File được sửa

#### `backend/models/Notification.js`
- Thêm `'new_story'` vào enum type.

#### `backend/controllers/chapterController.js`
- Sau khi tạo chapter thành công → tìm tất cả Favorite của story → tạo Notification `new_chapter` cho từng user (trừ tác giả).

#### `backend/controllers/storyController.js`
- Sau khi tạo story thành công → tìm tất cả AuthorFollow của tác giả → tạo Notification `new_story` cho từng user.

#### `backend/server.js` (hoặc app.js)
- Mount route `/api/author-follows`.

#### `frontend/src/pages/PublicProfile.jsx`
- Thêm nút "Theo dõi / Đang theo dõi" — chỉ hiện khi `profile.isAuthor === true` và người xem không phải chính họ.
- Gọi API check follow khi mount, toggle khi bấm nút.

## Kiểm thử sau khi sửa

- [ ] Vào profile tác giả → thấy nút "Theo dõi". Bấm → đổi thành "Đang theo dõi".
- [ ] Bấm lại → về "Theo dõi".
- [ ] Tác giả đăng chương mới → user đã favorite truyện nhận notification `new_chapter`.
- [ ] Tác giả đăng truyện mới → user đã follow tác giả nhận notification `new_story`.
- [ ] Không tự gửi thông báo cho chính tác giả.
- [ ] Trang profile của người không phải tác giả → không có nút "Theo dõi".

## Cách rollback

```bash
git revert <commit-hash>
```

## Ghi chú

- Thông báo tạo async fire-and-forget — không block response API.
- Giới hạn batch notification: nếu truyện có >500 favorites, chỉ gửi 500 cái đầu (tránh timeout).
