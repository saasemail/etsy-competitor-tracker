// ui.js

// === TEXT CASE CONVERTER ===
document.getElementById('uppercaseBtn').addEventListener('click', () => {
  const input = document.getElementById('caseInput').value;
  document.getElementById('caseResult').value = input.toUpperCase();
});
document.getElementById('lowercaseBtn').addEventListener('click', () => {
  const input = document.getElementById('caseInput').value;
  document.getElementById('caseResult').value = input.toLowerCase();
});
document.getElementById('capitalizeBtn').addEventListener('click', () => {
  const input = document.getElementById('caseInput').value;
  const capitalized = input.replace(/\b\w/g, c => c.toUpperCase());
  document.getElementById('caseResult').value = capitalized;
});

// === WORD COUNTER ===
const wordInput = document.getElementById('wordInput');
const wordCountDisplay = document.getElementById('wordCount');

wordInput.addEventListener('input', () => {
  const text = wordInput.value.trim();
  const words = text.length > 0 ? text.split(/\s+/).length : 0;
  const chars = text.length;
  wordCountDisplay.textContent = `Words: ${words} | Characters: ${chars}`;
});

// === EMAIL EXTRACTOR ===
document.getElementById('extractBtn').addEventListener('click', () => {
  const text = document.getElementById('emailInput').value;
  const emails = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/g);
  document.getElementById('emailOutput').value = emails ? emails.join('\n') : 'No emails found.';
});
