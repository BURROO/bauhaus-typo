// Constants / DOM refs
const preview = document.getElementById('preview');
const btnGenerate = document.getElementById('btn-generate');
const textFieldsContainer = document.getElementById('text-fields') || (function createContainer() {
  const c = document.createElement('div');
  c.id = 'text-fields';
  const aside = document.getElementById('aside');
  if (aside) aside.insertBefore(c, aside.querySelector('#date') || null);
  return c;
})();

const btnAdd = document.getElementById('btn-add');
const btnDelete = document.getElementById('btn-delete');

function getTextAreas() {
  return Array.from(textFieldsContainer.querySelectorAll('textarea'));
}

function selectTextarea(ta) {
  getTextAreas().forEach(t => t.classList.remove('selected'));
  if (ta) {
    ta.classList.add('selected');
    ta.focus();
  }
  updateDeleteButtonState();
}

// Ensure at least one textarea remains; disable delete when only one left
function updateDeleteButtonState() {
  if (!btnDelete) return;
  const count = getTextAreas().length;
  btnDelete.disabled = count <= 1;
}

// Add new textarea and auto-select it
if (btnAdd) {
  btnAdd.addEventListener('click', () => {
    const ta = document.createElement('textarea');
    ta.placeholder = 'heres a new text block...';
    ta.rows = 3;
    ta.style.boxSizing = 'border-box';
    textFieldsContainer.appendChild(ta);
    selectTextarea(ta);
  });
}

// Click to select a textarea (delegation)
textFieldsContainer.addEventListener('click', (e) => {
  const ta = e.target.closest && e.target.closest('textarea');
  if (!ta) return;
  selectTextarea(ta);
});

// Delete selected textarea (or last if none selected), but never remove the last remaining textarea
if (btnDelete) {
  btnDelete.addEventListener('click', () => {
    const areas = getTextAreas();
    if (areas.length <= 1) return; // keep at least one
    const selected = textFieldsContainer.querySelector('textarea.selected');
    let idx;
    if (selected) {
      idx = areas.indexOf(selected);
    } else {
      idx = areas.length - 1;
    }
    // remove the target
    areas[idx].remove();
    // choose new selection: prefer previous sibling, else first remaining
    const remaining = getTextAreas();
    const newIndex = Math.max(0, Math.min(remaining.length - 1, idx - 1));
    if (remaining.length) selectTextarea(remaining[newIndex]);
    updateDeleteButtonState();
  });
}

// initial state: ensure at least one textarea and select first
(function ensureInitialTextareas(){
  const areas = getTextAreas();
  if (areas.length === 0) {
    const ta = document.createElement('textarea');
    ta.placeholder = 'start typing...';
    ta.rows = 3;
    ta.style.boxSizing = 'border-box';
    textFieldsContainer.appendChild(ta);
    selectTextarea(ta);
  } else {
    selectTextarea(areas[0]);
  }
})();
updateDeleteButtonState();

