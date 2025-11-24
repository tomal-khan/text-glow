document.addEventListener('DOMContentLoaded', () => {
  const input = document.querySelector('.inner-input');
  const btn = document.querySelector('.start-glow');
  const preview = document.querySelector('.preview-text');
  const colorValue = document.getElementById('colorValue');
  const canvas = document.getElementById('colorWheel');

  if (!canvas) {
    console.error('Canvas #colorWheel not found in DOM.');
    return;
  }
  if (!input || !btn || !preview || !colorValue) {
    console.error('Required elements missing: .inner-input, .start-glow, .preview-text, or #colorValue');
    return;
  }

  const ctx = canvas.getContext('2d');
  const size = canvas.width;
  const cx = size / 2;
  const cy = size / 2;
  let selectedGlowColor = '#ffffff';

  function drawWheel() {
    const gradient = ctx.createConicGradient(-Math.PI / 2, cx, cy);
    gradient.addColorStop(0, 'red');
    gradient.addColorStop(1 / 6, 'yellow');
    gradient.addColorStop(2 / 6, 'lime');
    gradient.addColorStop(3 / 6, 'cyan');
    gradient.addColorStop(4 / 6, 'blue');
    gradient.addColorStop(5 / 6, 'magenta');
    gradient.addColorStop(1, 'red');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    const overlay = ctx.createRadialGradient(cx, cy, 0, cx, cy, cx);
    overlay.addColorStop(0, 'rgba(255,255,255,1)');
    overlay.addColorStop(0.55, 'rgba(255,255,255,0)');
    overlay.addColorStop(1, 'rgba(0,0,0,0.8)');
    ctx.fillStyle = overlay;
    ctx.fillRect(0, 0, size, size);
  }
  drawWheel();

  function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('').toUpperCase();
  }

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);

    if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) return;

    const p = ctx.getImageData(x, y, 1, 1).data;
    selectedGlowColor = rgbToHex(p[0], p[1], p[2]);
    colorValue.textContent = selectedGlowColor;
    colorValue.style.color = selectedGlowColor;
  });

  function pasteText() {
    const text = (input.value || '').trim();
    if (!text) return;

    preview.textContent = text;
    preview.style.color = selectedGlowColor;
    preview.style.textShadow = `
      0 0 8px ${selectedGlowColor},
      0 0 16px ${selectedGlowColor},
      0 0 24px ${selectedGlowColor},
      0 0 32px ${selectedGlowColor}
    `;
  }

  btn.addEventListener('click', pasteText);

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      pasteText();
    }
  });
});
