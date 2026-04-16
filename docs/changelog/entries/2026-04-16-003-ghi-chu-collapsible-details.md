# [FIX] Ghi chú → details collapsible với styling riêng

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| **Ngày giờ** | 2026-04-16 |
| **Người thực hiện** | Claude (Opus 4.6) |
| **Tag** | `[FIX]` |
| **Mức rủi ro** | `LOW` |
| **Commit hash** | `9a35ca5` |
| **Branch** | main |

## Mục đích

Ghi chú cần: (1) nổi bật khác biệt với nội dung thường, (2) click mở/thu gọn cho gọn, (3) chứa nhiều đoạn xuống dòng + hình ảnh.

**Trước:** Chèn `<blockquote>` inline style — không collapsible, không chứa được nội dung phức tạp.
**Sau:** Chèn `<details class="chapter-note"><summary>Ghi chú của tác giả</summary><div class="note-body">...</div></details>` — native HTML collapsible, rich content bên trong.

## Phạm vi thay đổi

### File sửa
- `frontend/src/pages/admin/EditChapter.jsx` — đổi insertHTML từ `<blockquote>` sang `<details class="chapter-note">`.
- `frontend/src/pages/manager/ManagerEditChapter.jsx` — tương tự.
- `frontend/src/components/ChapterRenderer.css` — viết lại CSS: gradient background tím nhạt, arrow rotate animation, dark mode, hỗ trợ img/p bên trong note body.
- `frontend/src/components/ChapterRenderer.jsx` — thêm class `chapter-content` cho HTML render container.

## Kiểm thử

- [ ] Chèn ghi chú trong editor → thấy block tím nổi bật với arrow ▶.
- [ ] Gõ nhiều dòng, paste hình ảnh bên trong ghi chú → hiển thị đúng.
- [ ] Đọc chương: ghi chú mặc định đóng, click summary → mở/đóng.
- [ ] Dark mode hiển thị đúng.

## Cách rollback

```bash
git revert <commit-hash>
```
