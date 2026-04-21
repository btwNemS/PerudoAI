<?php

require_once("Joueur.php");
require_once("Coeur.class.php");

$bot = new Coeur();

$bot->setMesDes([1, 2, 2, 2, 6]);

$bot->setNbDesAdverse(15);

$result = $bot->majTableProbabilite();

foreach ($result as $element) {
  $x = $element[0][0];
  $y = $element[0][1];
  $valeur = round($element[1], 5) * 100;
  echo "[$x][$y] = $valeur%\n";
}
