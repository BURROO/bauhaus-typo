// // Random helpers
// function random(min, max) { return Math.random() * (max - min) + min; }
// function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

// /* measurement helpers used by placement functions */
// function prepareForMeasurement(el) {
//   el.style.boxSizing = 'border-box';
//   el.style.display = 'inline-block';
//   el.style.padding = '0';
//   el.style.margin = '0';
//   el.style.lineHeight = '1';
//   el.style.letterSpacing = el.style.letterSpacing || 'normal';
//   el.style.whiteSpace = 'normal';
//   el.style.wordBreak = 'normal';
//   el.style.overflowWrap = 'break-word';
  // allow browser hyphenation when available; helps fitting long words
  // el.style.hyphens = 'auto';
//   el.style.transform = 'none';
//   el.style.transformOrigin = 'top left';
//   el.style.position = 'absolute';
//   el.style.left = '0';
//   el.style.top = '0';
//   el.style.pointerEvents = 'auto';
// }

// function computeSpanArea(containerEl, cols, rows, startCol, startRow, spanCols, spanRows) {
//   const containerW = containerEl.clientWidth;
//   const containerH = containerEl.clientHeight;
//   const cellW = containerW / Math.max(1, cols);
//   const cellH = containerH / Math.max(1, rows);
//   const availW = Math.max(8, Math.floor(spanCols * cellW) - 8);
//   const availH = Math.max(8, Math.floor(spanRows * cellH) - 8);
//   return { containerW, containerH, cellW, cellH, availW, availH };
// }

// /* placeModuleOnGrid(module, previewEl, cols = 4, rows = 6, opts = {})
//    - creates .text-block, measures with getBoundingClientRect(), removes padding/line-height noise,
//      optionally sets rotation (opts.rotate), centers precisely inside allocated grid span.
//    - returns { el, left, top, width, height, scale }
// */
// function placeModuleOnGrid(module, previewEl, cols = 4, rows = 6, opts = {}) {
//   const text = typeof module === 'string' ? module : (module && module.value ? module.value : String(module || ''));
//   const el = document.createElement('div');
//   el.className = 'text-block';
//   el.innerText = text;

//   // baseline measurement-safe styles
//   prepareForMeasurement(el);
//   if (opts.fontFamily) el.style.fontFamily = opts.fontFamily;
//   if (opts.fontWeight) el.style.fontWeight = opts.fontWeight;

//   // choose span & start cell
//   const maxColSpan = Math.min(3, cols);
//   const maxRowSpan = Math.min(3, rows);
//   const spanCols = Math.max(1, Math.min(maxColSpan, parseInt(opts.spanCols, 10) || Math.floor(Math.random() * maxColSpan) + 1));
//   const spanRows = Math.max(1, Math.min(maxRowSpan, parseInt(opts.spanRows, 10) || Math.floor(Math.random() * maxRowSpan) + 1));
//   const startCol = (typeof opts.startCol === 'number') ? opts.startCol : Math.floor(Math.random() * Math.max(1, cols - spanCols + 1));
//   const startRow = (typeof opts.startRow === 'number') ? opts.startRow : Math.floor(Math.random() * Math.max(1, rows - spanRows + 1));

//   // initial font-size heuristic based on available area
//   const { cellW, cellH, availW, availH } = computeSpanArea(previewEl, cols, rows, startCol, startRow, spanCols, spanRows);
//   const gridCompactness = Math.max(cols, rows);
//   const gridFactor = Math.min(3, Math.max(0.6, 6 / Math.max(1, gridCompactness)));
//   let fs = Math.round(Math.min(availH * 0.8, availW * 0.45) * gridFactor);
//   fs = Math.max(8, Math.min(fs, 200));
//   el.style.fontSize = fs + 'px';
//   el.style.maxWidth = availW + 'px';

//   previewEl.appendChild(el);

//   // measure rendered box using getBoundingClientRect()
//   let rect = el.getBoundingClientRect();
//   let naturalW = Math.round(rect.width);
//   let naturalH = Math.round(rect.height);

//   // shrink font until it fits the available area
//   while ((naturalW > availW || naturalH > availH) && fs > 8) {
//     fs -= 1;
//     el.style.fontSize = fs + 'px';
//     rect = el.getBoundingClientRect();
//     naturalW = Math.round(rect.width);
//     naturalH = Math.round(rect.height);
//   }

