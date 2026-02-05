// Extra starke Neigung für den ersten Satz
const FIRST_ROTATE_DEG = -18; // <- stärker = mehr Schräglage

let firstFrozenRot = FIRST_ROTATE_DEG; // Startneigung initial

const lines = Array.from(document.querySelectorAll(".line"));
const finalImage = document.querySelector(".final-image");
const textLines = finalImage ? lines.filter((el) => el !== finalImage) : lines;
const textIndexByLine = new Map(textLines.map((el, idx) => [el, idx]));

const SPEED = 0.0016;

// Boden
const BOTTOM_PADDING = 24;

// Höhe Stapel
const STACK_COMPRESSION = 0.5;

// Versatz / Jitter
const X_JITTER_PX = 32;
const Y_JITTER_PX = 7;
const ROTATE_DEG = 2.2;

// Letzter Satz Ende
const FINAL_GAP = 200;
const FINAL_IMAGE_GAP = 80;

// ✅ Erster Satz: wie stark er oben abgeschnitten ist
// 0.5 = exakt halb abgeschnitten, 0.6 = etwas mehr, 0.4 = weniger
const FIRST_CLIP_FACTOR = 0.5;


// Status
let activeIndex = 0;
let progress = 0;
let deltaBuffer = 0;
let needsRender = true;

// Layout
let BASE_END_Y = 0;
let STACK_GAP = 0;
let MAX_STACK_HEIGHT = 0;

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function computeLayout() {
  BASE_END_Y = (window.innerHeight / 2) - BOTTOM_PADDING;
  MAX_STACK_HEIGHT = window.innerHeight * 0.9 * STACK_COMPRESSION;

  const total = textLines.length;
  STACK_GAP = total > 1 ? (MAX_STACK_HEIGHT / (total - 1)) : 0;
}

// letzter Satz hat anderes Ende
function endYForIndex(i) {
  const lastTextIndex = textLines.length - 1;

  if (lines[i] === finalImage) {
    const lastTextY = BASE_END_Y - (lastTextIndex * STACK_GAP);
    return lastTextY - FINAL_IMAGE_GAP;
  }

  const textIndex = textIndexByLine.get(lines[i]);
  if (textIndex === lastTextIndex) {
    const stackTopY = BASE_END_Y - ((lastTextIndex - 1) * STACK_GAP);
    return stackTopY - FINAL_GAP;
  }

  return BASE_END_Y - (textIndex * STACK_GAP);
}

// ✅ STARTPOSITION: erster Satz halb über dem oberen Rand
function startYForIndex(i) {
  const el = lines[i];
  const h = el.getBoundingClientRect().height;

  if (i === 0) {
    // Oberer Viewport-Rand relativ zur Mitte:
    const topEdgeY = -window.innerHeight / 2;

    // Erster Satz am oberen Rand, mit Clip nach oben
    return topEdgeY + (h / 2) - (h * FIRST_CLIP_FACTOR);
  }

  // sonst: wie bei dir – knapp außerhalb oben (sichtbar "von oben kommend")
  const halfH = h / 2;
  return (-window.innerHeight / 2) + halfH;
}

function getCssPx(el, varName) {
  const v = getComputedStyle(el).getPropertyValue(varName).trim();
  if (!v) return 0;
  const n = Number(v.replace("px", "").trim());
  return Number.isFinite(n) ? n : 0;
}

function setTransform(el, xPx, yPx, extraRot = 0) {
  const jx = Number(el.dataset.jx || 0);
  const jy = Number(el.dataset.jy || 0);
  const rot = Number(el.dataset.rot || 0);

  el.style.transform =
    `translate(-50%, -50%)
     translate(${xPx + jx}px, ${yPx + jy}px)
     rotate(${rot + extraRot}deg)`;
}


