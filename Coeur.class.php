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


  private function majTableProbabilite()
  {
    $probabilite = 0;
    return $probabilite;
  }

  /**
   * Explications
   */
  private function paireProbabilite($Q, $V, $nbDes)
  {
    $probabilitePaire = 0;
    $z = array_count_values($this->mesDes)[$V] ?? 0;
    $k = $Q;
    $y = $k - $z;
    $x = $this->nbDesAdverse;

    return $probabilitePaire;
  }
}
