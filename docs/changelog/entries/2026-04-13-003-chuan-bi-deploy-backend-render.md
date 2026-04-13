# [CONFIG] Chuẩn bị deploy backend lên Render

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| **Ngày giờ** | 2026-04-13 |
| **Người thực hiện** | Tmy-andy |
| **Tag** | `[CONFIG]` |
| **Mức rủi ro** | `MEDIUM` |
| **Commit hash** | `1538775` |
| **Branch** | main |

## Mục đích

Chuyển backend từ Replit (sắp hết hạn trong 29 ngày) sang Render. Cập nhật URL API bên frontend, gỡ `backend/.env` khỏi git tracking để không leak secret về sau, cập nhật env vars phía backend cho đúng khi chạy trên Render + giao tiếp với Netlify.

## Phạm vi thay đổi

### File được sửa

#### `frontend/.env.production`
- **Trước:** `REACT_APP_API_URL=https://86ed155a-....pike.replit.dev:3000/api` (URL Replit + port `:3000` sai — Replit HTTPS không phục vụ port 3000 từ ngoài).
- **Sau:** `REACT_APP_API_URL=https://lamdiepcoanh-backend.onrender.com/api`
- **Lý do:** Trỏ frontend về backend Render thay vì Replit đã hết hạn.

#### `backend/.env` (chỉ thay đổi LOCAL, file đã gỡ khỏi git)
- **Trước (trên git):** chứa `JWT_SECRET=your-secret-key-change-in-production-...` (yếu, dễ đoán), `EMAIL_PASSWORD=your_app_password_here` (placeholder).
- **Sau (local only):**
  - `JWT_SECRET` → secret ngẫu nhiên 128 hex chars (512-bit entropy).
  - `EMAIL_PASSWORD` → Gmail App Password thật (`baky iybb ebxc mmwq`).
  - Thêm `FRONTEND_URL=https://lamdiepcoanh.netlify.app` để Socket.io CORS trên Render hoạt động đúng với Netlify.
- **Lý do:** Secret cũ yếu và đã lộ trên GitHub từ commit cũ; đồng thời cần config đúng cho production.

### File bị xóa khỏi git tracking (vẫn còn trên disk)

- `backend/.env` — đã chạy `git rm --cached backend/.env` để ngăn commit secret về sau. File vẫn còn ở local để dev chạy. Đã có trong `.gitignore` từ trước.

### File bị xóa hẳn

- `STRUCTURE.txt` — (nếu bạn xác nhận muốn xóa)

### File mới tạo
- `docs/changelog/entries/2026-04-13-003-chuan-bi-deploy-backend-render.md` — entry này.

## Kiểm thử sau khi sửa

- [ ] Backend chạy local OK: `cd backend && npm run dev` → thấy `MongoDB connected` + `Server running`.
- [ ] Deploy lên Render thành công, service healthy.
- [ ] Mở URL Render trực tiếp → trả về `{"message":"Lam Điệp Cô Ảnh API Server"}`.
- [ ] Frontend Netlify sau khi rebuild → Home page load được stories (không còn CORS error).
- [ ] Login → token JWT mới verify OK ở backend.
- [ ] Notification bell → Socket.io kết nối được từ `lamdiepcoanh.netlify.app`.
- [ ] Contact form → gửi email qua Gmail thành công (nếu test tính năng này).

## Cách rollback

**Rollback sang Replit tạm thời (nếu Render lỗi):**
```bash
git revert <commit-hash>
```
Điều này sẽ đưa `frontend/.env.production` về URL Replit cũ. Rồi push → Netlify rebuild.

**Rollback riêng .env tracking:**
```bash
git checkout <commit-hash-truoc-do> -- backend/.env
git add backend/.env
git commit -m "restore backend/.env tracking"
```
(Nhưng **không khuyến nghị** — để `.env` ngoài git là chuẩn bảo mật.)

## Ghi chú

- **Secret cũ đã lộ trên GitHub** — dù repo chưa show cho ai, vẫn nên đổi password MongoDB Atlas (`Overless30803.`) khi có thời gian. Entry này không làm việc đó.
- **MongoDB Atlas**: phải thêm `0.0.0.0/0` vào Network Access vì Render IP không cố định.
- **Env vars trên Render** phải set đầy đủ: `MONGO_URI`, `JWT_SECRET`, `FRONTEND_URL`, `EMAIL_USER`, `EMAIL_PASSWORD`. **KHÔNG** set `PORT`.
- Sau khi commit, quay lại file này và [CHANGELOG.md](../CHANGELOG.md) điền commit hash.
