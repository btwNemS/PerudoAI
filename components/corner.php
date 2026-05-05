<?php

function corner($class, $pseudo, $color, $dice)
{
?>
  <div class="corner <?= $class ?>">

    <div class="player" data-color="<?= $color ?>">

      <div class="dice-container">

        <div class="tray">
          <div class="dice-row">
            <?php foreach ($dice as $d): ?>
              <div class="dice <?= $color ?>">
                <img src="assets/dice<?= $d ?>.png">
              </div>
            <?php endforeach; ?>
          </div>
        </div>

        <div class="glass <?= $color ?>">
          <img src="assets/glass.png">
        </div>

        <div class="dice-result">
          <?= json_encode($dice) ?>
        </div>

        <div class="player-info">
          <span class="pseudo"><?= $pseudo ?></span>
          <span class="dice-count"><?= count($dice) ?>/5</span>
        </div>
      </div>
    </div>

  </div>
<?php
}
