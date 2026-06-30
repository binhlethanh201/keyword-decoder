// === HỆ THỐNG ÂM THANH & NHẠC NỀN ===
const sfxClick = new Audio("sounds/popClick.mp3");
const sfxCorrect = new Audio("sounds/correct.mp3");
const sfxWrong = new Audio("sounds/wrong.mp3");
const sfxTimeout = new Audio("sounds/timeout.mp3");
// Lưu ý: Tên file lấy theo đúng cấu trúc ảnh chụp là jackport.mp3
const sfxJackpot = new Audio("sounds/jackport.mp3");

// Khai báo 2 bài nhạc nền BGM
const bgmHappy = new Audio("sounds/Happy(Instrumental).mp3");
const bgmJustCloud = new Audio("sounds/JustACloudAway(Instrumental).mp3");

// Cấu hình lặp lại cho nhạc nền
bgmHappy.loop = true;
bgmJustCloud.loop = true;

// Cài đặt âm lượng phù hợp (Tránh bị quá to trên loa lớp học)
sfxClick.volume = 0.4;
sfxCorrect.volume = 0.6;
sfxWrong.volume = 0.5;
sfxTimeout.volume = 0.6;
sfxJackpot.volume = 0.7;
bgmHappy.volume = 0.2;
bgmJustCloud.volume = 0.18;

// Hàm tiện ích để tắt toàn bộ BGM trước khi chuyển bài
function stopAllBGM() {
  bgmHappy.pause();
  bgmHappy.currentTime = 0;
  bgmJustCloud.pause();
  bgmJustCloud.currentTime = 0;
}

// === CÁC PHẦN TỬ DOM ===
const introScreen = document.getElementById("intro-screen");
const selectionScreen = document.getElementById("selection-screen");
const mainLayout = document.getElementById("main-layout");
const skipButton = document.getElementById("skip-button");
const backToIntroBtn = document.getElementById("back-to-intro-btn");

const timerDisplay = document.getElementById("timer");
const maskedPhraseDisplay = document.getElementById("masked-phrase");
const guessInput = document.getElementById("guess-input");
const submitGuessBtn = document.getElementById("submit-guess-btn");
const hintDisplay = document.getElementById("hint-display");

const actionButtons = document.getElementById("action-buttons");
const retryBtn = document.getElementById("retry-btn");
const backSelectBtn = document.getElementById("back-select-btn");
const abortBtn = document.getElementById("abort-btn");
const questionButtonsGrid = document.getElementById("question-buttons-grid");
const selectionTitle = document.getElementById("selection-title");

const nohuModal = document.getElementById("nohu-modal");

// === DỮ LIỆU GAME ===
const keywords = [
  "Quyền làm chủ",
  "Nhà nước pháp quyền",
  "Dân biết dân bàn",
  "Chế độ công hữu",
  "Bình đẳng xã hội",
];

const hints = [
  "Bản chất cốt lõi của nền dân chủ XHCN, khẳng định ai là người nắm quyền lực cao nhất.",
  "Công cụ quản lý xã hội hiện đại, nơi mọi hành vi đều phải tuân thủ khuôn khổ của pháp luật.",
  "Phương châm thực hành dân chủ trực tiếp tại cơ sở.",
  "Nền tảng kinh tế để bảo đảm dân chủ XHCN là dân chủ cho đa số, không bị túi tiền chi phối.",
  "Mục tiêu hướng tới sự công bằng, không áp bức bóc lột trong xã hội XHCN.",
];

// === TRẠNG THÁI GAME ===
let currentKeywordIndex = 0;
let currentKeyword = "";
let timer = 45;
let timerInterval = null;
let guessedLetters = new Set();
let questionStatuses = ["idle", "idle", "idle", "idle", "idle"];

// === KHỞI TẠO GAME & SỰ KIỆN ===
document.addEventListener("DOMContentLoaded", () => {
  mainLayout.classList.add("hidden");
  selectionScreen.classList.add("hidden");
  nohuModal.classList.add("hidden");

  // Bật nhạc nền trang chủ khi người dùng tương tác (Browser policy)
  document.body.addEventListener(
    "click",
    () => {
      if (
        bgmHappy.paused &&
        introScreen.classList.contains("hidden") === false
      ) {
        bgmHappy.play().catch((e) => console.log("Audio autoplay blocked", e));
      }
    },
    { once: true },
  );

  // Từ Intro -> Màn chọn câu hỏi
  skipButton.addEventListener("click", () => {
    sfxClick.currentTime = 0;
    sfxClick.play();
    introScreen.classList.add("hidden");
    showSelectionScreen();
  });

  // Màn chọn câu hỏi -> Quay về Intro
  backToIntroBtn.addEventListener("click", () => {
    sfxClick.currentTime = 0;
    sfxClick.play();
    selectionScreen.classList.add("hidden");
    introScreen.classList.remove("hidden");

    stopAllBGM();
    bgmHappy.play();
  });

  submitGuessBtn.addEventListener("click", submitGuess);
  guessInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") submitGuess();
  });

  // Các nút điều khiển trong màn chơi
  retryBtn.addEventListener("click", () => {
    sfxClick.currentTime = 0;
    sfxClick.play();
    startRound();
  });

  backSelectBtn.addEventListener("click", goBackToSelection);
  abortBtn.addEventListener("click", goBackToSelection);

  // Nút Nổ hũ
  document.getElementById("no-hu-btn").addEventListener("click", () => {
    sfxJackpot.currentTime = 0;
    sfxJackpot.play();
    bgmJustCloud.volume = 0.05; // Giảm nhạc nền
    nohuModal.classList.remove("hidden");
  });
});

