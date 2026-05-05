const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function playPerudoMatch() {
<<<<<<< HEAD
  try {
    const response = await fetch("partie.json");
    if (!response.ok) {
      throw new Error(`Erreur réseau : ${response.status}`);
=======
    try {
        const response = await fetch('partie.json');
        if (!response.ok) {
            throw new Error(`Erreur réseau : ${response.status}`);
        }
        
        const data = await response.json();
        const identites = data.identite; // ["Pique", "Coeur", ... ]
        const playersNodes = document.querySelectorAll(".player");
        const announcementEl = document.getElementById('announcement');
        
        // On mémorise le nombre de dés initiaux pour détecter les pertes
        let previousDiceCounts = [5, 5, 5, 5];

        // On parcourt chaque Tour/Manche
        for (let i = 0; i < data.tours.length; i++) {
            const tour = data.tours[i];
            
            // --- NOUVEAUTÉ : Vérification de la perte d'un dé (après le Dudo de la manche d'avant) ---
            if (i > 0 && tour.lesDes) {
                for (let j = 0; j < 4; j++) {
                    const desId = 'Des' + j;
                    if (tour.lesDes[desId]) {
                        const currentCount = tour.lesDes[desId][1]; // index 1 = nb de dés restants
                        if (currentCount < previousDiceCounts[j]) {
                            const lostAmount = previousDiceCounts[j] - currentCount;
                            
                            if (currentCount === 0) {
                                // Le joueur tombe à 0 dé, il est éliminé
                                announcementEl.innerHTML = `<span style="color:#ff4444;"> ${identites[j]} a perdu son dernier dé...<br>ÉLIMINÉ !</span>`;
                            } else {
                                // Le joueur perd juste un dé
                                announcementEl.innerHTML = `<span style="color:#ffa844;"> ${identites[j]} a perdu ${lostAmount} dé(s) !<br>Il lui en reste ${currentCount}</span>`;
                            }
                            await delay(4000); // On laisse le verdict afficher 4 secondes
                            
                            // On met à jour notre mémoire avec le nouveau compte
                            previousDiceCounts[j] = currentCount;
                        }
                    }
                }
            }

            // Début Annonce manche
            announcementEl.innerHTML = `Lancement de la </br> <span style="font-size: 4rem;">Manche ${i + 1}</span>`;
            await delay(2500);
            announcementEl.textContent = "";

            // 1. Mise à jour et secousse des dés pour le nouveau tour
            if (tour.lesDes) {
                for (let j = 0; j < 4; j++) {
                    const desId = 'Des' + j;
                    if (tour.lesDes[desId]) {
                        const playerData = tour.lesDes[desId];
                        const nbDes = playerData[1];
                        
                        // On prend les dés et on retire les 0 "vides"
                        const diceValues = playerData.slice(2).filter(val => val !== 0);
                        
                        // On secoue s'il lui reste des dés
                        if (playersNodes[j] && nbDes > 0) {
                            shake(playersNodes[j], diceValues);
                        } else if (playersNodes[j]) {
                            renderDice(playersNodes[j], []); 
                        }
                    }
                }
            }

            // On laisse le temps à l'animation de finir
            await delay();

            // 2. Annonces des différentes IA
            if (tour.annonces) {
                for (let a = 0; a < tour.annonces.length; a++) {
                    const annonceInfo = tour.annonces[a];
                    const idJoueur = annonceInfo[0];
                    const quantite = annonceInfo[1];
                    const valeurDe = annonceInfo[2];
                    const nomJoueur = identites[idJoueur];

                    if (quantite === -1) {
                        // Le joueur crie DUDO
                        announcementEl.innerHTML = `<span style="color:red;"> ${nomJoueur} crie DUDO !</span> (Menteur)`;
                        await delay(3500); 
                    } else {
                        // Annonce classique
                        let deTexte = valeurDe === 1 ? "Paco(s)" : `dé(s) de ${valeurDe}`;
                        announcementEl.innerHTML = `${nomJoueur} annonce : <br><strong>${quantite}x</strong> ${deTexte}`;
                        await delay(2000);
                    }
                }
            }
        }
        
        announcementEl.innerHTML = `<span style="font-size: 5rem; text-shadow: 0 0 10px gold;"></span><br>La partie est terminée !<br>Vainqueur : <strong style="color:gold;">${identites[data.gagnant]}</strong>`;

    } catch (error) {
        console.error("Erreur de décodage:", error);
>>>>>>> 02253893db6d92b2f86631e44d168253da57d0f8
    }

    const data = await response.json();
    const identites = data.identite; // ["Pique", "Coeur", ... ]
    const playersNodes = document.querySelectorAll(".player");
    const announcementEl = document.getElementById("announcement");

    // On mémorise le nombre de dés initiaux pour détecter les pertes
    let previousDiceCounts = [5, 5, 5, 5];

    // On parcourt chaque Tour/Manche
    for (let i = 0; i < data.tours.length; i++) {
      const tour = data.tours[i];

      // --- NOUVEAUTÉ : Vérification de la perte d'un dé (après le Dudo de la manche d'avant) ---
      if (i > 0 && tour.lesDes) {
        for (let j = 0; j < 4; j++) {
          const desId = "Des" + j;
          if (tour.lesDes[desId]) {
            const currentCount = tour.lesDes[desId][1]; // index 1 = nb de dés restants
            if (currentCount < previousDiceCounts[j]) {
              const lostAmount = previousDiceCounts[j] - currentCount;

              if (currentCount === 0) {
                // Le joueur tombe à 0 dé, il est éliminé
                announcementEl.innerHTML = `<span style="color:#ff4444;"> ${identites[j]} a perdu son dernier dé...<br>ÉLIMINÉ !</span>`;
              } else {
                // Le joueur perd juste un dé
                announcementEl.innerHTML = `<span style="color:#ffa844;"> ${identites[j]} a perdu ${lostAmount} dé(s) !<br>Il lui en reste ${currentCount}</span>`;
              }
              await delay(4000); // On laisse le verdict afficher 4 secondes

              // On met à jour notre mémoire avec le nouveau compte
              previousDiceCounts[j] = currentCount;
            }
          }
        }
      }

      // Début Annonce manche
      announcementEl.innerHTML = `Lancement de la </br> <span style="font-size: 4rem;">Manche ${i + 1}</span>`;
      await delay(2500);
      announcementEl.textContent = "";

      // 1. Mise à jour et secousse des dés pour le nouveau tour
      if (tour.lesDes) {
        for (let j = 0; j < 4; j++) {
          const desId = "Des" + j;
          if (tour.lesDes[desId]) {
            const playerData = tour.lesDes[desId];
            const nbDes = playerData[1];

            // On prend les dés et on retire les 0 "vides"
            const diceValues = playerData.slice(2).filter((val) => val !== 0);

            // On secoue s'il lui reste des dés
            if (playersNodes[j] && nbDes > 0) {
              shake(playersNodes[j], diceValues);
            } else if (playersNodes[j]) {
              renderDice(playersNodes[j], []);
            }
          }
        }
      }

      // On laisse le temps à l'animation de finir
      await delay();

      // 2. Annonces des différentes IA
      if (tour.annonces) {
        for (let a = 0; a < tour.annonces.length; a++) {
          const annonceInfo = tour.annonces[a];
          const idJoueur = annonceInfo[0];
          const quantite = annonceInfo[1];
          const valeurDe = annonceInfo[2];
          const nomJoueur = identites[idJoueur];

          if (quantite === -1) {
            // Le joueur crie DUDO
            announcementEl.innerHTML = `<span style="color:red;"> ${nomJoueur} crie DUDO !</span> (Menteur)`;
            await delay(3500);
          } else {
            // Annonce classique
            let deTexte = valeurDe === 1 ? "Paco(s)" : `dé(s) de ${valeurDe}`;
            announcementEl.innerHTML = `${nomJoueur} annonce : <br><strong>${quantite}x</strong> ${deTexte}`;
            await delay(2000);
          }
        }
      }
    }

    announcementEl.innerHTML = `<span style="font-size: 5rem; text-shadow: 0 0 10px gold;"></span><br>La partie est terminée !<br>Vainqueur : <strong style="color:gold;">${identites[data.gagnant]}</strong>`;
  } catch (error) {
    console.error("Erreur de décodage:", error);
  }
}

// On lance quand la page est chargée
window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    playPerudoMatch();
  }, 1000);
});