function initJitter() {
  lines.forEach((el, i) => {
    const r1 = Math.sin(i * 999) * 10000;
    const r2 = Math.sin(i * 555) * 10000;
    const r3 = Math.sin(i * 333) * 10000;

    const jx = (r1 - Math.floor(r1) - 0.5) * 2 * X_JITTER_PX;
    const jy = (r2 - Math.floor(r2) - 0.5) * 2 * Y_JITTER_PX;
    const rot = (r3 - Math.floor(r3) - 0.5) * 2 * ROTATE_DEG;

    el.dataset.jx = jx.toFixed(2);
    el.dataset.jy = jy.toFixed(2);
    el.dataset.rot = rot.toFixed(2);
  });
}

function render() {
  const active = activeIndex;

  for (let i = 0; i < lines.length; i++) {
    const el = lines[i];

    const x = getCssPx(el, "--x");
    const yExtra = getCssPx(el, "--yExtra");

    let extraRot = 0;

    if (i === 0) {
      if (active === 0) {
        // Solange Satz 0 aktiv ist: von Startneigung -> gerade
        extraRot = lerp(FIRST_ROTATE_DEG, 0, progress);
        firstFrozenRot = extraRot; // aktuellen Wert merken
      } else {
        // Sobald Satz 0 nicht mehr aktiv ist (unten gestapelt):
        // NICHT zurückspringen, sondern gemerkte Rotation verwenden
        extraRot = firstFrozenRot;
      }
    }

    if (i < active) {
      const y = endYForIndex(i) + yExtra;
      el.classList.add("is-visible");
      setTransform(el, x, y, extraRot);

    } else if (i === active) {
      const startY = startYForIndex(i);
      const endY = endYForIndex(i);
      const y = lerp(startY, endY, progress) + yExtra;

      el.classList.add("is-visible");
      setTransform(el, x, y, extraRot);

    } else {
      const startY = startYForIndex(i);
      el.classList.remove("is-visible");
      setTransform(el, x, startY + yExtra, extraRot);
    }
  }
}



window.addEventListener("wheel", (e) => {
  e.preventDefault();
  deltaBuffer += e.deltaY;
  needsRender = true;
}, { passive: false });

function tick() {
  requestAnimationFrame(tick);

  if (!needsRender) return;
  needsRender = false;

  const consume = deltaBuffer * 0.35;
  deltaBuffer -= consume;

  progress += consume * SPEED;

  if (progress < 0) {
    if (activeIndex > 0) {
      activeIndex--;
      progress = 1 + progress;
      progress = clamp(progress, 0, 1);
    } else {
      progress = 0;
    }
  }

  if (progress > 1) {
    if (activeIndex < lines.length - 1) {
      activeIndex++;
      progress = progress - 1;
      progress = clamp(progress, 0, 1);
    } else {
      progress = 1;
    }
  }

  progress = clamp(progress, 0, 1);

  render();

  if (Math.abs(deltaBuffer) < 0.05) deltaBuffer = 0;
}

computeLayout();
initJitter();
render();
tick();

window.addEventListener("resize", () => {
  computeLayout();
  needsRender = true;
});

if (finalImage) {
  const refresh = () => {
    computeLayout();
    needsRender = true;
  };
  if (finalImage.complete) {
    refresh();
  } else {
    finalImage.addEventListener("load", refresh);
  }
}






document.addEventListener("DOMContentLoaded", () => {
  const h2s = Array.from(document.querySelectorAll("#centeralign h2"));
  if (!h2s.length) return;

  const showMs = 1200;   // wie lange eine Zeile sichtbar bleibt
  const gapMs  = 250;    // kleine Pause zwischen den Zeilen

  let index = 0;

  function show(i) {
    h2s.forEach((el, k) => el.classList.toggle("is-active", k === i));
  }

  async function loop() {
    while (true) {
      show(index);
      await new Promise(r => setTimeout(r, showMs));
      show(-1); // kurz ausblenden
      await new Promise(r => setTimeout(r, gapMs));
      index = (index + 1) % h2s.length;
    }
  }

  // Initial: alle aus, dann starten
  show(-1);
  loop();
});
