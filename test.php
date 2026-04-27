<?php

require_once("Joueur.php");
require_once("Coeur.class.php");

$bot = new Coeur();

$bot->setMesDes([1, 2, 2, 2, 6]);

$bot->setNbDesAdverse(15);

$result = $bot->majTableProbabilite();

$max = null;

foreach ($result as $item) {
  if ($max === null || $item[1] > $max[1]) {
    $max = $item;
  }
}

print_r($max);
