const canvas = document.getElementById("bg");
const gl = canvas.getContext("webgl");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

gl.viewport(0, 0, canvas.width, canvas.height);

const vertex = `
attribute vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `
precision mediump float;

uniform float time;
uniform vec2 resolution;

// paramètres du shader Godot
uniform float spin_time;
uniform vec3 colour_1;
uniform vec3 colour_2;
uniform vec3 colour_3;
uniform float contrast;
uniform float spin_amount;

const float PIXEL_SIZE_FAC = 700.0;
const float SPIN_EASE = 0.5;

void main() {

  vec2 screen_size = resolution;

  // pixelisation
  float pixel_size = length(screen_size) / PIXEL_SIZE_FAC;

  vec2 uv =
  (
    floor(gl_FragCoord.xy * (1.0 / pixel_size)) * pixel_size
    - 0.5 * screen_size
  )
  / length(screen_size);

  float uv_len = length(uv);

  // tourbillon
  float speed =
    (spin_time * SPIN_EASE * 0.2)
    + 302.2;

  float new_pixel_angle =
    atan(uv.y, uv.x)
    + speed
    - SPIN_EASE
      * 20.0
      * (
          spin_amount * uv_len
          + (1.0 - spin_amount)
        );

  vec2 mid =
    (screen_size / length(screen_size))
    / 2.0;

  uv = vec2(
    uv_len * cos(new_pixel_angle) + mid.x,
    uv_len * sin(new_pixel_angle) + mid.y
  ) - mid;

  // effet peinture
  uv *= 30.0;

  float spd = time * 2.0;

  vec2 uv2 = vec2(uv.x + uv.y);

  for (int i = 0; i < 5; i++) {

    uv2 += sin(max(uv.x, uv.y)) + uv;

    uv += 0.5 * vec2(
      cos(
        5.1123314
        + 0.353 * uv2.y
        + spd * 0.131121
      ),
      sin(
        uv2.x
        - 0.113 * spd
      )
    );

    uv -=
      cos(uv.x + uv.y)
      - sin(uv.x * 0.711 - uv.y);
  }

  // mélange couleurs
  float contrast_mod =
    0.25 * contrast
    + 0.5 * spin_amount
    + 1.2;

  float paint_res =
    min(
      2.0,
      max(
        0.0,
        length(uv) * 0.035 * contrast_mod
      )
    );

  float c1p =
    max(
      0.0,
      1.0 - contrast_mod * abs(1.0 - paint_res)
    );

  float c2p =
    max(
      0.0,
      1.0 - contrast_mod * abs(paint_res)
    );

  float c3p =
    1.0 - min(1.0, c1p + c2p);

  vec3 col =
      (0.3 / contrast) * colour_1
    + (1.0 - 0.3 / contrast)
      * (
          colour_1 * c1p
          + colour_2 * c2p
          + c3p * colour_3
        );

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(type, source) {
  const shader = gl.createShader(type);

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));

    gl.deleteShader(shader);

    return null;
  }

  return shader;
}

const program = gl.createProgram();

gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex));

gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment));

gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  console.error(gl.getProgramInfoLog(program));
}

gl.useProgram(program);

// quad fullscreen
const buffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
  gl.STATIC_DRAW,
);

const position = gl.getAttribLocation(program, "position");

gl.enableVertexAttribArray(position);

gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

// uniforms
const timeLoc = gl.getUniformLocation(program, "time");

const resLoc = gl.getUniformLocation(program, "resolution");

const spinTimeLoc = gl.getUniformLocation(program, "spin_time");

const colour1Loc = gl.getUniformLocation(program, "colour_1");

const colour2Loc = gl.getUniformLocation(program, "colour_2");

const colour3Loc = gl.getUniformLocation(program, "colour_3");

const contrastLoc = gl.getUniformLocation(program, "contrast");

const spinAmountLoc = gl.getUniformLocation(program, "spin_amount");

// couleurs
gl.uniform3f(colour1Loc, 0.0, 0.0, 0.0);
gl.uniform3f(colour2Loc, 0.0, 0.4, 0.9);
gl.uniform3f(colour3Loc, 1.0, 0.0, 0.2);

// paramètres
gl.uniform1f(contrastLoc, 1.0);
gl.uniform1f(spinAmountLoc, 1.05);

let start = Date.now();

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  gl.viewport(0, 0, canvas.width, canvas.height);
}

window.addEventListener("resize", resize);

function render() {
  const t = (Date.now() - start) / 1000;

  gl.uniform1f(timeLoc, t);

  gl.uniform1f(spinTimeLoc, t);

  gl.uniform2f(resLoc, canvas.width, canvas.height);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  requestAnimationFrame(render);
}

render();