//   // store metadata
//   el.dataset.startCol = String(startCol);
//   el.dataset.startRow = String(startRow);
//   el.dataset.spanCols = String(spanCols);
//   el.dataset.spanRows = String(spanRows);
//   el.dataset.baseFont = String(fs);
//   el.dataset.layerCols = String(cols);
//   el.dataset.layerRows = String(rows);
//   el.dataset.rotation = opts.rotate ? '90' : '0';

//   // apply rotation if requested (scale left at 1 for now)
//   const appliedScale = 1;
//   if (opts.rotate) el.style.transform = `rotate(90deg) scale(${appliedScale})`;
//   else el.style.transform = `scale(${appliedScale})`;

//   // re-measure transformed bbox
//   rect = el.getBoundingClientRect();
//   const measuredW = Math.round(rect.width);
//   const measuredH = Math.round(rect.height);

//   // center inside logical span
//   const left = Math.round(startCol * cellW + (spanCols * cellW - measuredW) / 2);
//   const top = Math.round(startRow * cellH + (spanRows * cellH - measuredH) / 2);

//   // clamp to container to avoid negative / off-screen positions
//   const safeLeft = Math.max(0, Math.min(left, Math.max(0, previewEl.clientWidth - measuredW)));
//   const safeTop = Math.max(0, Math.min(top, Math.max(0, previewEl.clientHeight - measuredH)));

//   el.style.left = safeLeft + 'px';
//   el.style.top = safeTop + 'px';

//   return { el, left: safeLeft, top: safeTop, width: measuredW, height: measuredH, scale: appliedScale };
// }

// /* fitModuleToGrid(el, previewEl, cols, rows, opts = {})
//    - re-measures with getBoundingClientRect, computes uniform scale so text fits the span,
//      supports rotation via opts.rotate or stored dataset, uses transform-origin: top left,
//      re-measures after transform and recenters. Returns { el, left, top, width, height, scale }.
// */
// function fitModuleToGrid(el, previewEl, cols, rows, opts = {}) {
//   cols = typeof cols === 'number' ? cols : (parseInt(el.dataset.layerCols, 10) || parseInt(previewEl.dataset.cols, 10) || 4);
//   rows = typeof rows === 'number' ? rows : (parseInt(el.dataset.layerRows, 10) || parseInt(previewEl.dataset.rows, 10) || 6);

//   const startCol = parseInt(el.dataset.startCol, 10) || 0;
//   const startRow = parseInt(el.dataset.startRow, 10) || 0;
//   const spanCols = parseInt(el.dataset.spanCols, 10) || 1;
//   const spanRows = parseInt(el.dataset.spanRows, 10) || 1;

//   // sanitize styles for measurement
//   prepareForMeasurement(el);
//   if (opts.fontFamily) el.style.fontFamily = opts.fontFamily;
//   if (opts.fontWeight) el.style.fontWeight = opts.fontWeight;

//   const { cellW, cellH, availW, availH } = computeSpanArea(previewEl, cols, rows, startCol, startRow, spanCols, spanRows);

//   let baseFs = parseInt(el.dataset.baseFont, 10) || Math.round(Math.min(availH * 0.8, availW * 0.45));
//   baseFs = Math.max(8, Math.min(baseFs, 200));
//   el.style.fontSize = baseFs + 'px';
//   el.style.maxWidth = availW + 'px';

//   // measure natural size untransformed
//   el.style.transform = 'none';
//   el.style.transformOrigin = 'top left';
//   let rect = el.getBoundingClientRect();
//   let naturalW = Math.round(rect.width);
//   let naturalH = Math.round(rect.height);

//   const rotate = (typeof opts.rotate === 'boolean') ? opts.rotate : (el.dataset.rotation === '90');

