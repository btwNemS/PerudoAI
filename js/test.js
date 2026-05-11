window.gameSpeedMultiplier = 1;
function setSpeedMultiplier(val) {
  window.gameSpeedMultiplier = val;
  document.documentElement.style.setProperty("--anim-speed", val);
}

const delay = (ms = 1000) =>
  new Promise((res) => setTimeout(res, ms / window.gameSpeedMultiplier));

const DOM = {
  announcement: document.getElementById("announcement"),
  players: document.querySelectorAll(".player"),
};

function getElemCenterPos(element) {
  const rect = element.getBoundingClientRect();
  const pixelX = rect.left + rect.width / 2;
  const pixelY = rect.top + rect.height / 2;
  return {
    x: (pixelX / window.innerWidth) * 100,
    y: (pixelY / window.innerHeight) * 100,
  };
}

function applyDropAnimationToAll() {
  DOM.players.forEach((playerNode) => {
    const glass = playerNode.querySelector(".glass");
    const containerClass = playerNode.closest(".corner").className;

    if (glass) {
      glass.classList.remove("lift1", "lift2", "cover", "shake");

      glass.classList.remove("drop1", "drop2");
      void glass.offsetWidth; // Force reflow

      if (containerClass.includes("left")) {
        glass.classList.add("drop2");
      } else {
        glass.classList.add("drop1");
      }
    }
  });
}

async function displayMessage(html, durationMs) {
  DOM.announcement.innerHTML = html;
  await delay(durationMs);
  DOM.announcement.innerHTML = "";
}

async function displayWinner(winnerName) {
  DOM.announcement.innerHTML = `
        La partie est terminée !<br>
        Vainqueur : <strong style="color:gold;">${winnerName}</strong>
    `;
  const duration = 15 * 1e3,
    animationEnd = Date.now() + duration,
    defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 0,
    };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }
  const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) return clearInterval(interval);
    const particleCount = 50 * (timeLeft / duration);
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: {
          x: randomInRange(0.1, 0.3),
          y: Math.random() - 0.2,
        },
      }),
    );
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: {
          x: randomInRange(0.7, 0.9),
          y: Math.random() - 0.2,
        },
      }),
    );
  }, 250);
}

async function checkAndDisplayDiceLosses(tour, previousDiceCounts, identites) {
  if (!tour.lesDes) return;

  for (let j = 0; j < 4; j++) {
    const desId = "Des" + j;
    if (!tour.lesDes[desId]) continue;

    const currentCount = tour.lesDes[desId][1];

    if (currentCount < previousDiceCounts[j]) {
      const lostAmount = previousDiceCounts[j] - currentCount;
      const playerNode = DOM.players[j];

      // Mise à jour visuelle instantanée : on retire les dés perdus sur la table
      if (playerNode) {
        const rowDice = playerNode.querySelectorAll(".dice-row .dice");
        const resDice = playerNode.querySelectorAll(".dice-result img");
        for (let k = 0; k < lostAmount; k++) {
          // Animation explosion sur la table
          if (rowDice[rowDice.length - 1 - k]) {
            let d = rowDice[rowDice.length - 1 - k];
            d.classList.add("explosion-dice");
            setTimeout(() => d.remove(), 800 / window.gameSpeedMultiplier);
          }
          // Animation explosion sur les petits dés résultats
          if (resDice[resDice.length - 1 - k]) {
            let r = resDice[resDice.length - 1 - k];
            r.classList.add("explosion-dice");
            setTimeout(() => r.remove(), 800 / window.gameSpeedMultiplier);
          }
        }
      }

      if (currentCount === 0) {
        await displayMessage(
          `<span style="color:#ff4444;"> ${identites[j]} a perdu son dernier dé...<br>ÉLIMINÉ !</span>`,
          4000,
        );
      }

      // PALIFICO : uniquement au passage vers 1 dé
      // PALIFICO : uniquement au passage de 2 dés vers 1 dé
      else if (previousDiceCounts[j] === 2 && currentCount === 1) {
        if (playerNode) {
          const palificoIcon = playerNode.querySelector(".palifico");

          if (palificoIcon) {
            palificoIcon.classList.remove("active");

            void palificoIcon.offsetWidth;

            palificoIcon.classList.add("active");
          }
        }

        await displayMessage(
          `
          <div style="
            color:#ffcc00;
            font-size:4rem;
            text-shadow:0 0 20px red;
          ">
            PALIFICO !
          </div>

          <div style="
            margin-top:20px;
            color:white;
            font-size:2rem;
          ">
            ${identites[j]} n'a plus qu'un seul dé !
          </div>
          `,
          5000,
        );
      } else {
        await displayMessage(
          `<span style="color:#ffa844;"> ${identites[j]} a perdu ${lostAmount} dé(s) !<br>Il lui en reste ${currentCount}</span>`,
          4000,
        );
      }
      previousDiceCounts[j] = currentCount;
    }
  }
}


 //Cinématique : Déplace le spotlight et secoue les dés un par un

