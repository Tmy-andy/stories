# CHANGELOG

Mục lục tất cả thay đổi của project, xếp theo thứ tự **mới nhất ở trên**.

Mỗi dòng trỏ tới 1 file chi tiết trong `entries/`. Xem [README.md](README.md) để biết quy tắc.

Format mỗi dòng:
`- YYYY-MM-DD [TAG] [RISK] — Mô tả ngắn → [entry](entries/file.md) · commit: hash`

---

## 2026

### Tháng 04

- 2026-04-14 `[FEATURE]` `LOW` — Trang lỗi 404 / 500 / 502 / 503 + `ErrorBoundary` bọc App → [entry](entries/2026-04-14-007-trang-loi-404-500-502-503.md) · commit: `f506246`
- 2026-04-14 `[FEATURE]` `MEDIUM` — `/manager/stories`: edit truyện thành page riêng + nút "Thêm truyện" có live preview (bỏ modal) → [entry](entries/2026-04-14-006-edit-story-thanh-page-va-create-co-preview.md) · commit: `50e6410`
- 2026-04-14 `[FEATURE]` `MEDIUM` — CMS trang tĩnh (`Page` model + `/manager/pages`) + thiết kế `/about` dynamic + banner `announcement` ở Terms/Privacy → [entry](entries/2026-04-14-005-cms-pages-tinh-va-about.md) · commit: `a2eaa5f`
- 2026-04-14 `[FEATURE]` `MEDIUM` — Banner `/` đọc từ `/manager/settings` (title/subtitle/subtitle Hán/image) + thêm field `bannerSubtitleSecondary` → [entry](entries/2026-04-14-004-banner-customization-home.md) · commit: `fa47efd`
- 2026-04-14 `[FIX]` `MEDIUM` — Lưu `ipHistory` khi login + block user sẽ chặn tất cả IP từng dùng (chặn triệt để 1-IP-nhiều-account) → [entry](entries/2026-04-14-003-fix-ip-blocking-luu-ip-history.md) · commit: `55e9aa7`
- 2026-04-14 `[FEATURE]` `MEDIUM` — Cấp quyền Tác giả ở `/manager/users` (admin-only) + đồng bộ email ở `/contact`, `/terms-and-conditions`, `/privacy-policy` từ `settings.contactEmail` → [entry](entries/2026-04-14-002-cap-quyen-tac-gia-va-dong-bo-email.md) · commit: `90a9bb4`
- 2026-04-14 `[FIX]` `MEDIUM` — Profile: tác giả ở Lịch sử đọc + tab Truyện yêu thích lấy từ `Favorite` collection. URL truyện mặc định dùng `slug`. `/manager/stories` cột Tác giả hết N/A → [entry](entries/2026-04-14-001-fix-tac-gia-va-slug-truyen.md) · commit: `bdc11be`
- 2026-04-13 `[FIX]` `LOW` — FavoriteButton race condition: dùng `userId` làm useEffect dep thay vì object `user` → fix không gỡ thích được + spam API → [entry](entries/2026-04-13-007-fix-favoritebutton-race-condition.md) · commit: `e55163d`
- 2026-04-13 `[FIX]` `LOW` — Phase 1: Hiển thị tên tác giả ở Home (populate `authorId`, sửa field `story.author` → `authorId.displayName`) → [entry](entries/2026-04-13-006-phase-1-fix-author-display.md) · commit: `553bbf5`
- 2026-04-13 `[FIX]` `LOW` — Sửa CommentInput crash khi `user.username` undefined → [entry](entries/2026-04-13-005-fix-commentinput-username-undefined.md) · commit: `553bbf5`
- 2026-04-13 `[FEATURE]` `MEDIUM` — Search autocomplete dropdown ở Header + Enter chuyển sang trang kết quả → [entry](entries/2026-04-13-004-search-autocomplete-header.md) · commit: `553bbf5`
- 2026-04-13 `[CONFIG]` `MEDIUM` — Chuẩn bị deploy backend lên Render: đổi URL frontend, gỡ `.env` khỏi git tracking → [entry](entries/2026-04-13-003-chuan-bi-deploy-backend-render.md) · commit: `1538775`
- 2026-04-13 `[DOCS]` `LOW` — Đồng bộ CLAUDE.md với hệ thống changelog + whitelist `.claude/` trong .gitignore → [entry](entries/2026-04-13-002-dong-bo-claude-md-voi-changelog-system.md) · commit: `56aa224`
- 2026-04-13 `[DOCS]` `LOW` — Khởi tạo hệ thống changelog → [entry](entries/2026-04-13-001-khoi-tao-changelog.md) · commit: `56aa224`

---

<!--
Khi thêm entry mới:
1. Thêm 1 dòng ngay dưới phần tháng tương ứng (trên cùng = mới nhất).
2. Nếu sang tháng/năm mới, tạo tiêu đề `### Tháng MM` / `## YYYY` mới.
3. Sau khi commit, thay `(chưa commit)` bằng commit hash thật.
-->
