const {readJsonFile} = require("./jsonReader");

const data = await readJsonFile ("./data.json");

function getMessage(annonce, identites) {
  const [joueur, quantite, valeur] = annonce;

  const nom = identites[joueur];

  if (quantite === -1) {
    return `${nom} : MENTEUR !`;
  }
  else
    if(valeur === -1)
        return `${nom} : Jesuis d'accord !`
  return `${nom} : ${quantite} dés de ${valeur}`;
}