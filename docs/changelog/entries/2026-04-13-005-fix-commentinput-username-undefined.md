# [FIX] CommentInput crash khi user.username undefined

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

Runtime error khi render `CommentInput`:
```
TypeError: Cannot read properties of undefined (reading 'charAt')
    at CommentInput (...)
```

Nguyên nhân: `user.username.charAt(0).toUpperCase()` chạy khi `user.username` undefined (dù `user` object tồn tại). Fix bằng fallback chain giống pattern đã dùng ở `Header.jsx`.

## Phạm vi thay đổi

### File được sửa

#### `frontend/src/components/CommentInput.jsx`
- **Trước:**
  ```jsx
  <img src={user.avatar} alt={user.username} ... />
  ...
  user.username.charAt(0).toUpperCase()
  ```
  Crash nếu `user.username` undefined.
- **Sau:**
  ```jsx
  <img src={user.avatar} alt={user.displayName || user.username || 'User'} ... />
  ...
  (user.displayName || user.username || '?').charAt(0).toUpperCase()
  ```
  An toàn với mọi trạng thái của user object.
- **Lý do:** Match pattern `user.displayName || user.username` đã dùng nhất quán trong `Header.jsx`; chuỗi fallback `'?'` đảm bảo không bao giờ `.charAt` vào undefined.

### File bị xóa / di chuyển / mới tạo
_(không có)_

## Kiểm thử sau khi sửa

- [ ] Mở trang có `CommentInput` (StoryDetail, ChapterReader) → không còn runtime error.
- [ ] User có `avatar` → hiện ảnh.
- [ ] User không có `avatar` nhưng có `displayName` → hiện chữ đầu của displayName.
- [ ] User chỉ có `username` → hiện chữ đầu của username.

## Cách rollback

```bash
git revert <commit-hash>
```

## Ghi chú

- Bug đã tồn tại từ trước, chỉ bị expose khi test tính năng search (entry 004). Không liên quan tới thay đổi search.
