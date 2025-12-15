document.addEventListener("DOMContentLoaded", () => {
  
  const input = document.querySelector(".inner-input");
  const btn = document.querySelector(".start-glow");
  const preview = document.querySelector(".preview-text");
  const colorValue = document.getElementById("colorValue");
  const canvas = document.getElementById("colorWheel");
  const selectorDot = document.getElementById("selectorDot");

  const ctx = canvas.getContext("2d");
  const size = canvas.width;
  const cx = size / 2;
  const cy = size / 2;

  let selectedGlowColor = "#FFFFFF";

  function drawColorWheel() {
    const wheel = ctx.createConicGradient(-Math.PI / 2, cx, cy);
    wheel.addColorStop(0, "red");
    wheel.addColorStop(1/6, "yellow");
    wheel.addColorStop(2/6, "lime");
    wheel.addColorStop(3/6, "cyan");
    wheel.addColorStop(4/6, "blue");
    wheel.addColorStop(5/6, "magenta");
    wheel.addColorStop(1, "red");

    ctx.fillStyle = wheel;
    ctx.fillRect(0, 0, size, size);

    const overlay = ctx.createRadialGradient(cx, cy, 0, cx, cy, cx);
    overlay.addColorStop(0, "rgba(255,255,255,1)");
    overlay.addColorStop(0.55, "rgba(255,255,255,0)");
    overlay.addColorStop(1, "rgba(0,0,0,0.85)");

    ctx.fillStyle = overlay;
    ctx.fillRect(0, 0, size, size);
  }

  drawColorWheel();

  function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map(c => c.toString(16).padStart(2, "0")).join("").toUpperCase();
  }

  canvas.addEventListener("click", e => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    selectedGlowColor = rgbToHex(pixel[0], pixel[1], pixel[2]);

    colorValue.textContent = selectedGlowColor;
    colorValue.style.color = selectedGlowColor;

    const dotSize = selectorDot.offsetWidth / 2;
    selectorDot.style.left = `${x - dotSize}px`;
    selectorDot.style.top = `${y - dotSize}px`;
    selectorDot.style.display = "block";
  });

  function applyGlow() {
    const text = input.value.trim();
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

  btn.addEventListener("click", applyGlow);

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      applyGlow();
    }
  });
  
document.querySelector('.copy').addEventListener('click', (e) => {
  const copyBtn = e.currentTarget;
  const preview = document.querySelector('.preview-text');
  if (!preview) return;

  const text = (preview.textContent || '').trim();
  if (!text) return;

  // Encode the text and color for the URL
  const encodedText = encodeURIComponent(text);
  const encodedColor = selectedGlowColor.substring(1); // Remove the '#'
  // Construct the URL for the typing SVG service
  const svgUrl = `https://readme-typing-svg.herokuapp.com?font=Fira+Code&pause=1000&color=${encodedColor}&width=435&lines=${encodedText}`;
  
  // Create the full Markdown snippet
  const markdownContent = `[!Typing SVG](https://git.io/typing-svg)`;
  
  navigator.clipboard.writeText(markdownContent).then(() => {
    const originalText = copyBtn.textContent;
    copyBtn.textContent = 'Copied!';
    setTimeout(() => {
      copyBtn.textContent = originalText;
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy: ', err);
  });
});
});