/* small custom alert dialog to replace native alert() so styling matches UI */
function showCustomAlert(message, title = 'Notice') {
  let overlay = document.getElementById('custom-alert-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'custom-alert-overlay';
    overlay.innerHTML = `
      <div id="custom-alert" role="alertdialog" aria-modal="true" aria-labelledby="custom-alert-title">
        <div class="alert-title" id="custom-alert-title"></div>
        <div class="alert-body" id="custom-alert-body"></div>
        <div class="alert-actions">
          <button class="alert-btn primary ok">OK</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);

    // close handlers
    overlay.querySelector('.ok').addEventListener('click', () => hideCustomAlert());
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) hideCustomAlert();
    });

    // keyboard: Esc closes
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('show')) hideCustomAlert();
    });
  }

  overlay.querySelector('#custom-alert-title').textContent = title;
  overlay.querySelector('#custom-alert-body').textContent = message;

  overlay.classList.add('show');
  // focus management
  const ok = overlay.querySelector('.ok');
  if (ok) ok.focus();
}

function hideCustomAlert() {
  const overlay = document.getElementById('custom-alert-overlay');
  if (!overlay) return;
  overlay.classList.remove('show');
}

/* -------------------------
   Small helpers
   ------------------------- */
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function choice(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

/* palette for layer visuals */
const LAYER_COLORS = [
  'rgba(44, 41, 41, 0.08)',
  'rgba(44, 41, 41, 0.08)',
  'rgba(44, 41, 41, 0.08)',
  'rgba(44, 41, 41, 0.08)'
];

// ...existing code...
function applyRandomTypography(root = preview, cfg = {}) {
  if (!root) return;

  const weights = Array.isArray(cfg.weights) ? cfg.weights : [90, 100, 200, 300, 400, 500, 600, 700, 800, 900];
  const [minTracking, maxTracking] = Array.isArray(cfg.trackingRange) ? cfg.trackingRange : [-0.3, 0.9];
  const [minScaleX, maxScaleX] = Array.isArray(cfg.scaleXRange) ? cfg.scaleXRange : [0.01, 3.05];
  const [minScaleY, maxScaleY] = Array.isArray(cfg.scaleYRange) ? cfg.scaleYRange : [0.01, 3.10]; // vertical stretch range
  const [minSlant, maxSlant] = Array.isArray(cfg.slantRange) ? cfg.slantRange : [-20, 20]; // deg skewX
  const [minLH, maxLH] = Array.isArray(cfg.lineHeightRange) ? cfg.lineHeightRange : [0.01, 2.25];

  const selector = '.text-block:not([data-typography-applied]), .repeat-text:not([data-typography-applied])';
  const nodes = Array.from(root.querySelectorAll(selector));
  nodes.forEach(el => {
    const w = choice(weights);
    const tracking = (Math.random() * (maxTracking - minTracking)) + minTracking;
    const scaleX = (Math.random() * (maxScaleX - minScaleX)) + minScaleX;
    const scaleY = (Math.random() * (maxScaleY - minScaleY)) + minScaleY;
    const slant = (Math.random() * (maxSlant - minSlant)) + minSlant;
    const lineH = (Math.random() * (maxLH - minLH)) + minLH;

    el.style.fontWeight = String(w);
    el.style.letterSpacing = tracking.toFixed(3) + 'em';
    el.style.lineHeight = lineH.toFixed(3); // unitless string

    // preserve original transform once
    if (!el.dataset.origTransform) {
      el.dataset.origTransform = el.style.transform || '';
      el.style.transformOrigin = el.style.transformOrigin || '50% 50%';
    }

    const base = (el.dataset.origTransform || '').trim();
    const stretchTransform = `scale(${scaleX.toFixed(3)},${scaleY.toFixed(3)}) skewX(${slant.toFixed(2)}deg)`;
    el.style.transform = (base ? (base + ' ') : '') + stretchTransform;

    el.dataset.typographyApplied = '1';
  });
}

/* -------------------------
   Grid selection (random)
   ------------------------- */
let currentGridIndex = 0;
let currentGrid = Array.isArray(window.grids) && window.grids.length
  ? window.grids[0]
  : { cols: 4, rows: 6 };

function pickRandomGrid() {
  if (!Array.isArray(window.grids) || window.grids.length === 0) return;
  currentGridIndex = Math.floor(Math.random() * window.grids.length);
  currentGrid = window.grids[currentGridIndex];
  if (typeof preview !== 'undefined' && preview) {
    preview.dataset.gridIndex = currentGridIndex;
  }
}

/* -------------------------
   Single-layer draw + fit (fallback)
   ------------------------- */
function drawGrid() {
  preview.querySelectorAll('.grid-line').forEach(el => el.remove());

  const { cols, rows } = currentGrid;
  const color = LAYER_COLORS[0];

  for (let i = 1; i < cols; i++) {
    preview.appendChild(makeVLine(i / cols, color));
  }

  for (let r = 1; r < rows; r++) {
    preview.appendChild(makeHLine(r / rows, color));
  }
}

function fitAllModules() {
  preview.querySelectorAll('.text-block').forEach(el => {
    if (typeof fitModuleToGrid === 'function') {
      fitModuleToGrid(el, preview, currentGrid.cols, currentGrid.rows);
    }
  });
}
/* -------------------------
   Generate (multi-layer)
   ------------------------- */
btnGenerate.addEventListener('click', () => {
// ensure preview uses its current computed size for layout (no scaling)
  const rect = preview.getBoundingClientRect();
  const logicalW = Math.round(rect.width);
  const logicalH = Math.round(rect.height);
  preview.style.width = logicalW + 'px';
  preview.style.height = logicalH + 'px';
  // keep CSS-based centering transform untouched (do not clear inline transform here)

  preview.querySelectorAll('.layer-container, .text-block, .grid-line, .repeat-text').forEach(el => el.remove());
  const modules = getTextModules();
  if (modules.length === 0) { showCustomAlert('please fill in at least one text field!', 'missing content'); return; }
  const layerCount = Math.max(1, Math.min(4, Math.round(Math.random() * 3) + 1));
  const gridsForLayers = pickRandomLayerGrids(layerCount);
  const layerEls = createLayerContainers(gridsForLayers);
  layerEls.forEach((le, i) => drawGridOnLayer(le, gridsForLayers[i]));
  placeModulesAcrossLayers(modules, layerEls, gridsForLayers);
  fitAllModulesLayers(layerEls, gridsForLayers);
  repositionRepeatsLayers(layerEls, gridsForLayers);

  applyRandomTypography(preview); 
  updateGridVisibility(); 

  // ensure handle is correctly placed
});

/* -------------------------
   Multi-layer helpers
   ------------------------- */
function pickRandomLayerGrids(n = 1) {
  const pool = Array.isArray(window.grids) && window.grids.length ? [...window.grids] : [{ cols: 4, rows: 6 }];
  n = Math.max(1, Math.min(4, n));
  const picked = [];
  while (picked.length < n && pool.length) {
    picked.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  }
  picked.sort((a, b) => (b.cols * b.rows) - (a.cols * a.rows)); // finest first
  return picked;
}

function createLayerContainers(grids) {
  preview.querySelectorAll('.layer-container').forEach(el => el.remove());
  const layers = [];
  grids.forEach((g, i) => {
    const layer = document.createElement('div');
    layer.className = 'layer-container';
    layer.style.position = 'absolute';
    layer.style.left = '0';
    layer.style.top = '0';
    layer.style.width = '100%';
    layer.style.height = '100%';
    layer.style.pointerEvents = 'none'; // let clicks pass to preview; text-blocks remain interactive
    layer.style.zIndex = String(10 + i);
    layer.dataset.cols = g.cols;
    layer.dataset.rows = g.rows;
    layer.dataset.gridColor = LAYER_COLORS[i % LAYER_COLORS.length] || 'rgba(0,0,0,0.06)';
    preview.appendChild(layer);
    layers.push(layer);
  });
  return layers;
}

function drawGridOnLayer(layerEl, grid) {
  layerEl.querySelectorAll('.grid-line, svg.grid-overlay').forEach(n => n.remove());
  const cols = grid.cols || 4;
  const rows = grid.rows || 6;
  const color = layerEl.dataset.gridColor || LAYER_COLORS[0];
  for (let i = 1; i < cols; i++) {
    const col = document.createElement('div');
    col.className = 'grid-line grid-col';
    col.style.position = 'absolute';
    col.style.width = '1px';
    col.style.top = '0';
    col.style.bottom = '0';
    col.style.left = (i * layerEl.clientWidth / cols) + 'px';
    col.style.background = color;
    col.style.pointerEvents = 'none';
    layerEl.appendChild(col);
  }
  for (let r = 1; r < rows; r++) {
    const row = document.createElement('div');
    row.className = 'grid-line grid-row';
    row.style.position = 'absolute';
    row.style.height = '1px';
    row.style.left = '0';
    row.style.right = '0';
    row.style.top = (r * layerEl.clientHeight / rows) + 'px';
    row.style.background = color;
    row.style.pointerEvents = 'none';
    layerEl.appendChild(row);
  }
}

function placeModulesAcrossLayers(modules, layerEls, gridsForLayers) {
  if (!modules || modules.length === 0) return;
  const sorted = modules.slice().sort((a, b) => (b.weight || 0) - (a.weight || 0));
  const layerCount = layerEls.length;
  const chunk = Math.ceil(sorted.length / Math.max(1, layerCount));
  sorted.forEach((mod, idx) => {
    const group = Math.min(Math.floor(idx / chunk), layerCount - 1);
    const layerIndex = Math.max(0, layerCount - 1 - group);
    const targetLayer = layerEls[layerIndex];
    const grid = gridsForLayers[layerIndex];
    placeModuleOnGrid(mod, targetLayer, grid.cols, grid.rows);
  });
  const bgCount = Math.max(1, Math.min(layerCount - 1, 2));
  for (let i = 0; i < bgCount; i++) {
    const bgLayer = layerEls[i];
    const grid = gridsForLayers[i];
    if (typeof createRepeatingText === 'function') {
      createRepeatingText(modules, bgLayer, grid);
    }
    bgLayer.querySelectorAll('.repeat-text').forEach(r => r.style.pointerEvents = 'none');
  }

  // apply random typography to any newly created text-blocks
  applyRandomTypography(preview);
}

function fitAllModulesLayers(layerEls, gridsForLayers) {
  layerEls.forEach((le, idx) => {
    const cols = gridsForLayers[idx].cols;
    const rows = gridsForLayers[idx].rows;
    le.querySelectorAll('.text-block').forEach(tb => {
      if (typeof fitModuleToGrid === 'function') fitModuleToGrid(tb, le, cols, rows);
    });
  });
}

function repositionRepeatsLayers(layerEls, gridsForLayers) {
  layerEls.forEach((le, idx) => {
    const grid = gridsForLayers[idx];
    if (!grid) return;
    le.querySelectorAll('.repeat-text').forEach(el => {
      const col = parseInt(el.dataset.col, 10) || 0;
      const row = parseInt(el.dataset.row, 10) || 0;
      const jitterX = parseFloat(el.dataset.jitterX) || 0;
      const jitterY = parseFloat(el.dataset.jitterY) || 0;
      const rot = el.dataset.rot === '90' ? 90 : 0;
      const cellW = le.clientWidth / Math.max(1, grid.cols);
      const cellH = le.clientHeight / Math.max(1, grid.rows);
      const left = Math.round(col * cellW + cellW / 2 + jitterX);
      const top = Math.round(row * cellH + cellH / 2 + jitterY);
      el.style.left = left + 'px';
      el.style.top = top + 'px';
      el.style.transform = `translate(-50%,-50%) rotate(${rot}deg)`;
      el.style.zIndex = '0';
    });
  });
}

function redrawAllLayers() {
  const layerEls = Array.from(preview.querySelectorAll('.layer-container'));
  if (!layerEls.length) {
    drawGrid();
    fitAllModules();
    repositionRepeats();
    return;
  }
  const gridsForLayers = layerEls.map(l => ({ cols: parseInt(l.dataset.cols, 10) || 4, rows: parseInt(l.dataset.rows, 10) || 6 }));
  layerEls.forEach((le, i) => {
    le.querySelectorAll('.grid-line, svg.grid-overlay').forEach(n => n.remove());
    drawGridOnLayer(le, gridsForLayers[i]);
  });
  fitAllModulesLayers(layerEls, gridsForLayers);
  repositionRepeatsLayers(layerEls, gridsForLayers);
}

/* GET text modules from inputs */

function getTextModules() {
  const modules = [];

  // date first (low weight)
  const dateEl = document.getElementById('date');
  if (dateEl && dateEl.value && dateEl.value.trim()) {
    modules.push({ key: 'date', value: dateEl.value.trim(), weight: random });
  }

  // explicit single-line inputs (preferred)
  const explicitEls = [
    { id: 'headline', key: 'headline', weight: 900 },
    { id: 'sub', key: 'sub', weight: 500 },
    { id: 'info', key: 'info', weight: 300 }
  ].map(def => ({ el: document.getElementById(def.id), key: def.key, weight: def.weight }))
   .filter(x => x.el);

  if (explicitEls.length) {
    explicitEls.forEach(item => {
      const v = (item.el.value || '').trim();
      if (v) modules.push({ key: item.key, value: v, weight: item.weight });
    });
  } else {
    // fallback: use all textareas inside #aside
    document.querySelectorAll('#aside textarea').forEach((ta, idx) => {
      const v = (ta.value || '').trim();
      if (v) modules.push({ key: `textarea_${idx}`, value: v, weight: 400 });
    });
  }

  return modules;
}

/* init flatpickr (if available) */
(function initDatePicker(){
  const dateInput = document.getElementById('date');
  if (!dateInput || typeof flatpickr !== 'function') return;
  flatpickr(dateInput, {
    mode: 'range',
    allowInput: true,
    dateFormat: 'd.m.Y',
    locale: 'en',
    clickOpens: true
  });
})();

/* -------------------------
   Repeating decorative text
   ------------------------- */
function createRepeatingText(modules, previewEl, grid) {
  const cols = grid.cols;
  const rows = grid.rows;
  const cellW = previewEl.clientWidth / Math.max(1, cols);
  const cellH = previewEl.clientHeight / Math.max(1, rows);

  const source = modules.length ? modules.map(m => m.value) : ['repeat'];
  const count = randInt(4, 12);

  for (let i = 0; i < count; i++) {
    const txt = choice(source);
    const el = document.createElement('div');
    el.className = 'repeat-text';
    el.innerText = txt;
    const fs = randInt(8, 18);
    el.style.position = 'absolute';
    el.style.fontSize = fs + 'px';
    el.style.pointerEvents = 'none';
    el.style.color = '#000';
    el.style.fontFamily = '"Helvetica", sans-serif';
    el.style.whiteSpace = 'nowrap';
    el.style.transform = `translate(-50%,-50%) rotate(${Math.random() < 0.2 ? 90 : 0}deg)`;
    const col = randInt(0, Math.max(0, cols - 1));
    const row = randInt(0, Math.max(0, rows - 1));
    const jitterX = (Math.random() - 0.5) * (cellW * 0.2);
    const jitterY = (Math.random() - 0.5) * (cellH * 0.2);
    el.dataset.col = col;
    el.dataset.row = row;
    el.dataset.jitterX = jitterX;
    el.dataset.jitterY = jitterY;
    el.dataset.rot = Math.random() < 0.2 ? '90' : '0';
    previewEl.appendChild(el);
  }
}

function repositionRepeats() {
  const layerEls = Array.from(preview.querySelectorAll('.layer-container'));
  if (layerEls.length) {
    const grids = layerEls.map(l => ({ cols: parseInt(l.dataset.cols, 10) || 4, rows: parseInt(l.dataset.rows, 10) || 6 }));
    repositionRepeatsLayers(layerEls, grids);
    return;
  }
  const cols = currentGrid.cols || 4;
  const rows = currentGrid.rows || 6;
  const cellW = preview.clientWidth / Math.max(1, cols);
  const cellH = preview.clientHeight / Math.max(1, rows);

  preview.querySelectorAll('.repeat-text').forEach(el => {
    const col = parseInt(el.dataset.col, 10) || 0;
    const row = parseInt(el.dataset.row, 10) || 0;
    const jitterX = parseFloat(el.dataset.jitterX) || 0;
    const jitterY = parseFloat(el.dataset.jitterY) || 0;
    const rot = el.dataset.rot === '90' ? 90 : 0;
    const left = Math.round(col * cellW + cellW / 2 + jitterX);
    const top = Math.round(row * cellH + cellH / 2 + jitterY);
    el.style.left = left + 'px';
    el.style.top = top + 'px';
    el.style.transform = `translate(-50%,-50%) rotate(${rot}deg)`;
    el.style.zIndex = '0';
  });
}

// Replace the top of the generate handler so it doesn't rely on scaling
// ...existing code...
btnGenerate.addEventListener('click', () => {
  // ensure preview has explicit pixel size before generation (no scaling)
  const rect = preview.getBoundingClientRect();
  preview.style.width = Math.round(rect.width) + 'px';
  preview.style.height = Math.round(rect.height) + 'px';

  // remove transform/scale setup (scaling disabled)
  // preview.style.transformOrigin = 'top left';
  // preview.style.transform = `scale(${currentScale})`;

  preview.querySelectorAll('.layer-container, .text-block, .grid-line, .repeat-text').forEach(el => el.remove());
  const modules = getTextModules();
  if (modules.length === 0) { showCustomAlert('please fill in at least one text field!', 'missing content'); return; }
  const layerCount = Math.max(1, Math.min(4, Math.round(Math.random() * 3) + 1));
  const gridsForLayers = pickRandomLayerGrids(layerCount);
  const layerEls = createLayerContainers(gridsForLayers);
  layerEls.forEach((le, i) => drawGridOnLayer(le, gridsForLayers[i]));
  placeModulesAcrossLayers(modules, layerEls, gridsForLayers);
  fitAllModulesLayers(layerEls, gridsForLayers);
  repositionRepeatsLayers(layerEls, gridsForLayers);
  applyRandomTypography(preview);

  updateGridVisibility();
});

function placeModulesAcrossLayers(modules, layerEls, gridsForLayers) {
  if (!modules || modules.length === 0) return;
  const sorted = modules.slice().sort((a, b) => (b.weight || 0) - (a.weight || 0));
  const layerCount = layerEls.length;
  const chunk = Math.ceil(sorted.length / Math.max(1, layerCount));
  sorted.forEach((mod, idx) => {
    const group = Math.min(Math.floor(idx / chunk), layerCount - 1);
    const layerIndex = Math.max(0, layerCount - 1 - group);
    const targetLayer = layerEls[layerIndex];
    const grid = gridsForLayers[layerIndex];
    placeModuleOnGrid(mod, targetLayer, grid.cols, grid.rows);
  });
  const bgCount = Math.max(1, Math.min(layerCount - 1, 2));
  for (let i = 0; i < bgCount; i++) {
    const bgLayer = layerEls[i];
    const grid = gridsForLayers[i];
    if (typeof createRepeatingText === 'function') {
      createRepeatingText(modules, bgLayer, grid);
    }
    bgLayer.querySelectorAll('.repeat-text').forEach(r => r.style.pointerEvents = 'none');
  }
}


/* -------------------------
   Simplified preview sizing (scaling removed)
   ------------------------- */
function initPreviewBaseSize() {
  // set explicit pixel size from computed layout only (no horizontal positioning)
  const rect = preview.getBoundingClientRect();
  preview.style.position = preview.style.position || 'absolute';
  // lock computed pixel width/height so layout doesn't scale unexpectedly
  preview.style.width = Math.round(rect.width) + 'px';
  preview.style.height = Math.round(rect.height) + 'px';
  preview.style.cursor = 'grab';
}
initPreviewBaseSize();

// Replace the simple mousemove handler with the reliable pointer-based drag implementation
// (enables two-axis dragging; initial horizontal centering is provided by CSS until the user moves)
let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;
let hasUserMoved = false; // becomes true once the user starts moving the preview (switches from CSS centering to JS control)

if (preview) {
  // ensure preview positioned and cursor set
  if (getComputedStyle(preview).position === 'static') preview.style.position = 'absolute';
  preview.style.cursor = preview.style.cursor || 'grab';

  const clamp = (v, a, b) => Math.max(a, Math.min(v, b));

  preview.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    // get current visual rect BEFORE mutating styles
    const rect = preview.getBoundingClientRect();

    const parent = preview.offsetParent || preview.parentElement || document.body;
    const pRect = parent.getBoundingClientRect();

    // If this is the first manual move, convert from CSS centering to JS-controlled
    // absolute positioning by setting inline left/top to the current visual position
    // (calculated from the visual rect), then clear the centering transform so
    // inline left/top take effect. After that recompute drag offsets relative
    // to the parent so the pointer doesn't jump on first move.
    if (!preview.style.left) {
      const leftInParent = rect.left - pRect.left + (parent.scrollLeft || 0);
      const topInParent = rect.top - pRect.top + (parent.scrollTop || 0);
      preview.style.left = Math.round(leftInParent) + 'px';
      preview.style.top = Math.round(topInParent) + 'px';
      // clear any stylesheet centering transform by overriding inline
      preview.style.transform = 'none';
      hasUserMoved = true;
      // recompute offsets so dragging starts smoothly from the pointer location
      dragOffsetX = e.clientX - (pRect.left + leftInParent);
      dragOffsetY = e.clientY - (pRect.top + topInParent);
    } else {
      // ensure top exists if only left was set previously
      if (!preview.style.top) {
        const topInParent = rect.top - pRect.top + (parent.scrollTop || 0);
        preview.style.top = Math.round(topInParent) + 'px';
      }
      // fall back to computing offsets from the current rect
      dragOffsetX = e.clientX - rect.left;
      dragOffsetY = e.clientY - rect.top;
    }

    isDragging = true;
    try { preview.setPointerCapture(e.pointerId); } catch (err) { /* noop */ }
    preview.style.cursor = 'grabbing';
    e.preventDefault();
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;

    const parent = preview.offsetParent || preview.parentElement || document.body;
    const pRect = parent.getBoundingClientRect();
    const visualW = preview.offsetWidth || preview.getBoundingClientRect().width;
    const visualH = preview.offsetHeight || preview.getBoundingClientRect().height;

    // target in viewport -> convert to parent coords for both axes
    const targetLeft = e.clientX - dragOffsetX;
    const targetTop  = e.clientY - dragOffsetY;
    let newLeft = targetLeft - pRect.left + (parent.scrollLeft || 0);
    let newTop  = targetTop  - pRect.top  + (parent.scrollTop  || 0);

    const maxLeft = Math.max(0, (parent.clientWidth || Math.round(pRect.width)) - visualW);
    const maxTop  = Math.max(0, (parent.clientHeight || Math.round(pRect.height)) - visualH);

    newLeft = clamp(newLeft, 0, maxLeft);
    newTop  = clamp(newTop, 0, maxTop);

    preview.style.left = Math.round(newLeft) + 'px';
    preview.style.top  = Math.round(newTop)  + 'px';

    if (typeof updateResizeHandle === 'function') updateResizeHandle();
  }, { passive: true });

  const endDrag = (e) => {
    if (!isDragging) return;
    isDragging = false;
    try { preview.releasePointerCapture && preview.releasePointerCapture(e.pointerId); } catch (err) { /* noop */ }
    preview.style.cursor = 'grab';
  };
  window.addEventListener('pointerup', endDrag, { passive: true });
  window.addEventListener('pointercancel', endDrag, { passive: true });
}

// debounce helper for resize
function debounce(fn, wait = 120) {
  let t;
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

// On resize: re-lock width/height and, if user already moved the preview,
// clamp inline left/top so the preview stays visible.
window.addEventListener('resize', debounce(() => {
  initPreviewBaseSize();
  if (!preview) return;
  if (hasUserMoved) {
    const parent = preview.offsetParent || preview.parentElement || document.body;
    const pRect = parent.getBoundingClientRect();
    const visualW = preview.offsetWidth || preview.getBoundingClientRect().width;
    const visualH = preview.offsetHeight || preview.getBoundingClientRect().height;
    const maxLeft = Math.max(0, (parent.clientWidth || Math.round(pRect.width)) - visualW);
    const maxTop  = Math.max(0, (parent.clientHeight || Math.round(pRect.height)) - visualH);

    if (preview.style.left) {
      let left = parseFloat(preview.style.left) || 0;
      left = Math.max(0, Math.min(left, maxLeft));
      preview.style.left = Math.round(left) + 'px';
    }
    if (preview.style.top) {
      let top = parseFloat(preview.style.top) || 0;
      top = Math.max(0, Math.min(top, maxTop));
      preview.style.top = Math.round(top) + 'px';
    }
  }
}), { passive: true });



// DIESER CODE WURDE HINZUGEFÜGT





// 1) EINE HILFsFUNKTION; DIE DEN INLINE STYLE (SVG UNTERSTÜTZT CSS NICHT RICHTIG ALS EIGENES FILE…)
function inlineComputedStyles(source, target) {
  const srcEls = source.querySelectorAll('*');
  const tgtEls = target.querySelectorAll('*');

  srcEls.forEach((src, i) => {
    const tgt = tgtEls[i];
    if (!tgt) return;

    const cs = getComputedStyle(src);
    let style = '';

    for (const prop of cs) {
      style += `${prop}:${cs.getPropertyValue(prop)};`;
    }

    tgt.setAttribute('style', style);
  });
}

// 2) HILFSFUNKTION ZUM AUSLESEN DER VERWENDETEN SCHRIFTEN
function collectFontFaceCSS(rootEl) {
  const families = new Set();

  rootEl.querySelectorAll('*').forEach(el => {
    const ff = getComputedStyle(el).fontFamily;
    if (ff) {
      ff.split(',').forEach(f =>
        families.add(f.trim().replace(/['"]/g, ''))
      );
    }
  });

  let css = '';

  for (const sheet of document.styleSheets) {
    let rules;
    try {
      rules = sheet.cssRules;
    } catch {
      continue;
    }

    for (const rule of rules) {
      if (
        rule.type === CSSRule.FONT_FACE_RULE &&
        families.has(rule.style.fontFamily.replace(/['"]/g, ''))
      ) {
        css += rule.cssText + '\n';
      }
    }
  }

  return css;
}

// 3) DIE NEUE FUNKTION FÜR DIE PIN
async function capturePreviewAsDataURL(previewEl, scale = 0.25) {
  if (!previewEl) return null;

  await document.fonts.ready;

  const rect = previewEl.getBoundingClientRect();
  const w = Math.max(1, Math.round(rect.width));
  const h = Math.max(1, Math.round(rect.height));

  const clone = previewEl.cloneNode(true);

  clone.removeAttribute('id');
  clone.querySelectorAll('[id]').forEach(n => n.removeAttribute('id'));
  clone.querySelectorAll(
    'button, input, textarea, .preview-resize-handle, .preview-toolbar, .debug-overlay'
  ).forEach(n => n.remove());

  clone.style.boxSizing = 'border-box';
  clone.style.width = w + 'px';
  clone.style.height = h + 'px';
  clone.style.position = 'static';
  clone.style.left = '0';
  clone.style.top = '0';
  clone.style.right = 'auto';
  clone.style.bottom = 'auto';
  clone.style.transform = 'none';
  clone.style.translate = 'none';

  inlineComputedStyles(previewEl, clone);

  const fontCSS = collectFontFaceCSS(previewEl);
  const serialized = new XMLSerializer().serializeToString(clone);

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <style>
    ${fontCSS}
  </style>
  <rect fill="transparent" x="0" y="0" width="20" height="20" />
  <foreignObject x="0" y="0" width="100%" height="100%" >
    <div xmlns="http://www.w3.org/1999/xhtml" >
      ${serialized}
    </div>
  </foreignObject>
</svg>
`;

  const img = new Image();

  return new Promise(resolve => {
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(w * scale);
      canvas.height = Math.round(h * scale);

      const ctx = canvas.getContext('2d');
      const bg = getComputedStyle(previewEl).backgroundColor;

      ctx.fillStyle =
        bg && bg !== 'rgba(0,0,0,0)' ? bg : '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = () => resolve(null);
    img.src =
      'data:image/svg+xml;charset=utf-8,' +
      encodeURIComponent(svg);
  });
}

// ENDE PHIIPPS CODE 

function savePinnedDataUrl(dataUrl) {
  if (!dataUrl) return;
  try {
    const raw = localStorage.getItem('pinnedPreviews');
    const arr = raw ? JSON.parse(raw) : [];
    arr.unshift({ ts: Date.now(), img: dataUrl });
    // If adding this item would make the pinned array exceed 100,
    // wipe the archive as requested (remove the 'pinnedPreviews' key).
    // Otherwise persist the newest 100 entries.
    if (Array.isArray(arr) && arr.length > 100) {
      try {
        localStorage.removeItem('pinnedPreviews');
        // optional: could also notify the user here via UI if desired
        console.warn('Pinned previews exceeded 100 — archive wiped.');
      } catch (rmErr) {
        // swallow removal errors to avoid breaking flow
      }
    } else {
      // keep only the newest N entries to avoid filling up localStorage
      // (data URLs can be large; reduce cap to 100 to keep usage reasonable)
      localStorage.setItem('pinnedPreviews', JSON.stringify(arr.slice(0, 100)));
    }
  } catch (e) { /* ignore storage errors */ }
}

/* existing IIFE that clones and appends into #pinned-sidebar
   now also persists a dataURL and ensures clicking sidebar navigates to archive.html */
(function () {
  const pinBtn = document.getElementById('btn-pin');
  const sidebar = document.getElementById('pinned-sidebar');
  if (!pinBtn) return;

  if (sidebar) {
    sidebar.style.cursor = 'pointer';
    // define handler before attaching to avoid ReferenceError
    function pinnedSidebarToArchive() { window.location.href = './archive.html'; }
    sidebar.removeEventListener('click', pinnedSidebarToArchive);
    sidebar.addEventListener('click', pinnedSidebarToArchive);
  }

  pinBtn.addEventListener('click', async () => {
    const previewEl = document.getElementById('preview');
    const sidebarEl = document.getElementById('pinned-sidebar');
    if (!previewEl || !sidebarEl) return;

    // require at least one generated layout element before allowing pin
    // (no action if user hasn't generated anything yet)
    if (previewEl.querySelectorAll('.layer-container, .text-block, .repeat-text').length === 0) {
      return;
    }

    // --- existing clone + append (keeps behavior you like) ---
    const card = document.createElement('div');
    card.className = 'pinned-card sidebar-item';

    const wrapper = document.createElement('div');
    wrapper.className = 'thumb-wrapper';

    const clone = previewEl.cloneNode(true);
    clone.removeAttribute('id');
    clone.querySelectorAll('[id]').forEach(n => n.removeAttribute('id'));
    clone.querySelectorAll('button, input, textarea, .preview-resize-handle, .preview-toolbar, .resize-handle, .debug-overlay').forEach(n => n.remove());

    clone.className = 'thumb-clone';
    const srcW = previewEl.offsetWidth || previewEl.getBoundingClientRect().width;
    const srcH = previewEl.offsetHeight || previewEl.getBoundingClientRect().height;
    clone.style.width = srcW + 'px';
    clone.style.height = srcH + 'px';
    clone.style.boxSizing = 'border-box';

    wrapper.appendChild(clone);
    card.appendChild(wrapper);
    sidebarEl.appendChild(card);

    const availW = Math.max(1, wrapper.clientWidth);
    const availH = Math.max(1, wrapper.clientHeight);
    const scale = Math.min(availW / srcW, availH / srcH);
    clone.style.transform = `translate(-50%,-50%) scale(${scale})`;

    card.scrollIntoView({ behavior: 'smooth', block: 'end' });

    // --- new: also capture a persistent dataURL and save to localStorage for the archive ---
    const dataUrl = await capturePreviewAsDataURL(previewEl, 0.25);
    if (dataUrl) savePinnedDataUrl(dataUrl);
  });

  const btn = document.getElementById('btn-archive');
  if (btn) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = './archive.html';
    });
  }

