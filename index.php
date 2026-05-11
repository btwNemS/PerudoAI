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
  

  <div id="announcement"></div>
  <canvas id="bg"></canvas>

  <script src="./js/crt.js"></script>
  <script src="./js/shader.js"></script>
  <script src="./js/corner.js" defer></script>
  <script src="./js/spotlight.js"></script>
<<<<<<< HEAD
  <script src="./js/bubble.js"></script>
=======
>>>>>>> 458749beafb977f666b9665c76961bae748f9e1c
  <script src="./js/test.js" defer></script>

    <!-- <script>
    const spotlight = createSpotlight({
      x: 50,
      y: 50,
      clearRadius: 100,
      fadeWidth: 200,
      opacity: 0,
      followMouse: false
    });

    setTimeout(() => {
      spotlight.animate({
        x: 50,
        y: 50,
        clearRadius: 125,
        fadeWidth: 200,
        opacity: 1,
      }, 800);
    }, 1000);

    setTimeout(() => {
      spotlight.animate({
        x: 35,
        y: 20,
        clearRadius: 75,
        fadeWidth: 200,
        opacity: 1,
      }, 800);
    }, 2000);

    setTimeout(() => {
      spotlight.animate({
        x: 65,
        y: 20,
        clearRadius: 75,
        fadeWidth: 200,
        opacity: 1,
      }, 800);
    }, 3000);

    setTimeout(() => {
      spotlight.animate({
        x: 65,
        y: 80,
        clearRadius: 75,
        fadeWidth: 200,
        opacity: 1,
      }, 800);
    }, 4000);

    setTimeout(() => {
      spotlight.animate({
        x: 35,
        y: 80,
        clearRadius: 75,
        fadeWidth: 200,
        opacity: 1,
      }, 800);
    }, 5000);

    setTimeout(() => {
      spotlight.animate({
        x: 50,
        y: 50,
        clearRadius: 125,
        fadeWidth: 200,
        opacity: 1,
      }, 800);
    }, 6000);

    setTimeout(() => {
      spotlight.animate({
        x: 50,
        y: 50,
        clearRadius: 1000,
        fadeWidth: 200,
        opacity: 0,
      }, 800);
    }, 7000);
  </script> -->

</body>

</html>