# [FEATURE] Vị trí nút Follow + danh sách tác giả theo dõi trên profile

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| **Ngày giờ** | 2026-04-17 (giờ Việt Nam) |
| **Người thực hiện** | Claude Code |
| **Tag** | `[FEATURE]` |
| **Mức rủi ro** | `MEDIUM` |
| **Commit hash** | _(chưa commit)_ |
| **Branch** | main |

## Mục đích

1. Dời nút "Theo dõi / Đang theo dõi" từ dưới @username lên góc trên-phải của phần card trắng trên PublicProfile.
2. Thêm tab **"Theo dõi"** vào PublicProfile — hiển thị danh sách tác giả mà profile đó đang theo dõi, click → chuyển tới profile tác giả.
3. Thêm tab **"Tác giả theo dõi"** vào Profile cá nhân (Profile.jsx) — hiển thị danh sách tác giả đang theo dõi, kèm nút Hủy theo dõi.

## Phạm vi thay đổi

### File được sửa nội dung
- `backend/controllers/authorFollowController.js` — thêm `getFollowedAuthorsByUserId` (public, theo userId bất kỳ)
- `backend/routes/authorFollows.js` — thêm route public `GET /user/:userId`
- `frontend/src/pages/PublicProfile.jsx` — dời Follow button, thêm tab "Theo dõi"
- `frontend/src/pages/Profile.jsx` — thêm tab "Tác giả theo dõi" + unfollow

## Kiểm thử sau khi sửa

- [ ] Nút Follow hiển thị góc trên-phải card
- [ ] Tab "Theo dõi" trên PublicProfile load đúng danh sách
- [ ] Click tác giả → chuyển tới /profile/:id
- [ ] Tab "Tác giả theo dõi" trên Profile cá nhân load đúng
- [ ] Nút Hủy theo dõi hoạt động, xóa khỏi danh sách ngay

## Cách rollback

```bash
git revert <commit-hash>
```

**Thủ công:** revert 4 file đã sửa.
