# [FIX] Cải thiện spoiler overlay + auto-@ khi reply

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| **Ngày giờ** | 2026-04-17 (giờ Việt Nam) |
| **Người thực hiện** | Claude |
| **Tag** | `[FIX]` |
| **Mức rủi ro** | `LOW` |
| **Commit hash** | (chưa commit) |
| **Branch** | main |

## Mục đích

1. Spoiler overlay trước đó nhìn không đẹp (bôi xám). Sửa lại thành frosted glass: chữ bị blur nặng (`blur-[8px]`), phủ lớp nền mờ `bg-gray-200/60` (light) / `bg-gray-900/70` (dark) + `backdrop-blur-sm`, nút đỏ có icon `visibility_off`.
2. Khi bấm "Trả lời" comment/reply, tự động điền `@username ` vào ô nhập + thêm vào mảng mentions → backend gửi noti cho người được @.

## Phạm vi thay đổi

### File được sửa nội dung
- `frontend/src/components/CommentSection.jsx` — Sửa spoiler overlay CSS + truyền `replyToUser={comment.userId}` vào CommentInput
- `frontend/src/components/ReplyList.jsx` — Sửa spoiler overlay CSS + truyền `replyToUser={reply.userId}` vào CommentInput
- `frontend/src/components/CommentInput.jsx` — Nhận prop `replyToUser`, pre-fill `@username ` + thêm vào mentions, auto-focus cursor sau @mention
- `backend/controllers/commentController.js` — (1) `createComment`: thêm đọc `mentions` từ body, lưu vào DB, gửi noti cho người được @mention. (2) `addReply`: dùng `notifiedUsers` Set để tránh gửi 2 noti trùng khi auto-@ chính chủ comment gốc

## Kiểm thử sau khi sửa

- [ ] Spoiler overlay hiển thị frosted glass đẹp hơn
- [ ] Bấm "Trả lời" → textarea tự điền `@username ` và focus cursor sau đó
- [ ] Gửi reply → người được @ nhận notification (không trùng với noti reply)
- [ ] Reply trên reply cũng auto-@ đúng người
- [ ] Comment mới có @mention → người được @ nhận notification
- [ ] Không gửi noti trùng khi 1 người vừa là chủ comment vừa bị @

## Cách rollback

```bash
git revert <commit-hash>
```
