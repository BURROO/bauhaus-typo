// ===== Game State =====
const gameState = {
    gridSize: 10,
    cellSize: CANVAS_SIZE / 10,
    birds: [],
    foods: [],
    frameCount: 0,
    stepOnceDirection: 0, // -1 for backward, +1 for forward step when paused
    isPaused: false,
    soundEnabled: true,
    soundVolume: 0.0,
    useGridMovement: true,
    backgroundVisible: true, // Background visibility state
    // per-flock home weight (can be tuned via UI)
    homeWeight: HOME_WEIGHT,
    // global speed multiplier for movement
    speedMultiplier: 1.0,
    shapeMode: 1,
    useRandomShapes: false, // Toggle between fixed shape mode and random per-bird shapes
    birdSizeScale: 1.0,
    sepWeight: 1.0,
    aliWeight: 1.0,
    cohWeight: 1.0,
    wordBuffer: 'BIRDS', // default text
    previousWordBuffer: 'BIRDS',
    wallBehavior: DEFAULT_WALL_BEHAVIOR,
    // Homing/flocking phase state
    homingPhase: false,
    homingLastToggle: Date.now(),
    homingCycleMs: HOMING_CYCLE_MS,
    homingPhaseStartTime: Date.now(),
    // homing tuning defaults (can be overridden by UI later)
    homingRampMs: HOMING_RAMP_MS,
    homingDamping: HOMING_DAMPING,
    homingNoiseReduction: HOMING_NOISE_REDUCTION,
    homingAlignmentBoost: 1.6,
    mouseX: -1000,
    mouseY: -1000,
    // per-bird random offset range in pixels (applied as +/- range)
    offsetRange: 0,
    // grid display toggle
    renderOffsetY: 0,
    renderGridWidth: 0,
    renderGridHeight: 0,
    spawnOffsetRows: 0,
    // Font case support flags
    fontSupportsUppercase: true,  // Default font supports uppercase
    fontSupportsLowercase: false, // Default font does not support lowercase
    supportedUppercase: null,
    supportedLowercase: null,
    // Frame history (max 20 frames)
    frameHistory: [],
    maxHistoryFrames: 20,
    // Image upload mode
    imageMode: false,
    imageMask: null,
    imageSource: null
};

let canvas;
// Offscreen canvas used only for recording so live view stays unchanged
let recordCanvas = null;
let recordCtx = null;
// Offscreen mask buffers for JS gooey (pure-black blobs)
let offscreenMask = null;
let offCtxMask = null;
let offscreenMaskBlur = null;
let offCtxMaskBlur = null;
let offscreenComposite = null;
let offCtxComposite = null;
let gooBlur = 0; // default blur in px (0 = no goo effect)
// Background image for canvas captures
let backgroundImage = null;
let backgroundReady = false;
// Backup of original GLYPHS for restoring default font
let originalGLYPHS = null;

// ===== Bird Audio =====
const birdAudio = {
    ctx: null,
    master: null,
    lastPlay: 0,
    ensureContext() {
        if (this.ctx) return true;
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return false;
        this.ctx = new AudioCtx();
        this.master = this.ctx.createGain();
        // Initialize master gain based on current sound settings
        const initialVol = (typeof gameState !== 'undefined' && gameState.soundEnabled)
            ? (gameState.soundVolume || 1.0)
            : 0.0;
        this.master.gain.value = 0.4 * initialVol;
        this.master.connect(this.ctx.destination);
        return true;
    },
    setVolume(vol) {
        if (!this.ensureContext()) return;
        const ctx = this.ctx;
        // Balanced master gain scale for clear audio without clipping
        const target = 0.4 * Math.max(0, Math.min(1, vol || 0));
        try {
            if (ctx && ctx.currentTime && this.master && this.master.gain) {
                this.master.gain.setTargetAtTime(target, ctx.currentTime, 0.05);
            } else {
                this.master.gain.value = target;
            }
        } catch (e) {
            // Fallback in case setTargetAtTime is unavailable
            this.master.gain.value = target;
        }
    },
    isReady() {
        if (!this.ctx && !this.ensureContext()) return false;
        if (this.ctx.state === 'suspended') this.ctx.resume();
        return this.ctx.state === 'running';
    },
    playChirp(pan = 0, brightness = 0.5) {
        if (!this.isReady()) return;
        const ctx = this.ctx;
        const now = ctx.currentTime;
        if (!Number.isFinite(now) || now < this.lastPlay + 0.02) return;
        this.lastPlay = now;

        // sanitize inputs to avoid non-finite AudioParam writes
        const safePan = Number.isFinite(pan) ? Math.max(-1, Math.min(1, pan)) : 0;
        const safeBright = Number.isFinite(brightness) ? Math.max(0, Math.min(1, brightness)) : 0.5;

        const base = 1500 + 1200 * safeBright + Math.random() * 400;
        const end = base * (0.55 + Math.random() * 0.15);
        // Moderate peak for good volume without distortion
        const peak = 0.15 + Math.random() * 0.07;
        if (!Number.isFinite(base) || !Number.isFinite(end) || !Number.isFinite(peak)) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

        osc.type = 'sine'; // Sine wave is smoother than triangle
        osc.frequency.setValueAtTime(base, now);
        osc.frequency.exponentialRampToValueAtTime(end, now + 0.09);

        // Smoother envelope: very short attack, longer sustain, gentle release
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(peak, now + 0.005); // Fast attack
        gain.gain.linearRampToValueAtTime(peak * 0.7, now + 0.06); // Sustain
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18); // Longer decay

        osc.connect(gain);
        if (panner) {
            panner.pan.setValueAtTime(safePan, now);
            gain.connect(panner);
            panner.connect(this.master);
        } else {
            gain.connect(this.master);
        }

        osc.start(now);
        osc.stop(now + 0.18);
    }
};

// ===== Frame History Management =====
function saveBirdState(bird) {
    return {
        x: bird.x,
        y: bird.y,
        vx: bird.vx || 0,
        vy: bird.vy || 0,
        hx: bird.hx || 0,
        hy: bird.hy || 0,
        homeX: bird.homeX,
        homeY: bird.homeY,
        health: bird.health,
        offsetX: bird.offsetX || 0,
        offsetY: bird.offsetY || 0,
        shapeType: bird.shapeType
    };
}

function restoreBirdState(bird, state) {
    bird.x = state.x;
    bird.y = state.y;
    bird.vx = state.vx;
    bird.vy = state.vy;
    bird.hx = state.hx;
    bird.hy = state.hy;
    bird.homeX = state.homeX;
    bird.homeY = state.homeY;
    bird.health = state.health;
    bird.offsetX = state.offsetX;
    bird.offsetY = state.offsetY;
    bird.shapeType = state.shapeType;
}

function saveGameStateSnapshot(frameIndex) {
    if (!Array.isArray(gameState.frameHistory)) {
        gameState.frameHistory = [];
    }
    
    const snapshot = {
        frameIndex: frameIndex,
        birds: (gameState.birds || []).map(b => saveBirdState(b)),
        foods: (gameState.foods || []).map(f => ({ x: f.x, y: f.y })),
        homingPhase: gameState.homingPhase
    };
    
    gameState.frameHistory.push(snapshot);
    
    // Keep only the last 20 frames
    if (gameState.frameHistory.length > gameState.maxHistoryFrames) {
        gameState.frameHistory.shift();
    }
}

function restoreGameStateSnapshot(frameIndex) {
    const snapshot = gameState.frameHistory.find(s => s.frameIndex === frameIndex);
    if (!snapshot) return false;
    
    // Restore birds
    if (Array.isArray(snapshot.birds) && Array.isArray(gameState.birds)) {
        // Match birds and restore their state
        for (let i = 0; i < Math.min(snapshot.birds.length, gameState.birds.length); i++) {
            restoreBirdState(gameState.birds[i], snapshot.birds[i]);
        }
    }
    
    // Restore foods
    if (Array.isArray(snapshot.foods)) {
        gameState.foods = snapshot.foods.map(f => ({ x: f.x, y: f.y }));
    }
    
    // Restore homing phase
    gameState.homingPhase = snapshot.homingPhase;
    
    return true;
}

function maybeEmitBirdChirp(bird, gameState) {
    if (!gameState.soundEnabled) return;
    if (!birdAudio.isReady()) return;
    const now = performance.now();
    if (!Number.isFinite(now)) return;
    const minGap = 120 + Math.random() * 120;
    if (bird.lastChirpTime && now - bird.lastChirpTime < minGap) return;

    const dims = bird.getGridDimensions ? bird.getGridDimensions(gameState) : null;
    let rawPan = 0;
    if (gameState.useGridMovement) {
        const gridW = dims && Number.isFinite(dims.gridWidth) ? Math.max(1, dims.gridWidth) : 1;
        rawPan = ((bird.x / gridW) - 0.5) * 1.4;
    } else {
        const cw = Math.max(1, gameState.canvasWidth || (canvas ? canvas.width : 1));
        rawPan = ((bird.x / cw) - 0.5) * 1.4;
    }
    const speed = Math.hypot(bird.vx || 0, bird.vy || 0);
    const speedEnergy = Number.isFinite(speed) ? Math.max(0, Math.min(1, speed / 4)) : 0;
    const chance = 0.2 + speedEnergy * 0.6;
    if (Math.random() > chance) return;

    bird.lastChirpTime = now;
    birdAudio.playChirp(rawPan, speedEnergy);
}

// ===== Recording State =====
let mediaRecorder = null;
let recordedChunks = [];
let recordingStream = null;
let isRecording = false;
const PREFER_MP4 = true;

function startRecording() {
    if (!canvas) return;
    if (!('MediaRecorder' in window)) {
        alert('MediaRecorder not supported in this browser. Please try Chrome or Edge.');
        return;
    }
    try {
        // Create a separate offscreen canvas for recording to avoid altering the live view
        recordCanvas = document.createElement('canvas');
        recordCanvas.width = canvas.width;
        recordCanvas.height = canvas.height;
        recordCtx = recordCanvas.getContext('2d');
        enableSmoothing(recordCtx);

        // Prefer 60fps; browsers may clamp to supported frame rates
        recordingStream = recordCanvas.captureStream(60);
        const options = getSupportedMediaRecorderOptions();
        recordedChunks = [];
        mediaRecorder = new MediaRecorder(recordingStream, options);
        mediaRecorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) recordedChunks.push(e.data);
        };
        mediaRecorder.onstop = handleRecordingStop;
        mediaRecorder.start();
        isRecording = true;
        updateRecordingControls();
    } catch (err) {
        console.error('Failed to start recording:', err);
        alert('Failed to start recording. Check console for details.');
    }
}

function stopRecording() {
    try {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
        }
    } catch (err) {
        console.error('Failed to stop recording:', err);
    } finally {
        if (recordingStream) {
            const tracks = recordingStream.getTracks ? recordingStream.getTracks() : [];
            tracks.forEach(t => t.stop());
        }
        recordingStream = null;
        isRecording = false;
        // Dispose recording canvas/context
        recordCtx = null;
        recordCanvas = null;
        updateRecordingControls();
    }
}

