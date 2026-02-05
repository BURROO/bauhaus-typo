console.log("index-card-03.js loaded");

// Set default font to ABCFavorit-Regular on page load
window.addEventListener('DOMContentLoaded', function() {
    const defaultFont = 'ABCFavorit-Regular';
    document.documentElement.style.setProperty('--active-font', defaultFont);
    document.body.style.fontFamily = defaultFont;
    
    document.querySelectorAll('.card-title, .ui-button, .write-textarea, .letter-glyph, .help-glyph, .card-description').forEach(el => {
        el.style.fontFamily = defaultFont;
    });
    
    console.log(`Default font set to: ${defaultFont}`);
});

// ===== INTERFACE FUNCTIONS =====

// Load button functionality - font selection dropdown
const loadButton = document.getElementById('load-button');
const fontModal = document.getElementById('font-modal');
const fontOptions = document.querySelectorAll('.font-option');

// Position dropdown relative to Load button
function positionDropdown() {
    const buttonRect = loadButton.getBoundingClientRect();
    fontModal.style.top = buttonRect.bottom + 'px';
    fontModal.style.left = buttonRect.left + 'px';
}

// Toggle dropdown
loadButton.addEventListener('click', function(e) {
    e.stopPropagation();
    
    if (!fontModal.classList.contains('active')) {
        positionDropdown();
        fontModal.classList.add('active');
    } else {
        fontModal.classList.remove('active');
    }
});

// Reposition on window resize
window.addEventListener('resize', function() {
    if (fontModal.classList.contains('active')) {
        positionDropdown();
    }
});

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    if (!fontModal.contains(e.target) && e.target !== loadButton) {
        fontModal.classList.remove('active');
    }
});

// Select font
fontOptions.forEach(option => {
    option.addEventListener('click', function() {
        const selectedFont = this.getAttribute('data-font');
        
        // Apply font to entire interface
        document.documentElement.style.setProperty('--active-font', selectedFont);
        document.body.style.fontFamily = selectedFont;
        
        // Apply to all elements
        document.querySelectorAll('.card-title, .ui-button, .write-textarea, .letter-glyph, .help-glyph, .card-description').forEach(el => {
            el.style.fontFamily = selectedFont;
        });
        
        console.log(`Font changed to: ${selectedFont}`);
        
        // Close dropdown
        fontModal.classList.remove('active');
    });
});

// Write button functionality
const writeButton = document.getElementById('write-button');
let isTextField = false;
let textarea = null;

writeButton.addEventListener('click', function() {
    if (!isTextField) {
        const buttonRect = writeButton.getBoundingClientRect();
        
        textarea = document.createElement('textarea');
        textarea.id = 'write-textarea';
        textarea.className = 'write-textarea';
        textarea.placeholder = 'Start writing...';
        
        textarea.style.position = 'fixed';
        textarea.style.left = buttonRect.left + 'px';
        textarea.style.top = buttonRect.top + 'px';
        textarea.style.width = buttonRect.width + 'px';
        textarea.style.minHeight = buttonRect.height + 'px';
        
        writeButton.style.visibility = 'hidden';
        document.body.appendChild(textarea);
        
        function autoExpand() {
            textarea.style.height = 'auto';
            textarea.style.height = Math.max(buttonRect.height, textarea.scrollHeight) + 'px';
        }
        
        textarea.addEventListener('input', autoExpand);
        
        function clickOutside(e) {
            if (e.target !== textarea) {
                textarea.remove();
                writeButton.style.visibility = 'visible';
                document.removeEventListener('click', clickOutside);
                isTextField = false;
            }
        }
        
        setTimeout(() => {
            document.addEventListener('click', clickOutside);
        }, 100);
        
        textarea.focus();
        isTextField = true;
    }
});

// Help button functionality
const helpButton = document.getElementById('help-button');
const cardDescription = document.querySelector('.card-description');
const closeDescription = document.querySelector('.close-description');

if (helpButton && cardDescription) {
    helpButton.addEventListener('click', function() {
        cardDescription.style.display = 'block';
    });
}

if (closeDescription && cardDescription) {
    closeDescription.addEventListener('click', function() {
        cardDescription.style.display = 'none';
    });
}

