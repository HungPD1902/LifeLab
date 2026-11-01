# GameDoAn trong LifeLab

Nguồn: `C:\Users\Hu\Desktop\Doan\GameDoAn`, chuyển ngày 01/11/2026.

## Mở các màn

- **Thư viện → Nhà an toàn · GameDoAn**, hoặc **Danh mục màn hình → Bộ màn GameDoAn**.
- `/gamedoan`: danh mục chia thành Khám phá, Học và chơi, Cá nhân.
- `/gamedoan/play`: mở nguyên bộ màn gốc; tham số `view` chọn màn đầu tiên.
- `/games/gamedoan/index.html`: bản HTML độc lập nguyên gốc để đối chiếu.

| Nhóm          | Màn                                                                                |
| ------------- | ---------------------------------------------------------------------------------- |
| Khám phá      | Trang đầu, Thư viện, An toàn (kèm tìm kiếm), Chi tiết kỹ năng, Sắp có              |
| Học và chơi   | Bài 1 nhận biết, Bài 2 thoát hiểm, Bài 3 hướng dẫn, Game căn phòng, Bài 4 kiểm tra |
| Trong game    | Tạm dừng, âm lượng, gợi ý, sổ tay, hoạt cảnh xử lý nguy cơ                         |
| Sau lượt chơi | Kết quả, xem lại, chơi lại                                                         |
| Cá nhân       | Đã lưu, Hành trình của em                                                          |

Điều kiện mở khóa và thưởng giữ nguyên: bài 2/3/4 cần hoàn thành bài trước.
Mở trực tiếp một bài đang khóa sẽ về chi tiết kỹ năng. Mục Game mở hướng dẫn
trước khi bắt đầu để người chơi chủ động phát nhạc và khởi chạy đồng hồ.
Kết quả/xem lại cần dữ liệu lượt chơi trong phiên, giống bản gốc.

## Mã nguồn

- `public/games/gamedoan/`: toàn bộ HTML, CSS, JS, assets và bộ kiểm tra gốc.
- `src/features/gamedoan/`: danh mục và lớp Expo DOM để hiển thị tài liệu gốc
  trong iframe riêng, tránh CSS, audio, biến toàn cục tác động các màn LifeLab.
- `src/app/gamedoan/`: route danh mục và route học/chơi bằng Expo Router.
- `lifelab-bridge.js`: chọn màn đầu, báo màn đang mở cho Expo Router qua tham số `view`.
- `lifelab.html`: tạo từ `index.html` bằng `node scripts/prepare-gamedoan.mjs`,
  chỉ thêm script cầu nối; các tệp gốc giữ nguyên nội dung.
- `README-source.md`: hướng dẫn và nguồn tài nguyên từ project gốc.

Khi sửa `index.html`, chạy lại `node scripts/prepare-gamedoan.mjs`.
Các màn LifeLab hiện có vẫn giữ đường dẫn của chúng; bộ GameDoAn có danh mục riêng.
Tiến độ, bookmark và âm lượng dùng các khóa localStorage gốc, riêng với demo LifeLab.
Thoát màn học/chơi sẽ tháo iframe để dừng timer, nhạc và thuyết minh.

## Nền tảng

Expo SDK 58 hỗ trợ Expo DOM và đóng gói `public/` vào binary native.
Do vậy không cần server GameDoAn riêng hay thêm dependency để giữ bản HTML gốc.
Public assets của DOM chưa hỗ trợ EAS Update: thay đổi các tài nguyên này cần
build binary mới. Tài liệu: https://docs.expo.dev/guides/dom-components/.

Kiểm tra bằng `npm run lint`, `npm run typecheck`, `npm run export:all`,
và `npm run test:e2e`. Bộ kiểm tra tích hợp: `tests/gamedoan.spec.ts`.
Kiểm tra web và xuất bundle không thay thế việc chạy thử WebView/audio/cử chỉ
trên thiết bị Android/iOS thật.

Đã kiểm tra khi tích hợp:

- 116 tệp mã nguồn/tài nguyên trùng nội dung với GameDoAn; bộ test gốc cũng được giữ lại.
- ESLint và TypeScript đều qua.
- 21 bài kiểm thử Playwright qua bằng Chrome, gồm toàn bộ route LifeLab và ba bài kiểm thử GameDoAn.
- Xuất bundle web, Android và iOS thành công, gồm bundle Expo DOM.
- Kiểm tra bố cục 320 × 568, 390 × 844 và 844 × 390; ảnh chụp tại `docs/preview/gamedoan-*.png`.
