# Changelog — Hướng dẫn sử dụng

Thư mục này ghi lại **mọi chỉnh sửa** của project theo chuẩn chuyên nghiệp, để sau này dễ tra cứu và backup/rollback khi cần.

## Cấu trúc

```
docs/changelog/
├── README.md           ← file này (hướng dẫn)
├── CHANGELOG.md        ← mục lục tổng, tất cả thay đổi theo thứ tự thời gian
├── TEMPLATE.md         ← mẫu để copy mỗi khi tạo entry mới
└── entries/            ← chi tiết từng thay đổi
    └── YYYY-MM-DD-NNN-ten-ngan.md
```

## Quy tắc đặt tên file entry

Format: `YYYY-MM-DD-NNN-mo-ta-ngan.md`

- `YYYY-MM-DD` — ngày thực hiện (VD: `2026-04-13`)
- `NNN` — số thứ tự trong ngày, 3 chữ số (VD: `001`, `002`)
- `mo-ta-ngan` — mô tả ngắn bằng tiếng Việt không dấu, dùng gạch ngang

**Ví dụ:** `2026-04-13-001-xoa-file-khong-dung.md`

## Quy trình mỗi khi chỉnh sửa

1. **Trước khi sửa:** copy [TEMPLATE.md](TEMPLATE.md) sang `entries/` với tên đúng format.
2. **Điền đầy đủ:**
   - Mục đích (tại sao sửa)
   - Danh sách file bị ảnh hưởng (đường dẫn cũ → đường dẫn mới nếu có di chuyển)
   - Nội dung thay đổi cụ thể
   - Cách rollback nếu cần quay lại
3. **Sau khi sửa:** thêm 1 dòng vào [CHANGELOG.md](CHANGELOG.md) trỏ tới entry vừa tạo.
4. **Commit git** với message tham chiếu tới entry: `refactor: xoa file khong dung (docs/changelog/entries/2026-04-13-001-...)`.

## Phân loại thay đổi (tag)

Mỗi entry gắn 1 trong các tag sau để dễ lọc:

| Tag | Ý nghĩa |
|-----|---------|
| `[FEATURE]` | Thêm tính năng mới |
| `[FIX]` | Sửa lỗi |
| `[REFACTOR]` | Sắp xếp lại code, không đổi logic |
| `[CLEANUP]` | Xóa file/code không dùng |
| `[CONFIG]` | Thay đổi cấu hình (env, package.json, ...) |
| `[DOCS]` | Cập nhật tài liệu |
| `[DB]` | Thay đổi database, migration |
| `[DEPS]` | Thêm/bớt/nâng cấp dependency |

## Mức độ rủi ro (risk)

| Mức | Nghĩa |
|-----|-------|
| `LOW` | Không ảnh hưởng tính năng (xóa file boilerplate, sửa comment) |
| `MEDIUM` | Có thể ảnh hưởng, cần test lại các tính năng liên quan |
| `HIGH` | Có khả năng phá tính năng, phải test toàn bộ + backup trước |

## Rollback — quay lại trước khi sửa

Có 3 cách, ưu tiên theo thứ tự:

1. **Git revert** (khuyến nghị): mỗi entry nên gắn với 1 commit hash. Chạy:
   ```bash
   git revert <commit-hash>
   ```
2. **Git checkout file cũ:** nếu chỉ muốn lấy lại 1 file:
   ```bash
   git checkout <commit-hash> -- <đường/dẫn/file>
   ```
3. **Thủ công theo mô tả trong entry:** mỗi entry có mục "Cách rollback" ghi rõ các bước.

## Nguyên tắc vàng

- **KHÔNG sửa code mà không tạo entry** — dù nhỏ.
- **KHÔNG xóa entry cũ** — nếu sai, tạo entry mới ghi "sửa lại entry XXX".
- **Luôn ghi commit hash** vào entry sau khi commit, để rollback nhanh.
