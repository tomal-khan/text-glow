const input = document.querySelector(".inner-input");
const preview = document.querySelector(".preview-text");
const btn = document.querySelector(".start-glow");

btn.addEventListener("click", pasteText);

input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    pasteText();
  }
});

function pasteText() {
  const text = input.value.trim();
  if (text !== "") {
    preview.textContent = text;
    preview.classList.add("glow");
  }
}