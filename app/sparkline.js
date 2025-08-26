// app/sparkline.js
// Draw a minimal sparkline on a canvas element.

/**
 * Draws a simple sparkline representing an array of numerical values.
 * @param {HTMLCanvasElement} canvas
 * @param {number[]} values
 */
export function drawSparkline(canvas, values) {
  if (!canvas || !values || values.length === 0) return;
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  // Compute points
  const step = width / (values.length - 1);
  ctx.strokeStyle = '#6ee7f9';
  ctx.lineWidth = 2;
  ctx.beginPath();
  values.forEach((val, idx) => {
    const x = idx * step;
    const y = height - ((val - min) / range) * height;
    if (idx === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
}