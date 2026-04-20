<?php

require_once("Coeur.class.php");

class Joueur
{
  protected $nbDes = 5;
}

$bot = new Coeur();

$bot->setMesDes([1, 2, 2, 2, 5]);

$bot->setNbDesAdverse(15);

$result = $bot->paireProbabilite(5, 2);

echo "Probabilité : " . $result . PHP_EOL;