//   // if fits without transform and no rotation requested, center and return
//   if (!rotate && naturalW <= availW && naturalH <= availH) {
//     const left = Math.round(startCol * cellW + (spanCols * cellW - naturalW) / 2);
//     const top = Math.round(startRow * cellH + (spanRows * cellH - naturalH) / 2);
//     const safeLeft = Math.max(0, Math.min(left, Math.max(0, previewEl.clientWidth - naturalW)));
//     const safeTop = Math.max(0, Math.min(top, Math.max(0, previewEl.clientHeight - naturalH)));
//     el.style.left = safeLeft + 'px';
//     el.style.top = safeTop + 'px';
//     el.dataset.baseFont = String(baseFs);
//     el.dataset.rotation = '0';
//     el.style.transform = 'none';
//     return { el, left: safeLeft, top: safeTop, width: naturalW, height: naturalH, scale: 1 };
//   }

//   // compute target available area (swap if rotating)
//   const targetAvailW = rotate ? availH : availW;
//   const targetAvailH = rotate ? availW : availH;

//   // compute uniform scale to fit
//   let scale = Math.min(1, targetAvailW / Math.max(1, naturalW), targetAvailH / Math.max(1, naturalH));
//   const minScale = (typeof opts.minScale === 'number') ? opts.minScale : 0.25;

//   // if scale < minScale, allow font shrinking (unless explicitly disabled)
//   if (scale < minScale && (opts.allowFontShrink !== false)) {
//     let fs = baseFs;
//     el.style.transform = 'none';
//     while (fs > 8) {
//       fs -= 1;
//       el.style.fontSize = fs + 'px';
//       rect = el.getBoundingClientRect();
//       naturalW = Math.round(rect.width);
//       naturalH = Math.round(rect.height);
//       scale = Math.min(1, targetAvailW / Math.max(1, naturalW), targetAvailH / Math.max(1, naturalH));
//       if (scale >= minScale) {
//         baseFs = fs;
//         break;
//       }
//     }
//   }

//   scale = Math.max(minScale, scale);

//   // apply transform (rotation + scale) with origin top-left
//   if (rotate) {
//     el.style.transform = `rotate(90deg) scale(${scale})`;
//     el.dataset.rotation = '90';
//   } else {
//     el.style.transform = `scale(${scale})`;
//     el.dataset.rotation = '0';
//   }

//   // re-measure transformed bbox and recenter precisely
//   rect = el.getBoundingClientRect();
//   const measuredW = Math.round(rect.width);
//   const measuredH = Math.round(rect.height);
//   const left = Math.round(startCol * cellW + (spanCols * cellW - measuredW) / 2);
//   const top = Math.round(startRow * cellH + (spanRows * cellH - measuredH) / 2);
//   const safeLeft = Math.max(0, Math.min(left, Math.max(0, previewEl.clientWidth - measuredW)));
//   const safeTop = Math.max(0, Math.min(top, Math.max(0, previewEl.clientHeight - measuredH)));

//   el.style.left = safeLeft + 'px';
//   el.style.top = safeTop + 'px';

//   el.dataset.baseFont = String(baseFs);

//   return { el, left: safeLeft, top: safeTop, width: measuredW, height: measuredH, scale };
// }

// ==============================
// Random helpers
// ==============================
function random(min, max) { return Math.random() * (max - min) + min; }
function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr) { return arr[randomInt(0, arr.length - 1)]; }

// ==============================
// GLOBAL LAYOUT MODE (per generate)
// ==============================
const LAYOUT_MODES = [
  "dense",
  "edge-heavy",
  "column-flow",
  "stacked",
  "fragmented"
];

// call this once per generate()
let ACTIVE_LAYOUT_MODE = LAYOUT_MODES[randomInt(0, LAYOUT_MODES.length - 1)];
console.log("Layout mode:", ACTIVE_LAYOUT_MODE);

// ==============================
// Measurement helpers
// ==============================
function prepareForMeasurement(el) {
  el.style.boxSizing = 'border-box';
  el.style.display = 'inline-block';
  el.style.padding = '0';
  el.style.margin = '0';
  el.style.lineHeight = '1';
  el.style.letterSpacing = el.style.letterSpacing || 'normal';
  el.style.whiteSpace = 'normal';
  el.style.wordBreak = 'normal';
  el.style.overflowWrap = 'break-word';
  // allow browser hyphenation when available; helps fitting long words
  el.style.hyphens = 'auto';
  // vendor-prefixed fallbacks
  el.style.WebkitHyphens = 'auto';
  el.style.msHyphens = 'auto';
  el.style.transform = 'none';
  el.style.transformOrigin = 'top left';
  el.style.position = 'absolute';
  el.style.left = '0';
  el.style.top = '0';
  el.style.pointerEvents = 'auto';
}

