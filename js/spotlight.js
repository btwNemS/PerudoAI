function createSpotlight(options = {}) {
  const {
    x = 50,
    y = 50,
    clearRadius = 120,
    fadeWidth = 180,
    opacity = 0.88,
    followMouse = true,
    container = document.body,
  } = options;

  const root = document.documentElement;

  const spotlight = document.createElement("div");
  spotlight.style.position = "fixed";
  spotlight.style.inset = "0";
  spotlight.style.pointerEvents = "none";
  spotlight.style.zIndex = "9999";

  container.appendChild(spotlight);

  // ---- état interne ----
  let state = {
    x,
    y,
    clearRadius,
    fadeWidth,
    opacity,
  };

  // ---- rendu ----
  function render() {
    root.style.setProperty("--x", `${state.x}vw`);
    root.style.setProperty("--y", `${state.y}vh`);
    root.style.setProperty("--clear-radius", `${state.clearRadius}px`);
    root.style.setProperty(
      "--fade-radius",
      `${state.clearRadius + state.fadeWidth}px`,
    );
    root.style.setProperty("--shadow-opacity", state.opacity);

    spotlight.style.background = `
      radial-gradient(
        circle at var(--x) var(--y),
        rgba(0,0,0,0) 0,
        rgba(0,0,0,0) var(--clear-radius),
        rgba(0,0,0,var(--shadow-opacity)) var(--fade-radius)
      )
    `;
  }

  // ---- update instantané ----
  function update(values = {}) {
    state = { ...state, ...values };
    render();
  }

  // ---- animation fluide ----
  function animate(values = {}, duration = 600) {
    const start = performance.now();
    const initial = { ...state };
    const target = { ...state, ...values };

    function lerp(a, b, t) {
      return a + (b - a) * t;
    }

    function ease(t) {
      return 1 - Math.pow(1 - t, 3); // ease-out
    }

    function frame(now) {
      const t = Math.min((now - start) / duration, 1);
      const e = ease(t);

      state.x = lerp(initial.x, target.x, e);
      state.y = lerp(initial.y, target.y, e);
      state.clearRadius = lerp(initial.clearRadius, target.clearRadius, e);
      state.fadeWidth = lerp(initial.fadeWidth, target.fadeWidth, e);
      state.opacity = lerp(initial.opacity, target.opacity, e);

      render();

      if (t < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  // ---- souris ----
  function setPositionFromPointer(e) {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    update({ x, y });
  }

  if (followMouse) {
    window.addEventListener("pointermove", setPositionFromPointer);
  }

  // init
  render();

  return {
    update,
    animate,
    destroy() {
      spotlight.remove();
      window.removeEventListener("pointermove", setPositionFromPointer);
    },
  };
}

window.createSpotlight = createSpotlight;
