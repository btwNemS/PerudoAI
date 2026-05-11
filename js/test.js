const delay = (ms) => new Promise((res) => setTimeout(res, ms));

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
});