// Invert, Outline, and Colorwheel Buttons
document.addEventListener("DOMContentLoaded", () => {
    const html = document.documentElement;
    const invertButton = document.getElementById("invert-button");
    const outlineButton = document.getElementById("outline-button");
    const colorPicker = document.getElementById("color-picker");
    const colorWheelBtn = document.getElementById("Colorwheel-Button");

    // Toggle outline mode
    if (outlineButton) {
        const outlineTooltip = outlineButton.querySelector('.tooltip');
        outlineButton.addEventListener("click", () => {
            html.classList.toggle("outline-mode");
            // Update tooltip text
            if (html.classList.contains("outline-mode")) {
                outlineTooltip.textContent = "Fill";
            } else {
                outlineTooltip.textContent = "Outline";
            }
        });
    }

    // Toggle invert mode
    if (invertButton) {
        invertButton.addEventListener("click", () => {
            html.classList.toggle("is-inverted");
        });
    }

    // Color wheel
    if (colorPicker && colorWheelBtn) {
        colorWheelBtn.addEventListener("click", () => {
            colorPicker.click();
        });

        colorPicker.addEventListener("input", (e) => {
            document.documentElement.style.setProperty("--base-color", e.target.value);
        });
    }
});

// ===== BRUSH FUNCTIONALITY =====

