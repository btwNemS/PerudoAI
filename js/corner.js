const players = document.querySelectorAll(".player");

function setDicePositions(playerEl) {
  const row = playerEl.querySelector(".dice-row");
  const dice = row.children;

  const positions = [
    [117.5, 55],
    [82.5, 55],
    [72, 82.5],
    [128, 82.5],
    [100, 100],
  ];

  for (let i = 0; i < dice.length; i++) {
    const d = dice[i];
    const pos = positions[i];

    if (!pos) continue;

    d.style.position = "absolute";
    d.style.left = pos[0] + "px";
    d.style.top = pos[1] + "px";
    d.style.transform = "none";
  }
}

function renderDice(playerEl, values) {
  const row = playerEl.querySelector(".dice-row");
  const color = playerEl.dataset.color;

  row.innerHTML = "";

  values.forEach((v) => {
    const d = document.createElement("div");
    d.className = "dice " + color;

    const img = document.createElement("img");
    img.src = `assets/dice${v}.png`;

    d.appendChild(img);
    row.appendChild(d);
  });

  setDicePositions(playerEl);

  playerEl.querySelector(".dice-result").textContent = JSON.stringify(values);

  playerEl.querySelector(".dice-count").textContent = values.length + "/5";
}

function animateRoll(playerEl, values) {
  const glass = playerEl.querySelector(".glass");

  glass.classList.remove("lift", "shake");
  glass.classList.add("cover");

  setTimeout(() => {
    glass.classList.add("shake");
  }, 20);

  setTimeout(() => {
    glass.classList.remove("shake");

    renderDice(playerEl, values);

    glass.classList.remove("cover");
    glass.classList.add("lift");
  }, 600);
}

function randomRoll(n = 5) {
  return Array.from({ length: n }, () => Math.floor(Math.random() * 6) + 1);
}

setInterval(() => {
  players.forEach((p) => {
    animateRoll(p, randomRoll());
  });
}, 2500);
