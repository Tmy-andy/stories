# [FIX] Khôi phục chức năng "Chèn ghi chú" cho contentEditable editor

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| **Ngày giờ** | 2026-04-16 |
| **Người thực hiện** | Claude (Opus 4.6) |
| **Tag** | `[FIX]` |
| **Mức rủi ro** | `LOW` |
| **Commit hash** | (điền sau khi commit) |
| **Branch** | main |

## Mục đích

Sau khi chuyển textarea → contentEditable (entry 001), nút "Chèn ghi chú" không hoạt động — nó vẫn ghi vào `formData.content` (state string) nhưng contentEditable div không đọc lại state nên nội dung không hiện.

## Phạm vi thay đổi

### File sửa
- `frontend/src/pages/admin/EditChapter.jsx` — nút "Chèn ghi chú" giờ dùng `document.execCommand('insertHTML')` để chèn `<blockquote>` trực tiếp vào contentEditable + sync state.
- `frontend/src/pages/manager/ManagerEditChapter.jsx` — thêm nút ghi chú vào toolbar (cùng pattern).

**Trước:** `setFormData(prev => ({ ...prev, content: prev.content + '\n> Ghi chú: \n' }))` — ghi vào state, contentEditable không re-render.
**Sau:** `document.execCommand('insertHTML', false, noteHtml)` + `syncContentFromEditor()` — chèn trực tiếp vào DOM, sync lại state.

## Kiểm thử

- [ ] Admin editor: bấm nút sticky_note → chèn ghi chú → ghi chú hiển thị trong editor.
- [ ] Manager editor: bấm nút sticky_note → tương tự.
- [ ] Lưu chương → mở lại → ghi chú còn đó.

## Cách rollback

```bash
git revert <commit-hash>
```
