# Âm thanh của game

Các nguồn do người dùng chọn:

| Tệp | Nguồn | Phần sử dụng |
| --- | --- | --- |
| `pop.mp3` | [BUBBLE POP SOUND EFFECT - FREE — Sound FX](https://www.youtube.com/watch?v=Ge2zHoXskC8) | 1,80–2,10 giây, bỏ đoạn chờ đầu |
| `meow.mp3` | [Cat Meow Sound Effect — SoundEffectsFactory](https://www.youtube.com/watch?v=su6_bKJJk74) | 0,95–2,05 giây, tiếng meow đầu |
| `boba-date.mp3` | [boba date — Stream Cafe](https://www.youtube.com/watch?v=JOXUEZloyZE) | 3 phút đầu, fade ở hai đầu, phát lặp |

Nguồn giữ nguyên tác giả; đây không phải âm thanh do dự án sáng tác. Tệp phát cục bộ để phản hồi chạm không phải chờ YouTube. `tests/prepare-audio.py` cắt/nén từ các MP3 nguồn theo video ID; công cụ chuẩn bị cần `imageio-ffmpeg`, game không cần thư viện ngoài.

`voice/` chứa 12 câu Google tiếng Việt, nội dung lấy từ `LESSON_VOICE` trong `lessons.js`. Đã tăng tốc 14% bằng `atempo` để giữ cao độ. `tests/prepare-voice.py --force` tạo lại sau khi đổi lời thoại; helper dùng chức năng đọc của trang Google Translate, không phải Google Cloud TTS API. Endpoint của website có thể thay đổi, nhưng lúc chạy game chỉ phát MP3 đã lưu. Nếu tệp lỗi, `voice.js` thử giọng tiếng Việt của trình duyệt rồi chuyển sang phụ đề ngắn.

Âm lượng lưu riêng ở `safe-room-audio-v1`: nhạc nền, hiệu ứng và giọng đọc. Nhạc tự giảm khi thuyết minh, dừng khi thoát game/ẩn tab. Âm thanh bắt đầu sau thao tác của người chơi theo chính sách trình duyệt.

SFX được tải sớm, giải mã độc lập với lời gọi resume và thử mở khóa lại trên mỗi thao tác, kể cả sau khi AudioContext bị gián đoạn. Dùng lại player đã nạp khi chưa có buffer, giảm nhạc trong lúc phát pop/meow. Kiểm tra phục hồi ở `tests/audio-recovery.html` và chạm cảm ứng ở `tests/sfx-input.ps1`.
