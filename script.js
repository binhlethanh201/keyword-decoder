// === HỆ THỐNG ÂM THANH & NHẠC NỀN ===
const sfxClick = new Audio("sounds/popClick.mp3");
const sfxCorrect = new Audio("sounds/correct.mp3");
const sfxWrong = new Audio("sounds/wrong.mp3");
const sfxTimeout = new Audio("sounds/timeout.mp3");
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

// === DỮ LIỆU GAME (10 CÂU HỎI LÝ LUẬN TRIẾT HỌC) ===
const keywords = [
  "Quyền làm chủ",
  "Nhà nước pháp quyền",
  "Dân biết dân bàn",
  "Chế độ công hữu",
  "Bình đẳng xã hội",
  "Dân chủ chủ nô",
  "Dân chủ tư sản",
  "Giai cấp vô sản",
  "Chuyên chính vô sản",
  "Bản chất giai cấp"
];

const hints = [
  "Ai là chủ của đất nước? Nhân dân có _____ để quyết định.",
  "Để chính quyền không độc tài, cần có luật lệ rõ ràng. Đó là nguyên tắc _____ _____.",
  "Dân phải hiểu thông tin, cùng bàn luận những việc địa phương. Đó là: _____.",
  "Công xưởng, đất đai, máy móc của toàn dân, không phải của một ông chủ. Đó gọi là _____ _____.",
  "Xóa bỏ sự chênh lệch: mọi người có cơ hội bằng nhau, quyền lợi bằng nhau. Đó là _____ _____.",
  "Thời cổ đại, chỉ ông chủ tự do bầu cử, còn nô lệ không có tiếng nói. Đó là _____ _____.",
  "Nền dân chủ có tự do bầu cử, nhưng tư bản nắm tiền, báo chí, nên kiểm soát kết quả. Đó là _____ _____.",
  "Công nhân nhà máy, nông dân không có gì ngoài sức lao động. Họ là _____ _____.",
  "Giai cấp công nhân nắm quyền lực nhà nước để bảo vệ thành quả cách mạng. Đó là _____ _____.",
  "Để phân biệt dân chủ nào thực sự, phải xem: Quyền lực do ai nắm? Phục vụ ai? Đó là _____ _____."
];

const knowledgeKeys = [
  "Ở nền dân chủ XHCN, nhân dân là chủ của đất nước. Không phải vua, không phải quý tộc, không phải một nhóm giàu có, mà chính những người lao động quyết định tương lai của quốc gia.",
  "Luật pháp là thước đo của quyền lực. Công dân phải tuân thủ luật, nhưng lãnh đạo cũng phải tuân thủ luật. Không ai lớn hơn pháp luật.",
  "Dân chủ cơ sở = dân thực sự tham gia. Không phải 'mình bầu cử xong là xong', mà người dân phải cùng nhau bàn luận, quyết định những việc ở địa phương của mình.",
  "Không ai giàu vô tình, không ai nghèo vô tình. Khi tài sản lớn thuộc toàn dân, lợi ích được chia sẻ cho tất cả người lao động, chứ không bị một người giàu có độc chiếm.",
  "Bình đẳng ≠ cào bằng. Ý không phải mọi người kiếm tiền ngang nhau, mà là ai cũng có cơ hội học hành, có cơ hội phát triển, không bị áp bức vì giai cấp hay xuất thân.",
  "Dân chủ sơ khai và cực kỳ bất công. Nó coi dân chủ chỉ dành cho nhóm người giàu, không dành cho lực lượng lao động chính - những người nô lệ.",
  "Dân chủ 'hình thức' của tư bản. Nó có tự do bầu cử trên giấy, nhưng thực quyền lực chỉ nằm trong tay những người nắm tiền bạc - giai cấp tư sản thôi.",
  "Giai cấp công nhân - lực lượng nòng cốt của cách mạng. Đây là những người có lợi ích trực tiếp trong việc phá bỏ chế độ bóc lột, vì vậy họ là người dẫn đầu xây dựng xã hội mới.",
  "Quyền lực tạm thời để xây dựng tương lai vĩnh cửu. Giai cấp công nhân phải kiên định giữ quyền lực để hạn chế lực lượng cũ can thiệp, đồng thời xây dựng xã hội không có giai cấp.",
  "Mọi dân chủ đều mang màu sắc giai cấp. Không có dân chủ 'trung lập' hay 'của tất cả mọi người'.<br>• Dân chủ tư sản: Giàu có nhưng phục vụ lợi ích thiểu số tư bản.<br>• Dân chủ XHCN: Phục vụ lợi ích của đại đa số nhân dân lao động - đó là điều khác biệt cốt lõi.<br>➔ <b>Kết luận phản biện:</b> Việt Nam không đi con đường tư bản không phải là mất đi dân chủ, mà là lựa chọn con đường tới dân chủ thực chất hơn - dân chủ phục vụ cho đa số người dân lao động!"
];

