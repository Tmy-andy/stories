0. Web load quá chậm
1. Trang /profile không hiển thị được tên tác giả truyện ở phần Lịch sử đọc, ở mục Truyện yêu thích cũng chưa hiển thị được danh sách truyện yêu thích.
2. Slug truyện vẫn thường hiển thị ID thay vì Slug như đã cài đặt. Hãy mặc định đường dẫn đến truyện hiển thị theo slug trong bảng stories ở database.
3. Ở Manager bổ sung mục cấp quyền Tác Giả cho account trong /manager/users và cho phép hiển thị ở /user-profile mục "Cấp độ"
4. Ở phần /manager/stories, khi click vào chỉnh sửa truyện, thay vì mở modal thì hãy mở thêm 1 trang con cho truyện để chỉnh sửa, phần thêm truyện hãy làm cho nó đang dạng chức năng 1 chút, khi trên truyện mới là nó cho mở trang thêm truyện luôn để người dùng dễ vừa viết vừa xem thử, theo dõi bố cục truyện chứ lồng nó vào chung với hiển thị danh sách chương truyện trông khó sử dụng quá.
5. Cho phép đồng bộ email được nhập từ /manager/settings vào các trang /contact, /terms-and-conditions, /privacy-policy, /about
6. Ở /manager thêm 1 mục /pages ở sidebar để cập nhật 3 trang /about, /terms-and-conditions, /privacy-policy. Cố định format hiện tại, chỉ thay đổi nội dung chữ trong từng mục thôi. Trang /about chưa có thì bạn tự design luôn đi, đồng bộ là được.
7. Cho phép thay ảnh bìa ở /manager/settings > Trang chủ > Tùy Chỉnh Trang Chủ. Cho phép chỉnh sửa cả các chữ trong banner đó. 
8. /manager/users phần Block người dùng vẫn chưa lấy được IP để chặn người dùng đó, fix để tránh trường hợp người không tuân thủ quy định lại phá trang của tôi bằng 1 IP nhưng nhiều tài khoản
9. /manager/stories cột Tác Giả tất cả thành N/A rồi --> Không lấy được tên tác giả
10. 