// Quick hide/show grids helper ------------------------------------------------
// Set HIDE_GRIDS_DEFAULT = true to start with grids hidden for quick visual checks.
const HIDE_GRIDS_DEFAULT = true;
let gridsHidden = !!HIDE_GRIDS_DEFAULT;

function updateGridVisibility() {
  // target all grid lines (single-layer and per-layer) and any SVG/grid overlays
  const nodes = document.querySelectorAll('.grid-line, svg.grid-overlay');
  nodes.forEach(n => {
    n.style.display = gridsHidden ? 'none' : '';
  });
  // also hide entire layer outlines if you want (optional)
  // document.querySelectorAll('.layer-container').forEach(l => l.style.outline = gridsHidden ? 'none' : '');
}

// programmatic toggle
function toggleGridVisibility(show) {
  if (typeof show === 'boolean') gridsHidden = !show;
  else gridsHidden = !gridsHidden;
  updateGridVisibility();
  console.log('Grid visibility -> hidden:', gridsHidden);
  return !gridsHidden;
}

// keyboard shortcut: Ctrl/Cmd + X toggles grid
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'x') {
    toggleGridVisibility();
  }
});

// initialize visibility on load
document.addEventListener('DOMContentLoaded', updateGridVisibility);

// expose for console debugging
window.toggleGridVisibility = toggleGridVisibility;
window.updateGridVisibility = updateGridVisibility; 

})();

