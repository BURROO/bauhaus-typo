// ===== Shape Drawing Functions =====
let ctx; // Set by app.js

// SVG cache: loaded SVG data for shapes 6-15 (Asset 1-10)
let svgShapes = {};

// Embedded SVG data (no need to fetch from files)
const embeddedSVGs = [
    `<svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 184.96 184.96"><g id="Layer_1-2" data-name="Layer 1"><rect width="184.96" height="184.96"/></g></svg>`,
    `<svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 184.96 184.96"><g id="Layer_1-2" data-name="Layer 1"><path d="M92.48,0h0c51.08,0,92.48,41.4,92.48,92.48h0c0,51.08-41.4,92.48-92.48,92.48h0C41.4,184.96,0,143.56,0,92.48h0C0,41.4,41.4,0,92.48,0Z"/></g></svg>`,
    `<svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 201.7 201.7"><g id="Layer_1-2" data-name="Layer 1"><path d="M201.7,100.85h0c-54.95,1.76-99.09,45.9-100.85,100.85h0c-1.76-54.95-45.9-99.09-100.85-100.85h0C54.95,99.09,99.09,54.95,100.85,0h0c1.76,54.95,45.9,99.09,100.85,100.85Z"/></g></svg>`,
    `<svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 184.96 184.96"><g id="Layer_1-2" data-name="Layer 1"><g><path d="M0,92.48v92.48h92.48C41.42,184.96,0,143.56,0,92.48Z"/><path d="M92.48,0H0v92.48C0,41.41,41.4,0,92.48,0Z"/><path d="M92.48,184.96h92.48v-92.48c0,51.07-41.4,92.48-92.48,92.48Z"/><path d="M92.48,0c51.07,0,92.48,41.4,92.48,92.48V0h-92.48Z"/></g></g></svg>`,
    `<svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 184.96 184.96"><g id="Layer_1-2" data-name="Layer 1"><g><rect y="69.36" width="69.36" height="46.24"/><rect x="115.6" y="69.36" width="69.36" height="46.24"/><rect x="69.36" y="115.6" width="46.24" height="69.36"/><rect x="69.36" width="46.24" height="69.36"/></g></g></svg>`,
    `<svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 184.96 184.96"><g id="Layer_1-2" data-name="Layer 1"><polygon points="92.48 0 98 57.59 121.06 4.53 108.52 61.01 146.84 17.67 117.46 67.5 167.29 38.12 123.95 76.45 180.43 63.9 127.37 86.96 184.96 92.48 127.37 98.01 180.43 121.06 123.95 108.52 167.29 146.84 117.46 117.46 146.84 167.3 108.52 123.96 121.06 180.43 98 127.37 92.48 184.96 86.95 127.37 63.9 180.43 76.44 123.96 38.12 167.3 67.5 117.46 17.66 146.84 61.01 108.52 4.53 121.06 57.59 98.01 0 92.48 57.59 86.96 4.53 63.9 61.01 76.45 17.66 38.12 67.5 67.5 38.12 17.67 76.44 61.01 63.9 4.53 86.95 57.59 92.48 0"/></g></svg>`,
    `<svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 184.95 184.96"><g id="Layer_1-2" data-name="Layer 1"><g><rect width="36.99" height="36.99"/><rect y="73.99" width="36.99" height="36.99"/><rect y="147.97" width="36.99" height="36.99"/><rect x="73.98" y="73.99" width="36.99" height="36.99"/><rect x="73.98" y="147.97" width="36.99" height="36.99"/><rect x="73.98" width="36.99" height="36.99"/><rect x="147.96" y="73.99" width="36.99" height="36.99"/><rect x="147.96" y="147.97" width="36.99" height="36.99"/><rect x="147.96" width="36.99" height="36.99"/><rect x="36.99" y="36.99" width="36.99" height="36.99"/><rect x="110.97" y="36.99" width="36.99" height="36.99"/><rect x="36.99" y="110.98" width="36.99" height="36.99"/><rect x="110.97" y="110.98" width="36.99" height="36.99"/></g></g></svg>`,
    `<svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 177.96 184.96"><g id="Layer_1-2" data-name="Layer 1"><path d="M148.16,92.48c50.73,0,29.74-64.61-11.3-34.79,41.04-29.82-13.92-69.75-29.59-21.5,15.68-48.25-52.26-48.25-36.58,0C55.01-12.06.05,27.87,41.1,57.69.06,27.87-20.94,92.48,29.8,92.48c-50.73,0-29.74,64.61,11.3,34.79-41.04,29.82,13.92,69.75,29.59,21.5-15.68,48.25,52.26,48.25,36.58,0,15.68,48.25,70.64,8.32,29.59-21.5,41.04,29.82,62.04-34.79,11.3-34.79ZM115.15,92.48c0,14.46-11.72,26.18-26.18,26.18h0c-14.46,0-26.18-11.72-26.18-26.18h0c0-14.46,11.72-26.18,26.18-26.18h0c14.46,0,26.18,11.72,26.18,26.18h0Z"/></g></svg>`,
    `<svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 184.95 184.96"><g id="Layer_1-2" data-name="Layer 1"><polygon points="184.95 184.96 92.47 129.47 0 184.96 92.47 0 184.95 184.96"/></g></svg>`,
    `<svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 83.11 83.11"><g id="Layer_3" data-name="Layer 3"><path d="M83.11,65.63c0,9.66-7.83,17.48-17.48,17.48s-17.49-7.82-17.49-17.48c0-7.17-2.46-13.77-6.59-18.99-4.13,5.22-6.59,11.82-6.59,18.99,0,9.66-7.82,17.48-17.48,17.48S0,75.29,0,65.63s7.83-17.48,17.48-17.48c7.17,0,13.77-2.46,18.99-6.59-5.22-4.13-11.82-6.59-18.99-6.59C7.83,34.97,0,27.14,0,17.49S7.83,0,17.48,0s17.48,7.83,17.48,17.49c0,7.17,2.46,13.77,6.59,18.99,4.13-5.22,6.59-11.82,6.59-18.99,0-9.66,7.83-17.49,17.49-17.49s17.48,7.83,17.48,17.49-7.83,17.48-17.48,17.48c-7.17,0-13.77,2.46-19,6.59,5.23,4.13,11.83,6.59,19,6.59,9.65,0,17.48,7.83,17.48,17.48Z"/></g></svg>`
];

