# DoAn2026 — giao diện wireframe LifeLab

Yêu cầu: tạo project Expo tên DoAn2026 ngay tại thư mục project; chỉ giao diện tĩnh, dữ liệu mẫu và navigate giữa các màn theo trang Wireframe của Figma 7JWZGZEXkw23jfrd0NvgTS, node 0:1. Không chỉnh sửa Figma.

Phạm vi gồm On boarding, Đăng nhập/Đăng ký, Home, Skill, Class và Profile. Mọi frame màn hình trong docs/figma/wireframe.xml phải có route hoặc trạng thái tương ứng, gồm các dialog xác nhận và empty state. Hình minh họa placeholder giữ nguyên bản chất placeholder; không tự thiết kế bộ nhận diện mới.

Lựa chọn triển khai: Expo, React Native, TypeScript, Expo Router; StyleSheet; trắng/xám/đen, bố cục gốc 390 × 844, co giãn theo điện thoại và xem được trên web. Bốn tab Trang chủ, Kỹ năng, Lớp học, Cá nhân. Dữ liệu chỉ trong bộ nhớ, không gọi API, không xác thực thật, không gửi email, không camera/QR thật. Form có thể nhập và các thao tác chọn tab, bộ lọc, toggle, mở/đóng dialog, tiếp tục bài học phản hồi được.

Nguồn: đã đọc toàn bộ metadata; xem ảnh toàn trang cùng ảnh chi tiết Home, Skill, Class. Figma Starter hết lượt trước khi đọc ảnh chi tiết Auth và Profile; những phần này dựng theo metadata và ảnh tổng quan, cần đối chiếu thêm sau khi có lượt đọc. Không khẳng định độ khớp pixel tuyệt đối.

Cập nhật theo yêu cầu người dùng: cố định tài khoản demo `duchung@example.com` / `DoAn2026@123`. Kiểm tra email và mật khẩu ở frontend trước khi vào trang chủ; lỗi nhập được hiển thị ngay tại form. Đăng ký/OTP giữ để xem wireframe và quay về đăng nhập; không tạo/đổi tài khoản cố định. Google/Apple mở thông báo để dùng tài khoản demo. Các route preview vẫn truy cập trực tiếp được; đây không phải xác thực server hay kiểm soát truy cập dữ liệu.

Cập nhật đăng ký/OTP: các ô đăng ký nhận nội dung tùy ý, không thêm kiểm tra bắt buộc/định dạng/mật khẩu trùng khớp. OTP đúng cố định `123456`; mã trống, thiếu số hoặc sai không chuyển màn. Số điện thoại lấy từ form đăng ký trong bộ nhớ phiên; màn xác thực che các số đầu và chỉ hiện tối đa 4 số cuối. Với số ngắn vẫn che ít nhất một số; không có số thì hiển thị `******`. Nút gửi lại mã vẫn dùng cùng mã mẫu. Luồng quên mật khẩu hiển thị email đã nhập và dùng cùng OTP.