/* small wiggle on button press/click/keyboard activation
   - pointerdown gives immediate feedback for mouse/touch
   - keydown handles Enter / Space when button has focus
*/
(function enableButtonWiggle() {
  const DURATION_MS = 20;      // must match --wiggle-duration in CSS
  const ITERATIONS = 7;         // must match --wiggle-iterations in CSS
  const BUFFER = 60;            // small safety buffer
  const TOTAL_MS = DURATION_MS * ITERATIONS + BUFFER;

  function triggerWiggle(btn) {
    if (!btn || !btn.classList) return;
    if (btn.classList.contains('wiggle')) return;
    btn.classList.add('wiggle');
    setTimeout(() => btn.classList.remove('wiggle'), TOTAL_MS);
  }

  // pointerdown covers mouse/touch immediacy
  document.addEventListener('pointerdown', (ev) => {
    const btn = ev.target.closest && ev.target.closest('button');
    if (btn) triggerWiggle(btn);
  }, { capture: true });

  // keyboard activation (Space / Enter) when a button is focused
  document.addEventListener('keydown', (ev) => {
    const active = document.activeElement;
    if (!active || active.tagName !== 'BUTTON') return;
    if (ev.key === 'Enter' || ev.key === ' ' || ev.key === 'Spacebar') {
      triggerWiggle(active);
    }
  });
})();

