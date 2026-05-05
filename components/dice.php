<?php
function dice($color, $num)
{
    $src = "assets/dice$num.png";

    return "
    <div class='dice $color' style=\"--img: url('$src');\">
        <img src='$src' alt='Dé $num'>
    </div>
    ";
}
