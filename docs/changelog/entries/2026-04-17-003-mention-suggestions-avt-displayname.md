# [FIX] Dropdown @mention hiển thị avatar, displayName, username

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| **Ngày giờ** | 2026-04-17 (giờ Việt Nam) |
| **Người thực hiện** | Claude |
| **Tag** | `[FIX]` |
| **Mức rủi ro** | `LOW` |
| **Commit hash** | `af64449` |
| **Branch** | main |

## Mục đích

Dropdown gợi ý @mention trước đó chỉ hiện `@username` dạng text thuần. Sửa lại hiển thị đầy đủ: avatar tròn, displayName (tên hiển thị), và @username bên dưới.

## Phạm vi thay đổi

### File được sửa nội dung
- `backend/controllers/commentController.js` — `getUserSuggestions`: thêm `displayName` và `avatar` vào `.select()`
- `frontend/src/components/CommentInput.jsx` — Redesign dropdown suggestion: avatar tròn + displayName + @username

## Kiểm thử sau khi sửa

- [ ] Gõ @ trong comment → dropdown hiện avatar, displayName, @username
- [ ] Click hoặc Enter chọn suggestion → chèn @username đúng
- [ ] User không có avatar → hiện chữ cái đầu

## Cách rollback

```bash
git revert <commit-hash>
```
