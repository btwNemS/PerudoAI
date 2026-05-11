<?php

function corner($class, $color, $dice)
{
?>
  <div class="corner <?= $class ?>">

    <div class="player" data-color="<?= $color ?>" data-side="<?= $class ?>">
      <div class="bubble"></div>

      <div class="dice-container">

        <div class="tray">
          <div class="dice-row">
            <?php foreach ($dice as $d): ?>
              <div class="dice <?= $color ?>">
                <img src="assets/images/dice<?= $d ?>.png">
              </div>
            <?php endforeach; ?>
          </div>
        </div>

        <div class="glass <?= $color ?>">
          <img src="assets/images/glass.png">
        </div>


        <div class="player-info">
          <span class="pseudo"></span>

          <div class="dice-result <?= $color ?>"></div>
        </div>
      </div>
    </div>

  </div>
<?php
}
