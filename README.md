# DoAn2026 · LifeLab

Project **Expo + React Native + TypeScript** dựng giao diện tĩnh theo trang **Wireframe** của [Figma Đồ án 2026](https://www.figma.com/design/7JWZGZEXkw23jfrd0NvgTS?node-id=0-1). Có điều hướng bằng Expo Router, dữ liệu mẫu và các tương tác giao diện. Figma được giữ nguyên, không chỉnh sửa.

## Chạy project

Yêu cầu Node.js **22.13 trở lên trong nhánh 22**, hoặc phiên bản mới được Expo SDK 58 hỗ trợ. Project hiện dùng Expo **58**.

```bash
cd /Users/gunvno/Documents/ChatGPT/DoAn2026
npm install
npm start
```

Quét QR bằng Expo Go tương thích SDK 58. Trong terminal Expo: `a` để mở Android emulator, `i` để mở iOS simulator nếu đã cài các công cụ tương ứng.

Xem bằng trình duyệt:

```bash
npm run web
```

App bắt đầu từ splash → 3 màn onboarding → đăng nhập. Tài khoản demo cố định:

| Email | Mật khẩu |
| --- | --- |
| `duchung@example.com` | `DoAn2026@123` |

Đăng nhập chỉ chuyển vào trang chủ khi khớp email/mật khẩu. Email bỏ qua khoảng trắng đầu/cuối và không phân biệt chữ hoa/thường; mật khẩu phải khớp chính xác. Đổi tài khoản mẫu tại `src/data/demo-account.ts`.

Luồng đăng ký/OTP vẫn để xem wireframe, không tạo tài khoản mới; sau thành công quay về đăng nhập bằng tài khoản cố định. Quên mật khẩu không thay đổi mật khẩu mẫu. Google/Apple chỉ mở thông báo, không tự đăng nhập. Đây là kiểm tra ở frontend cho demo, không phải cơ chế bảo vệ dữ liệu hay xác thực trên server. Mã lớp mẫu: **ABC123**.

**Đăng ký:** nhập tùy ý ở các ô, không kiểm tra định dạng hay yêu cầu mật khẩu xác nhận phải khớp. Màn OTP lấy số điện thoại từ form đăng ký, bỏ khoảng trắng/dấu phân cách khi hiển thị và che các số đầu, chỉ hiện tối đa 4 số cuối, ví dụ `0912345678` → `******5678`. Để trống hoặc nhập số ngắn vẫn xem tiếp được; trường hợp số ngắn luôn che ít nhất một số đầu. **OTP đúng là `123456`** (áp dụng cả luồng quên mật khẩu), mã trống/sai sẽ báo lỗi. Nút Gửi lại mã vẫn dùng OTP cố định này. Có thể đổi OTP tại `src/data/demo-account.ts`.

## Những phần đã dựng

| Nhóm Figma | Số frame | Nội dung |
| --- | ---: | --- |
| On boarding | 4 | Splash và ba bước giới thiệu |
| Đăng nhập/Đăng ký | 4 | Đăng nhập, đăng ký, OTP, thành công |
| Home | 5 | Trang chủ có dữ liệu/rỗng, nhiệm vụ, gợi ý, thông báo |
| Skill | 8 | Thư viện, danh mục, chi tiết kỹ năng, 4 bài, kết quả |
| Class | 27 | Danh sách/rỗng, tạo/tham gia lớp, thành viên, chờ duyệt, nhiệm vụ, tiến độ, xếp hạng, cài đặt và các dialog |
| Profile | 9 | Hồ sơ, chỉnh sửa, cài đặt, streak, xếp hạng, bộ sưu tập, vật phẩm, mascot và tùy chỉnh |

Tổng **57 frame Figma** được ánh xạ trong `src/data/screens.ts`. Có thêm màn Quên mật khẩu để hoàn thiện đường đi của nút, và trang danh mục `/screens` để mở trực tiếp từng màn. Vào **Cá nhân → Cài đặt → Danh sách màn hình wireframe** hoặc nút ba chấm trong Thư viện.

Các thao tác mẫu: đổi tab, lọc nhiệm vụ/danh mục, nhập form, chọn radio/checkbox, bật/tắt cài đặt, tạo/đổi tên lớp và nhiệm vụ trong phiên xem, chấp nhận/từ chối yêu cầu, trang bị vật phẩm, chuyển mascot. Bài học dùng nút Bắt đầu để đi sang màn kế tiếp; khu vực game giữ placeholder như wireframe.

## Cấu trúc code

```text
src/
  app/              # Route Expo Router và root layout
  components/       # UI dùng chung, thẻ nhiệm vụ, danh mục, bảng xếp hạng
  data/             # Dữ liệu mẫu và ánh xạ frame Figma → route
  screens/          # Các màn theo nhóm auth/home/skills/classes/profile
  state/demo.tsx    # Trạng thái trong bộ nhớ cho các thao tác mẫu
  navigation.ts     # Điều hướng và fallback cho nút quay lại
docs/
  figma/            # Metadata wireframe đã đọc, không chứa token truy cập
  preview/          # Ảnh chụp các tab chính do Playwright tạo
tests/              # Kiểm tra luồng điều hướng trên web ở kích thước điện thoại
```

Các route chính: `/home`, `/skills`, `/classes`, `/profile`. Các route còn lại đi qua `src/app/[screen].tsx`, render module tương ứng theo registry. Trên web giao diện giới hạn chiều rộng điện thoại; trên Android/iOS dùng đầy đủ vùng màn hình và safe area.

## Kiểm tra

```bash
npm run typecheck
npm run lint
npx expo-doctor
npx expo install --check
npm run export:all
```

Kiểm tra trình duyệt (cài Chromium một lần):

```bash
npx playwright install chromium
npm run test:e2e
```

Bộ kiểm tra đối chiếu đủ 57 frame, mở mọi route, kiểm tra lỗi runtime/tràn ngang, chạy các luồng onboarding/đăng ký/học bài/tạo lớp/tạo-sửa nhiệm vụ/tham gia lớp/hồ sơ, và chụp ảnh 390 × 844. Đây là kiểm tra web cùng kiểm tra xuất bundle native; chưa thay thế kiểm tra trên thiết bị Android/iPhone thật.

Xem bundle web đã xuất:

```bash
npm run export:web
npm run preview
```

Mở `http://127.0.0.1:4173`. Không chạy lệnh export đồng thời với bài kiểm tra/preview đang đọc `dist`, vì Expo tạo lại thư mục này.

## Deploy lên Vercel Hobby

Project có `vercel.json` để Vercel cài dependency, xuất bản web vào `dist` và chuyển các đường dẫn Expo Router về app. Nhờ vậy mở trực tiếp hoặc tải lại `/login`, `/verify`, `/home` không bị 404 do thiếu file HTML tương ứng.

1. Đưa project lên repository GitHub của bạn, gồm `package.json`, `package-lock.json`, `vercel.json`, `src/` và `assets/`; không đưa `node_modules/`, `dist/`, `dist-all/` lên Git.
2. Đăng nhập Vercel, chọn tài khoản/gói **Hobby**, vào **Add New → Project** rồi import repository.
3. Root Directory là thư mục chứa `package.json`. Kiểm tra các thiết lập sau (đã khai báo trong `vercel.json`):

| Thiết lập | Giá trị |
| --- | --- |
| Framework Preset | Other |
| Install Command | `npm ci` |
| Build Command | `npm run export:web` |
| Output Directory | `dist` |

4. Chọn Deploy; sau khi thành công mở đường dẫn HTTPS được Vercel cấp, thường có đuôi `.vercel.app`.
5. Thử mở trực tiếp `/login` và tải lại trang, đăng nhập bằng tài khoản demo, rồi thử đăng ký → OTP `123456` trên iPhone.

Cấu hình này chuẩn bị **hosting bản web**. Project hiện chưa có manifest, `apple-touch-icon` riêng hoặc service worker cho PWA/offline; cần bổ sung trước khi coi là bản PWA hoàn chỉnh. Vercel Hobby dành cho dự án cá nhân, phi thương mại; xem [tài liệu gói Hobby](https://vercel.com/docs/plans/hobby). Hướng dẫn nền tảng: [Expo → Vercel](https://docs.expo.dev/guides/publishing-websites/#vercel).

## Phạm vi của bản giao diện

- Giữ bảng màu trắng/xám/đen và bố cục wireframe. Chưa triển khai bộ màu giao diện chính thức.
- Đã xem ảnh tổng quan toàn trang và ảnh chi tiết Home, Skill, Class; Auth/Profile dựng từ metadata và ảnh tổng quan vì Figma Starter hết lượt đọc. Những phần này cần đối chiếu ảnh chi tiết thêm khi có lượt truy cập; chưa coi là bản khớp pixel cuối cùng.
- Icon ở thanh điều hướng được thêm trong các vòng tròn placeholder để dễ nhận diện tab. Mascot trang chủ được vẽ lại bằng SVG theo minh họa wireframe; hình game/onboarding giữ placeholder.
- Không backend, xác thực thật, email/OTP thật, camera/QR thật, thông báo đẩy hay mini-game. Dữ liệu thay đổi chỉ ở bộ nhớ và mất khi tải lại app. Không lưu mật khẩu người dùng nhập; tài khoản demo cố định nằm trong mã nguồn.
- App name là **DoAn2026**; logo trong giao diện là chữ LifeLab. Các file icon/splash native trong `assets/` hiện là asset khởi tạo Expo để thay bằng logo chính thức sau.
- `npm audit` có cảnh báo ở chuỗi dependency của Expo/Metro và công cụ native. Không dùng `audit fix --force` vì đề xuất hạ Expo/React Native sang các phiên bản không tương thích; kiểm tra lại dependency trước giai đoạn phát hành.
