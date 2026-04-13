# [FIX] FavoriteButton race condition khiến không gỡ thích được

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| **Ngày giờ** | 2026-04-13 |
| **Người thực hiện** | Tmy-andy |
| **Tag** | `[FIX]` |
| **Mức rủi ro** | `LOW` |
| **Commit hash** | _(chưa commit)_ |
| **Branch** | main |

## Mục đích

Ở trang StoryDetail, sau khi thêm yêu thích (tim đỏ), click lần 2 để gỡ → tim tạm xám rồi tự động đỏ lại. Nhìn như backend không xử lý DELETE.

**Nguyên nhân thật**: `authService.getCurrentUser()` gọi `JSON.parse(localStorage.getItem('user'))` → trả về **object mới mỗi render**. Trong `FavoriteButton`:
```js
const user = authService.getCurrentUser();
useEffect(() => { if (user) checkFavorite(); }, [storyId, user]);
```
`user` thay đổi reference mỗi render → `useEffect` fire liên tục → spam `checkFavorite` API. Tạo race:
1. Click lần 1 → `addFavorite` OK → `setIsFavorite(true)`
2. Re-render → `checkFavorite` fire (async in-flight)
3. Click lần 2 → `removeFavorite` OK → `setIsFavorite(false)`
4. Response của `checkFavorite` từ bước 2 về sau → trả `true` (lúc request DB còn có) → đè state về `true` → tim đỏ lại

## Phạm vi thay đổi

### File được sửa

#### `frontend/src/components/FavoriteButton.jsx`
- **Trước:**
  ```jsx
  const user = authService.getCurrentUser();
  useEffect(() => { if (user) checkFavorite(); }, [storyId, user]);
  ```
- **Sau:**
  ```jsx
  const user = authService.getCurrentUser();
  const userId = user?.id || user?._id;
  useEffect(() => {
    if (userId) checkFavorite();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyId, userId]);
  ```
- **Lý do:** Dùng `userId` (primitive string) làm dep thay vì object `user` → chỉ fire khi thật sự đổi user. Tránh infinite useEffect + race condition.

### File bị xóa / di chuyển / mới tạo
_(không có)_

## Kiểm thử sau khi sửa

- [ ] Mở StoryDetail → click tim → tim đỏ. Không thấy /favorites/check/:id gọi lặp trong Network tab.
- [ ] Click tim lần 2 → tim xám và giữ xám. Reload trang → vẫn xám.
- [ ] Click tim lần 3 → tim đỏ. Reload → vẫn đỏ.
- [ ] Đăng xuất rồi đăng nhập user khác → checkFavorite chạy lại (vì userId đổi).

## Cách rollback

```bash
git revert <commit-hash>
```

## Ghi chú

- Bug cũng ảnh hưởng hiệu năng (mỗi render = 1 API call). Fix tiết kiệm đáng kể request.
- Cân nhắc sau: cache `getCurrentUser()` ở authService (memoize) để tránh parse JSON nhiều lần. Để dành phase sau.
