# Kết quả kiểm tra — 21/10/2026

- `npm run typecheck`: đạt, không có lỗi TypeScript.
- `npm run lint`: đạt, không có lỗi/cảnh báo lint.
- `npx expo install --check`: Dependencies are up to date.
- `npx expo-doctor`: 20/20 checks passed.
- `npm run export:all`: xuất thành công bundle Web, Android và iOS tại `dist-all/`.
- `npm run test:e2e`: 15/15 bài kiểm tra đạt trong 50,9 giây trên bundle web cuối sau khi thêm OTP cố định và số điện thoại che đầu.
- Đối chiếu registry: đủ 57 frame màn hình trong metadata Figma; thêm route Quên mật khẩu và gallery.
- Xem ảnh thật của bốn tab và màn OTP tại `docs/preview/`; đã kiểm tra trực quan Home, Thư viện, Hồ sơ và Xác thực.
- Review source độc lập: đã sửa và kiểm tra lại việc giữ lớp đã tạo, truyền vai trò thành viên, mở/sửa nhiệm vụ theo ID và giữ lựa chọn mascot.

Các kiểm tra trình duyệt bao gồm mở mọi route, phát hiện lỗi runtime/tràn ngang, onboarding/đăng ký, bốn tab, bộ lọc nhiệm vụ, 4 bài học và kết quả, tạo lớp, tạo/sửa nhiệm vụ, hủy/xác nhận từ chối thành viên, tham gia lớp, trang bị vật phẩm, sửa hồ sơ, và nút footer ở màn 320 × 568.

Bổ sung kiểm tra tài khoản cố định: chặn email/mật khẩu trống hoặc sai; mật khẩu khớp chính xác; email không phân biệt hoa/thường và bỏ khoảng trắng đầu/cuối; hiển thị/xóa lỗi form; đăng nhập thành công theo hồ sơ mẫu; đăng xuất xóa mật khẩu nhập; Google/Apple không bỏ qua đăng nhập; đăng ký mẫu quay về đăng nhập. TypeScript, lint và xuất bundle Web/Android/iOS đã chạy lại và đạt sau thay đổi này.

Bổ sung kiểm tra đăng ký/OTP: chấp nhận thông tin đăng ký tùy ý, kể cả email không hợp lệ và hai mật khẩu khác nhau; truyền số điện thoại sang màn xác thực, chỉ hiện tối đa 4 số cuối; xử lý số trống/ngắn; từ chối OTP trống, thiếu số và sai; chỉ `123456` đi tiếp; gửi lại mã vẫn dùng OTP cố định. Luồng quên mật khẩu hiển thị email đã nhập và kiểm tra cùng OTP. Đã xuất lại cả bundle web và native, TypeScript/lint không có lỗi hoặc cảnh báo.

Chưa chạy trên thiết bị Android/iOS thật hoặc tạo binary APK/IPA. Auth/Profile chưa đối chiếu ảnh Figma chi tiết do giới hạn lượt MCP Starter. Phạm vi còn lại được mô tả trong README.
