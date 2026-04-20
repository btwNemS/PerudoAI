<?php
class Coeur extends Joueur
{
  protected $probabilite;
  protected $nbDesAdverse;

  public function __construct()
  {
    $this->probabilite = $this->majTableProbabilite();
    $this->nbDesAdverse = 15;
  }

  protected function historique($coupsJoues, $nbDesParJoueur)
  {
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


  private function majTableProbabilite()
  {
    $probabilite = 0;
    return $probabilite;
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
   * Explications
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
}