// === TRẠNG THÁI GAME ===
let currentKeywordIndex = 0;
let currentKeyword = "";
let timer = 45;
let timerInterval = null;
let guessedLetters = new Set();
// Khởi tạo trạng thái cho đủ 10 câu hỏi
let questionStatuses = Array(10).fill("idle");

// === KHỞI TẠO GAME & SỰ KIỆN ===
document.addEventListener("DOMContentLoaded", () => {
  mainLayout.classList.add("hidden");
  selectionScreen.classList.add("hidden");
  if (nohuModal) nohuModal.classList.add("hidden");

  // Bật nhạc nền trang chủ khi người dùng tương tác
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

  // Đảm bảo nút Nổ hũ không gây lỗi nếu bạn ẩn/xóa nút này ngoài HTML
  const noHuBtn = document.getElementById("no-hu-btn");
  if (noHuBtn) {
    noHuBtn.addEventListener("click", () => {
      sfxJackpot.currentTime = 0;
      sfxJackpot.play();
      bgmJustCloud.volume = 0.05; // Giảm nhạc nền
      if (nohuModal) nohuModal.classList.remove("hidden");
    });
  }
});

function goBackToSelection() {
  sfxClick.currentTime = 0;
  sfxClick.play();
  clearInterval(timerInterval);
  sfxTimeout.pause();
  sfxTimeout.currentTime = 0;
  showSelectionScreen();
}

