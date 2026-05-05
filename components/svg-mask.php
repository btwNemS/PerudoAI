<?php
function svg_mask($src)
{
  $id = "mask_" . uniqid();

  return "
    <div class='svg-stack'>

      <!-- contour -->
      <svg class='outline' viewBox='0 0 100 100'>
        <defs>
          <mask id='{$id}_bg'>
            <image href='$src' width='100' height='100'/>
          </mask>
        </defs>
        <rect width='100' height='100' fill='white' mask='url(#{$id}_bg)'/>
      </svg>

      <!-- sprite -->
      <svg class='fg' viewBox='0 0 100 100'>
        <defs>
          <mask id='{$id}'>
            <image href='$src' width='100' height='100'/>
          </mask>
        </defs>
        <rect width='100' height='100' mask='url(#{$id})'/>
      </svg>

    </div>
    ";
}
