# [DOCS] Đồng bộ CLAUDE.md với hệ thống changelog mới

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| **Ngày giờ** | 2026-04-13 |
| **Người thực hiện** | Tmy-andy (qua Claude) |
| **Tag** | `[DOCS]` |
| **Mức rủi ro** | `LOW` |
| **Commit hash** | _(chưa commit)_ |
| **Branch** | main |

## Mục đích

CLAUDE.md cũ quy định hệ thống changelog dạng **flat folder** (`changelog/YYYY-MM-DD_HH-MM-SS_desc.md`), nhưng entry 001 đã tạo hệ thống mới ở [docs/changelog/](../..) với cấu trúc có README + CHANGELOG index + TEMPLATE + entries/.

Hai hệ thống xung đột nhau. Cần:
- Viết lại CLAUDE.md để tham chiếu đúng hệ thống mới tại `docs/changelog/`.
- Đảm bảo `CLAUDE.md`, `docs/changelog/`, `.claude/` **không bị .gitignore loại trừ** — để Claude ở máy khác / conversation mới vẫn biết đọc rule và làm đúng trình tự.

## Phạm vi thay đổi

### File được sửa

#### `CLAUDE.md`
- **Trước:** Quy định changelog dạng `changelog/YYYY-MM-DD_HH-MM-SS_desc.md`, mỗi lần sửa là 1 file markdown flat ở folder `changelog/` root. Format nội dung tự do theo template inline trong CLAUDE.md.
- **Sau:** Trỏ tới hệ thống `docs/changelog/` (README + CHANGELOG.md + TEMPLATE.md + entries/). Quy trình 4 bước bắt buộc. 8 tag chuẩn + 3 mức rủi ro + checklist cuối task. Thêm section "File phải được giữ trong git" liệt kê `CLAUDE.md`, `docs/changelog/`, `.claude/`.
- **Lý do:** Đồng bộ với hệ thống đã tạo ở entry 001, tránh xung đột rule.

#### `.gitignore`
- **Trước:** Không có whitelist cho `.claude/`, `CLAUDE.md`, `docs/changelog/`. Các file này hiện không bị ignore (may mắn), nhưng không có bảo đảm nếu ai đó thêm rule `*` hoặc folder pattern mới.
- **Sau:** Thêm block comment + 3 dòng whitelist (`!.claude/`, `!CLAUDE.md`, `!docs/changelog/`) ở cuối section IDE, kèm comment giải thích.
- **Lý do:** Đảm bảo các file quản trị Claude luôn được commit, bất kể sau này có ai thêm pattern ignore rộng hơn.

### File bị xóa
_(không có)_

### File được di chuyển
_(không có)_

### File mới tạo
_(không có — chỉ sửa file hiện có)_

## Kiểm thử sau khi sửa

- [x] CLAUDE.md mở được, markdown render đúng, không còn tham chiếu folder `changelog/` root cũ.
- [x] `.gitignore` không ignore nhầm file khác; các whitelist chỉ áp dụng cho 3 đường dẫn cụ thể.
- [x] Các đường dẫn tham chiếu trong CLAUDE.md (`docs/changelog/README.md`, `TEMPLATE.md`, ...) tồn tại thật.

## Cách rollback

**Cách 1 — git revert (sau khi đã commit):**
```bash
git revert <commit-hash>
```

**Cách 2 — thủ công:**
1. Khôi phục `CLAUDE.md` về nội dung cũ (quy định `changelog/YYYY-MM-DD_HH-MM-SS_*.md`). Nội dung cũ xem ở git history hoặc entry này (phần "Trước").
2. Xóa 6 dòng mới thêm vào cuối section "IDE" trong `.gitignore` (từ comment `# Claude Code — KHÔNG ignore...` tới hết `!docs/changelog/`).

## Ghi chú

- Sau khi commit, nhớ quay lại file này và [CHANGELOG.md](../CHANGELOG.md) để điền commit hash thật.
- Folder `.claude/` hiện **chưa tồn tại** trong project, nhưng đã được whitelist sẵn để khi Claude Code tạo ra sẽ không bị ignore.
- Từ entry 003 trở đi, **bắt buộc** tuân thủ quy trình 4 bước trong CLAUDE.md mới — kể cả khi chỉ sửa 1 dòng code.
