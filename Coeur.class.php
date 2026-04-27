<?php
class Coeur extends Joueur
{
  protected $probabilite;
  protected $nbDesAdverse;
  protected $nbDesTotal;
  protected $minProba;
  protected $minProbaJoué;

  public function __construct()
  {
    $this->probabilite = $this->majTableProbabilite();
    $this->nbDesAdverse = 15;
    $this->nbDesTotal = 20;

    $this->minProba = 0.55;
    $this->minProbaJoué = 0.55;
  }

  protected function historique($coupsJoues, $nbDesParJoueur)
  {
    $this->nbDesTotal = array_sum($nbDesParJoueur);
    $this->nbDesAdverse = array_sum($nbDesParJoueur) - $this->nbDes;
  }
  //$coupsJoues est un tableau de l'historique des coups
  //$nbDesParJoueur est un tableau d'entiers


  protected function evaluer($qte, $val, $palifico, $nbDes) {}
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

  public function decision()
  {
    $probaTab = $this->majTableProbabilite();
    $coupsJouable = [];
    foreach ($probaTab as $item) {
      if ($item[1] > $this->minProba) {
        array_push($coupsJouable, $item);
      }
    }
    print_r($coupsJouable);
  }
}
