# [FEATURE] CMS trang tĩnh + thiết kế trang /about

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

Giải quyết #6 trong `Note để lần sau sửa.md`: thêm mục `/manager/pages` để cập nhật 3 trang `/about`, `/terms-and-conditions`, `/privacy-policy`. Trang `/about` chưa có → tự design.

Commit này gồm:
- Infra CMS: `Page` model, API CRUD, manager UI.
- Trang `/about` mới, content **100% dynamic** (đọc từ CMS).
- Terms/Privacy: thêm 1 field `announcement` hiển thị banner màu amber ở đầu trang (không refactor toàn bộ nội dung tĩnh — giảm blast radius).

## Thiết kế

### Model `Page`
```js
{
  slug: 'about' | 'terms-and-conditions' | 'privacy-policy', // unique
  title: String,
  subtitle: String,
  content: Map<String, String>, // key → editable text
  updatedAt: Date
}
```

Mỗi slug có schema "field list" định nghĩa trong `backend/data/pageDefaults.js` (shared source of truth cho default value + field label). Frontend cũng import để fallback.

### API
- `GET /api/pages/:slug` — public, trả về `{title, subtitle, fields: [{key,label,type,value}]}` với value từ DB hoặc default.
- `GET /api/manager/pages` — admin, trả về danh sách slug + status.
- `PATCH /api/manager/pages/:slug` — admin, update `content` map.

### Manager UI
- Route mới `/manager/pages`: list 3 pages với "Chỉnh sửa" button.
- Route `/manager/pages/:slug`: form edit — mỗi field là 1 textarea có label.
- Sidebar: thêm entry "Trang tĩnh".

### Frontend /about
- Design mới, style đồng bộ với Terms: hero section + 3-4 sections (intro, sứ mệnh, câu chuyện, liên hệ).
- Mọi text đọc từ `usePage('about')`.

## Phạm vi thay đổi

### File mới
**Backend**
- `backend/models/Page.js`
- `backend/data/pageDefaults.js` — shared schema + defaults cho 3 page.
- `backend/routes/pages.js` — public GET.
- (Route admin nằm trong `managerAPI.js`.)

**Frontend**
- `frontend/src/services/pageService.js`
- `frontend/src/hooks/usePage.js`
- `frontend/src/pages/manager/ManagerPages.jsx` (list)
- `frontend/src/pages/manager/ManagerPageEdit.jsx` (edit form)
- `frontend/src/pages/About.jsx`
- `frontend/src/data/pageDefaults.js` — mirror của backend defaults (fallback + labels).

### File sửa
**Backend**
- `backend/routes/managerAPI.js` — thêm admin CRUD.
- `backend/server.js` — mount `/api/pages`.

**Frontend**
- `frontend/src/App.jsx` — thêm route `/about`, `/manager/pages`, `/manager/pages/:slug`.
- `frontend/src/components/manager/ManagerLayout.jsx` — thêm link "Trang tĩnh".
- `frontend/src/services/managerAPI.js` — thêm `getPages`, `getPage`, `updatePage`.
- `frontend/src/pages/TermsAndConditions.jsx` — thêm banner `announcement` (usePage).
- `frontend/src/pages/PrivacyPolicy.jsx` — thêm banner `announcement` (usePage).

## Kiểm thử

- [ ] Login admin → sidebar manager có mục "Trang tĩnh".
- [ ] `/manager/pages` liệt kê 3 slug.
- [ ] Edit /about → save → reload `/about` hiện text mới.
- [ ] Reset (DB rỗng hoặc field chưa set) → /about hiện default.

## Cách rollback

```bash
git revert <commit-hash>
```

## Ghi chú

- Terms/Privacy refactor để commit sau để giảm blast radius.
- Default value trong `pageDefaults.js` phải đồng nhất giữa FE & BE; nếu tách sau có thể share qua package chung.
