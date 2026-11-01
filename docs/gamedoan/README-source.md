# Nhà an toàn — game kỹ năng

Mở `index.html` bằng trình duyệt, không cần cài thư viện hay build. Giao diện mặc định là Thư viện; luồng: Thư viện → An toàn → Chi tiết → Bài học → Game → Kết quả.

## Bộ visual hiện tại

Nguồn do người dùng cung cấp: https://drive.google.com/drive/folders/1qY5jloCAhRaOx25wOAiUjiIJYciPk_ZA

- `assets/visual/final.png`: nguyên bản Final.PNG 3089 × 2441, nền chính của game.
- `assets/visual/bg.png`: Bg.PNG cùng bộ ảnh, dùng ghép trạng thái sau xử lý.
- `assets/visual/obj/`: 17 lớp đồ vật gốc, giữ nguyên kích thước và tọa độ.
- `assets/visual/hazards/`: 5 lớp gốc, gồm dây điện hỏng/an toàn, ổ cắm quá tải/an toàn và tàn thuốc. Có **3 tình huống nguy hiểm**, không tính trạng thái an toàn thành nguy cơ mới.
- `assets/visual/sprites/`: phần ảnh có nội dung được cắt từ các lớp gốc để dùng highlight, thẻ bài học, vùng chọn.
- `assets/visual/safe.png`: ghép Bg + 17 đồ vật + dây/ổ điện an toàn. Mỗi khi tìm được nguy cơ, game chỉ thay vùng tương ứng, không lộ đáp án còn lại.
- `visual-data.js`: tọa độ phần trăm và hình vùng chọn lấy từ alpha của ảnh; các vùng trong suốt không bắt click nhầm. Tạo lại bằng `tests/prepare-visual.py` với Python/Pillow.

Các nút pause, âm thanh, gợi ý, sổ tay, nút trong demo và các nút hành động học/kết quả dùng Design System Figma (xem `design-buttons.css` và `assets/design-system/README.md`). Góc nhìn không dùng dãy nút: kéo chuột/vuốt một ngón để di chuyển, chụm/tách hai ngón để zoom 100–300%, con lăn chuột zoom tại vị trí trỏ. Một ngón vẫn dùng cuộn gốc; hai ngón được xử lý riêng và không chọn nhầm đồ vật. Trong demo/pause, các cử chỉ zoom không tác động. `visual.css` chỉ đổi phần trình bày cảnh: toàn phòng giữa nền pastel như ảnh tham khảo. **Chạm/click đôi vùng nền trống** để phóng to/thu nhỏ; khi phóng to, kéo hoặc vuốt hai chiều. Gợi ý tự mở góc nhìn phóng to. Mobile dùng cuộn gốc của trình duyệt và giảm hiệu ứng blur để nhẹ hơn.

## Luật và tiến độ

- 120 giây, 3 nguy cơ: dây điện hở, ổ cắm quá tải, tàn thuốc chưa dập. Chạm nhầm một đồ vật trừ 5 giây; nền trống không bị phạt.
- Tìm đúng sẽ **đổi ngay sang trạng thái đã xử lý**, không có viền vàng: tàn thuốc biến mất, dây/ổ điện dùng trạng thái an toàn từ bộ ảnh. Vùng chạm của tàn thuốc cũng tắt; có thể xem lại qua sổ tay. Đồng hồ dừng và phát demo 4 bước, tối thiểu 17 giây, chờ từng câu thuyết minh kết thúc trước khi chuyển bước. Demo không có bàn tay: dập tắt/chờ nguội tàn thuốc, đưa vào thùng rồi đặt thùng lại dưới gầm bàn; ngắt điện rồi thay dây hỏng, không quấn băng; ngắt điện và rút bớt phích của thiết bị không cần dùng, không chuyển sang ổ mới. Thùng rác tiếp tục nằm dưới bàn trong cảnh chính. Đây là hoạt cảnh minh họa ghép từ ảnh có sẵn và SVG trong `assets/demo/`. Có nút tạm dừng, xem lại, âm thanh và “Tớ nhớ rồi!”. Xem hết mới ghi vào danh sách hoạt cảnh đã xem. Chơi lại phục hồi Final.
- `voice.js` phát **12 câu Google tiếng Việt lưu sẵn**, đọc nhanh hơn 14% và rút gọn lời. Không phụ thuộc máy có cài giọng Google hay không. Nếu tệp lỗi, thử Web Speech với giọng Việt tự nhiên/Google trên thiết bị rồi dùng phụ đề ngắn. Khi tắt tiếng hoặc âm lượng giọng đọc bằng 0, vẫn có phụ đề. Pause, đổi tab, bỏ qua hoặc thoát bài sẽ dừng thuyết minh; dùng lại một audio player cho các bước để hỗ trợ quyền phát âm thanh trên mobile. Nguồn và cách tạo lại: `assets/audio/README.md`.
- HUD **màu xanh**, ngọn lửa thay ngôi sao và nút pause tròn có hai vạch trắng đậm. Menu pause chứa quay lại Kỹ năng, bật/tắt âm thanh và ba thanh âm lượng riêng (nhạc, hiệu ứng, giọng đọc). Cụm nút bên phải hình tròn như mẫu; **−20s** nằm trên góc nút bóng đèn. Sổ tay bên dưới dùng quyển sách người dùng gửi đã phối xanh, có huy hiệu góc đếm 1/2/3 nguy cơ đã tìm (ẩn khi 0). Khi gợi ý, vùng cần tìm sáng lên, cảnh xung quanh tối đi trong 3 giây và đồng hồ dừng. Hết thời gian do trả phí gợi ý sẽ kết thúc lượt chơi. Chuyển tab tự pause. Các phần này được định dạng trong `game-polish.css`.
- `audio.js` phát nhạc **boba date — Stream Cafe** lặp từ đoạn 3 phút, tiếng pop khi chạm đồ vật và meow khi chạm mèo. Tệp lấy từ đúng ba URL YouTube người dùng chọn, cắt bỏ khoảng im lặng để phản hồi nhanh. Hai hiệu ứng được tải sớm; mỗi thao tác chạm/click thử phục hồi AudioContext nếu bị khóa/ngắt. Không chờ `resume()` mới giải mã và không tạo audio player mới cho mỗi lần chạm. Nhạc nhỏ lại trong demo và lúc có SFX, dừng khi ẩn tab/thoát game. Âm lượng và mute lưu ở `safe-room-audio-v1`. Browser cần người chơi thao tác trước khi phát âm thanh; không nhúng player YouTube trong màn game.
- Hoàn thành còn ≥70 giây: 3 sao; ≥30 giây: 2 sao; dưới 30 giây: 1 sao. Phần thưởng 20/15/10 EXP; hết giờ 5 EXP. Chỉ nhận phần chênh lệch so với thành tích tốt nhất. Sau khi đạt 20 EXP, hoàn thành lại nhận 1 xu.
- Điểm game = tỷ lệ nguy cơ tìm thấy × 100 (làm tròn) − 10 × số lần chạm nhầm, tối thiểu 0. Thời gian kết quả chỉ tính lúc đồng hồ chạy, không cộng hình phạt hay thời gian xem hoạt cảnh.
- Bài 1: 3 thẻ nhận biết. Bài 2: 3 thẻ thoát hiểm. Bài 3: game căn phòng. Hoàn thành bài trước để mở bài sau. Bài 4: 5 câu kiểm tra, đạt 80% để hoàn thành kỹ năng; tối đa 20 EXP kiểm tra, không cộng trùng khi chơi lại.
- Có tìm kỹ năng bằng tiếng Việt không dấu, lưu bookmark, Trang đầu, Kỹ năng, Đã lưu và Của em. Các kỹ năng chưa có nội dung ghi “Sắp có”.
- localStorage `safe-kitchen-v1` giữ thưởng và lịch sử hoạt cảnh; `safe-kitchen-course-v1` giữ tiến độ kỹ năng/bookmark. Mã định danh cũ giữ để không xóa tiến độ đã lưu.

