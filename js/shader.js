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

const fragment =
  typeof crtFragment !== "undefined"
    ? crtFragment
    : `
precision mediump float;

uniform float time;
uniform vec2 resolution;

uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);

  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(a, b, u.x)
       + (c - a) * u.y * (1.0 - u.x)
       + (d - b) * u.x * u.y;
}

vec2 rotate(vec2 p, float a) {
  float s = sin(a);
  float c = cos(a);
  return vec2(
    c * p.x - s * p.y,
    s * p.x + c * p.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float amp = 0.5;

  v += noise(p) * amp;
  p = rotate(p * 2.02, 0.45);
  amp *= 0.5;

  v += noise(p) * amp;
  p = rotate(p * 2.03, -0.8);
  amp *= 0.5;

  v += noise(p) * amp;
  p = rotate(p * 2.01, 1.2);
  amp *= 0.5;

  v += noise(p) * amp;

  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  uv.x *= resolution.x / resolution.y;

  float t = time * 0.13;

  vec2 p = uv * 4.3;

  // Flow field lent, façon vent dans une canopée
  float angle = fbm(p * 0.45 + vec2(t * 0.35, -t * 0.22)) * 6.28318;
  vec2 flow = vec2(cos(angle), sin(angle));

  // Advection : le motif se déforme au lieu de simplement glisser
  p += flow * 0.65;

  // Ondulations larges et lentes
  p.x += sin(p.y * 1.7 + t * 1.8) * 0.22;
  p.y += cos(p.x * 1.3 - t * 1.4) * 0.18;

  // Rotation locale pour casser les répétitions
  float localRot = fbm(p * 0.65 - t * 0.4) * 1.8 - 0.9;
  p = rotate(p, localRot);

  // Bruit principal jungle
  float n =
      fbm(p + vec2(t * 0.45, -t * 0.25)) * 0.65 +
      fbm(p * 1.9 - vec2(t * 0.30, t * 0.42)) * 0.25 +
      fbm(p * 3.4 + vec2(-t * 0.18, t * 0.28)) * 0.10;

  // Feuillage doux
  float leaves = smoothstep(0.34, 0.72, n);

  // Taches de lumière filtrée
  float light = smoothstep(0.58, 0.92, n);
  light *= 0.55 + 0.45 * fbm(uv * 2.0 + vec2(t * 0.12, t * 0.08));

  vec3 col = mix(color1, color2, leaves);
  col = mix(col, color3, light * 0.45);

  // Désaturation pour mieux matcher les gobelets pixel art
  float gray = dot(col, vec3(0.299, 0.587, 0.114));
  col = mix(col, vec3(gray), 0.22);

  // Profondeur verticale subtile
  col *= 0.82 + 0.18 * uv.y;

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

const timeLoc = gl.getUniformLocation(program, "time");
const resLoc = gl.getUniformLocation(program, "resolution");

const c1 = gl.getUniformLocation(program, "color1");
const c2 = gl.getUniformLocation(program, "color2");
const c3 = gl.getUniformLocation(program, "color3");

gl.uniform3f(c1, 0.08, 0.18, 0.12);
gl.uniform3f(c2, 0.22, 0.35, 0.25);
gl.uniform3f(c3, 0.55, 0.65, 0.45);

let start = Date.now();

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  gl.viewport(0, 0, canvas.width, canvas.height);
}

window.addEventListener("resize", resize);

function render() {
  let t = (Date.now() - start) / 1000;

  gl.uniform1f(timeLoc, t);
  gl.uniform2f(resLoc, canvas.width, canvas.height);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  requestAnimationFrame(render);
}

render();