window.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('brush-canvas');
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    function ensureLetterLayer() {
        let layer = document.querySelector('.letter-layer');
        if (!layer) {
            layer = document.createElement('div');
            layer.className = 'letter-layer';
            if (canvas && canvas.parentNode) canvas.parentNode.insertBefore(layer, canvas.nextSibling);
            else document.body.appendChild(layer);
        }
        return layer;
    }

    const letterLayer = ensureLetterLayer();
    const ctx = canvas.getContext('2d');
    let boundaryPath = null;

    function updateBoundary() {
        const cssW = Math.max(1, Math.floor(canvas.clientWidth));
        const cssH = Math.max(1, Math.floor(canvas.clientHeight));
        canvas.width = cssW;
        canvas.height = cssH;
        canvas.style.width = cssW + 'px';
        canvas.style.height = cssH + 'px';

        const svg = document.querySelector('.card-3 svg');
        const svgPathEl = svg ? svg.querySelector('path') : null;

        if (svg && svgPathEl && svg.viewBox && svg.viewBox.baseVal) {
            try {
                const d = svgPathEl.getAttribute('d');
                const svgRect = svg.getBoundingClientRect();
                const canvasRect = canvas.getBoundingClientRect();
                const vb = svg.viewBox.baseVal;
                const sx0 = svgRect.width / vb.width;
                const sy0 = svgRect.height / vb.height;
                const padding = cssPxNumber('--brush-padding', 12);
                const sfX = Math.max(0, (svgRect.width - 2 * padding) / svgRect.width);
                const sfY = Math.max(0, (svgRect.height - 2 * padding) / svgRect.height);
                const sf = Math.min(sfX, sfY);
                const sx = sx0 * sf;
                const sy = sy0 * sf;
                const dx = (svgRect.left - canvasRect.left) + (svgRect.width * (1 - sf) / 2) - vb.x * sx;
                const dy = (svgRect.top - canvasRect.top) + (svgRect.height * (1 - sf) / 2) - vb.y * sy;
                const svgPath = new Path2D(d);
                const m = new DOMMatrix([sx, 0, 0, sy, dx, dy]);
                const p = new Path2D();
                p.addPath(svgPath, m);
                boundaryPath = p;
            } catch (err) {
                console.warn('failed to build brush boundary from SVG path', err);
                boundaryPath = null;
            }
        } else {
            boundaryPath = null;
        }
    }

    window.addEventListener('resize', updateBoundary, { passive: true });
    window.addEventListener('scroll', updateBoundary, { passive: true });
    updateBoundary();

    let drawing = false;
    let lastX = null;
    let lastY = null;
    let spacing = 20;

    const POOL_SIZE = 6;
    const rotateSegments = false;
    const sizeFalloff = 0.1;
    const BASE_SIZE = 200;

    function cssPxNumber(varName, fallback) {
        try {
            const v = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
            if (!v) return fallback;
            if (v.endsWith('px')) return parseFloat(v);
            const n = parseFloat(v);
            return isNaN(n) ? fallback : n;
        } catch (e) { return fallback; }
    }

    const MIN_FONT_SIZE = cssPxNumber('--letter-min-size', 200); // 150pt
    const MAX_FONT_SIZE = cssPxNumber('--letter-max-size', 467); // 350pt

    const path = [];
    const strokeHistory = [];
    const pool = [];
    let brushEnabled = false; // Brush is disabled by default
    let highestZIndex = 100; // Z-index management for layering

    function initPool() {
        for (let i = 0; i < POOL_SIZE; i++) {
            const el = document.createElement('span');
            el.className = 'letter-box';

            const dragZone = document.createElement('div');
            dragZone.className = 'letter-box-drag-zone';

            const glyph = document.createElement('span');
            glyph.className = 'letter-glyph';
            glyph.contentEditable = 'true';
            glyph.textContent = letters[Math.floor(Math.random() * letters.length)];

            const clip = document.createElement('div');
            clip.className = 'letter-clip';

            clip.appendChild(glyph);
            el.appendChild(dragZone);
            el.appendChild(clip);
            enableGlyphDrag(el);

            addZoomControls(el, false); // No info display for pool elements

            el.style.position = 'absolute';
            el.style.left = '0px';
            el.style.top = '0px';
            // Random base font size for each box (between 150pt and 350pt = 200px to 467px)
            const randomBaseFontSize = Math.floor(Math.random() * 267) + 200; // 200-467px range
            el.style.fontSize = randomBaseFontSize + 'px';
            el.dataset.initialFontSize = randomBaseFontSize.toString(); // Store for animation
            el.style.willChange = 'transform, left, top';
            el.style.visibility = 'hidden';
            el.dataset.hidden = 'true';
            el.dataset.zoom = '1'; // Set default zoom
            el.style.zIndex = '9999'; // Pool always on top while drawing

            // Increased randomness in size variation, but constrained to stay above minimum
            const sizeFactor = (Math.random() * 5) + 0.8; // 0.8 to 5.8
            el.dataset.sizeFactor = sizeFactor.toString();
            el.dataset.baseOffset = (Math.random() * 1.5 - 0.5).toString(); // -0.5 to 1 (so (1 + baseOffset) = 0.5 to 2)
            el.dataset.phase = (Math.random() * Math.PI * 4).toString();

            letterLayer.appendChild(el);
            pool.push(el);
        }
    }

    initPool();

    canvas.addEventListener('pointerdown', (e) => {
        // Only allow drawing if brush is enabled
        if (!brushEnabled) {
            return;
        }

        for (let el of pool) {
            const glyph = el.querySelector('.letter-glyph');
            if (glyph) {
                glyph.textContent = letters[Math.floor(Math.random() * letters.length)];
                glyph.contentEditable = 'true';
            }
        }

        for (let el of pool) {
            const sizeFactor = (Math.random() * 1.8) + 0.2;
            el.dataset.sizeFactor = sizeFactor.toString();
        }

        canvas.setPointerCapture(e.pointerId);
        drawing = true;
        const layerRect = letterLayer.getBoundingClientRect();
        const x = e.clientX - layerRect.left;
        const y = e.clientY - layerRect.top;
        lastX = x;
        lastY = y;

        if (boundaryPath && ctx) {
            if (!ctx.isPointInPath(boundaryPath, x, y)) {
                drawing = false;
                return;
            }
        }

        path.length = 0;
        for (let i = 0; i < POOL_SIZE; i++) {
            path.push({ x, y });
        }
        for (let el of pool) {
            el.style.left = `${x}px`;
            el.style.top = `${y}px`;
            el.style.visibility = 'visible';
            delete el.dataset.hidden;
        }
    });

    canvas.addEventListener('pointerup', (e) => {
        canvas.releasePointerCapture(e.pointerId);
        if (path.length > 1) {
            commitStroke(path.slice());
        }
        drawing = false; 
        lastX = null; 
        lastY = null;
        // Disable brush after stroke is committed
        brushEnabled = false;
        // Hide pool
        for (let el of pool) {
            el.style.visibility = 'hidden';
            el.dataset.hidden = 'true';
        }
    });

    canvas.addEventListener('pointerleave', () => {
        if (drawing && path.length > 1) {
            commitStroke(path.slice());
        }
        drawing = false; 
        lastX = null; 
        lastY = null;
        // Disable brush after stroke is committed
        brushEnabled = false;
        // Hide pool
        for (let el of pool) {
            el.style.visibility = 'hidden';
            el.dataset.hidden = 'true';
        }
    });

    function commitStroke(stroke) {
        if (!letterLayer || pool.length === 0) return;
        const committed = [];
        for (let i = 0; i < pool.length; i++) {
            const src = pool[i];
            const clone = document.createElement('span');
            clone.className = 'letter-box committed-letter';
            
            const dragZone = document.createElement('div');
            dragZone.className = 'letter-box-drag-zone';
            
            const srcGlyph = src.querySelector('.letter-glyph');
            if (!srcGlyph) continue;

            const glyph = srcGlyph.cloneNode(true);
            glyph.contentEditable = 'true';
            const clip = document.createElement('div');
            clip.className = 'letter-clip';
            clip.appendChild(glyph);
            clone.appendChild(dragZone);
            clone.appendChild(clip);

            enableGlyphDrag(clone);
            applyGlyphTransform(clone);

            clone.dataset.zoom = src.dataset.zoom || "1";
            clone.dataset.baseFontSize = src.style.fontSize || "64px"; // Increased from 32px to 64px
            applyGlyphTransform(clone);

            addZoomControls(clone);
            enableBoxDrag(clone);

            clone.style.position = 'absolute';
            clone.style.left = src.style.left;
            clone.style.top = src.style.top;
            clone.style.fontSize = src.style.fontSize;
            clone.style.padding = src.style.padding;
            
            // Copy outline-offset custom property
            const outlineOffset = src.style.getPropertyValue('--outline-offset');
            if (outlineOffset) {
                clone.style.setProperty('--outline-offset', outlineOffset);
            }
            
            clone.dataset.baseFontSize = src.style.fontSize;
            clone.style.transform = src.style.transform || 'translate(-50%, -50%)';
            // New brush strokes always on top
            highestZIndex++;
            clone.style.zIndex = highestZIndex;
            clone.style.willChange = 'auto';
            letterLayer.appendChild(clone);
            
            // Update info display after adding to DOM so dimensions are available
            if (clone._updateInfo) {
                clone._updateInfo();
            }
            
            committed.push(clone);
        }
        strokeHistory.push(committed);
        path.length = 0;
    }

    function clearCommitted() {
        for (let group of strokeHistory) {
            for (let el of group) {
                if (el && el.parentNode) el.parentNode.removeChild(el);
            }
        }
        strokeHistory.length = 0;
    }

    canvas.addEventListener('pointermove', (e) => {
        if (!drawing) return;
        const layerRect = letterLayer.getBoundingClientRect();
        const x = e.clientX - layerRect.left;
        const y = e.clientY - layerRect.top;

        if (boundaryPath && ctx) {
            if (!ctx.isPointInPath(boundaryPath, x, y)) return;
        }

        if (lastX !== null && lastY !== null) {
            const distanceY = Math.hypot(x - lastX, y - lastY);
            if (distanceY >= 1) {
                path.push({ x, y });
                lastX = x;
                lastY = y;
            }
        } else {
            lastX = x;
            lastY = y;
            path.push({ x, y });
        }

        const maxPath = POOL_SIZE * 10;
        if (path.length > maxPath) path.splice(0, path.length - maxPath);
    });

    function animate() {
        if (path.length > 1) {
            for (let i = 0; i < POOL_SIZE; i++) {
                const t = i / (POOL_SIZE - 1);
                const s = t * (path.length - 1);
                const idx = Math.floor(s);
                const frac = s - idx;
                const a = path[idx];
                const b = path[Math.min(idx + 1, path.length - 1)];
                const p = {
                    x: a.x * (1 - frac) + b.x * frac,
                    y: a.y * (1 - frac) + b.y * frac
                };
                const next = b;
                if (!p) continue;
                const el = pool[i];

                // Use the element's initial random fontSize as base instead of fixed BASE_SIZE
                const initialFontSize = parseFloat(el.dataset.initialFontSize || '200');
                // Remove sizeFalloff to prevent size reduction below minimum
                const base = initialFontSize; // No falloff
                const factor = parseFloat(el.dataset.sizeFactor || '1');
                const baseOffset = parseFloat(el.dataset.baseOffset || '0');
                const phase = parseFloat(el.dataset.phase || '0');
                const JITTER_AMPLITUDE = 0.02;
                const jitter = 1 + (Math.sin((Date.now() / 300) + phase + i * 0.02) * JITTER_AMPLITUDE);
                
                let size = Math.round(base * (1 + baseOffset) * factor * jitter);
                size = Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, size));
                
                // Fixed padding like in _01 and _02
                const padding = 15; // Fixed 15px padding
                const outlineOffset = 15; // Fixed 15px outline offset
                
                el.style.left = `${p.x}px`;
                el.style.top = `${p.y}px`;
                el.style.fontSize = `${size}px`;
                el.style.padding = `${padding}px`;
                el.style.setProperty('--outline-offset', `${outlineOffset}px`);
                el.style.transform = 'translate(-50%, -50%)';
            }
        } else if (!drawing && path.length > 0) {
            path.shift();
        }

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);

    // Zoom controls
    function addZoomControls(letterBox, addInfoDisplay = true) {
        letterBox.dataset.zoom = "1";
        letterBox.dataset.offsetX = "0";
        letterBox.dataset.offsetY = "0";
        letterBox.dataset.editMode = "false";

        let zoomInterval = null;

        // Create info display only if requested (not for pool elements)
        let infoDisplay = null;
        let updateInfo = null;
        
        if (addInfoDisplay) {
            infoDisplay = document.createElement('div');
            infoDisplay.className = 'letter-info';
        
            const infoFont = document.createElement('span');
            infoFont.className = 'info-font';
            
            const infoScale = document.createElement('span');
            infoScale.className = 'info-scale';
            
            infoDisplay.appendChild(infoFont);
            infoDisplay.appendChild(infoScale);
            
            // Function to update info display
            updateInfo = function() {
                const fontSize = parseFloat(letterBox.style.fontSize || '64');
                const zoom = parseFloat(letterBox.dataset.zoom || '1');
                const actualSize = fontSize * zoom;
                const fontSizePt = (actualSize * 72 / 96).toFixed(1);
                
                // Calculate scale relative to 36pt base (36pt = 100%)
                const basePt = 36;
                const basePx = basePt * 96 / 72; // 48px
                const scale = Math.round((actualSize / basePx) * 100);
                
                infoFont.textContent = fontSizePt + ' pt';
                infoScale.textContent = scale + '%';
                
                // Fixed size like in _01 and _02 - no scaling with box size
                // Position relative to letterBox bottom-right
                const boxPadding = 15;
                infoDisplay.style.bottom = boxPadding + 'px';
                infoDisplay.style.right = boxPadding + 'px';
            };
            
            updateInfo();
        }

        const ui = document.createElement('div');
        ui.className = 'zoom-ui';

        const zoomIn = document.createElement('button');
        zoomIn.textContent = '+';

        const zoomOut = document.createElement('button');
        zoomOut.textContent = '−';

        function startZooming(direction) {
            letterBox.dataset.editMode = "true";
            changeZoom(letterBox, direction);
            zoomInterval = setInterval(() => {
                changeZoom(letterBox, direction);
            }, 60);
        }

        function stopZooming() {
            if (zoomInterval) {
                clearInterval(zoomInterval);
                zoomInterval = null;
            }
        }

        zoomIn.addEventListener('pointerdown', (e) => {
            e.stopPropagation();
            startZooming(1.15);
        });

        zoomOut.addEventListener('pointerdown', (e) => {
            e.stopPropagation();
            startZooming(0.85);
        });

        zoomIn.addEventListener('pointerup', stopZooming);
        zoomOut.addEventListener('pointerup', stopZooming);
        zoomIn.addEventListener('pointerleave', stopZooming);
        zoomOut.addEventListener('pointerleave', stopZooming);
        zoomIn.addEventListener('pointercancel', stopZooming);
        zoomOut.addEventListener('pointercancel', stopZooming);

        ui.appendChild(zoomIn);
        ui.appendChild(zoomOut);
        letterBox.appendChild(ui);
        
        // Only append info display if it was created
        if (infoDisplay) {
            letterBox.appendChild(infoDisplay);
        }
        
        // Store updateInfo function for later use
        letterBox._updateInfo = updateInfo;
    }

    function changeZoom(letterBox, factor) {
        let z = parseFloat(letterBox.dataset.zoom || "1");
        z *= factor;
        
        // Calculate minimum zoom to ensure font doesn't go below 36pt (48px)
        const currentFontSize = parseFloat(letterBox.style.fontSize || '133');
        const minFontSize = 48; // 36pt in pixels
        const minZoom = minFontSize / currentFontSize;
        
        z = Math.max(minZoom, Math.min(5, z)); // Dynamic min zoom, max 5x
        letterBox.dataset.zoom = z.toFixed(3);
        applyGlyphTransform(letterBox);
        
        // Update info display if function exists
        if (letterBox._updateInfo) {
            letterBox._updateInfo();
        }
    }

    function enableGlyphDrag(letterBox) {
        const glyph = letterBox.querySelector('.letter-glyph');
        if (!glyph) return;

        let dragging = false;
        let startX = 0;
        let startY = 0;
        let baseX = 0;
        let baseY = 0;

        glyph.addEventListener('pointerdown', (e) => {
            if (letterBox.dataset.editMode !== "true") return;

            e.stopPropagation();
            e.preventDefault();

            dragging = true;
            startX = e.clientX;
            startY = e.clientY;
            baseX = parseFloat(letterBox.dataset.offsetX || "0");
            baseY = parseFloat(letterBox.dataset.offsetY || "0");

            glyph.setPointerCapture(e.pointerId);
        });

        window.addEventListener('pointermove', (e) => {
            if (!dragging) return;

            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            letterBox.dataset.offsetX = baseX + dx;
            letterBox.dataset.offsetY = baseY + dy;

            applyGlyphTransform(letterBox);
        });

        window.addEventListener('pointerup', () => {
            dragging = false;
        });

        // Bring to front when glyph gets focus (editing)
        glyph.addEventListener('focus', () => {
            selectBox(letterBox);
        });
    }

    // Enable dragging the entire box when it's active (has blue border)
    function enableBoxDrag(letterBox) {
        let isDraggingBox = false;
        let dragStartX = 0;
        let dragStartY = 0;
        let boxStartLeft = 0;
        let boxStartTop = 0;

        const dragZone = letterBox.querySelector('.letter-box-drag-zone');
        if (!dragZone) return;

        dragZone.addEventListener('pointerdown', (e) => {
            e.stopPropagation();
            e.preventDefault();

            // Activate box and bring to front
            selectBox(letterBox);

            isDraggingBox = true;
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            boxStartLeft = parseFloat(letterBox.style.left) || 0;
            boxStartTop = parseFloat(letterBox.style.top) || 0;

            letterBox.setPointerCapture(e.pointerId);
            dragZone.style.cursor = 'grabbing';
        });

        letterBox.addEventListener('pointermove', (e) => {
            if (!isDraggingBox) return;

            const dx = e.clientX - dragStartX;
            const dy = e.clientY - dragStartY;

            letterBox.style.left = `${boxStartLeft + dx}px`;
            letterBox.style.top = `${boxStartTop + dy}px`;
        });

        letterBox.addEventListener('pointerup', (e) => {
            if (isDraggingBox) {
                isDraggingBox = false;
                dragZone.style.cursor = 'grab';
                if (letterBox.hasPointerCapture(e.pointerId)) {
                    letterBox.releasePointerCapture(e.pointerId);
                }
            }
        });

        letterBox.addEventListener('pointercancel', (e) => {
            if (isDraggingBox) {
                isDraggingBox = false;
                letterBox.style.cursor = '';
            }
        });
    }

    function applyGlyphTransform(letterBox) {
        const glyph = letterBox.querySelector('.letter-glyph');
        if (!glyph) return;

        const z = parseFloat(letterBox.dataset.zoom || "1");
        const x = parseFloat(letterBox.dataset.offsetX || "0");
        const y = parseFloat(letterBox.dataset.offsetY || "0");

        // Use scale() transform so only the glyph scales, not the box
        glyph.style.transform = `translate(${x}px, ${y}px) scale(${z})`;
        
        // Compensate stroke-width for zoom (only affects visual rendering, CSS still controls style)
        const compensatedStroke = 2 / z;
        glyph.style.setProperty('--compensated-stroke', `${compensatedStroke}px`);
    }

    // Z-index management (variable declared at top of brush section)
    function bringToFront(letterBox) {
        highestZIndex++;
        letterBox.style.zIndex = highestZIndex;
    }

    // Multi-selection system
    let selectedLetterBoxes = [];

    function activateLetterBox(letterBox, isShiftClick = false) {
        if (isShiftClick) {
            // Multi-selection mode with Shift
            if (letterBox.classList.contains('is-active')) {
                // Deselect if already selected
                letterBox.classList.remove('is-active');
                const index = selectedLetterBoxes.indexOf(letterBox);
                if (index > -1) {
                    selectedLetterBoxes.splice(index, 1);
                }
            } else {
                // Add to selection
                letterBox.classList.add('is-active');
                selectedLetterBoxes.push(letterBox);
                bringToFront(letterBox);
            }
        } else {
            // Single selection mode (no Shift)
            // Deactivate all previous selections
            selectedLetterBoxes.forEach(lb => {
                lb.classList.remove('is-active');
            });
            selectedLetterBoxes = [];

            // Activate clicked box
            letterBox.classList.add('is-active');
            selectedLetterBoxes.push(letterBox);
            bringToFront(letterBox);
        }
    }

    function deactivateAll() {
        selectedLetterBoxes.forEach(lb => {
            lb.classList.remove('is-active');
        });
        selectedLetterBoxes = [];
    }

    // Simple selectBox function for drag-zone
    function selectBox(letterBox) {
        activateLetterBox(letterBox, false);
    }

    // Click on letter-box to activate
    document.addEventListener("click", (e) => {
        const clickedBox = e.target.closest(".letter-box");
        
        if (clickedBox) {
            activateLetterBox(clickedBox, e.shiftKey);
        } else {
            // Click outside - deactivate all
            const isUI = e.target.closest(".zoom-ui");
            if (!isUI) {
                deactivateAll();
            }
        }
    });

    // Sync text editing across all selected boxes
    document.addEventListener("input", (e) => {
        if (e.target.classList.contains('letter-glyph')) {
            const currentBox = e.target.closest('.letter-box');
            if (currentBox && selectedLetterBoxes.includes(currentBox) && selectedLetterBoxes.length > 1) {
                const newText = e.target.textContent;
                // Update all other selected boxes
                selectedLetterBoxes.forEach(box => {
                    if (box !== currentBox) {
                        const glyph = box.querySelector('.letter-glyph');
                        if (glyph) {
                            glyph.textContent = newText;
                        }
                    }
                });
            }
        }
    });

    document.addEventListener("pointerdown", (e) => {
        const box = e.target.closest(".letter-box");
        const glyph = e.target.closest(".letter-glyph");
        const ui = e.target.closest(".zoom-ui");

        if (box || glyph || ui) return;

        document.querySelectorAll(".letter-box").forEach(lb => {
            lb.dataset.editMode = "false";
        });
    });

    // Add/Delete button functionality
    const addButton = document.getElementById('add-button');
    const deleteButton = document.getElementById('delete-button');

    if (addButton) {
        addButton.addEventListener('click', () => {
            // Commit current stroke if drawing
            if (drawing && path.length > 1) {
                commitStroke(path.slice());
            }
            // Reset drawing state
            drawing = false;
            lastX = null;
            lastY = null;
            // Enable brush
            brushEnabled = true;
            // Clear the live path so a new brush stroke can start fresh
            path.length = 0;
            // Keep pool hidden until first pointerdown on canvas
            for (let el of pool) {
                el.style.visibility = 'hidden';
                el.dataset.hidden = 'true';
            }
            console.log('Brush enabled - ready to draw');
        });
    }

    if (deleteButton) {
        deleteButton.addEventListener('click', () => {
            // Delete all selected letter-boxes
            if (selectedLetterBoxes.length > 0) {
                selectedLetterBoxes.forEach(letterBox => {
                    // Remove from strokeHistory if it exists
                    for (let i = strokeHistory.length - 1; i >= 0; i--) {
                        const group = strokeHistory[i];
                        const index = group.indexOf(letterBox);
                        if (index > -1) {
                            group.splice(index, 1);
                            if (group.length === 0) {
                                strokeHistory.splice(i, 1);
                            }
                            break;
                        }
                    }
                    // Remove all child elements first (including info display)
                    while (letterBox.firstChild) {
                        letterBox.removeChild(letterBox.firstChild);
                    }
                    // Remove from DOM
                    if (letterBox.parentNode) {
                        letterBox.parentNode.removeChild(letterBox);
                    }
                });
                selectedLetterBoxes = [];
                console.log('Selected letter-boxes deleted');
            } else {
                console.log('No selected letter-boxes to delete');
            }
        });
    }
});
