// ui.js - Full Pomodoro Timer with Pair Mode (basic)

let timer;
let isRunning = false;
let remainingSeconds;
let currentMode = "work"; // work | shortBreak | longBreak
let completedCycles = 0;

const timeDisplay = document.getElementById("time");
const statusDisplay = document.getElementById("status");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

// Settings inputs
const workInput = document.getElementById("workDuration");
const shortBreakInput = document.getElementById("shortBreak");
const longBreakInput = document.getElementById("longBreak");
const cyclesInput = document.getElementById("cyclesBeforeLong");
const pairModeCheckbox = document.getElementById("pairMode");

function updateDisplay() {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  timeDisplay.textContent = `${minutes}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

function switchMode(mode) {
  currentMode = mode;
  if (mode === "work") {
    remainingSeconds = parseInt(workInput.value) * 60;
    statusDisplay.textContent = "Work";
  } else if (mode === "shortBreak") {
    remainingSeconds = parseInt(shortBreakInput.value) * 60;
    statusDisplay.textContent = "Short Break";
  } else if (mode === "longBreak") {
    remainingSeconds = parseInt(longBreakInput.value) * 60;
    statusDisplay.textContent = "Long Break";
  }
  updateDisplay();
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  timer = setInterval(() => {
    if (remainingSeconds > 0) {
      remainingSeconds--;
      updateDisplay();
    } else {
      clearInterval(timer);
      isRunning = false;

      if (currentMode === "work") {
        completedCycles++;
        if (completedCycles >= parseInt(cyclesInput.value)) {
          completedCycles = 0;
          switchMode("longBreak");
        } else {
          switchMode("shortBreak");
        }
        startTimer();
      } else {
        switchMode("work");
        startTimer();
      }
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
}

function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  completedCycles = 0;
  switchMode("work");
}

// === Pair Mode Demo ===
pairModeCheckbox.addEventListener("change", () => {
  if (pairModeCheckbox.checked) {
    // Free version: max 2 users
    alert("Pair Mode active: Free supports up to 2 users. Upgrade to Pro for up to 10!");
  }
});

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

// Initialize
switchMode("work");
