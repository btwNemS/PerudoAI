<?php
require_once("Joueur.php");
class Coeur extends Joueur
{
  protected $probabilite;
  protected $nbDesAdverse;
  protected $nbDesTotal;
  protected $indiceBluff = 0.25;
  protected $indiceBluffTab;
  protected $minProba;
  protected $minProbaJoue;
  protected $coupPrecedent; //[Q, V]
  protected $coupsJoues;
  protected $nbDesDebutManche;
  protected $lissagePondere;

  protected $weightValue;
  protected $ownedDiceBonus;
  protected $trustPaco;

  public function __construct()
  {
    parent::__construct("Coeur");
    $this->probabilite = $this->majTableProbabilite();
    $this->nbDesAdverse = 15;
    $this->nbDesTotal = 20;
    $this->indiceBluffTab = [0.25, 0.25, 0.25, 0.25];
    $this->coupPrecedent = [1, 2];
    $this->nbDesDebutManche = [5, 5, 5, 5];
    //PARAMETRES
    $this->minProba = 0.65; //seuil minimal pour considérer qu’un coup est crédible
    $this->minProbaJoue = 0.01; // seuil minimal pour accepter de continuer la partie sans dénoncer un bluff
    $this->lissagePondere = 2;
    $this->weightValue = 1.15;
    $this->ownedDiceBonus = 0.75;
    $this->trustPaco = 1;
  }

  public function historique($coupsJoues, $nbDesParJoueur)
  {
    $this->coupsJoues = $coupsJoues;

    $this->nbDesTotal = array_sum($nbDesParJoueur);
    $this->nbDesAdverse = array_sum($nbDesParJoueur) - $this->nbDes;


    return $this->coupsJoues;
  }
  //$coupsJoues est un tableau de l'historique des coups
  //$nbDesParJoueur est un tableau d'entiers

  public function evaluer($qte, $val, $palifico, $nbDes)
  {
    if (!empty($this->coupsJoues)) {
      $dernierCoup = end($this->coupsJoues);
      $this->coupPrecedent = [$dernierCoup[1], $dernierCoup[2]];
    } else {
      $this->coupPrecedent = [0, 0];
    }

    $this->probabilite = $this->majTableProbabilite($palifico);
    $coup = $this->decision($palifico);

    if (empty($coup)) {
      return [1, 2]; // valeur de secours
    }

    if ($coup[0] === -1) {
      return [-1, 0];
    }
    return $coup[0];
  }
  //$palifico est un booleen, retourne un tableau de 2 cases contenant la nouvelle quantité et la nouvelle valeur

  function factorielle($n)
  {
    if ($n < 0) {
      return;
    }
    $result = 1;
    for ($i = 2; $i <= $n; $i++) {
      $result *= $i;
    }
    return $result;
  }

  public function setMesDes($des)
  {
    $this->mesDes = $des;
  }

  public function setNbDesAdverse($nb)
  {
    $this->nbDesAdverse = $nb;
  }

  /**
   * Calcule la probabilité que V soit présent au moins Q fois parmi la partie total
   * en prenant compte de nos dés connu et des pacos présent.
   */
  public function paireProbabilite($Q, $V, $palifico)
  {
    $probabiliteTotal = 0;

    $counts = array_count_values($this->mesDes);
    if ($palifico) {
      $z = $counts[1] ?? 0;
      $p = 1 / 6;
    } elseif ($V == 1) {
      $z = $counts[1] ?? 0;
      $p = 1 / 4;
    } else {
      $z = ($counts[$V] ?? 0) + ($counts[1] ?? 0);
      $p = 1 / 3;
    }

    $k = $Q;
    $y_min = max(0, $k - $z);
    $x = $this->nbDesAdverse;

    for ($y = $y_min; $y <= $x; $y++) {

      $coefBinomial = $this->factorielle($x) /
        ($this->factorielle($y) * $this->factorielle($x - $y));

      $termeProbabilite =
        $p ** $y * (1 - $p) ** ($x - $y);

      $probabiliteTotal += $coefBinomial * $termeProbabilite;
    }

    return $probabiliteTotal;
  }
  /**
   * Créer un tableau de chacune des probabilités supérieurs à 0, sous la forme 
   * [[Q, V], proba]
   */
  public function majTableProbabilite($palifico = null)
  {
    $probabilite = [];
    for ($i = 1; $i <= $this->nbDesTotal; $i++) {
      for ($j = 1; $j <= 6; $j++) {
        $proba = $this->paireProbabilite($i, $j, $palifico);
        if ($proba != 0) {
          $valeur = [[$i, $j], $proba];
          array_push($probabilite, $valeur);
        }
      }
    }
    return $probabilite;
  }
  /**
   * Pondère les coups possible en fonction de leurs probabilité,
   * plus un coup jouable a de chance d'existé, plus il sera tiré
   */
  private function tirerCoup($coupsJouables)
  {
    $counts = array_count_values($this->mesDes);

    $total = 0;

    foreach ($coupsJouables as $item) {

      $valeur = $item[0][1];

      // poids de base = probabilité
      $poids = pow($item[1], $this->lissagePondere);

      // nombre de dés personnels correspondant
      if ($valeur == 1) {
        $nbPerso = $counts[1] ?? 0;
      } else {
        // les pacos comptent aussi
        $nbPerso = ($counts[$valeur] ?? 0) + ($counts[1] ?? 0);
      }

      // bonus multiplicatif
      $bonus = 1 + ($nbPerso * $this->ownedDiceBonus);

      $qte = $item[0][0];
      $val = $item[0][1];

      $poidsFinal = $poids * $bonus;

      if ($qte == $this->coupPrecedent[0]) {
        $poidsFinal *= $this->weightValue;
      }

      $total += $poidsFinal;

      $poidsCoups[] = [$item, $poidsFinal];
    }

    $rand = mt_rand() / mt_getrandmax() * $total;

    $cumul = 0;

    foreach ($poidsCoups as [$item, $poids]) {

      $cumul += $poids;

      if ($rand <= $cumul) {
        return $item;
      }
    }

    return end($coupsJouables);
  }
  /**
   * A FAIRE :
   *  - notre indice de bluff
   */
  private function coupAutorise($coup, $precedent, $palifico = false)
  {
    $q  = $coup[0];
    $v  = $coup[1];
    $q0 = $precedent[0];
    $v0 = $precedent[1];

    // Premier coup
    if ($q0 == 0) {
      if (!$palifico && $v == 1) {
        return false;
      }

      return true;
    }

    // Mode palifico :
    // la valeur doit rester identique au coup précédent
    if ($palifico && $v != $v0) {
      return false;
    }

    // Passage de n'importe quelle valeur vers paco
    if ($v0 != 1 && $v == 1) {
      return $q >= ceil($q0 / 2);
    }

    // Passage de paco vers une autre valeur
    if ($v0 == 1 && $v != 1) {
      return $q >= ($q0 * 2 + 1);
    }

    return ($q >= $q0 && $v >= $v0) && ($q > $q0 || $v > $v0);
  }