// Load SVG shapes from embedded data
function loadSVGShapes() {
    const parser = new DOMParser();
    for (let i = 0; i < embeddedSVGs.length; i++) {
        try {
            const svgDoc = parser.parseFromString(embeddedSVGs[i], 'image/svg+xml');
            svgShapes[i + 6] = svgDoc.documentElement;
        } catch (e) {
            console.warn(`Failed to parse embedded SVG ${i}:`, e);
        }
    }
}

// Call this on page load
loadSVGShapes();

function drawShape(shapeMode, cx, cy, size, color, vx, vy) {
    // SVG shapes (1-9) and Arrow (0 uses Asset 9 triangle)
    if (shapeMode === 0) {
        // Arrow shape using Asset 9 (triangle) - rotates with bird direction
        drawSVGShape(8, cx, cy, size, color, vx, vy);
    } else if (shapeMode >= 1 && shapeMode <= 8) {
        // SVG shapes 1-8 (Asset 1-8)
        drawSVGShape(shapeMode - 1, cx, cy, size, color, vx, vy);
    } else if (shapeMode === 9) {
        // Use uploaded custom SVG if available, otherwise Asset 10
        if (svgShapes[99]) {
            drawCustomSVGShape(cx, cy, size, color, vx, vy);
        } else {
            drawSVGShape(9, cx, cy, size, color, vx, vy);
        }
    } else {
        // Fallback to Arrow
        drawArrow(cx, cy, size, color, vx, vy);
    }
}

