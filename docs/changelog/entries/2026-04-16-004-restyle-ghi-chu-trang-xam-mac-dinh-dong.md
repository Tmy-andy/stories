# [FIX] Restyle ghi chú: nền trắng, xám nhạt, mặc định đóng

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| **Ngày giờ** | 2026-04-16 |
| **Người thực hiện** | Claude (Opus 4.6) |
| **Tag** | `[FIX]` |
| **Mức rủi ro** | `LOW` |
| **Commit hash** | (chưa commit) |
| **Branch** | main |

## Mục đích

Ghi chú sau khi chuyển sang `<details>` collapsible vẫn còn nền gradient tím và mặc định mở (`open`). Cần: (1) mặc định đóng, (2) nền trắng / xám nhạt trung tính, (3) tiêu đề xanh chủ đạo, (4) nội dung xám.

## Phạm vi thay đổi

### File được sửa nội dung

- `frontend/src/components/ChapterRenderer.css`
  - **Trước:** `.chapter-note .note-body` color `#4b3a6e` (tím), dark `#c4b5e0`; separator `border-bottom-color: #e0d4f5` / dark `#3c2d6b`
  - **Sau:** `.chapter-note .note-body` color `#6b7280` (xám), dark `#9ca3af`; separator `border-bottom-color: #e5e7eb` / dark `#374151`

- `frontend/src/pages/admin/EditChapter.jsx`
  - **Trước:** `insertHTML` với `<details class="chapter-note" open>` (mặc định mở)
  - **Sau:** `<details class="chapter-note">` (mặc định đóng)

- `frontend/src/pages/manager/ManagerEditChapter.jsx`
  - **Trước:** `insertHTML` với `<details class="chapter-note" open>`
  - **Sau:** `<details class="chapter-note">`

## Kiểm thử

- [ ] Chèn ghi chú → block hiển thị đóng mặc định (không thấy nội dung).
- [ ] Click summary → mở ra, click lại → đóng lại.
- [ ] Nền trắng, viền xám, tiêu đề xanh, nội dung xám.
- [ ] Dark mode đúng màu.

## Cách rollback

```bash
git revert <commit-hash>
```