  public function decision($palifico)
  {
    $probaTab = $this->probabilite;

    $joueurAccuse = null;

    if (!empty($this->coupsJoues)) {
      $dernierCoup = end($this->coupsJoues);
      $joueurAccuse = $dernierCoup[0];
    }

    $prudence = 1 - ((5 - $this->nbDes) * 0.2);

    $this->minProba = 0.7 ** $prudence;

    if ($joueurAccuse !== null) {
      $indice = $this->indiceBluffTab[$joueurAccuse];

      // Seuil méfiance nouveau 
      if ($palifico) {
          $mefianceMin = 0.05; // Base basse (1 ne sont pas des jokers)
          $mefianceMax = 0.20; 
      } else {
          $mefianceMin = 0.20; // Base haute
          $mefianceMax = 0.45; 
      }

      $seuilMefiance = $mefianceMin + (($indice - 0.05) / (0.90 - 0.05)) * ($mefianceMax - $mefianceMin);
      $seuilMefiance = max($mefianceMin, min($mefianceMax, $seuilMefiance));

      // Paco plus crédible
      if ($this->coupPrecedent[1] == 1) {
        $seuilMefiance *= $this->trustPaco;
      }

      $counts = array_count_values($this->mesDes);

      $valeurAnnoncee = $this->coupPrecedent[1];

      if ($valeurAnnoncee == 1) {

        // les 1 comptent seulement comme des 1
        $nbPerso = $counts[1] ?? 0;
      } else {

        // les 1 servent de jokers
        $nbPerso =
          ($counts[$valeurAnnoncee] ?? 0)
          + ($counts[1] ?? 0);
      }

      // plus j'ai de dés compatibles,
      // moins je dois accuser
      $seuilMefiance /= (1 + 4 * $nbPerso);
    }

    foreach ($probaTab as $item) {

      if ($item[0] == $this->coupPrecedent) {

        $probaAnnonce = $item[1];

        if ($nbPerso >= $this->coupPrecedent[0]) {
          break;
        }

        if ($nbPerso >= 3 && $probaAnnonce > 0.02) {
          break;
        }

        if ($seuilMefiance > $probaAnnonce) {
          return [-1, 0];
        }

        break;
      }
    }

    $coupsJouables = [];

    foreach ($probaTab as $item) {

      if (
        $item[1] > $this->minProba &&
        $this->coupAutorise(
          $item[0],
          $this->coupPrecedent,
          $palifico
        )
      ) {
        array_push($coupsJouables, $item);
      }
    }

    if (empty($coupsJouables)) {
      return [-1, 0];
    }

    return $this->tirerCoup($coupsJouables);
  }

  public function calcIndiceBluff($nbDesParJoueur)
  {
    //on attend d'avoir plus de tours pour analyser
    if (count($this->coupsJoues) < 2) return;

    $modif = 0.05;
    $indiceMin = 0.05;
    $indiceMax = 0.90;

    for ($i = 1; $i < count($this->coupsJoues); $i++) {
      $coup       = $this->coupsJoues[$i];
      $coupAvant  = $this->coupsJoues[$i - 1];

      // on cherche une accusation de bluff
      if ($coup[1] !== -1) continue;

      $joueurAccusateur = $coup[0];    // celui qui accuse
      $joueurAccuse     = $coupAvant[0]; //l'accusé

      // On ignore si on s'accuse soi-même 
      if ($joueurAccusateur === $joueurAccuse) continue;

      // si le joueur accusé perd un dé il bluffait bien
      $desAvant = $this->nbDesDebutManche[$joueurAccuse];
      $desApres = $nbDesParJoueur[$joueurAccuse];
      $bluffConfirme = ($desApres < $desAvant);

      if ($bluffConfirme) {
        $this->indiceBluffTab[$joueurAccuse] = min(
          $indiceMax,
          $this->indiceBluffTab[$joueurAccuse] + $modif
        );
      } else {
        // si l'accusé bluffait pas on lui fait confiance et réduit son indice
        $this->indiceBluffTab[$joueurAccuse] = max(
          $indiceMin,
          $this->indiceBluffTab[$joueurAccuse] - $modif
        );
      }
    }

    $this->nbDesDebutManche = $nbDesParJoueur;
  }
}
