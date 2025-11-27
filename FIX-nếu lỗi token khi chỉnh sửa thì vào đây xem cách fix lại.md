## Mở DevTools Console và chạy:

```js
console.log('User token:', localStorage.getItem('token'));
console.log('Manager token:', localStorage.getItem('manager_token'));
```

Nếu `user token` là `null` hoặc trống, nghĩa là **chưa đăng nhập bằng user account**, hoặc token đã bị xóa.

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