async function handleRecordingStop() {
    try {
        if (!recordedChunks || recordedChunks.length === 0) return;
        const blobType = inferBlobTypeFromRecorder(mediaRecorder);
        let blob = new Blob(recordedChunks, { type: blobType });
        const ts = new Date().toISOString().replace(/[:.]/g, '-');
        const isMp4Native = /mp4/i.test(blobType);

        if (PREFER_MP4 && !isMp4Native && window.convertWebMToMP4) {
            // Show converting state on the toggle button
            const recToggleBtn = document.getElementById('recordToggleBtn');
            const prevLabel = recToggleBtn ? recToggleBtn.textContent : '';
            if (recToggleBtn) {
                recToggleBtn.disabled = true;
                recToggleBtn.textContent = 'Converting to MP4…';
            }
            try {
                blob = await window.convertWebMToMP4(blob);
            } catch (convErr) {
                console.warn('FFmpeg conversion failed, falling back to WebM download.', convErr);
            } finally {
                if (recToggleBtn) {
                    recToggleBtn.disabled = false;
                    recToggleBtn.textContent = prevLabel || 'Start Recording';
                }
            }
        }

        // Decide extension by blob.type after potential conversion
        const finalIsMp4 = /mp4/i.test(blob.type);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `boids-recording-${ts}.${finalIsMp4 ? 'mp4' : 'webm'}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (err) {
        console.error('Failed to save recording:', err);
    } finally {
        recordedChunks = [];
        mediaRecorder = null;
    }
}

function getSupportedMediaRecorderOptions() {
    const candidates = [];
    if (PREFER_MP4) {
        candidates.push(
            { mimeType: 'video/mp4;codecs=h264', videoBitsPerSecond: 8_000_000 },
            { mimeType: 'video/mp4', videoBitsPerSecond: 8_000_000 }
        );
    }
    candidates.push(
        { mimeType: 'video/webm;codecs=vp9', videoBitsPerSecond: 8_000_000 },
        { mimeType: 'video/webm;codecs=vp8', videoBitsPerSecond: 8_000_000 },
        { mimeType: 'video/webm', videoBitsPerSecond: 8_000_000 }
    );
    for (const opt of candidates) {
        if (!opt.mimeType || MediaRecorder.isTypeSupported(opt.mimeType)) return opt;
    }
    return {};
}

function inferBlobTypeFromRecorder(rec) {
    try {
        if (rec && rec.mimeType) return rec.mimeType;
    } catch {}
    // Fallback common type
    return 'video/webm';
}

function enableSmoothing(ctxObj) {
    if (!ctxObj) return;
    ctxObj.imageSmoothingEnabled = true;
    ctxObj.imageSmoothingQuality = 'high';
}

function loadCanvasBackground() {
    if (backgroundImage) return backgroundReady;
    backgroundImage = new Image();
    backgroundImage.src = 'INTERFACE/Stock BG.png';
    backgroundImage.onload = () => {
        backgroundReady = true;
    };
    backgroundImage.onerror = (err) => {
        console.warn('Background image failed to load, using solid fill.', err);
        backgroundReady = false;
    };
    return backgroundReady;
}

function drawBackgroundLayer(targetCtx, canvasRect) {
    if (!targetCtx) return;

    const rect = canvasRect || targetCtx.canvas.getBoundingClientRect();
    const cssW = rect && rect.width ? rect.width : window.innerWidth;
    const cssH = rect && rect.height ? rect.height : window.innerHeight;
    const scaleX = cssW ? targetCtx.canvas.width / cssW : 1;
    const scaleY = cssH ? targetCtx.canvas.height / cssH : 1;

    targetCtx.save();
    targetCtx.setTransform(1, 0, 0, 1, 0, 0);

    // Always use a pure white backdrop for recordings/exports so the video has a solid background.
    targetCtx.fillStyle = '#ffffff';
    targetCtx.fillRect(0, 0, targetCtx.canvas.width, targetCtx.canvas.height);

    targetCtx.restore();
}

function getAvailableCanvasSpace() {
    const wrapperEl = document.querySelector('.canvas-wrapper');
    
    if (wrapperEl) {
        const rect = wrapperEl.getBoundingClientRect();
        return {
            width: Math.max(200, rect.width - 40), // Small padding
            height: Math.max(200, rect.height - 40)
        };
    }
    
    // Fallback if wrapper not found
    const availableWidth = window.innerWidth - 40;
    const availableHeight = window.innerHeight - 300; // Account for header/footer

    return {
        width: Math.max(200, availableWidth),
        height: Math.max(200, availableHeight)
    };
}

function calculateCanvasSizing(currentState) {
    // Image mode: honor uploaded aspect ratio and avoid viewport padding
    if (currentState && currentState.imageMode && currentState.imageMask) {
        const layout = computeWordLayout(currentState.wordBuffer || '[Image]', currentState.gridSize || BASE_SIZE);
        const space = getAvailableCanvasSpace();
        const baseCellSize = Math.max(2, Math.min(space.width / layout.gridWidth, space.height / layout.gridHeight));
        const canvasWidth = Math.max(1, Math.ceil(layout.gridWidth * baseCellSize));
        const canvasHeight = Math.max(1, Math.ceil(layout.gridHeight * baseCellSize));
        return {
            layout,
            cellSize: baseCellSize,
            canvasWidth,
            canvasHeight,
            renderOffsetY: 0,
            totalGridHeight: layout.gridHeight,
            totalGridWidth: layout.gridWidth,
            spawnOffsetRows: 0
        };
    }

    const layout = computeWordLayout(currentState.wordBuffer || 'A', currentState.gridSize || BASE_SIZE);
    const space = getAvailableCanvasSpace();

    const baseCellSize = Math.max(2, Math.min(space.width / layout.gridWidth, space.height / layout.gridHeight));

    // Expand both vertically and horizontally to fill available space while keeping square cells
    const paddedGridHeight = Math.floor(space.height / baseCellSize);
    const paddedGridWidth = Math.floor(space.width / baseCellSize);
    
    const extraRows = Math.max(0, paddedGridHeight - layout.gridHeight);
    const extraCols = Math.max(0, paddedGridWidth - layout.gridWidth);
    
    const totalGridHeight = layout.gridHeight + extraRows;
    const totalGridWidth = layout.gridWidth + extraCols;
    const renderOffsetY = 0; // use full vertical range with no pixel shift
    const spawnOffsetRows = Math.floor(extraRows / 2);

    const canvasWidth = Math.max(1, Math.ceil(totalGridWidth * baseCellSize));
    const canvasHeight = Math.max(1, Math.ceil(totalGridHeight * baseCellSize));

    return { layout, cellSize: baseCellSize, canvasWidth, canvasHeight, renderOffsetY, totalGridHeight, totalGridWidth, spawnOffsetRows };
}

function applyCanvasSizing(sizing) {
    if (!sizing) return;
    const { layout, cellSize, canvasWidth, canvasHeight, renderOffsetY = 0, totalGridHeight, totalGridWidth, spawnOffsetRows = 0 } = sizing;

    gameState.margin = layout.marginPerSide;
    gameState.effectiveGrid = typeof totalGridHeight === 'number' ? totalGridHeight : layout.gridHeight;
    gameState.glyphRegion = layout.glyphRegion;
    gameState.cellSize = cellSize;
    gameState.renderOffsetY = renderOffsetY;
    gameState.renderGridWidth = typeof totalGridWidth === 'number' ? totalGridWidth : layout.gridWidth;
    gameState.renderGridHeight = typeof totalGridHeight === 'number' ? totalGridHeight : layout.gridHeight;
    gameState.spawnOffsetRows = spawnOffsetRows;

    if (canvas) {
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
    }

    if (offscreenMask) {
        offscreenMask.width = canvasWidth;
        offscreenMask.height = canvasHeight;
    }
    if (offscreenMaskBlur) {
        offscreenMaskBlur.width = canvasWidth;
        offscreenMaskBlur.height = canvasHeight;
    }
    if (offscreenComposite) {
        offscreenComposite.width = canvasWidth;
        offscreenComposite.height = canvasHeight;
    }

    // Keep recording canvas in sync when recording
    if (recordCanvas) {
        recordCanvas.width = canvasWidth;
        recordCanvas.height = canvasHeight;
    }
}

// ===== Setup =====
function setup() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    // Preload background so recordings capture the sky texture instead of a black backplate
    loadCanvasBackground();

    // Compute initial sizing based on viewport and word layout
    applyCanvasSizing(calculateCanvasSizing(gameState));

    // offscreen for mask
    offscreenMask = document.createElement('canvas');
    offscreenMask.width = canvas.width;
    offscreenMask.height = canvas.height;
    offCtxMask = offscreenMask.getContext('2d');
    enableSmoothing(offCtxMask);

    offscreenMaskBlur = document.createElement('canvas');
    offscreenMaskBlur.width = canvas.width;
    offscreenMaskBlur.height = canvas.height;
    offCtxMaskBlur = offscreenMaskBlur.getContext('2d');
    enableSmoothing(offCtxMaskBlur);

    // offscreen composite buffer for drawing final bird blobs so we can
    // render grid beneath birds without the globalCompositeOperation
    offscreenComposite = document.createElement('canvas');
    offscreenComposite.width = canvas.width;
    offscreenComposite.height = canvas.height;
    offCtxComposite = offscreenComposite.getContext('2d');
    enableSmoothing(offCtxComposite);

    // main ctx smoothing
    enableSmoothing(ctx);

    // Backup original GLYPHS before any modifications
    if (!originalGLYPHS) {
        originalGLYPHS = JSON.parse(JSON.stringify(GLYPHS));
    }

    // Initialize default font case support (only uppercase for built-in GLYPHS)
    initDefaultFontSupport();

    // compute grid info (effective grid includes padding/margin)
    computeGridInfo(gameState);
    initBirds(gameState);
    if (!Array.isArray(gameState.birds) || gameState.birds.length === 0) {
        // Fallback: ensure at least one bird exists so the canvas never renders empty
        gameState.birds = [new Bird(0, 0)];
    }
    
    // Initialize frame 0 snapshot for history
    saveGameStateSnapshot(0);

    setupControls();
    setupEventListeners();
    // Keep canvas sizing responsive to window changes
    window.addEventListener('resize', () => {
        computeGridInfo(gameState);
        initBirds(gameState);
        gameState.frameCount = 0;
    });
}

// Initialize font support for the default built-in font
function initDefaultFontSupport() {
    const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const supportedUppercase = new Set();
    
    // Check which uppercase characters exist in default GLYPHS
    for (const ch of upperChars) {
        if (GLYPHS[ch] && GLYPHS[ch].some(v => v > 0)) {
            supportedUppercase.add(ch);
        }
    }
    
    // Default font only supports uppercase
    gameState.fontSupportsUppercase = supportedUppercase.size > 0;
    gameState.fontSupportsLowercase = false;
    gameState.supportedUppercase = supportedUppercase;
    gameState.supportedLowercase = new Set();
}

// ===== Physics Update Function =====
function computeFrameStep() {
    if (!Array.isArray(gameState.birds) || gameState.birds.length === 0) {
        initBirds(gameState);
        if (!Array.isArray(gameState.birds) || gameState.birds.length === 0) {
            gameState.birds = [new Bird(0, 0)];
        }
    }
    shuffle(gameState.birds);

    let occupiedAlive = new Set();
    for (let b of gameState.birds) {
        if (b.health > 0) {
            occupiedAlive.add(b.x + "," + b.y);
        }
    }

    let sepW = gameState.sepWeight;
    let aliW = gameState.aliWeight;
    let cohW = gameState.cohWeight;

    for (let b of gameState.birds) {
        b.update(gameState.birds, occupiedAlive, sepW, aliW, cohW, gameState.foods, gameState);
    }

    // Eat food
    for (let b of gameState.birds) {
        for (let i = gameState.foods.length - 1; i >= 0; i--) {
            let f = gameState.foods[i];
            if (f.x === b.x && f.y === b.y) {
                b.health = Math.min(1.0, b.health + 1);
                gameState.foods.splice(i, 1);
                break;
            }
        }
    }
}

function computeGridInfo(gameState) {
    // Align sizing with viewport so canvas stays responsive
    const sizing = calculateCanvasSizing(gameState);
    applyCanvasSizing(sizing);
    // Store canvas dimensions for free floating mode
    if (canvas) {
        gameState.canvasWidth = canvas.width;
        gameState.canvasHeight = canvas.height;
    }
}

function updateCanvasSize(gameState) {
    // Calculate and update canvas dimensions based on current word and resolution
    if (!canvas) return;
    computeGridInfo(gameState);
}

function exportCanvasToSVG() {
    if (!canvas || !gameState) return;

    const w = canvas.width;
    const h = canvas.height;
    const cellSize = gameState.cellSize || 20;
    const offsetY = gameState.renderOffsetY || 0;
    const birds = Array.isArray(gameState.birds) ? gameState.birds : [];
    const serializerEsc = (str) => String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    const buildShapeFragments = (svgEl, fill) => {
        if (!svgEl) return null;
        const nodes = svgEl.querySelectorAll('path, rect, circle, polygon');
        const frags = [];
        nodes.forEach((el) => {
            const tag = el.tagName.toLowerCase();
            if (tag === 'path') {
                const d = el.getAttribute('d');
                if (d) frags.push(`<path d="${serializerEsc(d)}" fill="${fill}" />`);
            } else if (tag === 'rect') {
                const x = el.getAttribute('x') || '0';
                const y = el.getAttribute('y') || '0';
                const rw = el.getAttribute('width');
                const rh = el.getAttribute('height');
                if (rw && rh) frags.push(`<rect x="${serializerEsc(x)}" y="${serializerEsc(y)}" width="${serializerEsc(rw)}" height="${serializerEsc(rh)}" fill="${fill}" />`);
            } else if (tag === 'circle') {
                const cx = el.getAttribute('cx') || '0';
                const cy = el.getAttribute('cy') || '0';
                const r = el.getAttribute('r');
                if (r) frags.push(`<circle cx="${serializerEsc(cx)}" cy="${serializerEsc(cy)}" r="${serializerEsc(r)}" fill="${fill}" />`);
            } else if (tag === 'polygon') {
                const pts = el.getAttribute('points');
                if (pts) frags.push(`<polygon points="${serializerEsc(pts)}" fill="${fill}" />`);
            }
        });
        return frags.join('');
    };

    const getViewBoxDims = (svgEl) => {
        let vbWidth = 100, vbHeight = 100;
        if (svgEl) {
            const viewBox = svgEl.getAttribute('viewBox');
            if (viewBox) {
                const parts = viewBox.split(/[,\s]+/);
                if (parts.length >= 4) {
                    vbWidth = parseFloat(parts[2]);
                    vbHeight = parseFloat(parts[3]);
                }
            }
        }
        return { vbWidth, vbHeight };
    };

    const buildArrowFragment = (size) => {
        const len = size;
        const w2 = size * 0.4;
        // Shift coordinates to positive space for cleaner viewBox centering
        const shiftX = len * 0.4;
        const shiftY = w2;
        const pts = [
            { x: -len * 0.4 + shiftX, y: -w2 * 0.3 + shiftY },
            { x: 0 + shiftX, y: -w2 * 0.3 + shiftY },
            { x: 0 + shiftX, y: -w2 + shiftY },
            { x: len * 0.6 + shiftX, y: 0 + shiftY },
            { x: 0 + shiftX, y: w2 + shiftY },
            { x: 0 + shiftX, y: w2 * 0.3 + shiftY },
            { x: -len * 0.4 + shiftX, y: w2 * 0.3 + shiftY }
        ];
        const points = pts.map(p => `${p.x.toFixed(3)},${p.y.toFixed(3)}`).join(' ');
        return {
            vbWidth: len,
            vbHeight: len,
            content: `<polygon points="${points}" fill="rgb(0,0,0)" />`
        };
    };

    const buildShapeForBird = (shapeMode, size) => {
        // shapeMode: 0=arrow fallback, 1-8 assets, 9=Asset 10 or uploaded custom
        if (shapeMode >= 1 && shapeMode <= 8) {
            const svgEl = svgShapes[shapeMode + 5]; // assets map to 6-13
            const content = buildShapeFragments(svgEl, 'rgb(0,0,0)');
            const { vbWidth, vbHeight } = getViewBoxDims(svgEl);
            if (content) return { vbWidth, vbHeight, content };
        } else if (shapeMode === 9) {
            // Prefer uploaded custom (id 99); fallback to embedded Asset 10 (id 15)
            const customEl = svgShapes && svgShapes[99];
            const asset10El = svgShapes && (svgShapes[15] || svgShapes[14]);
            const svgEl = customEl || asset10El;
            const content = buildShapeFragments(svgEl, 'rgb(0,0,0)');
            const { vbWidth, vbHeight } = getViewBoxDims(svgEl);
            if (content) return { vbWidth, vbHeight, content };
        }
        return buildArrowFragment(size);
    };

    const birdGroups = birds.map((b) => {
        const cx = b.x * cellSize + cellSize / 2 + (b.offsetX || 0);
        const cy = b.y * cellSize + cellSize / 2 + (b.offsetY || 0) + offsetY;
        const size = cellSize * gameState.birdSizeScale;
        const shapeMode = gameState.useRandomShapes ? b.shapeType : gameState.shapeMode;

        // Orientation logic mirrors renderer.js
        const ox = (Math.abs(b.hx) > 0 || Math.abs(b.hy) > 0) ? b.hx : b.vx;
        const oy = (Math.abs(b.hx) > 0 || Math.abs(b.hy) > 0) ? b.hy : b.vy;
        let angleRad = 0;
        if (shapeMode === 0 || shapeMode === 9) {
            angleRad = (Math.abs(ox) < 0.0001 && Math.abs(oy) < 0.0001) ? -Math.PI / 2 : Math.atan2(oy, ox);
        } else if (shapeMode === 8) {
            // only Asset 8 rotates in canvas version
            if (Math.abs(ox) > 0.0001 || Math.abs(oy) > 0.0001) angleRad = Math.atan2(oy, ox);
        }
        const angleDeg = angleRad * 180 / Math.PI;

        const { vbWidth, vbHeight, content } = buildShapeForBird(shapeMode, size);
        const scale = size / Math.max(vbWidth || 1, vbHeight || 1);
        return `<g transform="translate(${cx.toFixed(3)} ${cy.toFixed(3)}) rotate(${angleDeg.toFixed(3)}) scale(${scale.toFixed(4)}) translate(${-(vbWidth / 2).toFixed(3)} ${-(vbHeight / 2).toFixed(3)})">${content}</g>`;
    });

    // Grid removed; keep food only
    const gridParts = [];

    const foodParts = [];
    if (Array.isArray(gameState.foods)) {
        for (let f of gameState.foods) {
            const fx = f.x * cellSize + cellSize / 2;
            const fy = f.y * cellSize + cellSize / 2 + offsetY;
            const r = cellSize / 3;
            foodParts.push(`<circle cx="${fx.toFixed(3)}" cy="${fy.toFixed(3)}" r="${r.toFixed(3)}" fill="rgb(0,0,0)" />`);
        }
    }

    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ` +
        `width="${w}px" height="${h}px" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet">` +
        `<rect width="100%" height="100%" fill="white" />` +
        `${gridParts.join('')}` +
        `${foodParts.join('')}` +
        `${birdGroups.join('')}` +
        `</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'boids-export.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ===== Image Upload → Pixel Mask =====
function clearImageMode() {
    if (gameState.imageMode && gameState.previousWordBuffer) {
        gameState.wordBuffer = gameState.previousWordBuffer;
        const textInput = document.getElementById('textInput');
        if (textInput) textInput.value = gameState.wordBuffer;
    }
    gameState.imageMode = false;
    gameState.imageMask = null;
    gameState.imageSource = null;
}

function showImageUploadModal() {
    const modal = document.getElementById('imageUploadModal');
    if (modal) {
        modal.style.display = 'flex';
        const statusEl = document.getElementById('imageUploadStatus');
        if (statusEl) statusEl.textContent = '';
        const fileEl = document.getElementById('imageFileInputModal');
        if (fileEl) fileEl.value = '';
    }
}

function showFontUploadModal() {
    const modal = document.getElementById('fontUploadModal');
    if (modal) {
        modal.style.display = 'flex';
        const statusEl = document.getElementById('fontUploadStatus');
        if (statusEl) statusEl.textContent = '';
        const fileEl = document.getElementById('fontFileModal');
        if (fileEl) fileEl.value = '';
    }
}

function hideFontUploadModal() {
    const modal = document.getElementById('fontUploadModal');
    if (modal) modal.style.display = 'none';
}

function hideImageUploadModal() {
    const modal = document.getElementById('imageUploadModal');
    if (modal) modal.style.display = 'none';
}

function computeImageGridTarget(imgWidth, imgHeight) {
    const baseRes = Math.max(BASE_SIZE, gameState.gridSize || BASE_SIZE);
    const maxSide = Math.min(200, Math.max(20, Math.round(baseRes * 6)));
    if (!Number.isFinite(imgWidth) || !Number.isFinite(imgHeight) || imgWidth <= 0 || imgHeight <= 0) {
        return { targetW: baseRes, targetH: baseRes };
    }
    if (imgWidth >= imgHeight) {
        const targetW = maxSide;
        const targetH = Math.max(1, Math.round((imgHeight / imgWidth) * targetW));
        return { targetW, targetH };
    } else {
        const targetH = maxSide;
        const targetW = Math.max(1, Math.round((imgWidth / imgHeight) * targetH));
        return { targetW, targetH };
    }
}

function rasterizeImageElementToMask(img, sourceName) {
    const wasImageMode = !!gameState.imageMode;
    const { targetW, targetH } = computeImageGridTarget(img.naturalWidth || img.width, img.naturalHeight || img.height);
    const off = document.createElement('canvas');
    off.width = targetW;
    off.height = targetH;
    const offCtx = off.getContext('2d');
    offCtx.drawImage(img, 0, 0, targetW, targetH);
    const imgData = offCtx.getImageData(0, 0, targetW, targetH).data;
    const mask = new Uint8Array(targetW * targetH);
    for (let i = 0; i < imgData.length; i += 4) {
        const r = imgData[i];
        const g = imgData[i + 1];
        const b = imgData[i + 2];
        const a = imgData[i + 3];
        const bright = (r + g + b) / 3;
        mask[i / 4] = (a > 24 && bright < 245) ? 1 : 0;
    }
    const margin = 1;
    gameState.imageMask = { width: targetW, height: targetH, data: mask, margin };
    gameState.imageMode = true;
    if (!wasImageMode && gameState.wordBuffer) {
        gameState.previousWordBuffer = gameState.wordBuffer;
    }
    gameState.wordBuffer = '[Image]';
    gameState.imageSource = {
        dataUrl: img.src,
        name: sourceName || 'Image',
        naturalWidth: img.naturalWidth || img.width,
        naturalHeight: img.naturalHeight || img.height
    };

    const textInput = document.getElementById('textInput');
    if (textInput) textInput.value = gameState.wordBuffer;
    const statusEl = document.getElementById('fontStatus');
    if (statusEl) statusEl.textContent = `Image: ${targetW}×${targetH}`;

    computeGridInfo(gameState);
    initBirds(gameState);
    updateCanvasSize(gameState);
    gameState.frameHistory = [];
    gameState.frameCount = 0;
    saveGameStateSnapshot(0);
}

async function rasterizeImageFromSource(src, sourceName) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            try {
                rasterizeImageElementToMask(img, sourceName);
                resolve();
            } catch (err) {
                reject(err);
            }
        };
        img.onerror = reject;
        img.src = src;
    });
}

async function rasterizeImageFile(file) {
    if (!file) return;
    const reader = new FileReader();
    const dataUrl = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
    await rasterizeImageFromSource(dataUrl, file.name);
}

async function rerasterizeExistingImage() {
    if (!gameState.imageMode || !gameState.imageSource || !gameState.imageSource.dataUrl) return;
    await rasterizeImageFromSource(gameState.imageSource.dataUrl, gameState.imageSource.name);
}

function getOrCreateImageFileInput() {
    let input = document.getElementById('imageFileInput');
    if (!input) {
        input = document.createElement('input');
        input.type = 'file';
        input.id = 'imageFileInput';
        input.accept = 'image/*';
        input.style.display = 'none';
        document.body.appendChild(input);
    }
    if (!input.dataset.bound) {
        input.addEventListener('change', async (evt) => {
            if (evt.target.files && evt.target.files.length > 0) {
                try {
                    await rasterizeImageFile(evt.target.files[0]);
                } catch (err) {
                    console.error('Image load error', err);
                    const statusEl = document.getElementById('fontStatus');
                    if (statusEl) statusEl.textContent = 'Failed to parse image';
                }
            }
            evt.target.value = '';
        });
        input.dataset.bound = '1';
    }
    return input;
}

function getOrCreateFontFileInput() {
    let input = document.getElementById('fontFile');
    if (!input) {
        input = document.createElement('input');
        input.type = 'file';
        input.id = 'fontFile';
        input.accept = '.ttf,.otf,.woff,.woff2';
        input.style.display = 'none';
        document.body.appendChild(input);
    }
    if (!input.dataset.bound) {
        input.addEventListener('change', async (evt) => {
            if (evt.target.files && evt.target.files.length > 0) {
                try {
                    await parseUploadedFontToGlyphs(evt.target.files[0]);
                } catch (err) {
                    console.error('Font load error', err);
                    const statusEl = document.getElementById('fontStatus');
                    if (statusEl) statusEl.textContent = 'Failed to parse font';
                }
            }
            evt.target.value = '';
        });
        input.dataset.bound = '1';
    }
    return input;
}

function setupFontUploadModalHandlers() {
    if (fontModalInitialized) return;
    fontModalInitialized = true;

    const confirmBtn = document.getElementById('fontUploadConfirm');
    const cancelBtn = document.getElementById('fontUploadCancel');
    const fileEl = document.getElementById('fontFileModal');
    const statusEl = document.getElementById('fontUploadStatus');

    if (cancelBtn) {
        cancelBtn.onclick = () => {
            hideFontUploadModal();
            const fontSelector = document.getElementById('fontSelector');
            if (fontSelector) fontSelector.value = '';
        };
    }

    if (confirmBtn) {
        confirmBtn.onclick = async () => {
            if (!fileEl || !fileEl.files || fileEl.files.length === 0) {
                if (statusEl) statusEl.textContent = 'Please choose a font file.';
                return;
            }
            try {
                const file = fileEl.files[0];
                if (statusEl) statusEl.textContent = 'Parsing...';
                await parseUploadedFontToGlyphs(file);
                if (statusEl) statusEl.textContent = 'Done!';
                hideFontUploadModal();
            } catch (err) {
                console.error('Font load error', err);
                if (statusEl) statusEl.textContent = 'Failed to parse font';
            }
            const fontSelector = document.getElementById('fontSelector');
            if (fontSelector) fontSelector.value = '';
        };
    }
}

// ===== Font Upload → 5x5 Glyphs =====
async function parseUploadedFontToGlyphs(file) {
    const statusEl = document.getElementById('fontStatus');
    try {
        if (!file) {
            if (statusEl) statusEl.textContent = 'No font selected';
            return;
        }

        const blobUrl = URL.createObjectURL(file);
        const familyName = `UploadedFont_${Date.now()}`;
        const fontFace = new FontFace(familyName, `url(${blobUrl})`);
        await fontFace.load();
        document.fonts.add(fontFace);
        // Remember uploaded family and build glyphs at current resolution
        gameState.customFontFamily = familyName;
        await buildGlyphsForResolution(gameState.gridSize, file && file.name);
    } catch (e) {
        console.error('Font parse error', e);
        if (statusEl) statusEl.textContent = 'Failed to parse font';
    }
}

async function buildGlyphsForResolution(targetRes, fileNameForStatus) {
    const statusEl = document.getElementById('fontStatus');
    try {
        const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
        const newGlyphs = {};
        const N = Math.max(1, Math.floor(targetRes));
        
        // Parse both uppercase and lowercase
        const allChars = upperChars + lowerChars;
        for (const ch of allChars) {
            newGlyphs[ch] = rasterizeCharToGrid(ch, gameState.customFontFamily, N);
        }
        newGlyphs[' '] = new Array(N * N).fill(0);
        
        // Detect which cases the font supports by checking if glyphs have content
        const supportedUppercase = new Set();
        const supportedLowercase = new Set();
        
        for (let i = 0; i < upperChars.length; i++) {
            const upper = upperChars[i];
            const lower = lowerChars[i];
            
            const upperHasContent = newGlyphs[upper] && newGlyphs[upper].some(v => v > 0);
            const lowerHasContent = newGlyphs[lower] && newGlyphs[lower].some(v => v > 0);
            
            if (upperHasContent) supportedUppercase.add(upper);
            if (lowerHasContent) supportedLowercase.add(lower);
        }
        
        // Store font capabilities
        gameState.fontSupportsUppercase = supportedUppercase.size > 0;
        gameState.fontSupportsLowercase = supportedLowercase.size > 0;
        gameState.supportedUppercase = supportedUppercase;
        gameState.supportedLowercase = supportedLowercase;
        
        for (const key of Object.keys(newGlyphs)) {
            GLYPHS[key] = newGlyphs[key];
        }
        // Build proportional glyph metrics (active column span per glyph)
        const metrics = {};
        const letters = allChars.split('');
        letters.push(' ');
        for (const ch of letters) {
            const arr = GLYPHS[ch];
            if (!arr || !arr.length) continue;
            const dim = Math.max(1, Math.round(Math.sqrt(arr.length)));
            let minCol = dim, maxCol = -1;
            for (let x = 0; x < dim; x++) {
                let any = false;
                for (let y = 0; y < dim; y++) {
                    if (arr[y * dim + x]) { any = true; break; }
                }
                if (any) {
                    if (x < minCol) minCol = x;
                    if (x > maxCol) maxCol = x;
                }
            }
            if (maxCol >= minCol) {
                metrics[ch] = { minCol, maxCol, width: (maxCol - minCol + 1), dim };
            } else {
                metrics[ch] = { minCol: 0, maxCol: 0, width: Math.ceil(dim * 0.3), dim };
            }
        }
        gameState.glyphMetrics = metrics;
        
        // Build status message with case support info
        let caseInfo = '';
        if (gameState.fontSupportsUppercase && gameState.fontSupportsLowercase) {
            caseInfo = ' (uppercase + lowercase)';
        } else if (gameState.fontSupportsUppercase) {
            caseInfo = ' (uppercase only)';
        } else if (gameState.fontSupportsLowercase) {
            caseInfo = ' (lowercase only)';
        }
        
        if (statusEl) statusEl.textContent = `Parsed glyphs at ${N}×${N}${caseInfo}` + (fileNameForStatus ? ` from ${fileNameForStatus}` : '');
        
        // Re-normalize wordBuffer based on new font capabilities
        if (gameState.wordBuffer && gameState.customFontFamily) {
            const normalizedText = gameState.wordBuffer.split('').map(ch => normalizeCharForFont(ch)).join('');
            gameState.wordBuffer = normalizedText;
            
            // Update UI to reflect the normalized text
            const textInput = document.getElementById('textInput');
            if (textInput) textInput.value = normalizedText;
        }
        
        // Reinitialize with new glyphs
        computeGridInfo(gameState);
        initBirds(gameState);
        updateCanvasSize(gameState);
        gameState.frameCount = 0;
    } catch (e) {
        console.error('Build glyphs error', e);
        if (statusEl) statusEl.textContent = 'Failed building glyphs for resolution';
    }
}

// Smart case conversion based on font capabilities
function normalizeCharForFont(ch) {
    // If no custom font, keep original behavior (uppercase only)
    if (!gameState.customFontFamily) {
        return ch.toUpperCase();
    }
    
    const isUpper = ch === ch.toUpperCase() && ch !== ch.toLowerCase();
    const isLower = ch === ch.toLowerCase() && ch !== ch.toUpperCase();
    
    // If input is uppercase
    if (isUpper) {
        // If font supports uppercase, use it
        if (gameState.fontSupportsUppercase && gameState.supportedUppercase && gameState.supportedUppercase.has(ch)) {
            return ch;
        }
        // If font only supports lowercase, convert to lowercase
        if (gameState.fontSupportsLowercase) {
            return ch.toLowerCase();
        }
        return ch;
    }
    
    // If input is lowercase
    if (isLower) {
        // If font supports lowercase, use it
        if (gameState.fontSupportsLowercase && gameState.supportedLowercase && gameState.supportedLowercase.has(ch)) {
            return ch;
        }
        // If font only supports uppercase, convert to uppercase
        if (gameState.fontSupportsUppercase) {
            return ch.toUpperCase();
        }
        return ch;
    }
    
    // For non-letter characters, return as-is
    return ch;
}

function rasterizeCharToGrid(ch, family, targetDim) {
    const S = 256;
    const off = document.createElement('canvas');
    off.width = S;
    off.height = S;
    const c = off.getContext('2d');
    c.fillStyle = '#fff';
    c.fillRect(0, 0, S, S);
    c.fillStyle = '#000';
    c.textBaseline = 'alphabetic';

    // Pick a font size that fits well
    const fontSize = 200;
    c.font = `${fontSize}px '${family}'`;
    const m = c.measureText(ch);
    const asc = m.actualBoundingBoxAscent || fontSize * 0.8;
    const desc = m.actualBoundingBoxDescent || fontSize * 0.2;
    const textW = Math.max(1, m.width);
    const textH = asc + desc;
    const x = Math.floor((S - textW) / 2);
    const y = Math.floor((S - textH) / 2 + asc);
    c.fillText(ch, x, y);

    const img = c.getImageData(0, 0, S, S);
    const d = img.data;

    // Find tight bounding box of drawn glyph (non-white)
    let minX = S, minY = S, maxX = -1, maxY = -1;
    for (let py = 0; py < S; py++) {
        for (let px = 0; px < S; px++) {
            const idx = (py * S + px) * 4;
            const r = d[idx], g = d[idx + 1], b = d[idx + 2];
            const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            if (lum < 250) { // anything not nearly white
                if (px < minX) minX = px;
                if (py < minY) minY = py;
                if (px > maxX) maxX = px;
                if (py > maxY) maxY = py;
            }
        }
    }

    if (maxX < minX || maxY < minY) {
        const N0 = Math.max(1, Math.floor(targetDim));
        return new Array(N0 * N0).fill(0);
    }

    // Expand a tiny bit to avoid clipping
    const pad = 4;
    minX = Math.max(0, minX - pad);
    minY = Math.max(0, minY - pad);
    maxX = Math.min(S - 1, maxX + pad);
    maxY = Math.min(S - 1, maxY + pad);

    const bw = maxX - minX + 1;
    const bh = maxY - minY + 1;

    // Compute occupancy for an N×N grid within bbox
    const N = Math.max(1, Math.floor(targetDim));
    const out = new Array(N * N).fill(0);
    const thresh = 0.25; // coverage threshold
    for (let gy = 0; gy < N; gy++) {
        for (let gx = 0; gx < N; gx++) {
            const x0 = Math.floor(minX + (gx / N) * bw);
            const x1 = Math.floor(minX + ((gx + 1) / N) * bw);
            const y0 = Math.floor(minY + (gy / N) * bh);
            const y1 = Math.floor(minY + ((gy + 1) / N) * bh);
            const w = Math.max(1, x1 - x0);
            const h = Math.max(1, y1 - y0);

            let dark = 0, total = 0;
            for (let py = y0; py < y0 + h; py++) {
                for (let px = x0; px < x0 + w; px++) {
                    const idx = (py * S + px) * 4;
                    const r = d[idx], g = d[idx + 1], b = d[idx + 2];
                    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                    if (lum < 200) dark++;
                    total++;
                }
            }
            const coverage = dark / Math.max(1, total);
            out[gy * N + gx] = coverage >= thresh ? 1 : 0;
        }
    }
    return out;
}

// Create SVG shape buttons dynamically
async function createSVGShapeButtons() {
    const container = document.getElementById('shapeButtonsContainer');
    if (!container) return;

    // Wait for SVG shapes to load - increase timeout and check if loaded
    let retries = 0;
    while (retries < 20 && Object.keys(svgShapes).length < 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        retries++;
    }
    
    if (Object.keys(svgShapes).length < 10) {
        console.warn('Not all SVG shapes loaded yet. Loaded keys:', Object.keys(svgShapes));
    }

    // SVG button for shape 1 (square) - now first
    const squareBtn = document.createElement('button');
    squareBtn.className = 'shape-btn active';
    squareBtn.dataset.shape = '1';
    squareBtn.style.display = 'flex';
    squareBtn.style.alignItems = 'center';
    squareBtn.style.justifyContent = 'center';

    // Create canvas for square thumbnail
    const squareCanvas = document.createElement('canvas');
    squareCanvas.width = 100;
    squareCanvas.height = 100;
    squareCanvas.style.width = '100%';
    squareCanvas.style.height = '100%';
    const squareCtx = squareCanvas.getContext('2d');
    
    // Draw square shape as thumbnail (index 0 for shape 1)
    drawSVGThumb(squareCtx, 0, 50, 50, 80, 'black');
    squareBtn.appendChild(squareCanvas);

    squareBtn.addEventListener('click', (e) => {
        document.querySelectorAll('.shape-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        gameState.shapeMode = parseInt(e.currentTarget.dataset.shape);
        gameState.useRandomShapes = false;
    });
    container.appendChild(squareBtn);

    // Arrow button (shape 0) - now second, using Asset 9 SVG
    const arrowBtn = document.createElement('button');
    arrowBtn.className = 'shape-btn';
    arrowBtn.dataset.shape = '0';
    arrowBtn.style.display = 'flex';
    arrowBtn.style.alignItems = 'center';
    arrowBtn.style.justifyContent = 'center';

    // Create canvas for Asset 9 thumbnail
    const arrowCanvas = document.createElement('canvas');
    arrowCanvas.width = 100;
    arrowCanvas.height = 100;
    arrowCanvas.style.width = '100%';
    arrowCanvas.style.height = '100%';
    const arrowCtx = arrowCanvas.getContext('2d');
    
    // Draw Asset 9 (arrow triangle) as thumbnail (index 8)
    drawSVGThumb(arrowCtx, 8, 50, 50, 80, 'black');
    arrowBtn.appendChild(arrowCanvas);

    arrowBtn.addEventListener('click', (e) => {
        document.querySelectorAll('.shape-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        gameState.shapeMode = parseInt(e.currentTarget.dataset.shape);
        gameState.useRandomShapes = false;
    });
    container.appendChild(arrowBtn);

    // SVG buttons (shape 2-8)
    for (let i = 1; i < 8; i++) {
        const btn = document.createElement('button');
        btn.className = 'shape-btn';
        btn.dataset.shape = String(i + 1);
        btn.style.display = 'flex';
        btn.style.alignItems = 'center';
        btn.style.justifyContent = 'center';

        // Create canvas for SVG thumbnail
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        canvas.style.width = '100';
        canvas.style.height = '100%';
        const ctx = canvas.getContext('2d');
        
        // Draw SVG shape as thumbnail
        drawSVGThumb(ctx, i, 50, 50, 80, 'black');
        btn.appendChild(canvas);

        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.shape-btn').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            gameState.shapeMode = parseInt(e.currentTarget.dataset.shape);
            gameState.useRandomShapes = false;
        });

        container.appendChild(btn);
    }

    // Asset 10 button (shape 9)
    const asset10Btn = document.createElement('button');
    asset10Btn.className = 'shape-btn';
    asset10Btn.dataset.shape = '9';
    asset10Btn.style.display = 'flex';
    asset10Btn.style.alignItems = 'center';
    asset10Btn.style.justifyContent = 'center';

    // Create canvas for Asset 10 thumbnail
    const canvas10 = document.createElement('canvas');
    canvas10.width = 100;
    canvas10.height = 100;
    canvas10.style.width = '100%';
    canvas10.style.height = '100%';
    const ctx10 = canvas10.getContext('2d');
    
    // Draw Asset 10 (index 9) as thumbnail
    drawSVGThumb(ctx10, 9, 50, 50, 80, 'black');
    asset10Btn.appendChild(canvas10);

    asset10Btn.addEventListener('click', (e) => {
        document.querySelectorAll('.shape-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        gameState.shapeMode = parseInt(e.currentTarget.dataset.shape);
        gameState.useRandomShapes = false;
    });
    container.appendChild(asset10Btn);

    // Random button (second to last position)
    const randomBtn = document.createElement('button');
    randomBtn.className = 'shape-btn';
    randomBtn.dataset.shape = 'random';
    randomBtn.style.display = 'flex';
    randomBtn.style.alignItems = 'center';
    randomBtn.style.justifyContent = 'center';

    // Load and display Random.svg
    const randomCanvas = document.createElement('canvas');
    randomCanvas.width = 100;
    randomCanvas.height = 100;
    randomCanvas.style.width = '100%';
    randomCanvas.style.height = '100%';
    const randomCtx = randomCanvas.getContext('2d');
    
    // Embedded Random.svg
    const randomSvgText = `<svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 43.58 44.55"><g id="toggle"><g><rect x="0" y=".96" width="21.31" height="21.31"/><path d="M10.66,23.24h0c5.89,0,10.66,4.77,10.66,10.66h0c0,5.89-4.77,10.66-10.66,10.66h0c-5.89,0-10.66-4.77-10.66-10.66h0c0-5.89,4.77-10.66,10.66-10.66Z"/><path d="M43.58,11.62h0c-6.33.2-11.42,5.29-11.62,11.62h0c-.2-6.33-5.29-11.42-11.62-11.62h0c6.33-.2,11.42-5.29,11.62-11.62h0c.2,6.33,5.29,11.42,11.62,11.62Z"/><g><rect x="21.31" y="31.23" width="7.99" height="5.33"/><rect x="34.63" y="31.23" width="7.99" height="5.33"/><rect x="29.3" y="36.56" width="5.33" height="7.99"/><rect x="29.3" y="23.24" width="5.33" height="7.99"/></g></g></g></svg>`;
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(randomSvgText, 'image/svg+xml');
    const randomSvgElement = svgDoc.documentElement;
    if (randomSvgElement) {
        drawSVGThumbFromElement(randomCtx, randomSvgElement, 50, 50, 80, 'black');
    }
    
    randomBtn.appendChild(randomCanvas);

    randomBtn.addEventListener('click', (e) => {
        document.querySelectorAll('.shape-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        gameState.useRandomShapes = true;
        // reassign random shapes to all birds (1-8)
        if (Array.isArray(gameState.birds)) {
            for (let b of gameState.birds) {
                b.shapeType = Math.floor(Math.random() * 8) + 1;
            }
        }
    });
    container.appendChild(randomBtn);

    // Create upload SVG button (triggers file input) as the last button
    const uploadBtn = document.createElement('button');
    uploadBtn.id = 'svgUploadBtn';
    uploadBtn.className = 'shape-btn';
    uploadBtn.title = 'Upload SVG';
    uploadBtn.textContent = '+';
    uploadBtn.addEventListener('click', () => {
        const svgFileInput = document.getElementById('svgFile');
        if (svgFileInput) svgFileInput.click();
    });
    container.appendChild(uploadBtn);
}

// Draw SVG shape as thumbnail
function drawSVGThumb(ctx, assetIndex, cx, cy, size, color) {
    const svgShapeId = assetIndex + 6;
    const svgElement = svgShapes[svgShapeId];
    if (!svgElement) {
        console.warn(`SVG shape not found for assetIndex ${assetIndex}, svgShapeId ${svgShapeId}. Available keys:`, Object.keys(svgShapes));
        return;
    }

    ctx.save();
    ctx.translate(cx, cy);

    const viewBox = svgElement.getAttribute('viewBox');
    let vbWidth = 100, vbHeight = 100;
    if (viewBox) {
        const parts = viewBox.split(/[\s,]+/);
        if (parts.length >= 4) {
            vbWidth = parseFloat(parts[2]);
            vbHeight = parseFloat(parts[3]);
        }
    }

    const scale = size / Math.max(vbWidth, vbHeight);
    ctx.scale(scale, scale);
    ctx.translate(-vbWidth / 2, -vbHeight / 2);

    ctx.fillStyle = color;

    const paths = svgElement.querySelectorAll('path, rect, circle, polygon');
    for (let el of paths) {
        if (el.tagName === 'path') {
            const d = el.getAttribute('d');
            if (d) {
                const path = new Path2D(d);
                ctx.fill(path);
            }
        } else if (el.tagName === 'rect') {
            const x = parseFloat(el.getAttribute('x') || 0);
            const y = parseFloat(el.getAttribute('y') || 0);
            const w = parseFloat(el.getAttribute('width'));
            const h = parseFloat(el.getAttribute('height'));
            ctx.fillRect(x, y, w, h);
        } else if (el.tagName === 'circle') {
            const cx2 = parseFloat(el.getAttribute('cx') || 0);
            const cy2 = parseFloat(el.getAttribute('cy') || 0);
            const r = parseFloat(el.getAttribute('r'));
            ctx.beginPath();
            ctx.arc(cx2, cy2, r, 0, Math.PI * 2);
            ctx.fill();
        } else if (el.tagName === 'polygon') {
            const points = el.getAttribute('points');
            if (points) {
                const coords = points.split(/[\s,]+/).map(parseFloat);
                ctx.beginPath();
                ctx.moveTo(coords[0], coords[1]);
                for (let i = 2; i < coords.length; i += 2) {
                    ctx.lineTo(coords[i], coords[i + 1]);
                }
                ctx.closePath();
                ctx.fill();
            }
        }
    }

    ctx.restore();
}

// Draw a thumbnail directly from a provided SVG element
function drawSVGThumbFromElement(ctx, svgElement, cx, cy, size, color) {
    if (!svgElement) return;
    ctx.save();
    ctx.translate(cx, cy);
    const viewBox = svgElement.getAttribute('viewBox');
    let vbWidth = 100, vbHeight = 100;
    if (viewBox) {
        const parts = viewBox.split(/[\s,]+/);
        if (parts.length >= 4) {
            vbWidth = parseFloat(parts[2]);
            vbHeight = parseFloat(parts[3]);
        }
    }
    const scale = size / Math.max(vbWidth, vbHeight);
    ctx.scale(scale, scale);
    ctx.translate(-vbWidth / 2, -vbHeight / 2);
    ctx.fillStyle = color;
    const paths = svgElement.querySelectorAll('path, rect, circle, polygon');
    for (let el of paths) {
        if (el.tagName === 'path') {
            const d = el.getAttribute('d');
            if (d) {
                const p = new Path2D(d);
                ctx.fill(p);
            }
        } else if (el.tagName === 'rect') {
            const x = parseFloat(el.getAttribute('x') || 0);
            const y = parseFloat(el.getAttribute('y') || 0);
            const w = parseFloat(el.getAttribute('width'));
            const h = parseFloat(el.getAttribute('height'));
            ctx.fillRect(x, y, w, h);
        } else if (el.tagName === 'circle') {
            const cx2 = parseFloat(el.getAttribute('cx') || 0);
            const cy2 = parseFloat(el.getAttribute('cy') || 0);
            const r = parseFloat(el.getAttribute('r'));
            ctx.beginPath();
            ctx.arc(cx2, cy2, r, 0, Math.PI * 2);
            ctx.fill();
        } else if (el.tagName === 'polygon') {
            const points = el.getAttribute('points');
            if (points) {
                const coords = points.split(/[\s,]+/).map(parseFloat);
                ctx.beginPath();
                ctx.moveTo(coords[0], coords[1]);
                for (let i = 2; i < coords.length; i += 2) {
                    ctx.lineTo(coords[i], coords[i + 1]);
                }
                ctx.closePath();
                ctx.fill();
            }
        }
    }
    ctx.restore();
}

function setupControls() {
    // Text input handler for multi-letter words
    const textInput = document.getElementById('textInput');
    if (textInput) {
        textInput.addEventListener('input', (e) => {
            let text = e.target.value;

            // Typing switches back to text mode
            clearImageMode();
            
            // Apply smart case conversion based on font capabilities
            if (gameState.customFontFamily) {
                text = text.split('').map(ch => normalizeCharForFont(ch)).join('');
            } else {
                // Default behavior: convert to uppercase for built-in font
                text = text.toUpperCase();
            }
            
            if (text.length === 0) text = 'A'; // default to 'A' if empty
            gameState.wordBuffer = text;
            
            // Keep current resolution when typing; only re-render with existing grid size
            computeGridInfo(gameState);
            initBirds(gameState);
            updateCanvasSize(gameState);
            // Clear history and save new frame 0
            gameState.frameHistory = [];
            gameState.frameCount = 0;
            saveGameStateSnapshot(0);
        });
        // Initialize
        textInput.value = gameState.wordBuffer;
    }

    const resolutionSlider = document.getElementById('resolutionSlider');
    if (resolutionSlider) {
        resolutionSlider.addEventListener('input', async (e) => {
            let newGridSize = parseInt(e.target.value);
            // Enforce minimum resolution of 5 (5x5 base glyph size)
            // Below 5 pixels per letter, recognizable fonts are nearly impossible to render
            newGridSize = Math.max(BASE_SIZE, newGridSize);
            
            if (newGridSize !== gameState.gridSize) {
                gameState.gridSize = newGridSize;
                if (gameState.imageMode) {
                    await rerasterizeExistingImage();
                } else if (gameState.customFontFamily) {
                    // Rebuild glyphs at this resolution (includes re-init and resize)
                    await buildGlyphsForResolution(newGridSize);
                } else {
                    computeGridInfo(gameState);
                    initBirds(gameState);
                    updateCanvasSize(gameState);
                }
                // Clear history on resolution change
                gameState.frameHistory = [];
                gameState.frameCount = 0;
                saveGameStateSnapshot(0);
            } else if (gameState.imageMode) {
                await rerasterizeExistingImage();
            } else if (gameState.customFontFamily) {
                // If same value reported repeatedly while dragging, still ensure rebuild
                await buildGlyphsForResolution(newGridSize);
            }
            const resVal = document.getElementById('resolutionValue');
            const resVal2 = document.getElementById('resolutionValue2');
            if (resVal) resVal.textContent = newGridSize;
            if (resVal2) resVal2.textContent = newGridSize;
            // Update slider value if it was clamped
            e.target.value = newGridSize;
        });
    }

    const birdSizeSlider = document.getElementById('birdSizeSlider');
    if (birdSizeSlider) {
        birdSizeSlider.addEventListener('input', (e) => {
            gameState.birdSizeScale = parseFloat(e.target.value);
            const birdSizeValue = document.getElementById('birdSizeValue');
            if (birdSizeValue) birdSizeValue.textContent = gameState.birdSizeScale.toFixed(2);
        });
    }

    // Home strength slider
    const homeStrengthSlider = document.getElementById('homeStrengthSlider');
    if (homeStrengthSlider) {
        homeStrengthSlider.addEventListener('input', (e) => {
            const v = parseFloat(e.target.value);
            gameState.homeWeight = v;
            const homeStrengthValue = document.getElementById('homeStrengthValue');
            if (homeStrengthValue) homeStrengthValue.textContent = v.toFixed(3);
        });
    }

    // Homing period slider (seconds)
    const homingPeriodSlider = document.getElementById('homingPeriodSlider');
    if (homingPeriodSlider) {
        homingPeriodSlider.addEventListener('input', (e) => {
            const s = parseInt(e.target.value, 10);
            gameState.homingCycleMs = s * 1000;
            const homingPeriodValue = document.getElementById('homingPeriodValue');
            if (homingPeriodValue) homingPeriodValue.textContent = s + 's';
        });
    }

    // Speed multiplier slider
    const speedMultiplierSlider = document.getElementById('speedMultiplierSlider');
    if (speedMultiplierSlider) {
        speedMultiplierSlider.addEventListener('input', (e) => {
            const v = parseFloat(e.target.value);
            gameState.speedMultiplier = v;
            const speedMultiplierValue = document.getElementById('speedMultiplierValue');
            if (speedMultiplierValue) speedMultiplierValue.textContent = v.toFixed(2) + 'x';
        });
    }

    const sepSlider = document.getElementById('sepSlider');
    if (sepSlider) {
        sepSlider.addEventListener('input', (e) => {
            gameState.sepWeight = parseFloat(e.target.value);
            const sepValue = document.getElementById('sepValue');
            if (sepValue) sepValue.textContent = gameState.sepWeight.toFixed(1);
        });
    }

    const aliSlider = document.getElementById('aliSlider');
    if (aliSlider) {
        aliSlider.addEventListener('input', (e) => {
            gameState.aliWeight = parseFloat(e.target.value);
            const aliValue = document.getElementById('aliValue');
            if (aliValue) aliValue.textContent = gameState.aliWeight.toFixed(1);
        });
    }

    const cohSlider = document.getElementById('cohSlider');
    if (cohSlider) {
        cohSlider.addEventListener('input', (e) => {
            gameState.cohWeight = parseFloat(e.target.value);
            const cohValue = document.getElementById('cohValue');
            if (cohValue) cohValue.textContent = gameState.cohWeight.toFixed(1);
        });
    }

    const feedingBtn = document.getElementById('feedingBtn');
    if (feedingBtn) {
        feedingBtn.addEventListener('click', () => {
            spawnFood(gameState);
        });
    }

    const playBtn = document.getElementById('playBtn');
    if (playBtn) {
        playBtn.addEventListener('click', () => {
            gameState.isPaused = false;
            updatePlaybackButtonsUI();
        });
    }

    const pauseBtn = document.getElementById('pauseBtn');
    if (pauseBtn) {
        pauseBtn.addEventListener('click', () => {
            gameState.isPaused = true;
            updatePlaybackButtonsUI();
        });
    }

    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            computeGridInfo(gameState);
            initBirds(gameState);
            updateCanvasSize(gameState);
            gameState.frameCount = 0;
            // Clear history and save new frame 0
            gameState.frameHistory = [];
            saveGameStateSnapshot(0);
        });
    }

    // Previous frame button - forward one frame (even when paused)
    const prevFrameBtn = document.getElementById('prevFrameBtn');
    if (prevFrameBtn) {
        prevFrameBtn.addEventListener('click', () => {
            gameState.stepOnceDirection = 1;
            gameState.isPaused = true;
            updatePlaybackButtonsUI();
        });
    }

    // Next frame button - backward one frame (even when paused)
    const nextFrameBtn = document.getElementById('nextFrameBtn');
    if (nextFrameBtn) {
        nextFrameBtn.addEventListener('click', () => {
            gameState.stepOnceDirection = -1;
            gameState.isPaused = true;
            updatePlaybackButtonsUI();
        });
    }

    // Sound volume slider
    const soundVolumeSlider = document.getElementById('soundVolume');
    if (soundVolumeSlider) {
        soundVolumeSlider.addEventListener('input', (e) => {
            const v = parseFloat(e.target.value) / 100;
            gameState.soundVolume = Math.max(0, Math.min(1, v));
            // Apply to audio engine (mute if sound disabled)
            if (gameState.soundEnabled) {
                birdAudio.setVolume(gameState.soundVolume);
            } else {
                birdAudio.setVolume(0);
            }
        });
        // Initialize master volume from slider's current value
        const initV = parseFloat(soundVolumeSlider.value) / 100;
        gameState.soundVolume = Math.max(0, Math.min(1, initV || gameState.soundVolume));
        birdAudio.setVolume(gameState.soundEnabled ? gameState.soundVolume : 0);
    }

    const soundBtn = document.getElementById('soundToggleBtn');
    if (soundBtn) {
        const syncLabel = () => soundBtn.textContent = gameState.soundEnabled ? 'Sound: ON' : 'Sound: OFF';
        soundBtn.addEventListener('click', () => {
            gameState.soundEnabled = !gameState.soundEnabled;
            if (gameState.soundEnabled) {
                birdAudio.isReady();
                birdAudio.setVolume(gameState.soundVolume);
            } else {
                birdAudio.setVolume(0);
            }
            syncLabel();
        });
        syncLabel();
    }

    const exportSvgBtn = document.getElementById('exportSvgBtn');
    if (exportSvgBtn) {
        exportSvgBtn.addEventListener('click', () => {
            exportCanvasToSVG();
        });
    }

    // Recording control: single toggle button
    const recToggleBtn = document.getElementById('recordToggleBtn');
    if (recToggleBtn) {
        recToggleBtn.addEventListener('click', () => {
            if (isRecording) stopRecording(); else startRecording();
        });
    }
    updateRecordingControls();

    // Background toggle
    const backgroundToggleBtn = document.getElementById('backgroundToggleBtn');
    if (backgroundToggleBtn) {
        backgroundToggleBtn.addEventListener('click', (e) => {
            gameState.backgroundVisible = !gameState.backgroundVisible;
            e.target.textContent = gameState.backgroundVisible ? 'Background: On' : 'Background: Off';
            
            // Toggle background visibility using class
            if (gameState.backgroundVisible) {
                document.body.classList.remove('background-hidden');
            } else {
                document.body.classList.add('background-hidden');
            }
        });
    }

    // Movement mode toggle (grid vs free floating)
    const movementModeBtn = document.getElementById('movementModeBtn');
    if (movementModeBtn) {
        movementModeBtn.addEventListener('click', (e) => {
            gameState.useGridMovement = !gameState.useGridMovement;
            e.target.textContent = gameState.useGridMovement ? 'Movement: Grid' : 'Movement: Free';
            // Reset birds when switching modes to avoid positioning issues
            if (Array.isArray(gameState.birds)) {
                const cellSize = gameState.cellSize || 20;
                if (!gameState.useGridMovement) {
                    // Convert grid coords to pixel coords for free floating
                    // Also convert homeX/homeY for homing to work correctly
                    for (let b of gameState.birds) {
                        b.homeX = b.homeX * cellSize + cellSize / 2;
                        b.homeY = b.homeY * cellSize + cellSize / 2;
                        b.x = b.x * cellSize + cellSize / 2;
                        b.y = b.y * cellSize + cellSize / 2;
                        b.vx = 0;
                        b.vy = 0;
                    }
                } else {
                    // Convert pixel coords to grid coords for grid mode
                    // Also convert homeX/homeY
                    for (let b of gameState.birds) {
                        const homeGridX = Math.round(b.homeX / cellSize);
                        const homeGridY = Math.round(b.homeY / cellSize);
                        const currentGridX = Math.round(b.x / cellSize);
                        const currentGridY = Math.round(b.y / cellSize);
                        
                        const G = gameState.effectiveGrid || gameState.gridSize;
                        b.homeX = ((homeGridX % G) + G) % G;
                        b.homeY = ((homeGridY % G) + G) % G;
                        b.x = ((currentGridX % G) + G) % G;
                        b.y = ((currentGridY % G) + G) % G;
                        b.vx = 0;
                        b.vy = 0;
                    }
                }
            }
        });
    }

    // Gooey strength slider - controls blur intensity via SVG filter
    const gooSlider = document.getElementById('gooBlurSlider');
    const gooVal = document.getElementById('gooBlurValue');
    const gooFilter = document.querySelector('#goo feGaussianBlur');
    if (gooSlider && gooVal && gooFilter) {
        const updateGooEffect = (val) => {
            // Map slider range (0-5) to stdDeviation range (0-30)
            // 0 = no blur, 5 = max blur
            const stdDev = (val / 5) * 30;
            gooFilter.setAttribute('stdDeviation', stdDev.toString());
            
            // Enable/disable filter based on value
            if (val > 0) {
                document.body.classList.add('use-goo');
            } else {
                document.body.classList.remove('use-goo');
            }
        };

        gooSlider.addEventListener('input', (e) => {
            const newBlur = parseFloat(e.target.value);
            gooBlur = newBlur;  // update global
            gooVal.textContent = newBlur.toFixed(1);
            updateGooEffect(newBlur);
        });
        // initialize display/state (start at 0 => no goo)
        const initBlur = parseFloat(gooSlider.value);
        gooBlur = initBlur;
        gooVal.textContent = initBlur.toFixed(1);
        updateGooEffect(initBlur);
    }

    // Per-bird offset slider
    const offsetSlider = document.getElementById('birdOffsetSlider');
    const offsetVal = document.getElementById('birdOffsetValue');
    if (offsetSlider && offsetVal) {
        offsetSlider.addEventListener('input', (e) => {
            const v = parseFloat(e.target.value);
            gameState.offsetRange = v;
            offsetVal.textContent = v.toFixed(1);
            // reassign random offsets to existing birds within new range
            if (Array.isArray(gameState.birds)) {
                for (let b of gameState.birds) {
                    b.offsetX = (Math.random() * 2 - 1) * v;
                    b.offsetY = (Math.random() * 2 - 1) * v;
                }
            }
        });
        // initialize
        const initOffset = parseFloat(offsetSlider.value);
        gameState.offsetRange = initOffset;
        offsetVal.textContent = initOffset.toFixed(1);
    }

    // Generate SVG shape buttons dynamically (includes Random option)
    createSVGShapeButtons();

    // Font selector handlers
    const fontSelector = document.getElementById('fontSelector');
    
    // Predefined fonts from FONT_Example directory
    const availableFonts = [
        { name: 'Arcyn – Yuki Liu', file: 'Font_Example/Arcyn.ttf' },
        { name: 'mp3 – Ames Grund', file: 'Font_Example/mp3-regular.otf' },
        { name: 'Tele – Emelie Brockhaus', file: 'Font_Example/Tele-Text.otf' },
        { name: 'Default', file: 'Boids Pixel Font.glyphs' },
        { name: 'Upload Font', file: 'upload' },
        { name: 'Upload Image', file: 'upload-image' }
    ];
    
    // Load available fonts from FONT_Example directory
    async function loadAvailableFonts() {
        try {
            // Directly add all predefined fonts to selector
            for (const font of availableFonts) {
                const option = document.createElement('option');
                option.value = font.file;
                option.textContent = font.name;
                fontSelector.appendChild(option);
            }
        } catch (e) {
            console.warn('Failed to load font list', e);
        }
    }
    
    if (fontSelector) {
        fontSelector.addEventListener('change', async (e) => {
            if (!e.target.value) return;
            const selection = e.target.value;
            if (selection !== 'upload-image') {
                clearImageMode();
            }
            
            // Handle Default option - reset to built-in GLYPHS
            if (selection === 'Boids Pixel Font.glyphs') {
                // Restore original GLYPHS
                if (originalGLYPHS) {
                    for (const key of Object.keys(GLYPHS)) {
                        delete GLYPHS[key];
                    }
                    Object.assign(GLYPHS, JSON.parse(JSON.stringify(originalGLYPHS)));
                }
                
                gameState.customFontFamily = null;
                initDefaultFontSupport();
                computeGridInfo(gameState);
                initBirds(gameState);
                updateCanvasSize(gameState);
                gameState.frameHistory = [];
                gameState.frameCount = 0;
                saveGameStateSnapshot(0);
                
                const statusEl = document.getElementById('fontStatus');
                if (statusEl) statusEl.textContent = 'Using Boids Pixel Font';
                e.target.value = '';
                return;
            }
            
            // Handle Upload Font option
            if (selection === 'upload') {
                const input = getOrCreateFontFileInput();
                input.click();
                e.target.value = '';
                return;
            }

            // Handle Upload Image option
            if (selection === 'upload-image') {
                const input = getOrCreateImageFileInput();
                input.click();
                e.target.value = '';
                return;
            }
            
            try {
                const response = await fetch(e.target.value);
                if (!response.ok) {
                    const statusEl = document.getElementById('fontStatus');
                    if (statusEl) statusEl.textContent = 'Failed to load font - Please use a local server';
                    alert('Font loading failed. To use custom fonts, please run this page through a local web server.\n\nQuick start:\n1. Open Terminal\n2. Run: python3 -m http.server 8000\n3. Open: http://localhost:8000');
                    e.target.value = '';
                    return;
                }
                
                const blob = await response.blob();
                const fontName = e.target.options[e.target.selectedIndex].text;
                const file = new File([blob], fontName, { type: blob.type });
                
                const prevOptions = Array.from(fontSelector.options).map(o => o.outerHTML).join('');
                fontSelector.disabled = true;
                fontSelector.innerHTML = '<option selected>Parsing...</option>';
                
                await parseUploadedFontToGlyphs(file);
                
                fontSelector.disabled = false;
                fontSelector.innerHTML = prevOptions;
                fontSelector.value = '';
            } catch (err) {
                console.error('Font loading error', err);
                const statusEl = document.getElementById('fontStatus');
                if (statusEl) statusEl.textContent = 'Error loading font - Need local server';
                // Show user-friendly alert on first font load failure
                if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
                    alert('Font loading requires a local web server.\n\nTo fix this:\n1. Open Terminal in the project folder\n2. Run: python3 -m http.server 8000\n3. Open: http://localhost:8000\n\nAlternatively, use "Upload Font" option to load fonts directly.');
                }
                fontSelector.value = '';
                fontSelector.disabled = false;
            }
        });
        
        // Load available fonts on startup
        loadAvailableFonts();
    }

    // SVG upload handlers
    const svgFileEl = document.getElementById('svgFile');
    const svgUploadBtn = document.getElementById('svgUploadBtn');
    const svgUseBtn = document.getElementById('svgUseBtn');
    const svgStatusEl = document.getElementById('svgStatus');
    
    // Handle file selection from upload button (only bind once)
    if (svgFileEl && !svgFileEl.dataset.bound) {
        svgFileEl.addEventListener('change', async (e) => {
            if (e.target.files && e.target.files.length > 0) {
                try {
                    const file = e.target.files[0];
                    const text = await file.text();
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(text, 'image/svg+xml');
                    const root = doc.documentElement;
                    if (!root || root.tagName.toLowerCase() !== 'svg') {
                        if (svgStatusEl) svgStatusEl.textContent = 'Invalid SVG file';
                        e.target.value = ''; // Reset input
                        return;
                    }
                    // Store uploaded SVG for custom drawing (id 99)
                    svgShapes[99] = root;
                    
                    // Automatically switch to uploaded shape mode and update all birds
                    gameState.shapeMode = 9;
                    gameState.useRandomShapes = false;
                    
                    // Force all birds to use the uploaded shape immediately
                    if (Array.isArray(gameState.birds)) {
                        for (let bird of gameState.birds) {
                            bird.shapeType = 9;
                        }
                    }
                    
                    if (svgStatusEl) svgStatusEl.textContent = `Loaded: ${file.name}`;
                    e.target.value = ''; // Reset input to allow re-uploading same file
                } catch (err) {
                    console.error('Error loading SVG:', err);
                    if (svgStatusEl) svgStatusEl.textContent = 'Error loading SVG file';
                    e.target.value = ''; // Reset input
                }
            }
        });
        svgFileEl.dataset.bound = 'true';
    }
    
    if (svgUseBtn) {
        svgUseBtn.addEventListener('click', async () => {
            try {
                if (!svgFileEl || !svgFileEl.files || svgFileEl.files.length === 0) {
                    if (svgStatusEl) svgStatusEl.textContent = 'Please choose an SVG file first';
                    return;
                }
                const file = svgFileEl.files[0];
                const text = await file.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, 'image/svg+xml');
                const root = doc.documentElement;
                if (!root || root.tagName.toLowerCase() !== 'svg') {
                    if (svgStatusEl) svgStatusEl.textContent = 'Invalid SVG file';
                    return;
                }
                // Store uploaded SVG for custom drawing (id 99)
                svgShapes[99] = root;
                if (svgStatusEl) svgStatusEl.textContent = `Loaded: ${file.name}`;
                if (typeof window.refreshUploadedShapeThumb === 'function') {
                    window.refreshUploadedShapeThumb();
                }
                // Activate the uploaded shape mode automatically
                const uploadedBtn = document.getElementById('uploadedShapeBtn');
                if (uploadedBtn && !uploadedBtn.disabled) {
                    document.querySelectorAll('.shape-btn').forEach(b => b.classList.remove('active'));
                    uploadedBtn.classList.add('active');
                    gameState.shapeMode = 9;
                    gameState.useRandomShapes = false;
                }
            } catch (e) {
                console.error('Failed to use uploaded SVG', e);
                if (svgStatusEl) svgStatusEl.textContent = 'Failed to load SVG';
            }
        });
    }

    // Initialize displayed slider values from gameState
    document.getElementById('resolutionValue').textContent = gameState.gridSize;
    document.getElementById('resolutionValue2').textContent = gameState.gridSize;
    document.getElementById('birdSizeValue').textContent = gameState.birdSizeScale.toFixed(2);
    document.getElementById('sepValue').textContent = gameState.sepWeight.toFixed(1);
    document.getElementById('aliValue').textContent = gameState.aliWeight.toFixed(1);
    document.getElementById('cohValue').textContent = gameState.cohWeight.toFixed(1);
    document.getElementById('homeStrengthValue').textContent = gameState.homeWeight.toFixed(3);
    document.getElementById('homingPeriodValue').textContent = Math.round((gameState.homingCycleMs || HOMING_CYCLE_MS) / 1000) + 's';
    document.getElementById('speedMultiplierValue').textContent = gameState.speedMultiplier.toFixed(2) + 'x';

}

