const stage = document.getElementById("stage");
const subtext = document.getElementById("subtext");

const nextBtn = document.getElementById("nextBtn");
const choiceRow = document.getElementById("choiceRow");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");

const yesHoverAudio = document.getElementById("yesHoverAudio");
const noHoverAudio = document.getElementById("noHoverAudio");

// Sequence screens
const screens = [
  { text: "LETS" },
  { text: "RUN" },
  { text: "IT" },
  { text: "BACKK!!!" },
  // add purple heart + heart with arrow when question shows
  { text: "Will you be my Valentine? 💜💘", isQuestion: true },
];

let idx = 0;

// Helps with autoplay restrictions: unlock audio on first click
let audioUnlocked = false;
function unlockAudioOnce() {
  if (audioUnlocked) return;
  audioUnlocked = true;

  [yesHoverAudio, noHoverAudio].forEach(a => {
    a.muted = true;
    a.play().then(() => {
      a.pause();
      a.currentTime = 0;
      a.muted = false;
    }).catch(() => {
      a.muted = false;
    });
  });
}

function render() {
  const s = screens[idx];
  stage.textContent = s.text;

  // cute styling for question
  stage.classList.toggle("question", !!s.isQuestion);

  if (s.isQuestion) {
    nextBtn.classList.add("hidden");
    choiceRow.classList.remove("hidden");
    subtext.textContent = "Choose wisely, choopy 😌💗";
  } else {
    nextBtn.classList.remove("hidden");
    choiceRow.classList.add("hidden");
    subtext.textContent = "";
  }
}

nextBtn.addEventListener("click", () => {
  unlockAudioOnce();
  idx = Math.min(idx + 1, screens.length - 1);
  render();
});

// Hover audio
function playHover(audioEl) {
  if (!audioUnlocked) return;
  try {
    audioEl.currentTime = 0;
    audioEl.play();
  } catch {}
}
yesBtn.addEventListener("mouseenter", () => playHover(yesHoverAudio));
noBtn.addEventListener("mouseenter", () => playHover(noHoverAudio));

// --- PARTY MODE (confetti + lights) ---
function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function launchConfetti(amount = 120) {
  const colors = ["#ff5fd2", "#ff9ae7", "#b45fff", "#ffffff"];

  for (let i = 0; i < amount; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti";

    const left = rand(0, 100);
    const duration = rand(1.6, 3.4);
    const delay = rand(0, 0.6);
    const sizeW = rand(7, 12);
    const sizeH = rand(10, 18);

    piece.style.left = `${left}vw`;
    piece.style.width = `${sizeW}px`;
    piece.style.height = `${sizeH}px`;
    piece.style.animationDuration = `${duration}s`;
    piece.style.animationDelay = `${delay}s`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];

    // add a little horizontal drift
    piece.style.transform = `translateY(-20px) rotate(${rand(0, 360)}deg) translateX(${rand(-20, 20)}px)`;

    document.body.appendChild(piece);

    setTimeout(() => piece.remove(), (duration + delay) * 1000 + 200);
  }
}

function setPartyMode(on) {
  document.body.classList.toggle("party", on);
}

// YES click -> party!
yesBtn.addEventListener("click", () => {
  unlockAudioOnce();

  setPartyMode(true);
  launchConfetti(160);

  stage.textContent = "YAYYYYY CHOOPY!!! 💖✨";
  subtext.textContent = "I love you sooo much 💜💘";

  choiceRow.classList.add("hidden");
});

// NO click (playful)
noBtn.addEventListener("click", () => {
  unlockAudioOnce();

  const card = document.querySelector(".card");
  card.classList.remove("shake");
  void card.offsetWidth; // reflow
  card.classList.add("shake");

  // updated message
  subtext.textContent = "Oscar and Milo GOT 🐹🐹";

  const puff1 = document.createElement("span");
  puff1.className = "puff";
  puff1.textContent = "💥";

  const puff2 = document.createElement("span");
  puff2.className = "puff";
  puff2.textContent = "✨";

  stage.appendChild(puff1);
  stage.appendChild(puff2);

  setTimeout(() => {
    puff1.remove();
    puff2.remove();
  }, 950);
});

// Initial render
render();
