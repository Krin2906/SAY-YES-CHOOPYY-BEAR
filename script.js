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
  { text: "Will you be my Valentine?", isQuestion: true },
];

let idx = 0;

// Helps with autoplay restrictions: we "unlock" audio on first click.
let audioUnlocked = false;
function unlockAudioOnce() {
  if (audioUnlocked) return;
  audioUnlocked = true;

  // Try to play/pause quickly to satisfy some browsers (no sound heard)
  [yesHoverAudio, noHoverAudio].forEach(a => {
    a.muted = true;
    a.play().then(() => {
      a.pause();
      a.currentTime = 0;
      a.muted = false;
    }).catch(() => {
      // If it fails, hover may still work after interaction on some browsers
      a.muted = false;
    });
  });
}

function render() {
  const s = screens[idx];
  stage.textContent = s.text;

  if (s.isQuestion) {
    nextBtn.classList.add("hidden");
    choiceRow.classList.remove("hidden");
    subtext.textContent = "Choose wisely 😌";
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
  if (!audioUnlocked) return; // prevents annoyance before the first click
  try {
    audioEl.currentTime = 0;
    audioEl.play();
  } catch {}
}

yesBtn.addEventListener("mouseenter", () => playHover(yesHoverAudio));
noBtn.addEventListener("mouseenter", () => playHover(noHoverAudio));

// YES click
yesBtn.addEventListener("click", () => {
  unlockAudioOnce();
  stage.textContent = "YAYYYYY 💘";
  subtext.textContent = "Best decision ever. I love you!!";
  choiceRow.classList.add("hidden");
});

// NO click (playful, non-violent)
noBtn.addEventListener("click", () => {
  unlockAudioOnce();

  document.querySelector(".card").classList.remove("shake");
  void document.querySelector(".card").offsetWidth; // reflow to restart animation
  document.querySelector(".card").classList.add("shake");

  subtext.textContent = "Milo & Oscar are DISPLEASED 🐹🐹";

  // “poof” emojis as a silly effect (not graphic)
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
