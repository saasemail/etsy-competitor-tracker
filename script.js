// script.js
// Toolboard: render list of tools and handle input

const tools = [
  {
    title: "IP Address Lookup",
    description: "Quickly find your public IP address and location info.",
    url: "https://ip.toolboard.app"
  },
  {
    title: "QR Code Generator",
    description: "Create simple QR codes for links, Wi-Fi, or text.",
    url: "https://qr.toolboard.app"
  },
  {
    title: "Lorem Ipsum Generator",
    description: "Instantly generate placeholder text for mockups.",
    url: "https://lorem.toolboard.app"
  }
];

function renderTools(toolsList) {
  const container = document.createElement('div');
  container.className = 'tools-container';

  toolsList.forEach(tool => {
    const card = document.createElement('div');
    card.className = 'tool-card';

    const info = document.createElement('div');
    info.className = 'tool-info';

    const title = document.createElement('div');
    title.className = 'tool-title';
    title.textContent = tool.title;

    const description = document.createElement('div');
    description.className = 'tool-description';
    description.textContent = tool.description;

    info.appendChild(title);
    info.appendChild(description);

    const actions = document.createElement('div');
    actions.className = 'tool-actions';

    const openBtn = document.createElement('a');
    openBtn.href = tool.url;
    openBtn.target = '_blank';
    openBtn.rel = 'noopener noreferrer';
    openBtn.className = 'btn btn-primary';
    openBtn.textContent = 'Open';

    const copyBtn = document.createElement('button');
    copyBtn.className = 'btn btn-secondary';
    copyBtn.textContent = 'Copy Link';
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(tool.url).then(() => {
        copyBtn.textContent = 'Copied!';
        setTimeout(() => copyBtn.textContent = 'Copy Link', 2000);
      });
    });

    actions.appendChild(openBtn);
    actions.appendChild(copyBtn);

    card.appendChild(info);
    card.appendChild(actions);

    container.appendChild(card);
  });

  document.body.appendChild(container);
}

document.addEventListener('DOMContentLoaded', () => {
  renderTools(tools);
});
