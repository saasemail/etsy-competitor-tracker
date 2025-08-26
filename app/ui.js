// app/ui.js
// Responsible for rendering UI components on the dashboard.

import { drawSparkline } from './sparkline.js';

/**
 * Render the list of targets into the container.  Expects an array of target
 * objects with structure: { id, title, image, currentPrice, lastChange, priceHistory }
 *
 * @param {Array} targets
 * @param {Object} callbacks { onRefresh(id), onViewDiff(diff) }
 */
export function renderTargets(targets, callbacks) {
  const container = document.getElementById('targetsContainer');
  container.innerHTML = '';
  targets.forEach(t => {
    const card = document.createElement('div');
    card.className = 'target-card';
    // header: image + title + refresh button
    const header = document.createElement('div');
    header.className = 'target-header';
    const left = document.createElement('div');
    left.style.display = 'flex';
    left.style.alignItems = 'center';
    const img = document.createElement('img');
    img.src = t.image;
    img.alt = '';
    img.style.width = '48px';
    img.style.height = '48px';
    img.style.objectFit = 'cover';
    img.style.borderRadius = '0.5rem';
    const title = document.createElement('span');
    title.textContent = t.title;
    title.style.marginLeft = '0.5rem';
    title.style.fontWeight = '600';
    left.appendChild(img);
    left.appendChild(title);
    header.appendChild(left);
    const refreshBtn = document.createElement('button');
    refreshBtn.className = 'btn btn-secondary';
    refreshBtn.textContent = 'Refresh';
    refreshBtn.addEventListener('click', () => callbacks.onRefresh(t.id));
    header.appendChild(refreshBtn);
    card.appendChild(header);
    // Current price
    const price = document.createElement('div');
    price.textContent = `Price: ${t.currentPrice}`;
    card.appendChild(price);
    // Last change summary
    if (t.lastChange && t.lastChange.summary) {
      const change = document.createElement('div');
      change.textContent = t.lastChange.summary;
      change.style.fontSize = '0.875rem';
      change.style.color = 'var(--muted)';
      card.appendChild(change);
    }
    // Sparkline canvas
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 40;
    canvas.className = 'sparkline';
    drawSparkline(canvas, t.priceHistory);
    card.appendChild(canvas);
    // View diff if there is a diff
    if (t.lastChange && t.lastChange.fieldsChanged && t.lastChange.fieldsChanged.length) {
      const viewDiffBtn = document.createElement('button');
      viewDiffBtn.className = 'btn btn-secondary';
      viewDiffBtn.textContent = 'View diff';
      viewDiffBtn.addEventListener('click', () => callbacks.onViewDiff(t.lastChange));
      card.appendChild(viewDiffBtn);
    }
    container.appendChild(card);
  });
}