function goBackToSelection() {
  sfxClick.currentTime = 0;
  sfxClick.play();
  clearInterval(timerInterval);
  sfxTimeout.pause();
  sfxTimeout.currentTime = 0;
  showSelectionScreen();
}

// Loại bỏ dấu tiếng Việt
function normalize(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .trim();
}

function closeNoHuModal() {
  sfxClick.currentTime = 0;
  sfxClick.play();
  bgmJustCloud.volume = 0.18; // Khôi phục nhạc nền
  nohuModal.classList.add("hidden");
}

// === HIỂN THỊ MENU CHỌN CÂU HỎI ===
function showSelectionScreen() {
  clearInterval(timerInterval);
  mainLayout.classList.add("hidden");
  selectionScreen.classList.remove("hidden");

  stopAllBGM();
  bgmHappy.play(); // Trả lại nhạc sôi động ở màn hình chọn

  const isAllCleared = questionStatuses.every((status) => status === "success");
  if (isAllCleared) {
    selectionTitle.innerHTML =
      "🏆 HOÀN THÀNH TẤT CẢ CÂU HỎI!<br><span style='font-size:16px; color:#28a745; text-transform:none; display:block; margin-top:10px;'>Hãy click vào nút <b>🎉 Nổ hũ</b> góc dưới để nhận thông điệp cuối cùng!</span>";
  } else {
    selectionTitle.textContent = "Chọn Câu Hỏi";
  }

  questionButtonsGrid.innerHTML = "";
  keywords.forEach((_, index) => {
    const btn = document.createElement("button");
    btn.className = "q-select-btn";

    if (questionStatuses[index] === "success") {
      btn.classList.add("success");
      btn.textContent = `Câu hỏi ${index + 1} ✔️ (Chính xác)`;
    } else if (questionStatuses[index] === "failed") {
      btn.classList.add("failed");
      btn.textContent = `Câu hỏi ${index + 1} ❌ (Chưa đúng)`;
    } else {
      btn.textContent = `Câu hỏi ${index + 1}`;
    }

    btn.addEventListener("click", () => {
      sfxClick.currentTime = 0;
      sfxClick.play();
      selectionScreen.classList.add("hidden");
      mainLayout.classList.remove("hidden");
      currentKeywordIndex = index;
      startRound();
    });

    questionButtonsGrid.appendChild(btn);
  });
}

// === XỬ LÝ GIAO DIỆN Ô CHỮ ===
function generateMaskedPhrase() {
  maskedPhraseDisplay.innerHTML = "";
  let allRevealed = true;

  const words = currentKeyword.split(" ");

  words.forEach((word) => {
    const wordContainer = document.createElement("div");
    wordContainer.className = "word-container";

    const originalChars = word.split("");
    const normChars = normalize(word).split("");

    originalChars.forEach((char, i) => {
      const span = document.createElement("span");
      span.className = "char-box";
      span.textContent = char.toUpperCase();

      const normChar = normChars[i];
      if (guessedLetters.has(normChar)) {
        span.classList.add("revealed");
      } else {
        span.classList.add("hidden-char");
        allRevealed = false;
      }
      wordContainer.appendChild(span);
    });

    maskedPhraseDisplay.appendChild(wordContainer);
  });

  return allRevealed;
}

// === LOGIC THẮNG CUỘC ===
function handleWin() {
  clearInterval(timerInterval);

  // Dừng ngay nhạc đếm ngược kịch tính nếu đang phát dở
  sfxTimeout.pause();
  sfxTimeout.currentTime = 0;

  sfxCorrect.currentTime = 0;
  sfxCorrect.play();

  const normKeyword = normalize(currentKeyword);
  for (let char of normKeyword) {
    if (char !== " ") guessedLetters.add(char);
  }
  generateMaskedPhrase();

  hintDisplay.style.color = "#28a745";
  hintDisplay.innerHTML = `
  <div class="status-message success-status">🎉 <strong>Chính xác!</strong></div>
  <div class="hint-text">Giải thích: ${hints[currentKeywordIndex]}</div>`;
  questionStatuses[currentKeywordIndex] = "success";
  showActionButtons(false, true);
}

