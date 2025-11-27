## Mở DevTools Console và chạy:

```js
console.log('User token:', localStorage.getItem('token'));
console.log('Manager token:', localStorage.getItem('managerToken'));
console.log('Admin token:', localStorage.getItem('managerToken'));
console.log('Full localStorage:', localStorage);
```

Nếu `user token` là `null` hoặc trống, nghĩa là **chưa đăng nhập bằng user account**, hoặc token đã bị xóa.

Nếu bạn là **admin** (`tmy300803@gmail.com`), khi đăng nhập:
- `User token` sẽ được lưu
- `Manager token` (admin token) sẽ được tự động tạo và lưu

---

## Cách xử lý

### **1. Xóa hết `localStorage`:**

```js
localStorage.clear();
```

### **2. Reload trang**

### **3. Đăng nhập user thường**

*(tài khoản admin: `tmy300803@gmail.com`)*

### **4. Kiểm tra token đã lưu:**

```js
JSON.parse(localStorage.getItem('token') ?? '{}');
localStorage.getItem('token');
```
