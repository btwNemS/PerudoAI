<?php
require_once __DIR__ . '/components/corner.php';
?>
<!doctype html>
<html lang="fr">

<head>
  <meta charset="UTF-8">
  <title>Perudolatro</title>

  <link rel="stylesheet" href="./css/style.css">
  <link rel="stylesheet" href="./css/animation.css">
</head>

<body>

  <?php
  corner("top-left", "PIQUE", "yellow", [0, 0, 0, 0, 0]);
  corner("bottom-left", "COEUR", "green", [0, 0, 0, 0, 0]);
  corner("top-right", "TREFLE", "red", [0, 0, 0, 0, 0]);
  corner("bottom-right", "CARREAU", "blue", [0, 0, 0, 0, 0]);
  ?>

  
  <div class="bubble"></div>
  

  <div id="announcement"></div>
  <canvas id="bg"></canvas>

  <script src="./js/crt.js"></script>
  <script src="./js/shader.js"></script>
  <script src="./js/corner.js" defer></script>
  <script src="./js/test.js" defer></script>

</body>

</html>