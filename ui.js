// ui.js - Clean Pomodoro Timer

let timer;
let isRunning = false;
let remainingSeconds;
let currentMode = "work"; // work | shortBreak | longBreak
let completedCycles = 0;

// Elements
const timeDisplay = document.getElementById("time");
const statusDisplay = document.getElementById("status");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

// Settings
const workInput = document.getElementById("workDuration");
const shortBreakInput = document.getElementById("shortBreak");
const longBreakInput = document.getElementById("longBreak");
const cyclesInput = document.getElementById("cyclesBeforeLong");

function updateDisplay() {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
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

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

// Initialize
switchMode("work");
