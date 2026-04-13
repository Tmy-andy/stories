# [TAG] Tiêu đề ngắn của thay đổi

> Copy file này vào `entries/YYYY-MM-DD-NNN-mo-ta.md` và điền đầy đủ các mục dưới.

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| **Ngày giờ** | YYYY-MM-DD HH:MM (giờ Việt Nam) |
| **Người thực hiện** | Tên/username |
| **Tag** | `[FEATURE]` / `[FIX]` / `[REFACTOR]` / `[CLEANUP]` / `[CONFIG]` / `[DOCS]` / `[DB]` / `[DEPS]` |
| **Mức rủi ro** | `LOW` / `MEDIUM` / `HIGH` |
| **Commit hash** | (điền sau khi commit, VD: `a1b2c3d`) |
| **Branch** | main / feature/xxx |

## Mục đích

Giải thích **TẠI SAO** cần thay đổi. Bối cảnh, vấn đề đang gặp, lợi ích sau khi sửa.

Ví dụ: *"Project đang có 3 file seed trùng lặp (seed.js, seed-new.js, seed-categories.js), gây nhầm lẫn khi chạy. Cần gom lại cho rõ ràng."*

## Phạm vi thay đổi

### File bị xóa
- `đường/dẫn/file-cu.js` — lý do xóa

### File được di chuyển / đổi tên
| Trước | Sau | Lý do |
|-------|-----|-------|
| `backend/seed.js` | `backend/scripts/seed.js` | Gom script vào folder riêng |

### File được sửa nội dung
- `backend/server.js` — tóm tắt thay đổi (VD: "Tách phần kết nối DB sang config/db.js")
- `backend/package.json` — thêm script `seed`, `create-admin`

### File mới tạo
- `backend/config/db.js` — module kết nối MongoDB

## Chi tiết thay đổi (nếu cần)

Dán diff ngắn hoặc mô tả cụ thể các đoạn code đã sửa. Với refactor lớn, liệt kê từng bước.

```diff
- const mongoose = require('mongoose');
- mongoose.connect(process.env.MONGO_URI);
+ const connectDB = require('./config/db');
+ connectDB();
```

## Kiểm thử sau khi sửa

Liệt kê các việc đã test để xác nhận không hỏng tính năng nào:

- [ ] Backend khởi động bình thường (`npm run dev`)
- [ ] Kết nối MongoDB thành công
- [ ] Frontend gọi API OK
- [ ] Tính năng A vẫn chạy
- [ ] Tính năng B vẫn chạy

## Cách rollback

**Cách nhanh nhất:**
```bash
git revert <commit-hash>
```

**Thủ công (nếu chưa commit hoặc cần rollback riêng):**
1. Khôi phục file đã xóa: ...
2. Di chuyển file về vị trí cũ: ...
3. Đổi ngược nội dung file X: ...

## Ghi chú

Bất kỳ lưu ý nào cho tương lai: gotcha, việc cần làm thêm, phụ thuộc tới entry khác, ...