function updatePlaybackButtonsUI() {
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    if (playBtn) playBtn.classList.toggle('active', !gameState.isPaused);
    if (pauseBtn) pauseBtn.classList.toggle('active', gameState.isPaused);
}

function updateRecordingControls() {
    const recToggleBtn = document.getElementById('recordToggleBtn');
    if (recToggleBtn) {
        recToggleBtn.textContent = isRecording ? 'Stop' : 'Record MP4';
    }
}

function setupEventListeners() {
    canvas.addEventListener('mousemove', (e) => {
        let rect = canvas.getBoundingClientRect();
        gameState.mouseX = e.clientX - rect.left;
        gameState.mouseY = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => {
        gameState.mouseX = -1000;
        gameState.mouseY = -1000;
    });

    // Initialize playback buttons state
    updatePlaybackButtonsUI();
}

// ===== Animation Loop =====
function animate() {
    try {
    // Toggle homingPhase periodically so flock alternates between roaming and returning
    const now = Date.now();
    if (now - gameState.homingLastToggle > (gameState.homingCycleMs || HOMING_CYCLE_MS)) {
        gameState.homingPhase = !gameState.homingPhase;
        gameState.homingLastToggle = now;
        if (gameState.homingPhase) {
            // record start time for ramping
            gameState.homingPhaseStartTime = now;
        }
    }
    // update phase label if present
    const phaseLabelEl = document.getElementById('phaseLabel');
    if (phaseLabelEl) phaseLabelEl.textContent = gameState.homingPhase ? 'HOMING' : 'ROAMING';

    // Clear canvas — transparent when goo is active, white otherwise
    const gooEnabled = gooBlur > 0;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    if (gooEnabled) {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    } else {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    }

    // Save a reference to the main drawing context for compositing later
    const mainCtx = ctx;

    // Live view: do NOT draw white; keep showing the page background (transparent canvas)
    // Draw food first so it sits beneath the birds.
    ctx = mainCtx;
    drawFood(gameState);

    // Update birds and frame counter (allow single-step when paused)
    const shouldStep = !gameState.isPaused || gameState.stepOnceDirection !== 0;
    if (shouldStep) {
        // Handle backward/forward step using history
        if (gameState.isPaused && gameState.stepOnceDirection !== 0) {
            const targetFrame = gameState.frameCount + gameState.stepOnceDirection;
            
            // Try to restore from history first
            if (targetFrame >= 0 && restoreGameStateSnapshot(targetFrame)) {
                gameState.frameCount = targetFrame;
            } else if (targetFrame >= 0) {
                // If not in history, compute the frame (works for both forward and backward)
                gameState.frameCount = targetFrame;
                computeFrameStep();
                // Save the new frame to history
                saveGameStateSnapshot(gameState.frameCount);
            }
            // stepOnceDirection handled, reset it
            gameState.stepOnceDirection = 0;
        } else {
            // Normal playback (not paused)
            const frameIncrement = !gameState.isPaused ? 1 : gameState.stepOnceDirection;
            gameState.frameCount = Math.max(0, gameState.frameCount + frameIncrement);
            computeFrameStep();
            // Save to history
            if (!gameState.isPaused) {
                saveGameStateSnapshot(gameState.frameCount);
            }
        }
    }

    drawBirds(gameState);

    // Goo effect layer
    if (gooEnabled && offscreenMask && offCtxMask) {
        offCtxMask.clearRect(0, 0, offscreenMask.width, offscreenMask.height);
        offCtxMask.fillStyle = '#000';
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        for (let b of gameState.birds) {
            const cx = b.x * gameState.cellSize + gameState.cellSize / 2 + (b.offsetX || 0);
            const cy = b.y * gameState.cellSize + gameState.cellSize / 2 + (b.offsetY || 0) + gameState.renderOffsetY;
            // Skip birds with center point outside canvas
            if (cx < 0 || cx >= canvasWidth || cy < 0 || cy >= canvasHeight) continue;
            const size = gameState.cellSize * gameState.birdSizeScale;
            offCtxMask.beginPath();
            offCtxMask.arc(cx, cy, size / 2, 0, Math.PI * 2);
            offCtxMask.fill();
        }
        applyBlur(offscreenMask, offCtxMaskBlur, gooBlur);
        mainCtx.drawImage(offscreenMaskBlur, 0, 0);
    }

    gameState.stepOnceDirection = 0;

    const gooActive = gooEnabled && offCtxMask && offCtxMaskBlur;

    // Draw birds or gooey black blobs when enabled
    if (gooActive) {
        // 1) render white shapes into offscreen mask
        ctx = offCtxMask;
        offCtxMask.clearRect(0, 0, canvasWidth, canvasHeight);
        drawBirds(gameState, true); // mask=true draws white shapes

        // 2) blur mask into offscreenMaskBlur
        const blurPx = Math.max(1, gooBlur * 1.35 + 1.5);
        offCtxMaskBlur.clearRect(0, 0, canvasWidth, canvasHeight);
        offCtxMaskBlur.save();
        offCtxMaskBlur.filter = `blur(${blurPx}px)`;
        offCtxMaskBlur.drawImage(offscreenMask, 0, 0);
        offCtxMaskBlur.filter = 'none';
        offCtxMaskBlur.restore();

        // 3) optional threshold to harden mask — low threshold keeps more
        try {
            const MASK_THRESHOLD = 4; // lower threshold -> smoother edges
            let img = offCtxMaskBlur.getImageData(0, 0, canvasWidth, canvasHeight);
            let d = img.data;
            for (let i = 0; i < d.length; i += 4) {
                const l = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
                d[i + 3] = (l > MASK_THRESHOLD) ? 255 : 0;
            }
            offCtxMaskBlur.putImageData(img, 0, 0);
        } catch (e) {
            console.warn('Mask threshold failed', e);
        }

        // 4) composite into an offscreen composite buffer so we don't
        // affect the already-drawn grid/food on the main canvas.
        offCtxComposite.clearRect(0, 0, canvasWidth, canvasHeight);
        offCtxComposite.save();
        offCtxComposite.fillStyle = 'black';
        offCtxComposite.fillRect(0, 0, canvasWidth, canvasHeight);
        offCtxComposite.globalCompositeOperation = 'destination-in';
        offCtxComposite.drawImage(offscreenMaskBlur, 0, 0);
        offCtxComposite.restore();

        // Draw the composited bird blobs on top of the grid/food
        ctx = mainCtx;
        mainCtx.drawImage(offscreenComposite, 0, 0);
    } else {
        // Normal rendering: draw birds directly to main
        ctx = mainCtx;
        drawBirds(gameState);
    }

    // Recording path: render the same frame onto the offscreen recording canvas with a white backdrop
    if (isRecording && recordCtx && recordCanvas) {
        const recCtx = recordCtx;
        // Clear and paint white background for exported video only
        recCtx.clearRect(0, 0, canvasWidth, canvasHeight);
        drawBackgroundLayer(recCtx, canvas.getBoundingClientRect());

        // Draw food beneath birds
        ctx = recCtx;
        drawFood(gameState);

        // Mirror the initial goo soft mask overlay onto the recording canvas
        if (gooEnabled && offscreenMask && offCtxMask) {
            offCtxMask.clearRect(0, 0, offscreenMask.width, offscreenMask.height);
            offCtxMask.fillStyle = '#000';
            const canvasWidth = recordCanvas.width;
            const canvasHeight = recordCanvas.height;
            for (let b of gameState.birds) {
                const cx = b.x * gameState.cellSize + gameState.cellSize / 2 + (b.offsetX || 0);
                const cy = b.y * gameState.cellSize + gameState.cellSize / 2 + (b.offsetY || 0) + gameState.renderOffsetY;
                // Skip birds with center point outside canvas
                if (cx < 0 || cx >= canvasWidth || cy < 0 || cy >= canvasHeight) continue;
                const size = gameState.cellSize * gameState.birdSizeScale;
                offCtxMask.beginPath();
                offCtxMask.arc(cx, cy, size / 2, 0, Math.PI * 2);
                offCtxMask.fill();
            }
            applyBlur(offscreenMask, offCtxMaskBlur, gooBlur);
            recCtx.drawImage(offscreenMaskBlur, 0, 0);
        }

        // Recompute goo pass for recording target
        if (gooActive) {
            // 1) render white shapes into offscreen mask
            ctx = offCtxMask;
            offCtxMask.clearRect(0, 0, canvasWidth, canvasHeight);
            drawBirds(gameState, true);

            // 2) blur mask
            const blurPx = Math.max(1, gooBlur * 1.35 + 1.5);
            offCtxMaskBlur.clearRect(0, 0, canvasWidth, canvasHeight);
            offCtxMaskBlur.save();
            offCtxMaskBlur.filter = `blur(${blurPx}px)`;
            offCtxMaskBlur.drawImage(offscreenMask, 0, 0);
            offCtxMaskBlur.filter = 'none';
            offCtxMaskBlur.restore();

            // 3) threshold alpha
            try {
                const MASK_THRESHOLD = 4;
                let img = offCtxMaskBlur.getImageData(0, 0, canvasWidth, canvasHeight);
                let d = img.data;
                for (let i = 0; i < d.length; i += 4) {
                    const l = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
                    d[i + 3] = (l > MASK_THRESHOLD) ? 255 : 0;
                }
                offCtxMaskBlur.putImageData(img, 0, 0);
            } catch {}

            // 4) composite blobs
            offCtxComposite.clearRect(0, 0, canvasWidth, canvasHeight);
            offCtxComposite.save();
            offCtxComposite.fillStyle = 'black';
            offCtxComposite.fillRect(0, 0, canvasWidth, canvasHeight);
            offCtxComposite.globalCompositeOperation = 'destination-in';
            offCtxComposite.drawImage(offscreenMaskBlur, 0, 0);
            offCtxComposite.restore();

            // Draw onto recording canvas
            ctx = recCtx;
            recCtx.drawImage(offscreenComposite, 0, 0);
        } else {
            // Normal birds on recording canvas
            ctx = recCtx;
            drawBirds(gameState);
        }
        // Restore drawing context back to the visible canvas for subsequent frames
        ctx = mainCtx;
    }

    // Draw frame counter last so it's always readable
    // Frame counter hidden
    } catch (err) {
        console.error('Animate loop error', err);
    }
    requestAnimationFrame(animate);
}

// ===== Start =====
window.addEventListener('DOMContentLoaded', () => {
    try {
        // Attempt early audio init (may still be blocked by browser policies)
        birdAudio.ensureContext();
        setup();
        animate();
    } catch (err) {
        console.error('Startup error', err);
    }
});
