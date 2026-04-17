# [FEATURE] Tính năng ẩn bình luận spoiler

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| **Ngày giờ** | 2026-04-17 (giờ Việt Nam) |
| **Người thực hiện** | Claude |
| **Tag** | `[FEATURE]` |
| **Mức rủi ro** | `MEDIUM` |
| **Commit hash** | `79d2547` |
| **Branch** | main |

## Mục đích

Cho phép người bình luận đánh dấu bình luận có nội dung spoiler. Khi tick checkbox "Spoil", nội dung bình luận sẽ bị che mờ bằng overlay đỏ "SPOILER — Click để xem". Người đọc muốn xem spoiler thì bấm vào overlay để hiện nội dung. Áp dụng cho cả comment lẫn reply.

## Phạm vi thay đổi

### File được sửa nội dung
- `backend/models/Comment.js` — Thêm field `isSpoiler` (Boolean, default false) vào cả `replySchema` và `commentSchema`
- `backend/controllers/commentController.js` — Nhận `isSpoiler` từ request body trong `createComment` và `addReply`
- `frontend/src/services/commentService.js` — Truyền `isSpoiler` trong `createComment` và `addReply`
- `frontend/src/components/CommentInput.jsx` — Thêm checkbox "Spoil" bên cạnh nút submit
- `frontend/src/components/CommentSection.jsx` — Hiển thị spoiler overlay che nội dung comment khi `isSpoiler === true`
- `frontend/src/components/ReplyList.jsx` — Hiển thị spoiler overlay che nội dung reply khi `isSpoiler === true`

### File mới tạo
- (không có)

## Chi tiết thay đổi

### Backend
- Thêm `isSpoiler: { type: Boolean, default: false }` vào cả 2 schema
- Controller đọc `isSpoiler` từ `req.body` và truyền vào khi tạo comment/reply

### Frontend
- CommentInput: thêm state `isSpoiler`, checkbox "Spoil" với icon visibility_off
- CommentSection & ReplyList: khi `comment.isSpoiler === true`, nội dung bị che bởi overlay đỏ. Click overlay → toggle hiện nội dung

## Kiểm thử sau khi sửa

- [ ] Tạo comment bình thường (không tick spoil) → hiển thị bình thường
- [ ] Tạo comment có tick spoil → nội dung bị che, hiện overlay đỏ "SPOILER — Click để xem"
- [ ] Click overlay → hiện nội dung spoiler
- [ ] Reply có tick spoil cũng bị che tương tự
- [ ] Comment/reply cũ (không có field isSpoiler) vẫn hiển thị bình thường

## Cách rollback

**Cách nhanh nhất:**
```bash
git revert <commit-hash>
```

**Thủ công:**
1. Xóa field `isSpoiler` khỏi `replySchema` và `commentSchema` trong `backend/models/Comment.js`
2. Xóa dòng đọc `isSpoiler` trong `commentController.js` (createComment, addReply)
3. Xóa param `isSpoiler` trong `commentService.js`
4. Xóa checkbox và state `isSpoiler` trong `CommentInput.jsx`
5. Xóa logic spoiler overlay trong `CommentSection.jsx` và `ReplyList.jsx`

## Ghi chú

- Comment cũ trong DB không có field `isSpoiler` → Mongoose trả về `undefined` → falsy → hiển thị bình thường (backward compatible)
