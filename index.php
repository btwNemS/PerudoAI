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
  corner("top-left", "yellow", [0, 0, 0, 0, 0]);
  corner("bottom-left", "green", [0, 0, 0, 0, 0]);
  corner("bottom-right", "red", [0, 0, 0, 0, 0]);
  corner("top-right", "blue", [0, 0, 0, 0, 0]);
  ?>
<<<<<<< HEAD


  <div class="bubble"></div>

=======
  
>>>>>>> c90f990e03e00d435507f308e389ded0503c32f0

  <div id="announcement"></div>
  <canvas id="bg"></canvas>

  <script src="./js/crt.js"></script>
  <script src="./js/shader.js"></script>
  <script src="./js/corner.js" defer></script>
  <script src="./js/spotlight.js"></script>

  <script src="./js/bubble.js"></script>

  <script src="./js/test.js" defer></script>
</body>

</html>