# 🎮 Keyword_Decoder - Game Giải Mã Từ Khóa

Dự án Mini Game Web tương tác được phát triển phục vụ cho bài thuyết trình môn **Chủ nghĩa xã hội khoa học**. Game giúp khuấy động không khí lớp học thông qua việc giải mã các khái niệm lý luận cốt lõi bằng hình thức ô chữ kịch tính.

---

## 📝 Tổng Quan Về Trò Chơi

> **Chủ đề:** Dân chủ XHCN & Nhà nước pháp quyền.

### 🕹️ Cách vận hành trong lớp học:
* **Hiển thị ô chữ:** Cụm từ khóa sẽ bị che lại, hệ thống tự động mở ký tự đầu tiên của mỗi từ đơn để làm mồi gợi ý (Ví dụ: `Q quyền l à m c h ủ` ➔ `Q _ _ _ _   L _ _   C _ _`).
* **Thời gian áp lực:** Mỗi câu hỏi có đúng **45 giây** đếm ngược để suy nghĩ và đưa ra đáp án.
* **Cơ chế đoán linh hoạt:** Người chơi dưới lớp có thể giơ tay đoán **1 chữ cái** bất kỳ hoặc **đoán tuốt cả cụm từ**.
* **Hỗ trợ sư phạm:** Sau mỗi lượt đoán (dù đúng hay sai), hệ thống luôn hiển thị gợi ý hoặc định nghĩa tương ứng để MC/Presenter tiện "chém gió" kiến thức.

---

## ✨ Các Tính Năng Nổi Bật

* **🎨 Giao diện Đồng bộ Canva:** Phối màu chuẩn Teal (`#05829a`) chuyển mượt mà qua hiệu ứng Radial Gradient, giúp hộp câu hỏi nổi bật hoàn toàn, không gây mỏi mắt khi nhìn trên máy chiếu lớp học.
* **🎵 Hệ thống âm thanh sống động (SFX & BGM):**
  * Nhạc nền sôi động (*Happy - Instrumental*) ở sảnh chờ và nhạc tập trung (*Just a Cloud Away - Instrumental*) khi đang làm bài.
  * Hiệu ứng âm thanh tương tác chuẩn gameshow: Tiếng *Ting Ting* khi đoán đúng, tiếng lỗi *Buzzer* khi đoán sai, tiếng còi báo hết giờ.
* **🛡️ Chống lỗi hiển thị (Vỡ khung):** Cấu trúc ô chữ sử dụng Flexbox cố định kích thước, đảm bảo khi đổi từ chữ ẩn sang chữ hiện **tuyệt đối không bị nhảy dòng** làm mất thẩm mỹ.
* **🎉 Tính năng Nổ Hũ (Jackpot):** Nút mở rộng đặc biệt ở góc màn hình, kích hoạt hiệu ứng âm thanh hoành tráng để mở ra câu hỏi nghị luận cuối cùng nhằm chốt hạ điểm số.

---

## 📁 Cấu Trúc Thư Mục Dự Án

```text
Keyword_Decoder/
├── index.html          # Cấu trúc giao diện chính (Intro, Menu, Main Game, Modal)
├── style.css           # Định dạng giao diện, hiệu ứng chuyển màu và hiệu ứng ô chữ pop-up
├── script.js           # Xử lý logic game (Timer, chuẩn hóa dấu tiếng Việt, quản lý âm thanh)
└── sounds/             # Kho tài nguyên âm thanh và nhạc nền hệ thống
    ├── correct.mp3
    ├── Happy(Instrumental).mp3
    ├── jackport.mp3
    ├── JustACloudAway(Instrumental).mp3
    ├── popClick.mp3
    ├── timeout.mp3
    └── wrong.mp3