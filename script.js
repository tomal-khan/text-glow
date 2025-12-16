document.addEventListener("DOMContentLoaded", () => {
  
  const input = document.querySelector(".inner-input");
  const btn = document.querySelector(".start-glow");
  const preview = document.querySelector(".preview-text");
  const clearBtn = document.querySelector(".clear-btn");
  const toggleSpaceBtn = document.querySelector(".toggle-space-btn");
  const colorValue = document.getElementById("colorValue");
  const infoBtn = document.getElementById("info-btn");
  const infoPhill = document.getElementById("info-phill");
  const canvas = document.getElementById("colorWheel");

  const ctx = canvas.getContext("2d");
  const size = canvas.width;
  const cx = size / 2;
  const cy = size / 2;

  let selectedGlowColor = "#FFFFFF";
  let autoAddSpace = true; // New state variable: true by default

  function drawColorWheel() {
    const wheel = ctx.createConicGradient(-Math.PI / 2, cx, cy);
    // Smoother conic gradient for the color spectrum
    wheel.addColorStop(0, "#FF0000"); // Red
    wheel.addColorStop(1/12, "#FF8000"); // Orange
    wheel.addColorStop(2/12, "#FFFF00"); // Yellow
    wheel.addColorStop(3/12, "#80FF00"); // Chartreuse
    wheel.addColorStop(4/12, "#00FF00"); // Lime
    wheel.addColorStop(6/12, "#00FFFF"); // Cyan
    wheel.addColorStop(8/12, "#0000FF"); // Blue
    wheel.addColorStop(10/12, "#8000FF"); // Violet
    wheel.addColorStop(11/12, "#FF00FF"); // Magenta
    wheel.addColorStop(1, "red");

    ctx.fillStyle = wheel;
    ctx.beginPath();
    ctx.arc(cx, cy, cx, 0, 2 * Math.PI);
    ctx.fill();

    const overlay = ctx.createRadialGradient(cx, cy, 0, cx, cy, cx);
    // This gradient controls saturation and value.
    overlay.addColorStop(0, "rgba(255,255,255,1)");      // Center is white (desaturated)
    const transparentPoint = 0.40; // 25% bigger white center (0.32 * 1.25 = 0.40)
    overlay.addColorStop(transparentPoint, "rgba(255,255,255,0)");    // End of pure color ring (transparent overlay)

    // Smooth transition from 5% black to 100% black at the edge.
    const startOpacity = 0.05; // 5% black
    const endOpacity = 1.0;    // 100% black
    const startOfDarkness = transparentPoint + 0.01; // Start darkness just after transparent point
    const darkSteps = Math.ceil((1 - startOfDarkness) / 0.05); // Calculate steps for ~0.05 increments
    for (let i = 0; i <= darkSteps; i++) {
      const pos = startOfDarkness + i * ((1 - startOfDarkness) / darkSteps);
      const opacity = startOpacity + (i / darkSteps) * (endOpacity - startOpacity);
      overlay.addColorStop(pos, `rgba(0,0,0,${opacity})`);
    }

    ctx.fillStyle = overlay;
    ctx.beginPath();
    ctx.arc(cx, cy, cx, 0, 2 * Math.PI);
    ctx.fill();
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

    // If there is text in the input, apply the glow. Otherwise, this just sets the color for the next input.
    if (input.value.trim()) {
      applyGlow();
    }
  });

  function applyGlow() {
    let text = input.value.trim();
    if (!text) return;

    // If the preview already has content, add a leading space to the new text.
    if (preview.childNodes.length > 0 && autoAddSpace) {
      text = ' ' + text;
    }

    const span = document.createElement('span');
    span.textContent = text;
    span.style.color = selectedGlowColor;
    span.style.textShadow = `0 0 8px ${selectedGlowColor}, 0 0 16px ${selectedGlowColor}`;

    preview.appendChild(span);
    input.value = ''; // Clear the input for the next text segment
  }

  function clearAll() {
    preview.innerHTML = '';
    input.value = '';
  }

  btn.addEventListener("click", applyGlow);
  clearBtn.addEventListener("click", clearAll);

  // Toggle auto-add space functionality
  toggleSpaceBtn.addEventListener("click", () => {
    autoAddSpace = !autoAddSpace;
    if (autoAddSpace) {
      toggleSpaceBtn.textContent = "Disable Space";
    } else {
      toggleSpaceBtn.textContent = "Enable Space";
    }
  });

  // Info phill toggle logic
  infoBtn.addEventListener("click", () => {
    infoPhill.classList.toggle("visible");
  });

  input.addEventListener("keydown", e => {
    const isLimitReached = input.value.length >= 1080;
    // A set of keys that should always be allowed, even at the limit.
    const allowedKeys = new Set(['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab', 'Home', 'End']);

    if (e.ctrlKey && e.key === 'Backspace') {
      e.preventDefault();
      clearAll();
      return;
    }
    
    // Handle Ctrl + J for toggling auto-add space
    if (e.ctrlKey && e.key.toLowerCase() === 'j') {
      e.preventDefault();
      toggleSpaceBtn.click(); // Simulate a click on the button
      return;
    }

    if (e.key === "Enter" || (isLimitReached && !allowedKeys.has(e.key))) {
      e.preventDefault();
      applyGlow();
    }
  });
  
  // Add keyboard shortcuts for preset colors
  document.addEventListener("keydown", e => {
    // Handle all Ctrl shortcuts here
    if (!e.ctrlKey) {
      return; // Do nothing if Ctrl is not pressed
    }

    // Handle Ctrl + i for info panel
    if (e.key.toLowerCase() === 'i') {
      e.preventDefault(); // Prevent default browser action (e.g., italics)
      infoPhill.classList.toggle("visible");
    }

    const presets = {
      '1': '#FF0000', // Red
      '2': '#0000FF', // Blue
      '3': '#00FF00', // Green (Lime)
      '4': '#FFFF00', // Yellow
      '5': '#00FFFF', // Cyan
      '6': '#ff9000ff', // Orange
      '7': '#430058ff', // Purple
      '8': '#f422ffff', // Pink
      '9': '#000000', // Black
      '0': '#FFFFFF'  // White
    };

const newColor = presets[e.key];
    if (newColor) {
      selectedGlowColor = newColor;
      colorValue.textContent = selectedGlowColor;
      colorValue.style.color = selectedGlowColor;
      applyGlow(); // Instantly apply the glow with the new color
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
