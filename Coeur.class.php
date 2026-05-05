<?php
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


  protected $lissagePondere;

  public function __construct()
  {
    $this->probabilite = $this->majTableProbabilite();
    $this->nbDesAdverse = 15;
    $this->nbDesTotal = 20;

    $this->coupPrecedent = [1, 2];

    //PARAMETRES
    $this->minProba = 0.55;
    $this->minProbaJoue = 0.35;
    $this->lissagePondere = 0.25;
  }

  protected function historique($coupsJoues, $nbDesParJoueur)
  {
    $this->coupsJoues = $coupsJoues;

    $this->nbDesTotal = array_sum($nbDesParJoueur);
    $this->nbDesAdverse = array_sum($nbDesParJoueur) - $this->nbDes;

    // return $this->historique;
    return $this->coupsJoues;
  }
  //$coupsJoues est un tableau de l'historique des coups
  //$nbDesParJoueur est un tableau d'entiers



  protected function evaluer($qte, $val, $palifico, $nbDes)
  {
    $dernierCoup = null;
    if (!empty($this->coupsJoues)) {
      $dernierCoup = end($this->coupsJoues);
    }

    $this->coupPrecedent = [$dernierCoup[1], $dernierCoup[2]];
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
  /**
   * Temporaire
   */
  public function setMesDes($des)
  {
    $this->mesDes = $des;
  }
  /**
   * Temporaire
   */
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
   *  - passage de n'importe qui au pako (Q = ceil(Q/2))
   *  - passage de pako à autres (Q = Q * 2 + 1)
   *  - être d'accord avec la proposition
   */
  public function decision()
  {
    $probaTab = $this->majTableProbabilite();
    foreach ($probaTab as $item) {
      if ($item[0] == $this->coupPrecedent) {
        if ($this->minProbaJoue > $item[1]) {
          return [-1, 0];
        }
      }
    }
    $coupsJouables = [];
    foreach ($probaTab as $item) {
      if (
        $item[1] > $this->minProba &&
        $item[0][0] >= $this->coupPrecedent[0] &&
        $item[0][1] >= $this->coupPrecedent[1] &&
        (
          $item[0][0] > $this->coupPrecedent[0] ||
          $item[0][1] > $this->coupPrecedent[1]
        )
      ) {
        array_push($coupsJouables, $item);
      }
    }
    return $this->tirerCoup($coupsJouables);
  }

  public function calcIndiceBluff()
  {
    $this->indiceBluffTab = [];
  }
}
