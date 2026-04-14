# [FEATURE] Banner trang chủ đọc từ Settings + thêm dòng chữ Hán

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| **Ngày giờ** | 2026-04-14 |
| **Người thực hiện** | Claude (Opus 4.6) |
| **Tag** | `[FEATURE]` |
| **Mức rủi ro** | `MEDIUM` |
| **Commit hash** | (điền sau khi commit) |
| **Branch** | main |

## Mục đích

Giải quyết #7 trong `Note để lần sau sửa.md`:

> Cho phép thay ảnh bìa ở `/manager/settings > Trang chủ > Tùy Chỉnh Trang Chủ`. Cho phép chỉnh sửa cả các chữ trong banner đó.

Hiện trạng:
- `Settings` model có sẵn `bannerTitle`, `bannerSubtitle`, `bannerImage`, `bannerButtonText` — nhưng `Home.jsx` hardcode hoàn toàn, không đọc settings.
- `ManagerSettings` tab Trang chủ chỉ expose `bannerTitle` + `bannerButtonText` + upload ảnh. Thiếu `bannerSubtitle`.
- Banner hiện tại có 2 phần chữ: dòng tiếng Việt + dòng chữ Hán. Cần expose cả 2.

## Thiết kế

- **Model**: thêm field `bannerSubtitleSecondary` (chữ Hán / alt style).
- **Controller**: `updateSettings` nhận thêm field mới.
- **ManagerSettings**: thêm 2 textarea (`bannerSubtitle`, `bannerSubtitleSecondary`). Gỡ input "Text Nút CTA" khỏi UI (field giữ trong model cho sau này, nhưng hiện banner không có nút CTA nên ẩn ô nhập — tránh user bối rối). ← **Giữ lại** để không đụng field legacy; chỉ thêm mới, không xóa.
- **Home.jsx**: fetch settings qua hook mới `useHomeBanner`, fallback về giá trị hardcode hiện tại nếu settings rỗng. Ảnh banner dùng `settings.bannerImage` nếu có, fallback `heroBanner` asset.

### Hook `useHomeBanner`
Return object `{ title, subtitle, subtitleSecondary, image, loading }`.

## Phạm vi thay đổi

### File mới
- `frontend/src/hooks/useHomeBanner.js`

### File sửa
**Backend**
- `backend/models/Settings.js` — thêm `bannerSubtitleSecondary`.
- `backend/controllers/settingsController.js` — destructure + gán field mới.

**Frontend**
- `frontend/src/pages/manager/ManagerSettings.jsx` — thêm 2 textarea cho subtitle.
- `frontend/src/pages/Home.jsx` — dùng hook, fallback hardcode.

## Kiểm thử sau khi sửa

- [ ] `/manager/settings` tab "Trang chủ" có đủ: tiêu đề, subtitle, subtitle phụ (Hán), upload ảnh.
- [ ] Save → reload `/` thấy chữ + ảnh mới.
- [ ] Settings rỗng → Home vẫn hiện text/ảnh mặc định cũ.
- [ ] Multiline trong subtitle render đúng (dùng `whitespace-pre-line`).

## Cách rollback

```bash
git revert <commit-hash>
```

Thủ công: revert 4 file + xóa hook.

## Ghi chú

- Không thay schema cũ, chỉ add field → an toàn với dữ liệu hiện tại.
- `bannerButtonText` chưa dùng ở Home — để dành entry sau khi có thiết kế CTA.
