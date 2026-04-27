<?php

require_once("Joueur.php");
require_once("Coeur.class.php");

$bot = new Coeur();

$bot->setMesDes([1, 2, 2, 2, 6]);

$bot->setNbDesAdverse(15);

$result = $bot->majTableProbabilite();

$bot->decision();