// === ĐỒNG HỒ ĐẾM NGƯỢC ===
function countdownTimer() {
  clearInterval(timerInterval);
  timer = 45;
  timerDisplay.textContent = `Thời gian: ${timer}s`;
  timerDisplay.style.color = "#0B3C46"; // Ban đầu để màu tối thanh lịch

  timerInterval = setInterval(() => {
    timer--;
    timerDisplay.textContent = `Thời gian: ${timer}s`;
    if (timer === 10) {
      sfxTimeout.currentTime = 0;
      sfxTimeout.play();
      timerDisplay.style.color = "#D32F2F"; // Đổi màu đỏ cảnh báo kịch tính
    }

    if (timer <= 0) {
      handleTimeout();
    }
  }, 1000);
}

// === XỬ LÝ NGƯỜI CHƠI ĐOÁN ===
function submitGuess() {
  const rawInput = guessInput.value.trim();
  if (!rawInput) {
    hintDisplay.style.color = "#D32F2F";
    hintDisplay.textContent = "Vui lòng nhập 1 chữ cái hoặc cả cụm từ!";
    return;
  }

  const normInput = normalize(rawInput);
  const normKeyword = normalize(currentKeyword);

  if (normInput.length === 1) {
    if (guessedLetters.has(normInput)) {
      hintDisplay.style.color = "#f0ad4e";
      hintDisplay.innerHTML = `⚠️ Chữ "${rawInput.toUpperCase()}" đã có sẵn! Mời bạn đoán chữ khác.`;
      guessInput.value = "";
      guessInput.focus();
      return;
    }

    if (normKeyword.includes(normInput)) {
      guessedLetters.add(normInput);
      const isWin = generateMaskedPhrase();
      if (isWin) {
        handleWin();
      } else {
        sfxCorrect.currentTime = 0;
        sfxCorrect.play();
        hintDisplay.style.color = "#28a745";
        hintDisplay.innerHTML = `
  <div class="status-message success-status"><strong>Chính xác có chữ "${rawInput.toUpperCase()}"!</strong></div>
  <div class="hint-text">Mời đoán tiếp.</div>`;
      }
    } else {
      sfxWrong.currentTime = 0;
      sfxWrong.play();
      hintDisplay.style.color = "#D32F2F";
      hintDisplay.innerHTML = `
  <div class="status-message error-status">❌ <strong>Không có chữ "${rawInput.toUpperCase()}"!</strong></div>
  <div class="hint-text"><strong>Gợi ý:</strong> ${hints[currentKeywordIndex]}</div>`;
    }
  } else {
    if (normInput === normKeyword) {
      handleWin();
    } else {
      sfxWrong.currentTime = 0;
      sfxWrong.play();
      hintDisplay.style.color = "#D32F2F";
      hintDisplay.innerHTML = `
  <div class="status-message error-status">❌ <strong>Sai rồi!</strong></div>
  <div class="hint-text"><strong>Gợi ý:</strong> ${hints[currentKeywordIndex]}</div>`;
    }
  }

  guessInput.value = "";
  guessInput.focus();
}

// === HẾT GIỜ ===
function handleTimeout() {
  clearInterval(timerInterval);
  // Không cần phát lại sfxTimeout ở đây nữa vì âm thanh phát từ giây 11 đã vừa vặn kết thúc lúc này

  hintDisplay.style.color = "#D32F2F";
  hintDisplay.innerHTML = `
  <div class="status-message error-status">⏱️ <strong>Hết giờ!</strong></div>
  <div class="hint-text">Rất tiếc bạn chưa giải mã được cụm từ này. Hãy thử lại hoặc lựa chọn câu hỏi khác!</div>`;
  questionStatuses[currentKeywordIndex] = "failed";
  showActionButtons(true, true);
}

// Bật tắt các nút hành động cuối game
function showActionButtons(showRetry, showBack) {
  guessInput.disabled = true;
  submitGuessBtn.disabled = true;
  actionButtons.classList.remove("hidden");

  retryBtn.style.display = showRetry ? "inline-block" : "none";
  backSelectBtn.style.display = showBack ? "inline-block" : "none";
}

// === BẮT ĐẦU VÒNG CHƠI ===
function startRound() {
  stopAllBGM();
  bgmJustCloud.play(); // Chuyển sang nhạc nền êm dịu khi tập trung

  // Đảm bảo tắt triệt để sfxTimeout cũ khi sang vòng mới hoặc chơi lại
  sfxTimeout.pause();
  sfxTimeout.currentTime = 0;

  document.getElementById("round-indicator").textContent =
    `TỪ KHÓA ${currentKeywordIndex + 1}/5`;

  currentKeyword = keywords[currentKeywordIndex];
  guessedLetters.clear();

  const words = currentKeyword.split(" ");
  words.forEach((word) => {
    if (word.length > 0) guessedLetters.add(normalize(word[0]));
  });

  generateMaskedPhrase();
  countdownTimer();

  hintDisplay.textContent = "Nhập 1 chữ cái hoặc cả cụm từ để giải mã!";
  hintDisplay.style.color = "#1C3F60";
  guessInput.value = "";
  guessInput.disabled = false;
  submitGuessBtn.disabled = false;
  actionButtons.classList.add("hidden");
  guessInput.focus();
}
