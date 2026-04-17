# [FEATURE] Public profile hiển thị danh sách truyện + số truyện cho tác giả

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| **Ngày giờ** | 2026-04-17 (giờ Việt Nam) |
| **Người thực hiện** | Claude |
| **Tag** | `[FEATURE]` |
| **Mức rủi ro** | `LOW` |
| **Commit hash** | `d8caee0` |
| **Branch** | main |

## Mục đích

Khi xem profile của tác giả, cần hiển thị danh sách truyện đã đăng (phía trên "Bình luận gần đây") và thêm mục "Truyện đã đăng" vào info grid để thấy tổng số truyện.

## Phạm vi thay đổi

### File được sửa nội dung
- `backend/controllers/authController.js` — getUserProfile: thêm query Story.find({authorId}) trả về `authorStories` + `storyCount`
- `frontend/src/pages/PublicProfile.jsx` — Thêm state `stories`, hiển thị mục "Truyện" trong info grid, thêm section "Danh sách truyện của --" phía trên "Bình luận gần đây" (chỉ hiện khi isAuthor)

## Kiểm thử sau khi sửa

- [ ] Profile tác giả: hiện "Truyện" trong info grid với số đúng
- [ ] Profile tác giả: hiện section danh sách truyện với cover + title + link
- [ ] Profile người đọc: không hiện mục truyện, không hiện section truyện
- [ ] Profile admin: vẫn hiển thị bình thường

## Cách rollback

```bash
git revert <commit-hash>
```
