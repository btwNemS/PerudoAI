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
  protected $autresJoueurs;
  protected $nbDesDebutManche;
  protected $lissagePondere;

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
    $this->minProba = 0.45;
    $this->minProbaJoue = 0.3;
    $this->lissagePondere = 0.5;
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

    $this->probabilite = $this->majTableProbabilite();
    $coup = $this->decision();

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
  public function paireProbabilite($Q, $V)
  {
    $probabiliteTotal = 0;

    $counts = array_count_values($this->mesDes);

    if ($V == 1) {
      $z = $counts[1] ?? 0;
      $p = 1 / 6;
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
  public function majTableProbabilite()
  {
    $probabilite = [];
    for ($i = 1; $i <= $this->nbDesTotal; $i++) {
      for ($j = 1; $j <= 6; $j++) {
        $proba = $this->paireProbabilite($i, $j);
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
    $total = 0;
    foreach ($coupsJouables as $item) {
      $total += pow($item[1], $this->lissagePondere);
    }

    $rand = mt_rand() / mt_getrandmax() * $total;

    $cumul = 0;
    foreach ($coupsJouables as $item) {
      $poidsLisse = pow($item[1], $this->lissagePondere);
      $cumul += $poidsLisse;

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
  private function coupAutorise($coup, $precedent)
  {
    $q  = $coup[0];
    $v  = $coup[1];
    $q0 = $precedent[0];
    $v0 = $precedent[1];

    // Premier coup
    if ($q0 == 0) return true;

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

  public function decision()
  {
    $probaTab = $this->probabilite;

    $joueurAccuse = null;
    if (!empty($this->coupsJoues)) {
      $dernierCoup = end($this->coupsJoues);
      $joueurAccuse = $dernierCoup[0];
    }

    $seuilMefiance = $this->minProbaJoue;

    if ($joueurAccuse !== null) {
      $indice = $this->indiceBluffTab[$joueurAccuse];
      $seuilMefiance = $this->minProbaJoue + ($indice - 0.25) * 0.4;
      $seuilMefiance = max(0.05, min(0.80, $seuilMefiance));
    }

    foreach ($probaTab as $item) {
      if ($item[0] == $this->coupPrecedent) {
        if ($seuilMefiance > $item[1]) {
          return [-1, 0];
        }
      }
    }

    $coupsJouables = [];

    foreach ($probaTab as $item) {
      if (
        $item[1] > $this->minProba &&
        $this->coupAutorise($item[0], $this->coupPrecedent)
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