## Kiểm tra

`tests/browser.html` kiểm tra cảnh, ảnh, vùng chọn, zoom, nguy cơ, hoạt cảnh, phí gợi ý và reset; chạy thêm `?mobile`, `?landscape`. `tests/voice.html` kiểm tra chọn giọng, phát bản thu, chờ lời thoại, pause/replay/mute/skip, đổi tab và fallback bằng engine giả. `tests/hud-audio.html` chạy qua localhost, bấm Run để kiểm tra menu âm thanh, phát nhạc thật, giải mã đủ 15 MP3 và phát câu Google thật. `tests/screens.ps1` kiểm tra luồng kỹ năng/kết quả. `tests/camera-input.ps1` và `tests/gesture-input.ps1` kiểm tra chuột, cảm ứng và pinch qua Chrome DevTools Protocol cổng 9228, với hồ sơ Chrome thử nghiệm riêng.

`tests/audio-recovery.html` tái hiện lời gọi resume bị treo/ngắt; `tests/sfx-input.ps1` chạm thật qua CDP vào vùng ảnh đồ vật/mèo, kiểm tra audio source thực sự bắt đầu và phục hồi sau khi suspend, đồng thời bảo đảm vuốt không phát SFX. Server thử nghiệm cho bài này chạy ở `127.0.0.1:8772`.

Nội dung an toàn: trẻ tránh xa nguy cơ và báo người lớn, không tự chạm/sửa điện hoặc nhặt tàn thuốc. Hướng dẫn thoát hiểm tham khảo https://www.usfa.fema.gov/prevention/home-fires/at-risk-audiences/children/ và https://www.usfa.fema.gov/gallery/pictographs/escape-planning.html.

## Button Design System

Đã đọc trực tiếp Figma node `8:2`, component set `131:7079`. Nút dùng font Capriola, Primary xanh `#70baf0`/cạnh đậm `#0f63a9`, Secondary nền `#f8fcff`/viền xanh; Pressed và Disabled theo mẫu. Cỡ 48/40/32 px, bo góc 10/8 px. Icon game tải nguyên bản SVG 24 × 24 từ Figma và lưu nội bộ. Chi tiết nguồn, node và giấy phép font tại `assets/design-system/README.md`. Nút chứa nhãn tiếng Việt dài được phép xuống dòng khi màn hình nhỏ để không cắt chữ.

## Phản hồi chạm đồ vật thường

Chạm một đồ vật không phải nguy cơ sẽ nâng sprite nhẹ, tăng độ sáng và hiện tên khoảng 0,95 giây rồi trở lại bình thường. Nền bên dưới được ghép từ các lớp gốc để không xuất hiện hai bản sao đồ vật. Chạm liên tục thay phản hồi trước; mở demo, pause hoặc reset sẽ dọn hiệu ứng. Không chạy hiệu ứng khi vuốt/zoom. Luật trừ 5 giây vẫn giữ. `tests/prepare-visual.py` tạo các ảnh `*-underlay.png`; bộ ảnh được nạp trước khi chơi để phản hồi nhanh.