async function animateDiceShakingSequential(tour, spotlight) {
  if (!tour.lesDes) return;

  // 1. Allume le spotlight au centre
  spotlight.update({ x: 50, y: 50 });
  spotlight.animate(
    { opacity: 1, clearRadius: 250 },
    600 / window.gameSpeedMultiplier,
  );
  await delay(600);

  // 2. Parcourt chaque joueur
  for (let j = 0; j < 4; j++) {
    const desId = "Des" + j;
    if (!tour.lesDes[desId]) continue;

    const playerData = tour.lesDes[desId];
    const nbDes = playerData[1];
    const diceValues = playerData.slice(2).filter((val) => val !== 0);
    const playerNode = DOM.players[j];

    if (playerNode) {
      const palificoIcon = playerNode.querySelector(".palifico");

      if (palificoIcon) {
        palificoIcon.classList.remove("active");
      }
    }

    if (!playerNode) continue;

    if (nbDes > 0) {
      // A. Calcul dynamique des coordonnées pour avoir le focus hyper centré
      const coords = getElemCenterPos(playerNode);

      spotlight.animate(
        { x: coords.x, y: coords.y, clearRadius: 180 },
        500 / window.gameSpeedMultiplier,
      );
      await delay(500);

      shake(playerNode, diceValues);
      await delay(1500);
    } else {
      renderDice(playerNode, []);
    }
  }



  // 3. Rallume la salle
  spotlight.animate(
    { opacity: 0, clearRadius: 500 },
    800 / window.gameSpeedMultiplier,
  );
  await delay(800);
}

async function playAnnouncements(annonces, identites) {
  if (!annonces) return;

  for (const annonceInfo of annonces) {
    const [idJoueur, quantite, valeurDe] = annonceInfo;

    const playerNode = DOM.players[idJoueur];
    const bubble = playerNode.querySelector(".bubble");

    let texte = "";

    if (quantite === -1) {
      texte = "MENTEUR !";
    } else if (valeurDe === 1) {
      texte = `${quantite} Paco`;
    } else {
      texte = `${quantite} ${valeurDe}`;
    }

    bubble.textContent = texte;

    const isLeft = playerNode.closest(".corner").className.includes("left");

    // Utiliser les classes left/right qui contiennent les animations CSS
    // isLeft = le joueur est à gauche de l'écran, on veut que la bulle aille vers la droite (le centre)
    bubble.classList.remove("left", "right");
    void bubble.offsetWidth;

    if (isLeft) {
      bubble.classList.add("left"); // Va vers la droite (le centre)
    } else {
      bubble.classList.add("right"); // Va vers la gauche (le centre)
    }

    await delay(2200);
  }
}

async function playPerudoMatch() {
  try {
    const response = await fetch("partie.json");
    if (!response.ok) throw new Error(`Erreur réseau : ${response.status}`);

    const data = await response.json();
    const identites = data.identite;

    DOM.players.forEach((playerNode, index) => {
      const pseudoElement = playerNode.querySelector(".pseudo");

      if (pseudoElement && identites[index]) {
        pseudoElement.textContent = identites[index];
      }
    });

    let previousDiceCounts = [5, 5, 5, 5];

    const mainSpotlight = window.createSpotlight({
      opacity: 0,
      followMouse: false,
      clearRadius: 150,
      fadeWidth: 100,
    });

    for (let i = 0; i < data.tours.length; i++) {
      const tour = data.tours[i];

      if (i > 0) {
        await checkAndDisplayDiceLosses(tour, previousDiceCounts, identites);
      }

      // Affiche le début de la manche
      await displayMessage(
        `Lancement de la <br> <span style="font-size: 4rem;">Manche ${i + 1}</span>`,
        2500,
      );

      // Secoue chaque gobelet et révèle les dés sous la lumière
      await animateDiceShakingSequential(tour, mainSpotlight);

      // NOUVEAUTÉ : Fait revenir les gobelets sur la table immédiatement après la révélation
      // (animation reverse) pour cacher les dés aux autres avant le début des enchères !
      applyDropAnimationToAll();
      await delay(1000);

      // Lecture des enchères (les dés sont maintenant bien cachés sous les gobelets)
      await playAnnouncements(tour.annonces, identites);
    }

    await displayWinner(identites[data.gagnant]);
  } catch (error) {
    console.error("Erreur critique:", error);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  // Création du panel de contrôle de la vitesse
  const speedMenu = document.createElement("div");
  speedMenu.style.position = "absolute";
  speedMenu.style.bottom = "20px";
  speedMenu.style.right = "20px";
  speedMenu.style.zIndex = "1000";
  speedMenu.style.background = "rgba(0,0,0,0.6)";
  speedMenu.style.padding = "10px";
  speedMenu.style.borderRadius = "8px";
  speedMenu.style.color = "white";
  speedMenu.style.fontFamily = "monospace";
  speedMenu.style.fontSize = "16px";

  speedMenu.innerHTML = `
    Vitesse :
    <button onclick="setSpeedMultiplier(1)" style="margin-left:5px; cursor:pointer;">x1</button>
    <button onclick="setSpeedMultiplier(2)" style="margin-left:5px; cursor:pointer;">x2</button>
    <button onclick="setSpeedMultiplier(4)" style="margin-left:5px; cursor:pointer;">x4</button>
    <button onclick="setSpeedMultiplier(8)" style="margin-left:5px; cursor:pointer;">x8</button>
  `;
  document.body.appendChild(speedMenu);

  setTimeout(playPerudoMatch, 1000);
});
