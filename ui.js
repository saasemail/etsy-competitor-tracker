// === TEXT CASE CONVERTER ===
function convertCase(type) {
  const input = document.getElementById('textInput').value;
  let result = '';

  if (type === 'upper') result = input.toUpperCase();
  if (type === 'lower') result = input.toLowerCase();
  if (type === 'capitalize') {
    result = input.replace(/\b\w/g, c => c.toUpperCase());
  }

  document.getElementById('textOutput').value = result;
}

// === WORD COUNTER ===
const wordInput = document.getElementById('wordInput');
wordInput.addEventListener('input', () => {
  const text = wordInput.value.trim();
  const words = text.length > 0 ? text.split(/\s+/).length : 0;
  const chars = text.length;
  document.getElementById('wordCount').textContent = `Words: ${words} | Characters: ${chars}`;
});

// === EMAIL EXTRACTOR ===
function extractEmails() {
  const text = document.getElementById('emailInput').value;
  const emails = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/g);
  document.getElementById('emailOutput').value = emails ? emails.join('\n') : 'No emails found.';
}
