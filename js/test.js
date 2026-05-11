<<<<<<< HEAD
// ==========================================
// 1. UTILITAIRES ET CONFIGURATION
// ==========================================
const delay = (ms = 1000) => new Promise((res) => setTimeout(res, ms));
=======

const delay = (ms = 1000) => new Promise(res => setTimeout(res, ms));
>>>>>>> c90f990e03e00d435507f308e389ded0503c32f0

async function playPerudoMatch() {
  try {
    const response = await fetch("partie.json");

    if (!response.ok) {
      throw new Error(`Erreur réseau : ${response.status}`);
    }

    const data = await response.json();
    const identites = data.identite;
    const playersNodes = document.querySelectorAll(".player");
    const announcementEl = document.getElementById("announcement");

    let previousDiceCounts = [5, 5, 5, 5];

    for (let i = 0; i < data.tours.length; i++) {
      const tour = data.tours[i];

      // perte de dés
      if (i > 0 && tour.lesDes) {
        for (let j = 0; j < 4; j++) {
          const desId = "Des" + j;

          if (tour.lesDes[desId]) {
            const currentCount = tour.lesDes[desId][1];

            if (currentCount < previousDiceCounts[j]) {
              const lostAmount = previousDiceCounts[j] - currentCount;

              if (currentCount === 0) {
                announcementEl.innerHTML = `<span style="color:#ff4444;">${identites[j]} est éliminé !</span>`;
              } else {
                announcementEl.innerHTML = `<span style="color:#ffa844;">${identites[j]} perd ${lostAmount} dé(s)</span>`;
              }

              await delay(3000);
              previousDiceCounts[j] = currentCount;
            }
          }
        }
      }

      // annonce manche
      announcementEl.innerHTML = `Manche ${i + 1}`;
      await delay(2000);
      announcementEl.textContent = "";

      // dés
      if (tour.lesDes) {
        for (let j = 0; j < 4; j++) {
          const desId = "Des" + j;

          if (tour.lesDes[desId]) {
            const playerData = tour.lesDes[desId];
            const nbDes = playerData[1];

            const diceValues = playerData.slice(2).filter(v => v !== 0);

            if (playersNodes[j] && nbDes > 0) {
              shake(playersNodes[j], diceValues);
            } else if (playersNodes[j]) {
              renderDice(playersNodes[j], []);
            }
          }
        }
      }

      await delay(800);

      // annonces IA
      if (tour.annonces) {
        for (let a = 0; a < tour.annonces.length; a++) {
          const [idJoueur, quantite, valeurDe] = tour.annonces[a];
          const nom = identites[idJoueur];

          if (quantite === -1) {
            announcementEl.innerHTML = `${nom} : DUDO !`;
            showBubble(playersNodes[idJoueur], "DUDO !");
            await delay(2500);
          } else {
            const texte = valeurDe === 1 ? "Paco" : `dé ${valeurDe}`;
            announcementEl.innerHTML = `${nom} : ${quantite}x ${texte}`;
            showBubble(playersNodes[idJoueur], `${quantite}x ${texte}`);
            await delay(3000);
          }
        }
      }
    }

    announcementEl.innerHTML = `🏆 ${identites[data.gagnant]} gagne !`;

  } catch (error) {
    console.error("Erreur:", error);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  setTimeout(playPerudoMatch, 1000);
const DOM = {
  announcement: document.getElementById("announcement"),
  players: document.querySelectorAll(".player"),
};

// Calcule mathématiquement le centre exact en vw/vh d'un gobelet selon la taille de ton écran
function getElemCenterPos(element) {
  const rect = element.getBoundingClientRect();
  const pixelX = rect.left + rect.width / 2;
  const pixelY = rect.top + rect.height / 2;
  return {
    x: (pixelX / window.innerWidth) * 100,
    y: (pixelY / window.innerHeight) * 100,
  };
}

// Fonction pour faire rentrer tous les gobelets depuis l'extérieur vers la table
function applyDropAnimationToAll() {
  DOM.players.forEach((playerNode) => {
    const glass = playerNode.querySelector(".glass");
    const containerClass = playerNode.closest(".corner").className;

    if (glass) {
      glass.classList.remove("lift1", "lift2", "cover", "shake");

      // On relance l'animation en la retirant d'abord pour forcer le reflow
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
  e;
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
          if (rowDice[rowDice.length - 1 - k])
            rowDice[rowDice.length - 1 - k].remove();
          if (resDice[resDice.length - 1 - k])
            resDice[resDice.length - 1 - k].remove();
        }
      }

      if (currentCount === 0) {
        await displayMessage(
          `<span style="color:#ff4444;"> ${identites[j]} a perdu son dernier dé...<br>ÉLIMINÉ !</span>`,
          4000,
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

/**
 * Cinématique : Déplace le spotlight et secoue les dés un par un
 */
async function animateDiceShakingSequential(tour, spotlight) {
  if (!tour.lesDes) return;

  // 1. Allume le spotlight au centre
  spotlight.update({ x: 50, y: 50 });
  spotlight.animate({ opacity: 1, clearRadius: 250 }, 600);
  await delay(600);

  // 2. Parcourt chaque joueur
  for (let j = 0; j < 4; j++) {
    const desId = "Des" + j;
    if (!tour.lesDes[desId]) continue;

    const playerData = tour.lesDes[desId];
    const nbDes = playerData[1];
    const diceValues = playerData.slice(2).filter((val) => val !== 0);
    const playerNode = DOM.players[j];

    if (!playerNode) continue;

    if (nbDes > 0) {
      // A. Calcul dynamique des coordonnées pour avoir le focus hyper centré
      const coords = getElemCenterPos(playerNode);

      spotlight.animate({ x: coords.x, y: coords.y, clearRadius: 180 }, 500);
      await delay(500);

      shake(playerNode, diceValues);
      await delay(1500);
    } else {
      renderDice(playerNode, []);
    }
  }

  // Plus besoin de coverAllCups() ici, car les dés restent affichés pendant les enchères
  // Les gobelets reviendront d'eux-mêmes au début de la manche suivante !

  // 3. Rallume la salle
  spotlight.animate({ opacity: 0, clearRadius: 500 }, 800);
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

    const isLeft = playerNode.closest(".corner").className.includes("left");

    bubble.classList.remove("bubble-left", "bubble-right");

    if (isLeft) {
      bubble.classList.add("bubble-left");
    } else {
      bubble.classList.add("bubble-right");
    }

    bubble.textContent = texte;

    // relance l'animation
    bubble.classList.remove("show");
    void bubble.offsetWidth;
    bubble.classList.add("show");

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

<<<<<<< HEAD
window.addEventListener("DOMContentLoaded", () => {
  setTimeout(playPerudoMatch, 1000);
});
=======
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(playPerudoMatch, 1000);
});});
>>>>>>> c90f990e03e00d435507f308e389ded0503c32f0