// ==============================
// Grid helpers
// ==============================
function computeSpanArea(containerEl, cols, rows, startCol, startRow, spanCols, spanRows) {
  const containerW = containerEl.clientWidth;
  const containerH = containerEl.clientHeight;
  const cellW = containerW / Math.max(3, cols);
  const cellH = containerH / Math.max(1, rows);
  const availW = Math.max(8, Math.floor(spanCols * cellW) - 8);
  const availH = Math.max(8, Math.floor(spanRows * cellH) - 8);
  return { containerW, containerH, cellW, cellH, availW, availH };
}

// ==============================
// Layout logic helpers
// ==============================
function biasedCell(max, mode) {
  if (mode === "edge-heavy") {
    return Math.random() < 0.35 ? 0 : max;
  }
  if (mode === "dense") {
    return randomInt(0, max);
  }
  // center bias
  return Math.round(random(max * 0.25, max * 0.75));
}

function pickSpan(max, mode) {
  if (mode === "dense") return 1;
  if (mode === "stacked") return randomInt(Math.ceil(max / 2), max);
  if (mode === "fragmented") return Math.random() < 0.7 ? 1 : 2;
  return randomInt(1, max);
}

function alignWithinSpan(spanSize, contentSize, mode) {
  if (mode === "start") return 0;
  if (mode === "end") return spanSize - contentSize;
  if (mode === "offset") return random(0, Math.max(0, spanSize - contentSize));
  return (spanSize - contentSize) / 2;
}

function shouldRotate(index, mode) {
  // if (mode === "fragmented") return index % 6 === 0;
  // if (mode === "fragmented") return index % 6 === 0;
  return Math.random() < 0.5;
}

function pickRotationAngle() {
  // pick either 90 or -90 degrees with equal probability
  return Math.random() < 0.5 ? -90 : 90;
}
// Ensure the element's transformed bounding box is fully contained inside
// the preview/container. We use getBoundingClientRect() for both and
// adjust the element's inline left/top by the needed pixel offset.
function clampElementIntoContainer(el, container) {
  const parentRect = container.getBoundingClientRect();
  let childRect = el.getBoundingClientRect();
  let shiftX = 0;
  if (childRect.left < parentRect.left) shiftX = parentRect.left - childRect.left;
  else if (childRect.right > parentRect.right) shiftX = parentRect.right - childRect.right;
  let shiftY = 0;
  if (childRect.top < parentRect.top) shiftY = parentRect.top - childRect.top;
  else if (childRect.bottom > parentRect.bottom) shiftY = parentRect.bottom - childRect.bottom;

  if (shiftX !== 0 || shiftY !== 0) {
    // current left/top in px (fall back to offset values if style not set)
    const curLeft = parseFloat(el.style.left) || el.offsetLeft || 0;
    const curTop = parseFloat(el.style.top) || el.offsetTop || 0;
    el.style.left = (curLeft + shiftX) + 'px';
    el.style.top = (curTop + shiftY) + 'px';
    // re-read child rect after shift
    childRect = el.getBoundingClientRect();
  }

  // return measurements relative to the container's content box
  return {
    left: Math.round(childRect.left - parentRect.left),
    top: Math.round(childRect.top - parentRect.top),
    width: Math.round(childRect.width),
    height: Math.round(childRect.height)
  };
}

// ==============================
// Placement memory (for overlap logic)
// ==============================
const PLACEMENTS = [];

