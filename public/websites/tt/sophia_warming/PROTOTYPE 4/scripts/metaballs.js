// Distortion renderer (adjusted slider mapping: baseline becomes slider minimum,
// maximum mapped to a much stronger intensity).
// Rasterize text to a high-res mask, then apply stronger fractal value-noise,
// interior seeding, morphological dilation/erosion to produce filled, fragmented blobs.
// Slider controls intensity. No external libraries required.
(function () {
  // DOM canvas and drawing contexts
  let canvas, ctx;
  let width = 800, height = 220;            // visible canvas logical resolution (will be set from CSS)
  let DPR = Math.max(1, window.devicePixelRatio || 1);

  // Offscreen mask canvas (high resolution)
  let maskW = 800, maskH = 220;             // processing resolution (updated from CSS * DPR)
  let maskCanvas, maskCtx;

  // temporary arrays
  let textMask;     // Uint8ClampedArray length maskW*maskH (0/1)
  let outMask;      // Uint8ClampedArray length maskW*maskH (0/1)

  // Slider mapping constants: change these to tune baseline and maximum intensity
  // MIN_S is what slider==0 will produce (baseline distortion).
  // MAX_S is what slider==100 will produce (very intense).
  const MIN_S = 15;   // baseline (was effectively >0 in your current screenshot)
  const MAX_S = 420;  // very strong maximum — increase to make even more intense

  // initialize
  function init(canvasEl) {
    canvas = canvasEl;
    ctx = canvas.getContext('2d');

    updateSizesFromCSS();

    // create offscreen mask canvas
    maskCanvas = document.createElement('canvas');
    maskCanvas.width = maskW;
    maskCanvas.height = maskH;
    maskCtx = maskCanvas.getContext('2d');

    textMask = new Uint8ClampedArray(maskW * maskH);
    outMask = new Uint8ClampedArray(maskW * maskH);

    console.log('metaballs renderer initialized', { width, height, maskW, maskH, DPR, MIN_S, MAX_S });
  }

  function updateSizesFromCSS() {
    const styleW = Math.max(200, Math.round((canvas && canvas.offsetWidth) || 800));
    const styleH = Math.max(80, Math.round((canvas && canvas.offsetHeight) || 220));
    DPR = Math.max(1, window.devicePixelRatio || 1);

    width = Math.round(styleW * DPR);
    height = Math.round(styleH * DPR);
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = styleW + 'px';
    canvas.style.height = styleH + 'px';

    // High-res processing (downscale = 1). Change to 1.5 or 2 for performance.
    const downscale = 1;
    const newMaskW = Math.max(160, Math.floor(styleW * DPR / downscale));
    const newMaskH = Math.max(48, Math.floor(styleH * DPR / downscale));

    if (!textMask || textMask.length !== newMaskW * newMaskH) {
      maskW = newMaskW;
      maskH = newMaskH;

      if (!maskCanvas) maskCanvas = document.createElement('canvas');
      maskCanvas.width = maskW;
      maskCanvas.height = maskH;
      maskCtx = maskCanvas.getContext('2d');

      textMask = new Uint8ClampedArray(maskW * maskH);
      outMask = new Uint8ClampedArray(maskW * maskH);

      console.log('mask resized', { maskW, maskH });
    }
  }

  // ===== value noise (fast, coherent) =====
  function hash(x, y) {
    let n = x + y * 57;
    n = (n << 13) ^ n;
    return (1.0 - ((n * (n * n * 15731 + 789221) + 1376312589) & 0x7fffffff) / 1073741824.0);
  }
  function valueNoise(x, y) {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = x - xi;
    const yf = y - yi;

    const v00 = hash(xi, yi);
    const v10 = hash(xi + 1, yi);
    const v01 = hash(xi, yi + 1);
    const v11 = hash(xi + 1, yi + 1);

    function smooth(t) { return t * t * (3 - 2 * t); }
    const sx = smooth(xf);
    const sy = smooth(yf);

    const ix0 = v00 * (1 - sx) + v10 * sx;
    const ix1 = v01 * (1 - sx) + v11 * sx;
    return ix0 * (1 - sy) + ix1 * sy;
  }

  function fractalNoise(x, y, octaves) {
    let sum = 0, amp = 1, freq = 1, max = 0;
    for (let i = 0; i < octaves; i++) {
      sum += (valueNoise(x * freq, y * freq)) * amp;
      max += amp;
      amp *= 0.5;
      freq *= 2;
    }
    return sum / max;
  }

  // ===== rasterize text into binary mask at mask resolution =====
  function rasterizeText(lines, fontSizePx) {
    // opaque white background to avoid alpha confusion
    maskCtx.clearRect(0, 0, maskW, maskH);
    maskCtx.fillStyle = '#fff';
    maskCtx.fillRect(0, 0, maskW, maskH);

    maskCtx.fillStyle = '#000';
    maskCtx.textAlign = 'center';
    maskCtx.textBaseline = 'middle';

    const fs = Math.max(6, Math.floor(fontSizePx * (maskW / Math.max(1, width))));
    for (let i = 0; i < lines.length; i++) {
      const yPos = Math.floor((i + 0.5) * (maskH / lines.length));
      maskCtx.font = `bold ${fs}px Arial, Helvetica, sans-serif`;
      maskCtx.fillText(lines[i] || '', maskW / 2, yPos);
    }

    const im = maskCtx.getImageData(0, 0, maskW, maskH).data;
    for (let p = 0, i = 0; p < im.length; p += 4, i++) {
      textMask[i] = im[p] < 128 ? 1 : 0;
    }
  }

  // ===== edge detection =====
  function computeEdgeMask(srcMask, edgeMaskOut) {
    const w = maskW, h = maskH;
    edgeMaskOut.fill(0);
    for (let y = 1; y < h - 1; y++) {
      let row = y * w;
      for (let x = 1; x < w - 1; x++) {
        const p = row + x;
        const v = srcMask[p];
        if (v) {
          if (!srcMask[p - 1] || !srcMask[p + 1] || !srcMask[p - w] || !srcMask[p + w]) {
            edgeMaskOut[p] = 1;
          }
        }
      }
    }
  }

  // ===== morphological ops =====
  function dilate(mask, w, h) {
    const out = new Uint8ClampedArray(w * h);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const p = y * w + x;
        if (mask[p]) { out[p] = 1; continue; }
        let any = false;
        for (let oy = -1; oy <= 1 && !any; oy++) {
          for (let ox = -1; ox <= 1 && !any; ox++) {
            if (ox === 0 && oy === 0) continue;
            const nx = x + ox, ny = y + oy;
            if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
            if (mask[ny * w + nx]) any = true;
          }
        }
        out[p] = any ? 1 : 0;
      }
    }
    return out;
  }

  function erode(mask, w, h) {
    const out = new Uint8ClampedArray(w * h);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const p = y * w + x;
        if (!mask[p]) { out[p] = 0; continue; }
        let ok = true;
        if (x > 0 && !mask[p - 1]) ok = false;
        if (x < w - 1 && !mask[p + 1]) ok = false;
        if (y > 0 && !mask[p - w]) ok = false;
        if (y < h - 1 && !mask[p + w]) ok = false;
        out[p] = ok ? 1 : 0;
      }
    }
    return out;
  }

  // ===== distortion: intense fragmentation + filled shapes =====
  function distortMask(distortion) {
    // distortion is a numeric "s" that can exceed 100 (we normalize by /100 for relative strength)
    const s = Math.max(0, distortion / 100); // s may be >1 at maximum
    outMask.fill(0);

    if (s <= 0.001) {
      for (let i = 0; i < textMask.length; i++) outMask[i] = textMask[i];
      return;
    }

    const edge = new Uint8ClampedArray(maskW * maskH);
    computeEdgeMask(textMask, edge);

    // stronger parameters; scale with s (s can exceed 1)
    const maxDisp = Math.max(2, Math.round(2 + s * 28)); // displacement grows with s
    const octaves = 5;
    const noiseScale = Math.max(0.008, 0.015 * (1 / (1 + s * 0.2))); // scale adjusts with s
    const seedProb = Math.min(0.8, 0.04 + s * 0.45); // more interior seeds when s grows
    const holeProb = Math.min(0.9, 0.06 + s * 0.7);

    // displaced edges (place many moved edge pixels)
    for (let y = 1; y < maskH - 1; y++) {
      const row = y * maskW;
      for (let x = 1; x < maskW - 1; x++) {
        const p = row + x;
        if (!edge[p]) continue;
        const fx = fractalNoise(x * noiseScale, y * noiseScale, octaves) * 2 - 1;
        const fy = fractalNoise((x + 7000) * noiseScale, (y + 7000) * noiseScale, octaves) * 2 - 1;
        const dx = Math.round(fx * maxDisp);
        const dy = Math.round(fy * maxDisp);
        const nx = Math.min(maskW - 1, Math.max(0, x + dx));
        const ny = Math.min(maskH - 1, Math.max(0, y + dy));
        const np = ny * maskW + nx;
        if (Math.random() > 0.01) outMask[np] = 1;
        if (Math.random() < holeProb * 0.08) outMask[np] = 0;
      }
    }

    // interior seeding
    for (let i = 0; i < textMask.length; i++) {
      if (textMask[i] && Math.random() < seedProb) {
        outMask[i] = 1;
      }
    }

    // stochastic removal of some pixels
    for (let i = 0; i < outMask.length; i++) {
      if (outMask[i] && Math.random() < Math.min(0.7, 0.02 + s * 0.6)) {
        outMask[i] = 0;
      }
    }

    // morphological fill: more dilation iterations at higher s
    const dilIterations = Math.max(2, Math.round(2 + s * 12));
    let temp = outMask;
    for (let k = 0; k < dilIterations; k++) {
      temp = dilate(temp, maskW, maskH);
    }
    const erodeIterations = Math.round(Math.max(0, s * 2));
    for (let k = 0; k < erodeIterations; k++) {
      temp = erode(temp, maskW, maskH);
    }

    // remove tiny specks
    for (let i = 0; i < temp.length; i++) {
      if (temp[i]) {
        const x = i % maskW, y = Math.floor(i / maskW);
        let c = 0;
        for (let oy = -1; oy <= 1; oy++) {
          for (let ox = -1; ox <= 1; ox++) {
            const nx = x + ox, ny = y + oy;
            if (nx < 0 || nx >= maskW || ny < 0 || ny >= maskH) continue;
            if (temp[ny * maskW + nx]) c++;
          }
        }
        if (c < 2 && Math.random() < 0.95) temp[i] = 0;
      }
    }

    outMask.set(temp);
  }

  // ===== draw mask to visible canvas (upscale) =====
  function drawMaskToCanvas() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#000';
    const sx = width / maskW;
    const sy = height / maskH;
    for (let y = 0; y < maskH; y++) {
      const row = y * maskW;
      for (let x = 0; x < maskW; x++) {
        if (outMask[row + x]) {
          ctx.fillRect(Math.floor(x * sx), Math.floor(y * sy), Math.ceil(sx), Math.ceil(sy));
        }
      }
    }
  }

  // ===== public render function =====
  function render(distortionValue) {
    if (!canvas || !ctx) return;
    updateSizesFromCSS();

    // Map UI slider (0..100) into our internal distortion range (MIN_S..MAX_S)
    const v = Math.max(0, Math.min(100, Number(distortionValue) || 0));
    const mappedS = MIN_S + (v / 100) * (MAX_S - MIN_S); // mappedS can be >>100

    const payload = (window.metaballUI && window.metaballUI.getTextLines && window.metaballUI.getTextLines());
    const lines = payload || ['', '', ''];

    const baseFontPx = Math.floor(maskH / 2.6);
    rasterizeText(lines, baseFontPx);

    // apply distortion (mappedS used by distortMask; when mappedS small it's subtle)
    if (mappedS <= 0.5) {
      outMask.fill(0);
      for (let i = 0; i < textMask.length; i++) outMask[i] = textMask[i];
    } else {
      distortMask(mappedS);
    }

    drawMaskToCanvas();
  }

  // expose
  window.metaballs = { init, render };

  // auto re-render on resize using current slider value
  window.addEventListener('resize', () => {
    if (window.metaballs && typeof window.metaballs.render === 'function') {
      const v = Number((document.getElementById('slider-distortion') || { value: 0 }).value);
      window.metaballs.render(v);
    }
  });
})();