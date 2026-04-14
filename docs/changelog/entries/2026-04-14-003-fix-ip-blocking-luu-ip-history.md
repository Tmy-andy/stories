# [FIX] Lưu IP history + chặn tất cả IP khi block user

## Thông tin chung

| Trường | Giá trị |
|--------|---------|
| **Ngày giờ** | 2026-04-14 |
| **Người thực hiện** | Claude (Opus 4.6) |
| **Tag** | `[FIX]` |
| **Mức rủi ro** | `MEDIUM` |
| **Commit hash** | (điền sau khi commit) |
| **Branch** | main |

## Mục đích

Giải quyết #8 trong `Note để lần sau sửa.md`:

> `/manager/users` phần Block người dùng vẫn chưa lấy được IP để chặn người dùng đó, fix để tránh trường hợp người không tuân thủ quy định lại phá trang của tôi bằng 1 IP nhưng nhiều tài khoản.

Vấn đề gốc:
- `User.ipAddress` chỉ set **1 lần duy nhất lúc đăng ký**. Login không cập nhật → user cũ (tạo trước khi thêm field) có `ipAddress = null`, hoặc user dùng nhiều IP thì chỉ giữ IP lúc register.
- Block endpoint đọc `user.ipAddress` → nếu null thì không ghi IP vào blacklist → trên UI hiện `N/A` và không chặn được IP.

## Thiết kế

### Model
- Thêm field `ipHistory: [{ ip: String, seenAt: Date }]` lưu tối đa N IP gần nhất (hiện để không giới hạn, chỉ dedupe theo ip).
- Giữ `ipAddress` làm "latest IP" để tương thích code cũ.

### Auth flow
- `register`: set `ipAddress` + push `{ip, seenAt: now}` vào `ipHistory`.
- `login`: update `ipAddress` = current, dedupe push vào `ipHistory` (nếu IP đã tồn tại thì chỉ update `seenAt`).

### Block flow
- `POST /api/manager/users/:id/block`: blacklist email + **hợp tất cả IP** từ `ipHistory` (fallback `user.ipAddress` nếu `ipHistory` rỗng để xử lý user legacy).
- Response trả về `blockedRecords` (array) để UI hiển thị số lượng IP đã chặn.

### Frontend
- `ManagerUsers` block modal: thay dòng "IP Address: X" thành danh sách IP (nếu có) hoặc "Không rõ IP".

## Phạm vi thay đổi

### File được sửa

**Backend**
- `backend/models/User.js` — thêm schema `ipHistory`.
- `backend/controllers/authController.js` — login ghi IP + update ipHistory; register push ipHistory.
- `backend/routes/managerAPI.js` — block endpoint duyệt `ipHistory` thay vì chỉ `user.ipAddress`.

**Frontend**
- `frontend/src/pages/manager/ManagerUsers.jsx` — block modal liệt kê danh sách IP.

## Kiểm thử sau khi sửa

- [ ] User cũ (không có ipAddress) đăng nhập lại → DB có `ipAddress` + `ipHistory[0]`.
- [ ] User đổi IP (đăng nhập từ mạng khác) → `ipHistory` có cả 2 IP.
- [ ] Admin bấm Block → `Blacklist` collection có đủ `email` + mọi IP trong `ipHistory`.
- [ ] User đó cố đăng ký/đăng nhập lại từ bất kỳ IP đã chặn → bị 403.
- [ ] Frontend block modal hiện danh sách IP.

## Cách rollback

```bash
git revert <commit-hash>
```

Thủ công: xóa field `ipHistory` khỏi `User.js`, revert logic login/register/block, revert UI block modal.

## Ghi chú

- Không migrate dữ liệu cũ: user chưa login lại sẽ có `ipHistory = []`. Lần login kế sẽ tự điền.
- `ipHistory` lưu object để có timestamp, sau này có thể dùng phân tích pattern.
