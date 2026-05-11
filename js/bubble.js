function showBubble(player, message) {
  if (!player) return;

  let bubble = player.querySelector(".bubble");

  if (!bubble) {
    bubble = document.createElement("div");
    bubble.className = "bubble";
    player.appendChild(bubble);
  }

  bubble.textContent = message;

  // reset
  bubble.classList.remove("left", "right");
  void bubble.offsetWidth;

  // 🎯 direction basée sur ton dataset (comme shake)
  if (
    player.dataset.side === "top-left" ||
    player.dataset.side === "bottom-left"
  ) {
    bubble.classList.add("left"); // va vers centre
  } else {
    bubble.classList.add("right");
  }
}