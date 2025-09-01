let timer;
let timeLeft;
let isRunning = false;
let cycles = 0;

const timeEl = document.getElementById('timeLeft');
const sessionLabel = document.getElementById('sessionLabel');
const beep = document.getElementById('beep');
const circle = document.querySelector('.progress-ring__circle');
const circumference = 2 * Math.PI * 90; // r=90
circle.style.strokeDasharray = circumference;

function startTimer() {
  if (isRunning) return;
  const workMins = parseInt(document.getElementById('workInput').value);
  const breakMins = parseInt(document.getElementById('breakInput').value);
  const longBreakMins = parseInt(document.getElementById('longBreakInput').value);
  const cyclesLimit = parseInt(document.getElementById('cyclesInput').value);
  const pairMode = document.getElementById('pairMode').checked;

  if (!timeLeft) {
    timeLeft = workMins * 60;
    sessionLabel.textContent = "Work";
  }

  isRunning = true;
  timer = setInterval(() => {
    timeLeft--;
    updateDisplay();

    if (timeLeft <= 0) {
      beep.play();
      clearInterval(timer);
      isRunning = false;

      if (sessionLabel.textContent === "Work") {
        cycles++;
        if (cycles % cyclesLimit === 0) {
          timeLeft = longBreakMins * 60;
          sessionLabel.textContent = "Long Break";
        } else {
          timeLeft = breakMins * 60;
          sessionLabel.textContent = "Break";
        }
      } else {
        timeLeft = workMins * 60;
        sessionLabel.textContent = "Work";
      }

      if (pairMode) {
        alert("Pair Mode: Notify your partner — session ended!");
      }

      startTimer();
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
  timeLeft = null;
  cycles = 0;
  timeEl.textContent = "25:00";
  sessionLabel.textContent = "Work";
  updateCircle(1);
}

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timeEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  updateCircle(timeLeft / getSessionDuration());
}

function getSessionDuration() {
  const label = sessionLabel.textContent;
  if (label === "Work") return parseInt(document.getElementById('workInput').value) * 60;
  if (label === "Break") return parseInt(document.getElementById('breakInput').value) * 60;
  if (label === "Long Break") return parseInt(document.getElementById('longBreakInput').value) * 60;
  return 1;
}

function updateCircle(progress) {
  const offset = circumference - progress * circumference;
  circle.style.strokeDashoffset = offset;
}