(function enableButtonWiggle() {
  const DURATION_MS = 280;      // should match --wiggle-duration in CSS
  const ITERATIONS = 7;         // should match --wiggle-iterations in CSS
  const BUFFER = 60;
  const TOTAL_MS = DURATION_MS * ITERATIONS + BUFFER;

  const ROTATE_MS = 420; // matches animation-duration in CSS for rotate30

  function triggerWiggle(btn) {
    if (!btn || !btn.classList) return;
    // skip wiggle for special rotating buttons to avoid transform conflicts
    if (btn.id === 'btn-archive' || btn.id === 'btn-back') return;
    if (btn.classList.contains('wiggle')) return;
    btn.classList.add('wiggle');
    setTimeout(() => btn.classList.remove('wiggle'), TOTAL_MS);
  }

  function triggerRotate(btn) {
    if (!btn || !btn.classList) return;
    if (btn.classList.contains('rotate-30')) return;
    btn.classList.add('rotate-30');
    setTimeout(() => btn.classList.remove('rotate-30'), ROTATE_MS + 40);
  }

  // pointerdown covers mouse/touch immediacy
  document.addEventListener('hover', (ev) => {
    const btn = ev.target.closest && ev.target.closest('button');
    if (!btn) return;
    if (btn.id === 'btn-archive' || btn.id === 'btn-back') {
      triggerRotate(btn);
    } else {
      triggerWiggle(btn);
    }
  }, { capture: true });

  // keyboard activation (Space / Enter) when a button is focused
  document.addEventListener('keydown', (ev) => {
    const active = document.activeElement;
    if (!active || active.tagName !== 'BUTTON') return;
    if (ev.key === 'Enter' || ev.key === ' ' || ev.key === 'Spacebar') {
      if (active.id === 'btn-archive' || active.id === 'btn-back') triggerRotate(active);
      else triggerWiggle(active);
    }
  });
})();