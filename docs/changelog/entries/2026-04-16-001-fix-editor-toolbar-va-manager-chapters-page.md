# [FIX] + [FEATURE] Fix editor toolbar + Manager chapters thành page riêng

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| **Ngày giờ** | 2026-04-16 |
| **Người thực hiện** | Claude (Opus 4.6) |
| **Tag** | `[FIX]` |
| **Mức rủi ro** | `MEDIUM` |
| **Commit hash** | `25d0363` |
| **Branch** | main |

## Mục đích

1. **Fix toolbar**: Nút bold/italic/underline/alignment ở `/admin/edit-chapter/` không hoạt động — nguyên nhân: `document.execCommand` chỉ chạy trên `contentEditable`, không chạy trên `<textarea>`. → Chuyển sang `contentEditable` div.
2. **Manager chapters page**: Quản lý chương ở `/manager/stories` đang dùng modal → chuyển thành page riêng: danh sách chương + editor chương tương tự `/admin/edit-chapter`.

## Phạm vi thay đổi

### File mới
- `frontend/src/pages/manager/ManagerChapters.jsx` — danh sách chương của truyện
- `frontend/src/pages/manager/ManagerEditChapter.jsx` — editor chương (dùng managerAPI)

### File sửa
- `frontend/src/pages/admin/EditChapter.jsx` — textarea → contentEditable div, sync innerHTML ↔ state.
- `frontend/src/components/ChapterRenderer.jsx` — render HTML khi content chứa HTML tags.
- `frontend/src/App.jsx` — thêm route `/manager/stories/:storyId/chapters`, `/manager/stories/:storyId/chapters/:chapterId/edit`.
- `frontend/src/pages/manager/ManagerStories.jsx` — nút "Quản lý chương" → Link thay vì modal, bỏ chapter modal + state.

## Kiểm thử

- [ ] `/admin/edit-chapter/` → nút Bold/Italic/Underline hoạt động, lưu được.
- [ ] `/manager/stories` → nút "Quản lý chương" dẫn tới trang list chapters.
- [ ] Trang list chapters → click edit → mở editor page.
- [ ] Lưu chương từ manager editor → quay lại list, nội dung đã cập nhật.

## Cách rollback

```bash
git revert <commit-hash>
```