// Loại bỏ dấu tiếng Việt để đối chiếu chính xác
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
  if (nohuModal) nohuModal.classList.add("hidden");
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
      "🏆 HOÀN THÀNH TẤT CẢ CÂU HỎI LÝ LUẬN!<br><span style='font-size:16px; color:#28a745; text-transform:none; display:block; margin-top:10px;'>Nhóm sẵn sàng bước vào phần thảo luận chuyên sâu phản biện!</span>";
  } else {
    selectionTitle.textContent = "HỆ THỐNG TỪ KHÓA BÀI HỌC";
  }

  questionButtonsGrid.innerHTML = "";
  keywords.forEach((_, index) => {
    const btn = document.createElement("button");
    btn.className = "q-select-btn";

    if (questionStatuses[index] === "success") {
      btn.classList.add("success");
      btn.textContent = `Câu hỏi ${index + 1} ✔️`;
    } else if (questionStatuses[index] === "failed") {
      btn.classList.add("failed");
      btn.textContent = `Câu hỏi ${index + 1} ❌`;
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

// === LOGIC THẮNG CUỘC (LẬT MỞ ĐÁP ÁN + HIỆN CHÌA KHÓA KIẾN THỨC) ===
function handleWin() {
  clearInterval(timerInterval);

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
    <div class="status-message success-status">🎉 <strong>CHÍNH XÁC! Đáp án: ${currentKeyword.toUpperCase()}</strong></div>
    <div class="hint-text" style="margin-top: 10px; padding: 12px; background: #e8f5e9; border-left: 5px solid #28a745; text-align: justify; color: #1b5e20; line-height: 1.5;">
      <b>📝 Chìa khóa kiến thức:</b> ${knowledgeKeys[currentKeywordIndex]}
    </div>
  `;
  questionStatuses[currentKeywordIndex] = "success";
  showActionButtons(false, true);
}

// === ĐỒNG HỒ ĐẾM NGƯỢC (45 GIÂY) ===
function countdownTimer() {
  clearInterval(timerInterval);
  timer = 45;
  timerDisplay.textContent = `Thời gian: ${timer}s`;
  timerDisplay.style.color = "#0B3C46";

  timerInterval = setInterval(() => {
    timer--;
    timerDisplay.textContent = `Thời gian: ${timer}s`;
    if (timer === 10) {
      sfxTimeout.currentTime = 0;
      sfxTimeout.play();
      timerDisplay.style.color = "#D32F2F"; // Chuyển đỏ cảnh báo kịch tính
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
    hintDisplay.innerHTML = `<span style="color: #D32F2F; font-weight: bold;">⚠️ Vui lòng nhập chữ cái hoặc từ khóa!</span>`;
    return;
  }

  const normInput = normalize(rawInput);
  const normKeyword = normalize(currentKeyword);

  // TRƯỜNG HỢP 1: Người chơi nhập ĐÚNG toàn bộ cụm từ đáp án
  if (normInput === normKeyword) {
    handleWin();
    guessInput.value = "";
    guessInput.focus();
    return;
  }

  // TRƯỜNG HỢP 2: Người chơi nhập 1 chữ cái HOẶC 1 từ/cụm từ ngắn (Ví dụ: "che", "che do", "cong huu")
  // Kiểm tra xem chuỗi nhập vào có nằm trong đáp án hay không
  if (normKeyword.includes(normInput)) {
    let hasNewLetter = false;

    // Duyệt qua từng ký tự của chuỗi người chơi nhập vào
    for (let char of normInput) {
      if (char !== " " && !guessedLetters.has(char)) {
        guessedLetters.add(char);
        hasNewLetter = true;
      }
    }

    const isWin = generateMaskedPhrase();
    if (isWin) {
      handleWin();
    } else {
      sfxCorrect.currentTime = 0;
      sfxCorrect.play();
      
      if (normInput.length === 1) {
        hintDisplay.innerHTML = `
          <div class="status-message success-status">✔️ <strong>Đúng! Có chữ "${rawInput.toUpperCase()}" trong ô chữ.</strong></div>
          <div class="hint-text" style="margin-top: 5px;"><b>Gợi ý diễn giải:</b> ${hints[currentKeywordIndex]}</div>
        `;
      } else {
        hintDisplay.innerHTML = `
          <div class="status-message success-status">✔️ <strong>Chính xác! Các chữ cái trong từ "${rawInput.toUpperCase()}" đã được lật mở.</strong></div>
          <div class="hint-text" style="margin-top: 5px;"><b>Tiếp tục đoán các từ còn lại:</b> ${hints[currentKeywordIndex]}</div>
        `;
      }
    }
  } else {
    // TRƯỜNG HỢP 3: Đoán sai (Chữ cái không có, hoặc cụm từ nhập vào bị sai chính tả/không nằm trong đáp án)
    sfxWrong.currentTime = 0;
    sfxWrong.play();
    hintDisplay.innerHTML = `
      <div class="status-message error-status">❌ <strong>"${rawInput.toUpperCase()}" không chính xác hoặc không khớp!</strong></div>
      <div class="hint-text" style="margin-top: 5px; color: #d32f2f;"><b>Hãy bám sát gợi ý:</b> ${hints[currentKeywordIndex]}</div>
    `;
  }

  guessInput.value = "";
  guessInput.focus();
}

// === HẾT GIỜ (HIỆN ĐÁP ÁN CHUẨN + CHÌA KHÓA KIẾN THỨC) ===
function handleTimeout() {
  clearInterval(timerInterval);

  hintDisplay.style.color = "#D32F2F";
  hintDisplay.innerHTML = `
    <div class="status-message error-status">⏱️ <strong>Hết giờ!</strong></div>
    <div class="hint-text" style="color: #b71c1c;">Cụm từ ẩn giấu là: <b>${currentKeyword.toUpperCase()}</b></div>
    <div class="hint-text" style="margin-top: 10px; padding: 12px; background: #ffebee; border-left: 5px solid #D32F2F; text-align: justify; color: #b71c1c; line-height: 1.5;">
      <b>📝 Chìa khóa kiến thức cần nắm:</b> ${knowledgeKeys[currentKeywordIndex]}
    </div>
  `;
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

// === BẮT ĐẦU VÒNG CHƠI (XÓA BỎ LẬT CHỮ ĐẦU, HIỆN THẲNG GỢI Ý ĐỂ ĐOÁN) ===
function startRound() {
  stopAllBGM();
  bgmJustCloud.play(); // Chuyển nhạc nền tập trung suy luận

  sfxTimeout.pause();
  sfxTimeout.currentTime = 0;

  // Cập nhật số lượng hiển thị trên tổng số 10 câu
  document.getElementById("round-indicator").textContent =
    `TỪ KHÓA ${currentKeywordIndex + 1}/${keywords.length}`;

  currentKeyword = keywords[currentKeywordIndex];
  guessedLetters.clear();

  // 🔥 ĐÃ XÓA LOGIC TỰ ĐỘNG HIỆN CHỮ CÁI ĐẦU TIÊN (LUẬT CHIẾC NÓN KỲ DIỆU ẨN HẾT)
  generateMaskedPhrase();
  countdownTimer();

  // 🔥 HIỂN THỊ NGAY CÂU HỎI GỢI Ý ĐỂ ĐỊNH HƯỚNG TƯ DUY CHO LỚP
  hintDisplay.innerHTML = `
    <div class="status-message" style="color: #1C3F60;">💡 <b>GỢI Ý ĐỊNH HƯỚNG:</b></div>
    <div class="hint-text" style="color: #0B3C46; font-size: 18px; margin-top: 5px; font-weight: 500;">
      ${hints[currentKeywordIndex]}
    </div>
  `;
  
  guessInput.value = "";
  guessInput.disabled = false;
  submitGuessBtn.disabled = false;
  actionButtons.classList.add("hidden");
  guessInput.focus();
}