// ==============================
// Main placement function
// ==============================
function placeModuleOnGrid(module, previewEl, cols = 4, rows = 6, opts = {}, index = 0) {
  const text = typeof module === 'string'
    ? module
    : (module && module.value ? module.value : String(module || ''));

  const el = document.createElement('div');
  el.className = 'text-block';
  el.innerText = text;
  // set language for hyphenation rules (fall back to document language or 'en')
  try {
    el.lang = previewEl.lang || document.documentElement.lang || 'en';
  } catch (e) {
    el.lang = document.documentElement.lang || 'en';
  }

  prepareForMeasurement(el);

  // ------------------------------
  // Span + start cell (layout-aware)
  // ------------------------------
  const maxColSpan = Math.min(3, cols);
  const maxRowSpan = Math.min(3, rows);

  const spanCols = opts.spanCols ??
    pickSpan(maxColSpan, ACTIVE_LAYOUT_MODE);

  const spanRows = opts.spanRows ??
    pickSpan(maxRowSpan, ACTIVE_LAYOUT_MODE);

  const startCol = opts.startCol ??
    biasedCell(cols - spanCols, ACTIVE_LAYOUT_MODE);

  const startRow = opts.startRow ??
    biasedCell(rows - spanRows, ACTIVE_LAYOUT_MODE);

  // ------------------------------
  // Available area
  // ------------------------------
  const { cellW, cellH, availW, availH } =
    computeSpanArea(previewEl, cols, rows, startCol, startRow, spanCols, spanRows);

  // ------------------------------
  // Font sizing (slightly variant)
  // ------------------------------
  let fs = Math.round(
    Math.min(availH * random(0.6, 0.9), availW * random(0.35, 0.55))
  );
  fs = Math.max(8, Math.min(fs, 400));
  el.style.fontSize = fs + 'px';
  el.style.maxWidth = availW + 'px';

  // micro-typographic variation
  el.style.lineHeight = pick([0.9, 1, 1.1, 1.5, 1.8, 2]);

  previewEl.appendChild(el);

  // ------------------------------
  // Fit text into span
  // ------------------------------
  let rect = el.getBoundingClientRect();
  while ((rect.width > availW || rect.height > availH) && fs > 8) {
    fs -= 1;
    el.style.fontSize = fs + 'px';
    rect = el.getBoundingClientRect();
  }

  // ------------------------------
  // Rotation (rule-based) with ±90° support
  // ------------------------------
  const willRotate = shouldRotate(index, ACTIVE_LAYOUT_MODE);
  const rotAngle = willRotate ? pickRotationAngle() : 0; // 0, 90 or -90
  el.dataset.rotation = String(rotAngle);

  if (rotAngle !== 0) {
    // preserve any other transform functions already present on the element
    const prevTransform = (el.style.transform || '').trim();
    const funcs = prevTransform.match(/\w+\([^)]*\)/g) || [];
    const preserved = funcs.filter(f => !/^\s*rotate\s*\(/i.test(f));
    // compose rotate(angle) followed by any preserved functions
    el.style.transform = [`rotate(${rotAngle}deg)`, ...preserved].join(' ').trim();
  }

  rect = el.getBoundingClientRect();

  // ------------------------------
  // Alignment inside span
  // ------------------------------
  const hAlign = pick(["start", "center", "end", "offset"]);
  const vAlign = pick(["start", "center", "end", "offset"]);

  let left = Math.round(
    startCol * cellW +
    alignWithinSpan(spanCols * cellW, rect.width, hAlign)
  );

  let top = Math.round(
    startRow * cellH +
    alignWithinSpan(spanRows * cellH, rect.height, vAlign)
  );

  // ------------------------------
  // Clamp
  // ------------------------------
  left = Math.max(0, Math.min(left, previewEl.clientWidth - rect.width));
  top = Math.max(0, Math.min(top, previewEl.clientHeight - rect.height));

  el.style.left = left + 'px';
  el.style.top = top + 'px';

  // make a final containment pass using the element's transformed bounding box
  const adjusted = clampElementIntoContainer(el, previewEl);

  // ------------------------------
  // Overlap-aware z-index (optional)
  // ------------------------------
  if (ACTIVE_LAYOUT_MODE === "dense" || ACTIVE_LAYOUT_MODE === "fragmented") {
    el.style.zIndex = randomInt(1, 20);
  }

  // store placement (use adjusted values to reflect any containment correction)
  PLACEMENTS.push({
    left: adjusted.left,
    top: adjusted.top,
    width: adjusted.width,
    height: adjusted.height
  });

  return { el, left: adjusted.left, top: adjusted.top, width: adjusted.width, height: adjusted.height, scale: 1 };
}
