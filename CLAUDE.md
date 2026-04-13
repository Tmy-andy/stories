# Project Rules — CLAUDE.md

File này là **luật của project**, Claude Code sẽ tự đọc mỗi lần mở folder này. Mọi AI assistant làm việc với project PHẢI tuân thủ các rule dưới đây.

---

## 📋 Changelog Rule (BẮT BUỘC)

Sau **MỖI LẦN** chỉnh sửa file (tạo mới / sửa / xóa / di chuyển), Claude **PHẢI** tạo một **entry changelog** theo hệ thống tại [docs/changelog/](docs/changelog/).

### Vị trí & cấu trúc

```
docs/changelog/
├── README.md                        ← hướng dẫn chi tiết, ĐỌC TRƯỚC KHI GHI
├── CHANGELOG.md                     ← mục lục tổng, thêm 1 dòng mỗi entry
├── TEMPLATE.md                      ← copy file này để tạo entry mới
└── entries/
    └── YYYY-MM-DD-NNN-mo-ta-ngan.md ← chi tiết từng entry
```

### Quy trình 4 bước (BẮT BUỘC, không bỏ bước nào)

1. **Trước khi sửa code:** copy [docs/changelog/TEMPLATE.md](docs/changelog/TEMPLATE.md) sang `docs/changelog/entries/` với tên format `YYYY-MM-DD-NNN-mo-ta-ngan.md`.
   - `NNN` = số thứ tự trong ngày, 3 chữ số (`001`, `002`, ...).
   - Mô tả viết tiếng Việt **không dấu**, nối bằng gạch ngang.
2. **Điền đầy đủ entry:** mục đích, phạm vi (file xóa / di chuyển / sửa / mới), kiểm thử, cách rollback.
3. **Sau khi sửa xong:** thêm 1 dòng vào [docs/changelog/CHANGELOG.md](docs/changelog/CHANGELOG.md) trỏ tới entry, theo format:
   ```
   - YYYY-MM-DD `[TAG]` `RISK` — Mô tả ngắn → [entry](entries/file.md) · commit: hash
   ```
4. **Sau khi commit git:** điền commit hash vào cả entry và dòng trong CHANGELOG.md.

### Tag bắt buộc (chọn 1)

| Tag | Khi nào dùng |
|-----|--------------|
| `[FEATURE]` | Thêm tính năng mới |
| `[FIX]` | Sửa lỗi |
| `[REFACTOR]` | Sắp xếp lại code, không đổi logic |
| `[CLEANUP]` | Xóa file/code không dùng |
| `[CONFIG]` | Thay đổi cấu hình (env, package.json, ...) |
| `[DOCS]` | Cập nhật tài liệu |
| `[DB]` | Thay đổi database, migration |
| `[DEPS]` | Thêm/bớt/nâng cấp dependency |

### Mức rủi ro bắt buộc (chọn 1)

| Mức | Nghĩa |
|-----|-------|
| `LOW` | Không ảnh hưởng tính năng (xóa boilerplate, sửa comment, đổi docs) |
| `MEDIUM` | Có thể ảnh hưởng, cần test lại các tính năng liên quan |
| `HIGH` | Có khả năng phá tính năng — phải test toàn bộ + backup trước |

### Quy tắc phụ (KHÔNG được vi phạm)

1. **KHÔNG BAO GIỜ** sửa code mà không tạo entry — dù là sửa 1 dòng.
2. **KHÔNG xóa** entry cũ; nếu sai, tạo entry mới ghi "sửa lại entry XXX".
3. Nếu 1 task sửa nhiều file, gộp tất cả vào **MỘT** entry (không tách nhỏ vô nghĩa).
4. Luôn ghi rõ **Trước → Sau** trong phần phạm vi thay đổi, để có thể rollback thủ công.
5. Mô tả bằng **tiếng Việt** (hoặc song ngữ nếu thuật ngữ kỹ thuật cần chính xác).

---

## 🔒 File phải được giữ trong git (KHÔNG ignore)

Để Claude ở máy khác hoặc chat mới vẫn làm đúng trình tự, các file/folder sau **PHẢI** được commit lên git:

- [CLAUDE.md](CLAUDE.md) — file này (luật project).
- [docs/changelog/](docs/changelog/) — toàn bộ hệ thống changelog.
- `.claude/` — cấu hình project-specific của Claude Code (nếu có).

Kiểm tra [.gitignore](.gitignore): các đường dẫn trên **không** được liệt kê.

---

## 🔄 Cách rollback

Ưu tiên theo thứ tự:

1. **Git revert** (an toàn nhất):
   ```bash
   git revert <commit-hash>
   ```
2. **Khôi phục 1 file cụ thể:**
   ```bash
   git checkout <commit-hash> -- <đường/dẫn/file>
   ```
3. **Thủ công theo entry:** mỗi entry đều có mục "Cách rollback" ghi từng bước.

---

## ✅ Checklist trước khi kết thúc mỗi task

- [ ] Đã tạo 1 entry trong `docs/changelog/entries/` theo đúng TEMPLATE.
- [ ] Đã thêm 1 dòng vào `docs/changelog/CHANGELOG.md`.
- [ ] Đã chọn đúng `[TAG]` và `RISK`.
- [ ] Phần "Phạm vi thay đổi" ghi rõ Trước → Sau.
- [ ] Phần "Cách rollback" có thể đọc-và-làm-theo được.
- [ ] Sau khi commit, đã điền commit hash vào entry + CHANGELOG.md.
