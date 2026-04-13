# [DOCS] Khởi tạo hệ thống changelog

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| **Ngày giờ** | 2026-04-13 |
| **Người thực hiện** | Tmy-andy |
| **Tag** | `[DOCS]` |
| **Mức rủi ro** | `LOW` |
| **Commit hash** | `56aa224` |
| **Branch** | main |

## Mục đích

Tạo hệ thống ghi log thay đổi chuyên nghiệp cho project, để:
- Theo dõi rõ mọi chỉnh sửa với mốc thời gian và lý do.
- Biết chính xác file nào bị xóa/di chuyển/sửa, thay đổi từ đâu sang đâu.
- Có thể rollback khi cần mà không sợ mất việc.
- Người mới vào project (hoặc chính mình sau vài tháng) đọc lại dễ hiểu.

## Phạm vi thay đổi

### File mới tạo
- `docs/changelog/README.md` — hướng dẫn sử dụng hệ thống changelog, quy tắc đặt tên, tag, mức rủi ro, cách rollback.
- `docs/changelog/CHANGELOG.md` — mục lục tổng, tất cả thay đổi theo thứ tự thời gian.
- `docs/changelog/TEMPLATE.md` — mẫu entry, copy ra mỗi khi có thay đổi mới.
- `docs/changelog/entries/2026-04-13-001-khoi-tao-changelog.md` — entry này.

### File bị xóa
_(không có)_

### File được di chuyển
_(không có)_

### File được sửa
_(không có — chỉ thêm mới, không đụng vào code hiện có)_

## Kiểm thử sau khi sửa

- [x] Không sửa code nên không cần test tính năng.
- [x] Các file markdown hiển thị đúng định dạng.

## Cách rollback

Xóa cả thư mục `docs/changelog/`:
```bash
rm -rf docs/changelog
```

Hoặc nếu đã commit:
```bash
git revert <commit-hash>
```

## Ghi chú

- Đây là entry **đầu tiên**, đánh số `001`. Entry tiếp theo trong ngày 2026-04-13 sẽ là `002`.
- Từ entry sau trở đi, **bắt buộc** copy `TEMPLATE.md` để tạo, không tự viết khác format.
- Sau khi commit, nhớ quay lại file này và [CHANGELOG.md](../CHANGELOG.md) để điền commit hash.
