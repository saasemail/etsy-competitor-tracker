// ui.js

/**
 * Render tools from localStorage
 */
export function renderTools() {
  const container = document.getElementById('toolsContainer');
  container.innerHTML = '';
  const tools = JSON.parse(localStorage.getItem('tools') || '[]');

  if (tools.length === 0) {
    const empty = document.createElement('p');
    empty.textContent = 'No tools saved yet.';
    empty.style.color = 'var(--muted)';
    container.appendChild(empty);
    return;
  }

  tools.forEach(tool => {
    const card = document.createElement('div');
    card.className = 'tool';

    const title = document.createElement('h3');
    title.textContent = tool.title;
    card.appendChild(title);

    const content = document.createElement('p');
    content.textContent = tool.content;
    content.className = 'tool-content';
    card.appendChild(content);

    const actions = document.createElement('div');
    actions.className = 'tool-actions';

    const copyBtn = document.createElement('button');
    copyBtn.className = 'btn btn-secondary';
    copyBtn.textContent = 'Copy';
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(tool.content);
    });
    actions.appendChild(copyBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-danger';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => {
      const updated = tools.filter(t => t !== tool);
      localStorage.setItem('tools', JSON.stringify(updated));
      renderTools();
    });
    actions.appendChild(deleteBtn);

    card.appendChild(actions);
    container.appendChild(card);
  });
}

/**
 * Save a new tool from textarea
 */
export function setupForm() {
  const titleInput = document.getElementById('toolTitle');
  const contentInput = document.getElementById('toolContent');
  const saveBtn = document.getElementById('saveTool');

  saveBtn.addEventListener('click', () => {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    if (!title || !content) return alert('Please fill in both fields.');
    const tools = JSON.parse(localStorage.getItem('tools') || '[]');
    tools.push({ title, content });
    localStorage.setItem('tools', JSON.stringify(tools));
    titleInput.value = '';
    contentInput.value = '';
    renderTools();
  });
}
