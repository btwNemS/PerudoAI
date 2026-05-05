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

  // 🔹 reset affichage des dés
  row.innerHTML = "";

  values.forEach((v) => {
    const d = document.createElement("div");
    d.className = "dice " + color;

    const img = document.createElement("img");
    img.src = `assets/images/dice${v}.png`;

    d.appendChild(img);
    row.appendChild(d);
  });

  setDicePositions(playerEl);

  const result = playerEl.querySelector(".dice-result");
  result.innerHTML = "";

  values.forEach((v) => {
    const img = document.createElement("img");
    img.src = `assets/images/dice-top${v}.png`;
    img.alt = `dice ${v}`;
    result.appendChild(img);
  });
}

function shake(playerEl, values) {
  const glass = playerEl.querySelector(".glass");
  
  glass.classList.remove("lift1","lift2", "shake");


  setTimeout(() => {
    glass.classList.add("shake");
  }, 20);

  setTimeout(() => {
    glass.classList.remove("shake");
    renderDice(playerEl, values);
     if (
      playerEl.dataset.side === "top-left" ||
      playerEl.dataset.side === "bottom-left"
    ) {
      glass.classList.add("lift2"); 
    } else {
      glass.classList.add("lift1");
    }
  }, 600);
}

function test(playerEl, values) {


  renderDice(playerEl, values);
}

function randomRoll(n = 5) {
  return Array.from({ length: n }, () => Math.floor(Math.random() * 6) + 1);
}

/*
setInterval(() => {
  players.forEach((p) => {
    shake(p, randomRoll());
  });
}, 2500);*/

function loop() {
  players.forEach((p) => {
    shake(p, randomRoll());
  });

  setTimeout(loop, 2000); // adapte à la durée réelle
}

loop();