function drawSVGShape(assetIndex, cx, cy, size, color, vx, vy) {
    // assetIndex: 0-9 (Asset 1-10)
    const svgShapeId = assetIndex + 6; // Maps to 6-15 in svgShapes (Asset 1-10)
    const svgElement = svgShapes[svgShapeId];
    if (!svgElement) {
        // Fallback to Arrow if SVG not loaded
        drawArrow(cx, cy, size, color, vx, vy);
        return;
    }

    ctx.save();
    ctx.translate(cx, cy);
    
    // Asset 8 (index 7) and Asset 9 (index 8 - triangle) rotate with bird direction
    let angle = 0;
    if ((assetIndex === 7 || assetIndex === 8) && (Math.abs(vx) > 0.0001 || Math.abs(vy) > 0.0001)) {
        angle = Math.atan2(vy, vx);
        // Asset 9 triangle points upward by default, needs 90° offset to align with horizontal movement
        if (assetIndex === 8) {
            angle += Math.PI / 2;
        }
        ctx.rotate(angle);
    }

    // Get viewBox dimensions
    const viewBox = svgElement.getAttribute('viewBox');
    let vbWidth = 100, vbHeight = 100;
    if (viewBox) {
        const parts = viewBox.split(/[\s,]+/);
        if (parts.length >= 4) {
            vbWidth = parseFloat(parts[2]);
            vbHeight = parseFloat(parts[3]);
        }
    }

    // Scale to fit the desired size
    const scale = size / Math.max(vbWidth, vbHeight);
    ctx.scale(scale, scale);
    ctx.translate(-vbWidth / 2, -vbHeight / 2);

    // Set fill color
    ctx.fillStyle = color;

    // Draw paths from the SVG
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
            const cx = parseFloat(el.getAttribute('cx') || 0);
            const cy = parseFloat(el.getAttribute('cy') || 0);
            const r = parseFloat(el.getAttribute('r'));
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
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

function drawCustomSVGShape(cx, cy, size, color, vx, vy) {
    const svgElement = svgShapes && svgShapes[99];
    if (!svgElement) {
        drawArrow(cx, cy, size, color, vx, vy);
        return;
    }

    ctx.save();
    ctx.translate(cx, cy);

    // Always point upward - no rotation
    ctx.rotate(0);

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

function drawArrow(cx, cy, size, color, vx, vy) {
    ctx.fillStyle = color;
    ctx.save();
    ctx.translate(cx, cy);

    // Calculate rotation angle based on velocity
    let angle;
    if (Math.abs(vx) < 0.0001 && Math.abs(vy) < 0.0001) {
        angle = -Math.PI / 2;
    } else {
        angle = Math.atan2(vy, vx);
    }
    ctx.rotate(angle);

    let len = size;
    let w = size * 0.4;
    ctx.beginPath();
    ctx.moveTo(-len * 0.4, -w * 0.3);
    ctx.lineTo(0, -w * 0.3);
    ctx.lineTo(0, -w);
    ctx.lineTo(len * 0.6, 0);
    ctx.lineTo(0, w);
    ctx.lineTo(0, w * 0.3);
    ctx.lineTo(-len * 0.4, w * 0.3);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function drawFood(gameState) {
    ctx.fillStyle = 'black';
    const offsetX = gameState.renderOffsetX || 0;
    const offsetY = gameState.renderOffsetY || 0;
    for (let f of gameState.foods) {
        const cx = f.x * gameState.cellSize + gameState.cellSize / 2 + offsetX;
        const cy = f.y * gameState.cellSize + gameState.cellSize / 2 + offsetY;
        ctx.beginPath();
        ctx.arc(cx, cy, gameState.cellSize / 3, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawBirds(gameState, mask = false) {
    for (let b of gameState.birds) {
        b.display(gameState, gameState.cellSize, mask);
    }
}
