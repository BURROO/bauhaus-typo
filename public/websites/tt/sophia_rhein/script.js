let currentStep = 1;
let currentNumber = 0;
let currentView = 'one';
let numbers = {};
let canvas, ctx;
let colorLevel = 0;
let blendLevel = 0;
let stackLevel = 0;
let effect01Level = 0;
let effectInterval = null;
let currentEffectAdjustment = null;
let currentShape = 'stone';
let clickCounts = {};
let currentMonth = 0;
let monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
let currentOutputType = null;
let materialLayerCount = 0;
let materialLayerAmount = 1;
let materialDirection = 0;
let materialOffsetMultiplier = 1.0;
const MATERIAL_TYPES = ['circles', 'grid', 'brick', 'lines'];
const LAYER_ORDER_BASE = ['stones', ...MATERIAL_TYPES];

const NUMBER_PRESETS = {
    0: { 
        direction: 0,
        stones: [
            {col: 1, row: 0}, {col: 2, row: 0},{col: 3, row:0},
            {col: 0, row: 1}, {col: 4, row: 1},
            {col: 0, row: 2}, {col: 4, row: 2},
            {col: 0, row: 3}, {col: 4, row: 3},
            {col: 0, row: 4}, {col: 4, row: 4},
            {col: 0, row: 5}, {col: 4, row: 5},
            {col: 1, row: 6}, {col: 2, row: 6}, {col: 3, row: 6}
        ]
    },
    1: { 
        direction: 36,
        stones: [
            {col: 0, row: 2},
            {col: 1, row: 1}, {col: 2, row: 1},
            {col: 2, row: 0}, {col: 2, row: 2},
            {col: 2, row: 3},
            {col: 2, row: 4},
            {col: 2, row: 5},
            {col: 2, row: 6},
        ]
    },
    2: { 
        direction: 72,
        stones: [
            {col: 2, row: 0}, {col: 3, row: 0},
            {col: 1, row: 1}, {col: 4, row: 1},
            {col: 4, row: 2},
            {col: 3, row: 3},
            {col: 2, row: 4},
            {col: 1, row: 5},
            {col: 1, row: 6}, {col: 2, row: 6}, {col: 3, row: 6}, {col: 4, row: 6},   
        ]
    },
    3: { 
        direction: 108,
        stones: [
            {col: 2, row: 0}, {col: 3, row: 0},
            {col: 1, row: 1}, {col: 4, row: 1}, 
            {col :4, row: 2},
            {col: 2, row: 3}, {col: 3, row: 3},
            {col :4, row: 4},
            {col: 1, row: 5}, {col: 4, row: 5},
            {col: 2, row: 6}, {col: 3, row: 6},
         
        ]
    },
    4: { 
        direction: 144,
        stones: [
            {col: 1, row: 0}, 
            {col: 1, row: 1}, 
            {col: 1, row: 2}, {col: 4, row: 2}, 
            {col: 1, row: 3}, {col: 2, row: 3}, {col: 3, row: 3}, {col: 4, row: 3},
            {col: 4, row: 4},
            {col: 4, row: 5},
            {col: 4, row: 6},
        ]
    },
    5: { 
        direction: 180,
        stones: [
            {col: 1, row: 0}, {col: 2, row: 0}, {col: 3, row: 0}, {col: 4, row: 0},
            {col: 1, row: 1},
            {col: 1, row: 2},
            {col: 1, row: 3}, {col: 2, row: 3}, {col: 3, row: 3},
            {col: 4, row: 4},
            {col: 1, row: 5}, {col: 4, row: 5}, 
            {col: 2, row: 6}, {col: 3, row: 6}
        ]
    },
    6: { 
        direction: 216,
        stones: [
            {col: 1, row: 0}, {col: 2, row: 0},
            {col: 0, row: 1}, {col: 3, row: 1},
            {col: 0, row: 2}, 
            {col: 0, row: 3}, {col: 1, row: 3}, {col: 2, row: 3},
            {col: 0, row: 4}, {col: 3, row: 4},
            {col: 0, row: 5}, {col: 3, row: 5}, 
            {col: 1, row: 6}, {col: 2, row: 6},        ]
    },
    7: { 
        direction: 252,
        stones: [
            {col: 1, row: 0}, {col: 2, row: 0}, {col: 3, row: 0}, {col: 4, row: 0},
            {col: 4, row: 1},
            {col: 4, row: 2},
            {col: 3, row: 3},
            {col: 2, row: 4},
            {col: 1, row: 5},
            {col: 1, row: 6},
        ]
    },
    8: { 
        direction: 288,
        stones: [
            {col: 1, row: 0}, {col: 2, row: 0}, {col: 3, row: 0},
            {col: 0, row: 1}, {col: 4, row: 1},
            {col: 0, row: 2}, {col: 4, row: 2},
            {col: 1, row: 3}, {col: 2, row: 3}, {col: 3, row: 3},
            {col: 0, row: 4}, {col: 4, row: 4},
            {col: 0, row: 5}, {col: 4, row: 5},
            {col: 1, row: 6}, {col: 2, row: 6}, {col: 3, row: 6}
        ]
    },
    9: { 
        direction: 324,
        stones: [
            {col: 2, row: 0}, {col: 3, row: 0}, 
            {col: 1, row: 1}, {col: 4, row: 1},
            {col: 1, row: 2}, {col: 4, row: 2}, 
            {col: 2, row: 3}, {col: 3, row: 3}, {col: 4, row: 3},
            {col: 4, row: 4}, 
            {col: 1, row: 5}, {col: 4, row: 5},
            {col: 2, row: 6}, {col: 3, row: 6}
        ]
    }
};
const MATERIAL_DEFAULT_COLORS = {
    'circles': '#fc0000',
    'grid': '#00ffff',
    'brick': '#ff3e96',
    'lines': '#bec2cb'
};

function loadNumbersFromStorage() {
    try {
        const savedNumbers = localStorage.getItem('numberDesigns');
        if (savedNumbers) {
            const parsed = JSON.parse(savedNumbers);
            
            for (let i = 0; i <= 9; i++) {
                if (parsed[i]) {
                    const baseOffset = 20;
                    const materialTypes = ['circles', 'grid', 'brick', 'lines'];
                    
                    const materials = (parsed[i].materials || []).map(material => {
                        if (!material.color) {
                            material.color = MATERIAL_DEFAULT_COLORS[material.type] || '#000000';
                        }
                        if (material.baseOffset === undefined || material.baseOffset <= 0) {
                            const materialTypeIndex = materialTypes.indexOf(material.type);
                            const layerIndex = materialTypeIndex >= 0 ? materialTypeIndex : (material.layerIndex !== undefined ? material.layerIndex : 0);
                            material.baseOffset = baseOffset * (layerIndex + 1);
                            material.layerIndex = layerIndex;
                        }
                        return material;
                    });
                    
                    numbers[i] = {
                        stones: parsed[i].stones || [],
                        clickData: parsed[i].clickData || {},
                        materials: materials,
                        drillClickCount: parsed[i].drillClickCount || 0,
                        materialLayerCount: parsed[i].materialLayerCount || 0,
                        materialDirection: parsed[i].materialDirection || 0,
                        materialOffsetMultiplier: parsed[i].materialOffsetMultiplier !== undefined ? parsed[i].materialOffsetMultiplier : 1.0,
                        layerOrderOffset: parsed[i].layerOrderOffset || 0
                    };
                } else {
                    numbers[i] = { 
                        stones: [], 
                        clickData: {}, 
                        materials: [], 
                        drillClickCount: 0,
                        materialLayerCount: 0,
                        materialDirection: 0,
                        materialOffsetMultiplier: 1.0,
                        layerOrderOffset: 0
                    };
                }
            }
        } else {
            for (let i = 0; i <= 9; i++) {
                numbers[i] = { 
                    stones: [], 
                    clickData: {}, 
                    materials: [], 
                    drillClickCount: 0,
                    materialLayerCount: 0,
                    materialDirection: 0,
                    materialOffsetMultiplier: 1.0,
                    layerOrderOffset: 0
                };
            }
        }
    } catch (e) {
        console.error('Error loading numbers from storage:', e);
        for (let i = 0; i <= 9; i++) {
            numbers[i] = { 
                stones: [], 
                clickData: {}, 
                materials: [], 
                drillClickCount: 0,
                materialLayerCount: 0,
                materialDirection: 0,
                materialOffsetMultiplier: 1.0,
                layerOrderOffset: 0
            };
        }
    }
}

function saveNumbersToStorage() {
    try {
        localStorage.setItem('numberDesigns', JSON.stringify(numbers));
    } catch (e) {
        console.error('Error saving numbers to storage:', e);
    }
}

function initializeNumbers() {
    for (let i = 0; i <= 9; i++) {
        if (!numbers[i]) {
            numbers[i] = { 
                stones: [], 
                clickData: {}, 
                materials: [], 
                drillClickCount: 0,
                materialLayerCount: 0,
                materialDirection: 0,
                materialOffsetMultiplier: 1.0,
                layerOrderOffset: 0
            };
        }
    }
}

let currentMaterialIndex = 0;
const materialSequence = ['stones', 'circles', 'grid', 'brick', 'lines'];

function init() {
    loadNumbersFromStorage();
    initializeNumbers();
    initStep1MaterialGrid();
    initCursor();
    initInfoBox();
}

function initInfoBox() {
    const usePresetButton = document.getElementById('usePresetButton');
    if (usePresetButton) {
        usePresetButton.addEventListener('click', () => {
            loadPreset();
            const infoBox = document.getElementById('infoBox');
            if (infoBox) {
                infoBox.style.display = 'none';
            }
        });
    }
    
    const tryYourselfButton = document.getElementById('tryYourselfButton');
    if (tryYourselfButton) {
        tryYourselfButton.addEventListener('click', () => {
            const infoBox = document.getElementById('infoBox');
            if (infoBox) {
                infoBox.style.display = 'none';
            }
        });
    }
}

function loadPreset() {
    if (!canvas || !ctx) {
        initCanvas();
    }
    
    if (gridCellSize === 0) {
        gridCellSize = Math.min(700 / 5, 980 / 7);
    }
    
    const baseOffset = 20;
    const materialColors = {
        'circles': '#fc0000',
        'grid': '#00ffff',
        'brick': '#ff3e96',
        'lines': '#bec2cb'
    };
    
    const canvasWidth = 700;
    const canvasHeight = 980;
    
    for (let num = 0; num <= 9; num++) {
        const preset = NUMBER_PRESETS[num];
        const direction = preset.direction;
        
        // Clear existing data for this number
        numbers[num] = {
            stones: [],
            clickData: {},
            materials: [],
            drillClickCount: 0,
            materialLayerCount: 5, // 5 layers total
            materialLayerAmount: 5,
            materialDirection: direction,
            layerOrderOffset: 0
        };
        
        // Create stones based on preset pattern
        // If preset has stones array, use it; otherwise use default 3x3 grid
        const stoneSize = gridCellSize * 0.95;
        let stonePositions = [];
        
        if (preset.stones && preset.stones.length > 0) {
            // Use custom pattern from preset
            stonePositions = preset.stones;
        } else {
            // Default: 3x3 grid in center (fallback)
            const centerCol = 2; // Middle column (0-4)
            const centerRow = 3; // Middle row (0-6)
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    stonePositions.push({
                        col: centerCol + (col - 1),
                        row: centerRow + (row - 1)
                    });
                }
            }
        }
        
        stonePositions.forEach(pos => {
            const clampedCol = Math.max(0, Math.min(4, pos.col));
            const clampedRow = Math.max(0, Math.min(6, pos.row));
            
            const x = clampedCol * gridCellSize + gridCellSize / 2;
            const y = clampedRow * gridCellSize + gridCellSize / 2;
            
            const shapePoints = generateStoneShape(stoneSize);
            const stone = {
                x: x,
                y: y,
                size: stoneSize,
                shape: shapePoints,
                shapeType: 'stone',
                color: getStoneColor(),
                rotation: Math.random() * 360
            };
            
            numbers[num].stones.push(stone);
        });
        
        // Add 4 material layers (circles, grid, brick, lines)
        const materialTypes = ['circles', 'grid', 'brick', 'lines'];
        
        materialTypes.forEach((materialType, layerIndex) => {
            const totalOffset = baseOffset * (layerIndex + 1);
            const directionRad = (direction * Math.PI) / 180;
            const offsetX = Math.cos(directionRad) * totalOffset;
            const offsetY = Math.sin(directionRad) * totalOffset;
            
            // Add material for each stone
            numbers[num].stones.forEach((stone, stoneIndex) => {
                const material = {
                    type: materialType,
                    x: stone.x + offsetX,
                    y: stone.y + offsetY,
                    size: gridCellSize * 1.0,
                    rotation: 0,
                    color: materialColors[materialType] || '#000000',
                    alpha: 1,
                    stoneIndex: stoneIndex,
                    layerIndex: layerIndex,
                    baseOffset: totalOffset
                };
                
                numbers[num].materials.push(material);
            });
        });
    }
    
    saveNumbersToStorage();
    
    // Refresh display if we're on step 2
    if (currentStep === 2) {
        renderCanvas();
        if (currentView === 'all') {
            renderAllView();
        }
    }
}

function generateStoneShape(size, forMaterial = false) {
    const points = [];
    
    if (forMaterial) {
        // For materials: more regular shape with minimal variation
        const baseSize = size * 0.8;
        const numPoints = 16; // Fixed number of points for consistency
        const baseRadius = baseSize / 2;
    
    for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2;
            // Very slight variation for outline
            const radiusVariation = 0.95 + Math.random() * 0.05;
        const radius = baseRadius * radiusVariation;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
        points.push({ x, y });
        }
    } else {
        // For stones: original organic shape
        const numPoints = 20 + Math.floor(Math.random() * 10);
    const widthRatio = 0.8 + Math.random() * 0.3; // 0.8 to 1.1
    const heightRatio = 0.8 + Math.random() * 0.3;
    const baseRadiusX = (size / 2) * widthRatio;
    const baseRadiusY = (size / 2) * heightRatio;
    
    for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2;
        const radiusVariation = 0.85 + Math.random() * 0.15; // 0.85 to 1.0
        const radiusX = baseRadiusX * radiusVariation;
        const radiusY = baseRadiusY * radiusVariation;
        const x = Math.cos(angle) * radiusX;
        const y = Math.sin(angle) * radiusY;
        points.push({ x, y });
        }
    }
    
    return points;
}

function drawStone(ctx, points, x, y, color = '#000') {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = color;
    ctx.beginPath();
    
    if (points.length > 0) {
        ctx.moveTo(points[0].x, points[0].y);
        
        for (let i = 0; i < points.length; i++) {
            const current = points[i];
            const next = points[(i + 1) % points.length];
            const ctrlX = (current.x + next.x) / 2;
            const ctrlY = (current.y + next.y) / 2;
            ctx.quadraticCurveTo(current.x, current.y, ctrlX, ctrlY);
        }
        
        ctx.closePath();
        ctx.fill();
    }
    
    ctx.restore();
}

function generateSVGPath(points) {
    if (points.length === 0) return '';
    
    let path = `M ${points[0].x} ${points[0].y} `;
    
    for (let i = 0; i < points.length; i++) {
        const current = points[i];
        const next = points[(i + 1) % points.length];
        const ctrlX = (current.x + next.x) / 2;
        const ctrlY = (current.y + next.y) / 2;
        path += `Q ${current.x} ${current.y} ${ctrlX} ${ctrlY} `;
    }
    
    path += 'Z';
    return path;
}

function drawMaterial(ctx, material, x, y) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((material.rotation * Math.PI) / 180);
    ctx.globalAlpha = ctx.globalAlpha * (material.alpha !== undefined ? material.alpha : 1);
    
    // Use material.color if available, otherwise use default colors
    const materialColor = material.color || (() => {
        const defaults = {
            'circles': '#fc0000',
            'grid': '#00ffff',
            'brick': '#ff3e96',
            'lines': '#bec2cb'
        };
        return defaults[material.type] || '#000000';
    })();
    
    switch(material.type) {
        case 'circles':
            // Small circles pattern (2x4 grid)
            drawCirclesPatternCanvas(ctx, material.size, materialColor);
            break;
        case 'grid':
            // Grid pattern (8x8)
            drawGridPatternCanvas(ctx, material.size, materialColor);
            break;
        case 'brick': {
            const brickShape = generateBrickShape(material.size);
            const width = Math.abs(brickShape[1].x - brickShape[0].x);
            const height = Math.abs(brickShape[2].y - brickShape[1].y);
            
            // Create cache key based on size and color
            const cacheKey = `brick_${material.size.toFixed(2)}_${materialColor}`;
            
            // Get or create cached brick canvas
            if (!window.brickCache) {
                window.brickCache = new Map();
            }
            let brickCanvas = window.brickCache.get(cacheKey);
            
            if (!brickCanvas) {
                const tempWidth = Math.ceil(width) + 2;
                const tempHeight = Math.ceil(height) + 2;
                brickCanvas = document.createElement('canvas');
                brickCanvas.width = tempWidth;
                brickCanvas.height = tempHeight;
                const tempCtx = brickCanvas.getContext('2d');
                
                // Draw brick background
                tempCtx.fillStyle = materialColor;
                tempCtx.fillRect(0, 0, tempWidth, tempHeight);
                
                // Cut out four holes with destination-out for true transparency
                const circleRadius = Math.min(width, height) * 0.18;
                const spacingX = width * 0.5;
                const spacingY = height * 0.5;
                
                tempCtx.globalCompositeOperation = 'destination-out';
                for (let row = 0; row < 2; row++) {
                    for (let col = 0; col < 2; col++) {
                        const circleX = tempWidth / 2 + (col - 0.5) * spacingX;
                        const circleY = tempHeight / 2 + (row - 0.5) * spacingY;
                        tempCtx.beginPath();
                        tempCtx.arc(circleX, circleY, circleRadius, 0, Math.PI * 2);
                        tempCtx.fill();
                    }
                }
                
                window.brickCache.set(cacheKey, brickCanvas);
            }
            
            ctx.drawImage(brickCanvas, brickShape[0].x - 1, brickShape[0].y - 1);
            break;
        }
        case 'lines':
            // Vertical lines pattern
            drawLinesPatternCanvas(ctx, material.size, materialColor);
            break;
    }
    
    ctx.restore();
}

function generateBrickShape(size) {
    // Perfect rectangle with no variation
    const width = size;
    const height = size;
    
    // Create perfect rectangle with 4 corners (no variation)
    const corners = [
        { x: -width/2, y: -height/2 },
        { x: width/2, y: -height/2 },
        { x: width/2, y: height/2 },
        { x: -width/2, y: height/2 }
    ];
    
    return corners;
}

function generateGridShape(size) {
    // Perfect grid with no variation
    const gridSize = size;
    const numCells = 3; // Fixed number of cells for consistency
    const cellSize = gridSize / numCells;
    
    // Create a perfect square grid outline (no variation)
    const corners = [
        { x: -gridSize/2, y: -gridSize/2 },
        { x: gridSize/2, y: -gridSize/2 },
        { x: gridSize/2, y: gridSize/2 },
        { x: -gridSize/2, y: gridSize/2 }
    ];
    
    return { corners, cellSize, numCells };
}

function drawCirclesPattern(group, size, color) {
    const scale = size / 700;
    
    const positions = [
        // Column 1
        { x: 103.24, y: 25.654 },
        { x: 103.24, y: 285.131 },
        { x: 103.24, y: 544.607 },
        // Column 2
        { x: 220.775, y: 136.861 },
        { x: 220.775, y: 411.675 },
        // Column 3
        { x: 344.168, y: 25.654 },
        { x: 344.168, y: 285.131 },
        { x: 344.168, y: 544.607 },
        // Column 4
        { x: 461.704, y: 136.861 },
        { x: 461.704, y: 411.675 },
        // Column 5
        { x: 596.761, y: 25.654 },
        { x: 596.761, y: 285.131 },
        { x: 596.761, y: 544.607 }
    ];
    
    // Outer radius: 64.869, Inner radius: 32.435 (from SVG)
    const outerRadius = 64.869 * scale;
    const innerRadius = 32.435 * scale;
    
    positions.forEach(pos => {
        const x = (pos.x - 350) * scale;
        const y = (pos.y - 350) * scale + size * 0.12;
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        
        let pathData = `M ${x + outerRadius} ${y} `;
        for (let i = 0; i <= 32; i++) {
            const angle = (i / 32) * Math.PI * 2;
            const px = x + Math.cos(angle) * outerRadius;
            const py = y + Math.sin(angle) * outerRadius;
            pathData += `L ${px} ${py} `;
        }
        pathData += 'Z ';
        
        pathData += `M ${x + innerRadius} ${y} `;
        for (let i = 0; i <= 32; i++) {
            const angle = (i / 32) * Math.PI * 2;
            const px = x + Math.cos(angle) * innerRadius;
            const py = y + Math.sin(angle) * innerRadius;
            pathData += `L ${px} ${py} `;
        }
        pathData += 'Z';
        
        path.setAttribute('d', pathData);
        path.setAttribute('fill', color);
        path.setAttribute('fill-rule', 'evenodd');
        group.appendChild(path);
    });
}

function drawGridPattern(group, size, color) {
    const numCells = 8;
    const cellSize = size / numCells;
    const lineWidth = size * 0.013; // ~9px for 700px
    
    const gridGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gridGroup.setAttribute('stroke', color);
    gridGroup.setAttribute('stroke-width', lineWidth);
    gridGroup.setAttribute('fill', 'none');
    
    const halfSize = size / 2;
    
    // Draw vertical lines
    for (let i = 1; i < numCells; i++) {
        const x = -halfSize + i * cellSize;
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x);
        line.setAttribute('y1', -halfSize);
        line.setAttribute('x2', x);
        line.setAttribute('y2', halfSize);
        gridGroup.appendChild(line);
    }
    
    // Draw horizontal lines
    for (let i = 1; i < numCells; i++) {
        const y = -halfSize + i * cellSize;
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', -halfSize);
        line.setAttribute('y1', y);
        line.setAttribute('x2', halfSize);
        line.setAttribute('y2', y);
        gridGroup.appendChild(line);
    }
    
    group.appendChild(gridGroup);
}

function drawLinesPattern(group, size, color) {
    const numLines = 9;
    const lineWidth = size * 0.043; // ~30px for 700px
    const spacing = size / (numLines + 1);
    
    const linesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    linesGroup.setAttribute('stroke', 'none');
    linesGroup.setAttribute('fill', color);
    
    const halfSize = size / 2;
    
    for (let i = 1; i <= numLines; i++) {
        const x = -halfSize + i * spacing - lineWidth / 2;
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x);
        rect.setAttribute('y', -halfSize);
        rect.setAttribute('width', lineWidth);
        rect.setAttribute('height', size);
        linesGroup.appendChild(rect);
    }
    
    group.appendChild(linesGroup);
}

const circleRingCache = new Map();

function drawCirclesPatternCanvas(ctx, size, color) {
    const scale = size / 700;
    
    const positions = [
        // Column 1
        { x: 103.24, y: 25.654 },
        { x: 103.24, y: 285.131 },
        { x: 103.24, y: 544.607 },
        // Column 2
        { x: 220.775, y: 136.861 },
        { x: 220.775, y: 411.675 },
        // Column 3
        { x: 344.168, y: 25.654 },
        { x: 344.168, y: 285.131 },
        { x: 344.168, y: 544.607 },
        // Column 4
        { x: 461.704, y: 136.861 },
        { x: 461.704, y: 411.675 },
        // Column 5
        { x: 596.761, y: 25.654 },
        { x: 596.761, y: 285.131 },
        { x: 596.761, y: 544.607 }
    ];
    
    const outerRadius = 64.869 * scale;
    const innerRadius = 32.435 * scale;
    
    const cacheKey = `${size.toFixed(2)}_${color}`;
    
    let ringCanvas = circleRingCache.get(cacheKey);
    if (!ringCanvas) {
        const tempSize = Math.ceil(outerRadius * 2) + 2;
        ringCanvas = document.createElement('canvas');
        ringCanvas.width = tempSize;
        ringCanvas.height = tempSize;
        const tempCtx = ringCanvas.getContext('2d');
        
        tempCtx.fillStyle = color;
        tempCtx.beginPath();
        tempCtx.arc(tempSize / 2, tempSize / 2, outerRadius, 0, Math.PI * 2);
        tempCtx.fill();
        
        tempCtx.globalCompositeOperation = 'destination-out';
        tempCtx.beginPath();
        tempCtx.arc(tempSize / 2, tempSize / 2, innerRadius, 0, Math.PI * 2);
        tempCtx.fill();
        
        circleRingCache.set(cacheKey, ringCanvas);
    }
    
    const tempSize = ringCanvas.width;
    
    positions.forEach(pos => {
        const x = (pos.x - 350) * scale;
        const y = (pos.y - 350) * scale + size * 0.12;
        
        ctx.drawImage(ringCanvas, x - tempSize / 2, y - tempSize / 2);
    });
}

function drawGridPatternCanvas(ctx, size, color) {
    const numCells = 8;
    const cellSize = size / numCells;
    const lineWidth = size * 0.013; // ~9px for 700px
    
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    const halfSize = size / 2;
    
    for (let i = 1; i < numCells; i++) {
        const x = -halfSize + i * cellSize;
        ctx.beginPath();
        ctx.moveTo(x, -halfSize);
        ctx.lineTo(x, halfSize);
        ctx.stroke();
    }
    
    for (let i = 1; i < numCells; i++) {
        const y = -halfSize + i * cellSize;
        ctx.beginPath();
        ctx.moveTo(-halfSize, y);
        ctx.lineTo(halfSize, y);
        ctx.stroke();
    }
}

function drawLinesPatternCanvas(ctx, size, color) {
    const numLines = 9;
    const lineWidth = size * 0.043; // ~30px for 700px
    const spacing = size / (numLines + 1);
    
    ctx.fillStyle = color;
    const halfSize = size / 2;
    
    for (let i = 1; i <= numLines; i++) {
        let x = -halfSize + i * spacing - lineWidth / 2;
        x = Math.max(-halfSize, Math.min(halfSize - lineWidth, x));
        ctx.fillRect(x, -halfSize, lineWidth, size);
    }
}

function createFallingStones() {
    const container = document.getElementById('fallingStones');
    if (!container) {
        console.error('fallingStones container not found');
        return;
    }
    
    const numStones = 15;
    
    for (let i = 0; i < numStones; i++) {
        const size = 100 + Math.random() * 150; // Larger, more like pebbles
        // Make canvas larger to prevent clipping of rounded stones
        const padding = 20;
        const canvasSize = size + padding * 2;
        const stoneCanvas = document.createElement('canvas');
        stoneCanvas.width = canvasSize;
        stoneCanvas.height = canvasSize;
        stoneCanvas.className = 'falling-stone';
        
        const stoneCtx = stoneCanvas.getContext('2d');
        const stoneShape = generateStoneShape(size);
        // Draw stone centered in the larger canvas with stone color
        drawStone(stoneCtx, stoneShape, canvasSize / 2, canvasSize / 2, '#0000ee');
        
        const xPos = Math.random() * (window.innerWidth - size);
        stoneCanvas.style.left = xPos + 'px';
        stoneCanvas.style.top = '-300px';
        stoneCanvas.style.cursor = 'pointer';
        stoneCanvas.style.pointerEvents = 'auto';
        stoneCanvas.style.zIndex = '10';
        
        // Add click handler
        stoneCanvas.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Stone clicked, going to step 2');
            goToStep(2);
        });
        
        // Also add mousedown as backup
        stoneCanvas.addEventListener('mousedown', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Stone mousedown, going to step 2');
            goToStep(2);
        });
        
        container.appendChild(stoneCanvas);
        
        animateStoneFall(stoneCanvas, Math.random() * 500, size);
    }
}

function animateStoneFall(element, delay, size) {
    setTimeout(() => {
        const duration = 1500 + Math.random() * 800;
        const startTime = Date.now();
        const startX = parseFloat(element.style.left);
        const drift = (Math.random() - 0.5) * 150;
        const targetX = Math.max(0, Math.min(window.innerWidth - size, startX + drift));
        const targetY = window.innerHeight - size - (Math.random() * 200);
        const rotation = (Math.random() - 0.5) * 40;
        
        function animate() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            const currentY = (easeProgress * (targetY + 300) - 300);
            const currentX = startX + (targetX - startX) * easeProgress;
            const currentRotation = rotation * easeProgress;
            
            element.style.top = currentY + 'px';
            element.style.left = currentX + 'px';
            element.style.transform = `rotate(${currentRotation}deg)`;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }
        
        animate();
    }, delay);
}

// Navigation
function goToStep(step) {
    console.log('goToStep called with step:', step);
    const previousStep = currentStep;
    
    if (currentStep === 2) {
        saveNumbersToStorage();
    }
    
    // Reset material index when leaving step 1
    if (currentStep === 1 && step !== 1) {
        currentMaterialIndex = 0;
    }
    
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    const targetStep = document.getElementById(`step${step}`);
    if (!targetStep) {
        console.error('Step', step, 'not found');
        return;
    }
    targetStep.classList.add('active');
    currentStep = step;
    
    // Reset cursor text when changing steps
    if (window.resetCursorText) {
        window.resetCursorText();
    }
    
    // Stop drill animation when leaving step 1
    if (step !== 1 && window.stopDrillTextAnimation) {
        window.stopDrillTextAnimation();
    }
    
    // Reinitialize material grid if entering step 1
    if (step === 1) {
        step1ClickCount = 0;
        step1MaterialDirection = 0;
        step1TargetDirection = 0;
        if (step1AnimationFrame) {
            cancelAnimationFrame(step1AnimationFrame);
            step1AnimationFrame = null;
        }
        initStep1MaterialGrid();
        
    }
    if (step === 1) {
        currentMaterialIndex = 0;
        initStep1MaterialGrid();
    }
    console.log('Current step set to:', currentStep);
    
    // Show/hide slider handle based on step
    const handle = document.getElementById('sliderHandle');
    if (handle) {
        if (step === 2) {
            // Show handle in step 2
            handle.style.display = 'block';
            handle.style.visibility = 'visible';
        } else {
            // Hide handle in other steps
            handle.style.display = 'none';
            handle.style.visibility = 'hidden';
        }
    }
    
    if (step === 2) {
        initCanvas();
        document.getElementById('oneView').classList.add('active');
        initMaterialControls();
        updateCurrentNumberLabel();
        currentShape = 'stone'; // Reset to stone
        updateArrowVisibility();
        renderCanvas();
        
        // Show info box (always when coming from step 1 or on initial load)
        // Only skip if coming from step 3 (going back)
        if (previousStep === 1 || previousStep === undefined || previousStep === null) {
            const infoBox = document.getElementById('infoBox');
            
            if (infoBox) {
                // Show info box immediately without animation
                infoBox.style.display = 'block';
            }
        }
    } else if (step === 3) {
        // Show selection buttons
        const outputSelection = document.getElementById('outputSelection');
        if (outputSelection) {
            outputSelection.style.display = 'grid';
        }
        
        // Show back button to Step 2
        const selectionBackButton = document.getElementById('selectionBackButton');
        if (selectionBackButton) {
            selectionBackButton.style.display = 'block';
        }
        
        // Show top and bottom bars
        const topBar = document.querySelector('#step3 .top-bar');
        const bottomBar = document.querySelector('#step3 .bottom-bar');
        if (topBar) topBar.style.display = 'block';
        if (bottomBar) bottomBar.style.display = 'block';
        
        if (document.getElementById('clockView')) {
            document.getElementById('clockView').style.display = 'none';
        }
        if (document.getElementById('calendarView')) {
            document.getElementById('calendarView').style.display = 'none';
        }
        
        currentOutputType = null;
    }
}

function selectOutput(type) {
    loadNumbersFromStorage();
    
    // Store the selected output type
    currentOutputType = type;
    
    // Hide the selection buttons
    const outputSelection = document.getElementById('outputSelection');
    if (outputSelection) {
        outputSelection.style.display = 'none';
    }
    
    // Hide the back button to Step 2
    const selectionBackButton = document.getElementById('selectionBackButton');
    if (selectionBackButton) {
        selectionBackButton.style.display = 'none';
    }
    
    // Hide top and bottom bars
    const topBar = document.querySelector('#step3 .top-bar');
    const bottomBar = document.querySelector('#step3 .bottom-bar');
    if (topBar) topBar.style.display = 'none';
    if (bottomBar) bottomBar.style.display = 'none';
    
    if (type === 'calendar') {
        document.getElementById('calendarView').style.display = 'flex';
        document.getElementById('clockView').style.display = 'none';
        selectMonth(currentMonth);
        renderCalendarPages(); // Re-render calendar
        setupStep3HoverTexts(); // Setup hover texts for calendar view
    } else if (type === 'clock') {
        document.getElementById('clockView').style.display = 'flex';
        document.getElementById('calendarView').style.display = 'none';
        // Clear calendar pages grid when switching to clock
        const calendarPagesGrid = document.getElementById('calendarPagesGrid');
        if (calendarPagesGrid) {
            calendarPagesGrid.innerHTML = '';
        }
        initClock();
    }
}

function goBackToSelection() {
    // Hide Clock and Calendar views
    if (document.getElementById('clockView')) {
        document.getElementById('clockView').style.display = 'none';
    }
    if (document.getElementById('calendarView')) {
        document.getElementById('calendarView').style.display = 'none';
    }
    
    // Show selection buttons
    const outputSelection = document.getElementById('outputSelection');
    if (outputSelection) {
        outputSelection.style.display = 'grid';
    }
    
    // Show back button to Step 2
    const selectionBackButton = document.getElementById('selectionBackButton');
    if (selectionBackButton) {
        selectionBackButton.style.display = 'block';
    }
    
    // Show top and bottom bars
    const topBar = document.querySelector('#step3 .top-bar');
    const bottomBar = document.querySelector('#step3 .bottom-bar');
    if (topBar) topBar.style.display = 'block';
    if (bottomBar) bottomBar.style.display = 'block';
    
    // Clear calendar pages grid to remove preview pages
    const calendarPagesGrid = document.getElementById('calendarPagesGrid');
    if (calendarPagesGrid) {
        calendarPagesGrid.innerHTML = '';
    }
    
    // Reset output type
    currentOutputType = null;
}

function autoStartClock() {
    if (document.getElementById('clockView')) {
        document.getElementById('clockView').style.display = 'block';
        initClock();
    }
}

const GRID_COLS = 5;
const GRID_ROWS = 7;
let gridCellSize = 0;

let isDrawing = false;
let drawnCells = new Set();

function setupHighResCanvas(canvasElement, width, height) {
    const dpr = window.devicePixelRatio || 1;
    
    // Set the actual size in memory (scaled for high DPI)
    canvasElement.width = width * dpr;
    canvasElement.height = height * dpr;
    
    // Set the display size (CSS pixels)
    canvasElement.style.width = width + 'px';
    canvasElement.style.height = height + 'px';
    
    // Scale the context to account for the device pixel ratio
    const ctx = canvasElement.getContext('2d');
    ctx.scale(dpr, dpr);
    
    return ctx;
}

function initCanvas() {
    canvas = document.getElementById('mainCanvas');
    if (!canvas) return;
    
    // Canvas size for 5 columns × 7 rows (portrait/hochformatig)
    // Using larger cells (140px) to fill screen like before
    // 5 columns × 140 = 700, 7 rows × 140 = 980
    canvas.width = 700;
    canvas.height = 980;
    ctx = canvas.getContext('2d');
    
    gridCellSize = Math.min(canvas.width / GRID_COLS, canvas.height / GRID_ROWS);
    
    // Drag-to-draw functionality
    // Use canvas wrapper to handle events even when SVG is on top
    const canvasWrapper = canvas.parentElement;
    
    canvasWrapper.addEventListener('mousedown', (e) => {
        // Only handle if clicking on canvas or SVG area, not on other elements
        if (e.target === canvas || e.target === canvasWrapper || e.target.closest('#stonesSvg')) {
            // Check if we're in Step 2 and clicking on the canvas area
            if (currentStep === 2) {
                isDrawing = true;
                drawnCells.clear(); // Reset for new drag
                handleCanvasDraw(e);
                e.preventDefault();
                e.stopPropagation();
            }
        }
    });
    
    canvasWrapper.addEventListener('mousemove', (e) => {
        if (isDrawing && currentStep === 2) {
            handleCanvasDraw(e);
            e.preventDefault();
            e.stopPropagation();
        }
    });
    
    document.addEventListener('mouseup', (e) => {
        if (isDrawing) {
            isDrawing = false;
            drawnCells.clear();
            saveNumbersToStorage();
        }
    });
    
    canvasWrapper.addEventListener('mouseleave', (e) => {
        if (isDrawing) {
            isDrawing = false;
            drawnCells.clear();
            saveNumbersToStorage();
        }
    });
    
    renderCanvas();
}

function snapToGrid(x, y) {
    const gridCol = Math.floor(x / gridCellSize);
    const gridRow = Math.floor(y / gridCellSize);
    
    const clampedCol = Math.max(0, Math.min(GRID_COLS - 1, gridCol));
    const clampedRow = Math.max(0, Math.min(GRID_ROWS - 1, gridRow));
    
    const gridX = clampedCol * gridCellSize + gridCellSize / 2;
    const gridY = clampedRow * gridCellSize + gridCellSize / 2;
    
    return { x: gridX, y: gridY };
}

function handleCanvasDraw(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const rawX = (e.clientX - rect.left) * scaleX;
    const rawY = (e.clientY - rect.top) * scaleY;
    
    const snapped = snapToGrid(rawX, rawY);
    const x = snapped.x;
    const y = snapped.y;
    
    const gridCol = Math.floor(x / gridCellSize);
    const gridRow = Math.floor(y / gridCellSize);
    const cellKey = `${gridCol},${gridRow}`;
    
    if (!drawnCells.has(cellKey)) {
        drawnCells.add(cellKey);
        
        const clickKey = `${x},${y}`;
    
    if (!numbers[currentNumber].clickData[clickKey]) {
        addStone(x, y, 'stone');
        numbers[currentNumber].clickData[clickKey] = { count: 1, shape: 'stone' };
    }
    renderCanvas();
    }
}

function addStone(x, y, shapeType = 'stone') {
    const size = gridCellSize * 0.95 + Math.random() * gridCellSize * 0.03;
    
    // Generate shape based on shape type
    let shapePoints;
    switch(shapeType) {
        case 'stone':
            shapePoints = generateStoneShape(size);
            break;
        case 'brick':
            // TODO: Implement brick shape
            shapePoints = generateStoneShape(size); // Placeholder
            break;
        case 'concrete':
            // TODO: Implement concrete shape
            shapePoints = generateStoneShape(size); // Placeholder
            break;
        case 'mat4':
            // TODO: Implement mat4 shape
            shapePoints = generateStoneShape(size); // Placeholder
            break;
        default:
            shapePoints = generateStoneShape(size);
    }
    
    const stone = {
        x: x,
        y: y,
        size: size,
        shape: shapePoints,
        shapeType: shapeType,
        color: getStoneColor(),
        rotation: Math.random() * 360
    };
    
    numbers[currentNumber].stones.push(stone);
    saveNumbersToStorage();
    
    // Wenn bereits Materialien existieren, Materialschichten für alle Steine (inkl. neuem) aktualisieren
    const hasExistingMaterials = numbers[currentNumber].materials && numbers[currentNumber].materials.length > 0;
    const hasMaterialLayers = materialLayerAmount > 1.001 || (numbers[currentNumber].materialLayerAmount && numbers[currentNumber].materialLayerAmount > 1.001);
    
    if (hasExistingMaterials || hasMaterialLayers) {
        // Materialien für alle Steine (inkl. neuem) neu erstellen
        updateMaterialLayers(false, materialLayerAmount || numbers[currentNumber].materialLayerAmount || 1);
    }
}

function updateStoneAtPosition(x, y, newShape) {
    const stones = numbers[currentNumber].stones;
    for (let i = stones.length - 1; i >= 0; i--) {
        const stone = stones[i];
        const distance = Math.sqrt(Math.pow(stone.x - x, 2) + Math.pow(stone.y - y, 2));
        if (distance < stone.size / 2) {
            const size = stone.size;
            let shapePoints;
            switch(newShape) {
                case 'stone':
                    shapePoints = generateStoneShape(size);
                    break;
                case 'brick':
                    shapePoints = generateStoneShape(size); // Placeholder
                    break;
                case 'concrete':
                    shapePoints = generateStoneShape(size); // Placeholder
                    break;
                case 'mat4':
                    shapePoints = generateStoneShape(size); // Placeholder
                    break;
                default:
                    shapePoints = generateStoneShape(size);
            }
            stone.shape = shapePoints;
            stone.shapeType = newShape;
            break;
        }
    }
}

function selectShape(shape) {
    currentShape = shape;
    
    document.querySelectorAll('.shape-option').forEach(opt => opt.classList.remove('active'));
    
    // Map shape names to element IDs
    const shapeIdMap = {
        'stone': 'shapeStone',
        'brick': 'shapeBrick',
        'concrete': 'shapeConcrete',
        'mat4': 'shapeMat4'
    };
    
    const shapeId = shapeIdMap[shape];
    if (shapeId) {
        const shapeElement = document.getElementById(shapeId);
        if (shapeElement) {
            shapeElement.classList.add('active');
        }
    }
}

function getStoneColor() {
    // Stone color: #0000ee
    return '#0000ee'; 
}

function renderCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (gridCellSize > 0) {
    ctx.save();
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 0.5;
        for (let col = 0; col <= GRID_COLS; col++) {
            const x = col * gridCellSize;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let row = 0; row <= GRID_ROWS; row++) {
            const y = row * gridCellSize;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    ctx.restore();
    }
    
    const svg = document.getElementById('stonesSvg');
    svg.innerHTML = ''; // Clear existing stones
    
    // Set SVG viewBox to extend beyond canvas dimensions to allow materials to overflow
    const padding = 200; // Extra space for materials to overflow
    svg.setAttribute('viewBox', `${-padding} ${-padding} ${canvas.width + padding * 2} ${canvas.height + padding * 2}`);
    svg.setAttribute('width', canvas.width + padding * 2);
    svg.setAttribute('height', canvas.height + padding * 2);
    
    // Materialien und Steine zeichnen
    const materials = numbers[currentNumber].materials || [];
    const stones = numbers[currentNumber].stones || [];
    
    // Materialien zuerst zeichnen (hinten), sortiert nach baseOffset (größte zuerst = hinten)
    // Alle Materialien nach baseOffset absteigend sortieren
    // Größter baseOffset = am weitesten hinten, wird zuerst gezeichnet
    const sortedMaterials = [...materials].sort((a, b) => {
        const offsetA = a.baseOffset !== undefined ? a.baseOffset : -Infinity;
        const offsetB = b.baseOffset !== undefined ? b.baseOffset : -Infinity;
        return offsetB - offsetA; // Absteigend sortieren (größte zuerst)
    });

    // Materialien in der Reihenfolge ihrer baseOffsets zeichnen
    sortedMaterials.forEach(material => {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('transform', `translate(${material.x}, ${material.y}) rotate(${material.rotation})`);
        if (material.alpha !== undefined) {
            group.setAttribute('opacity', String(material.alpha));
        }
        
                    const materialColor = material.color || MATERIAL_DEFAULT_COLORS[material.type] || '#000000';

                    switch (material.type) {
            case 'circles':
                drawCirclesPattern(group, material.size, materialColor);
                break;
            case 'grid':
                drawGridPattern(group, material.size, materialColor);
                break;
                        case 'brick': {
                const brickShape = generateBrickShape(material.size);
                const width = Math.abs(brickShape[1].x - brickShape[0].x);
                const height = Math.abs(brickShape[2].y - brickShape[1].y);
                
                            const circleRadius = Math.min(width, height) * 0.18;
                            const spacingX = width * 0.5;
                            const spacingY = height * 0.5;
                
                const centerX = (brickShape[0].x + brickShape[1].x + brickShape[2].x + brickShape[3].x) / 4;
                const centerY = (brickShape[0].y + brickShape[1].y + brickShape[2].y + brickShape[3].y) / 4;
                
                let brickPathData = `M ${brickShape[0].x} ${brickShape[0].y} `;
                brickPathData += `L ${brickShape[1].x} ${brickShape[1].y} `;
                brickPathData += `L ${brickShape[2].x} ${brickShape[2].y} `;
                brickPathData += `L ${brickShape[3].x} ${brickShape[3].y} `;
                brickPathData += 'Z';
                
                for (let row = 0; row < 2; row++) {
                    for (let col = 0; col < 2; col++) {
                        const circleX = centerX + (col - 0.5) * spacingX;
                        const circleY = centerY + (row - 0.5) * spacingY;
                        const numPoints = 16;
                        const angleStep = (Math.PI * 2) / numPoints;
                        brickPathData += ` M ${circleX + circleRadius} ${circleY}`;
                        for (let i = 1; i <= numPoints; i++) {
                            const angle = i * angleStep;
                            const x = circleX + Math.cos(angle) * circleRadius;
                            const y = circleY + Math.sin(angle) * circleRadius;
                            brickPathData += ` L ${x} ${y}`;
                        }
                        brickPathData += ' Z';
                    }
                }
                
                const brickPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                brickPath.setAttribute('d', brickPathData);
                brickPath.setAttribute('fill', materialColor);
                            brickPath.setAttribute('fill-rule', 'evenodd');
                group.appendChild(brickPath);
                break;
                        }
            case 'lines':
                drawLinesPattern(group, material.size, materialColor);
                break;
        }
        
        svg.appendChild(group);
    });
    
    // Steine zuletzt zeichnen (vorne/im Vordergrund)
    stones.forEach((stone, stoneIndex) => {
        const copies = Math.max(1, stackLevel);
        
        for (let i = 0; i < copies; i++) {
            const offset = i * 3;
            
            const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            group.setAttribute('transform', `translate(${stone.x + offset}, ${stone.y + offset}) rotate(${stone.rotation})`);
    
    if (blendLevel > 0) {
                group.setAttribute('style', `mix-blend-mode: multiply;`);
            }
            
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const pathData = generateSVGPath(stone.shape);
            path.setAttribute('d', pathData);
            path.setAttribute('fill', stone.color);
            
            group.appendChild(path);
            svg.appendChild(group);
        }
    });
}

// Initialize material controls (slider and direction button)
function initMaterialControls() {
    materialLayerAmount =
        (numbers[currentNumber].materialLayerAmount !== undefined
            ? numbers[currentNumber].materialLayerAmount
            : (numbers[currentNumber].materialLayerCount || 1));
    materialLayerAmount = Math.max(1, Math.min(5, materialLayerAmount));
    materialLayerCount = Math.max(1, Math.min(5, Math.round(materialLayerAmount)));
    materialDirection = numbers[currentNumber].materialDirection || 0;
    materialOffsetMultiplier = numbers[currentNumber].materialOffsetMultiplier !== undefined ? numbers[currentNumber].materialOffsetMultiplier : 1.0;
    
    initLayerSlider();
    initDirectionButton();
    updateCurrentNumberLabel();
    
    // Update slider to saved position (or reset to 1 if not set)
    if (materialLayerAmount > 1.001) {
        updateSliderPosition();
    } else {
        resetSliderToPosition1();
    }
}

// Update slider position based on current materialLayerCount
function updateSliderPosition() {
    const slider = document.getElementById('layerSlider');
    const handle = document.getElementById('sliderHandle');
    if (!slider || !handle) return;
    
    setTimeout(() => {
        const sliderHeight = slider.offsetHeight;
        const handleHeight = 20;
        const minY = handleHeight / 2;
        const maxY = sliderHeight - handleHeight / 2;
        const range = maxY - minY;
        
        // Smooth position for current materialLayerAmount (1..5)
        const amount = Math.max(1, Math.min(5, materialLayerAmount !== undefined ? materialLayerAmount : materialLayerCount));
        const t = (amount - 1) / 4; // 0..1
        const position = minY + range * t;
        
        // Use fixed positioning relative to viewport
        const sliderRect = slider.getBoundingClientRect();
        const handleTop = sliderRect.top + position;
        handle.style.position = 'fixed';
        handle.style.top = handleTop + 'px';
        handle.style.left = '0px';
        
        // Also update track position
        const track = slider.querySelector('.slider-track');
        if (track) {
            track.style.top = position + 'px';
        }
    }, 100);
}

function initLayerSlider() {
    const slider = document.getElementById('layerSlider');
    const handle = document.getElementById('sliderHandle');
    if (!slider || !handle) return;

    // Only initialize behavior in step 2
    if (currentStep !== 2) return;

    // Avoid double-binding
    if (slider.hasAttribute('data-smooth-slider')) return;
    slider.setAttribute('data-smooth-slider', 'true');

    const STEP = 0.01; // requested step
    const handleHeight = 20;
    const lerp = (a, b, t) => a + (b - a) * t;

    let isDragging = false;
    let rafId = null;
    let pendingSave = false;

    let currentY = null;
    let targetY = null;
    let currentAmount = null;
    let targetAmount = null;
    let lastAppliedAmount = null;

    function getMetrics() {
        const sliderHeight = slider.offsetHeight;
        const minY = handleHeight / 2;
        const maxY = sliderHeight - handleHeight / 2;
        const range = Math.max(1, maxY - minY);
        return { minY, maxY, range };
    }

    function clamp(v, a, b) {
        return Math.max(a, Math.min(b, v));
    }

    function yToAmount(y) {
        const { minY, range } = getMetrics();
        const t = clamp((y - minY) / range, 0, 1);
        const stepped = Math.round(t / STEP) * STEP;
        return 1 + stepped * 4; // 1..5
    }

    function amountToY(amount) {
        const { minY, range } = getMetrics();
        const t = clamp((amount - 1) / 4, 0, 1);
        return minY + t * range;
    }

    function setVisual(y) {
        const { minY, maxY } = getMetrics();
        const clampedY = clamp(y, minY, maxY);
        const sliderRect = slider.getBoundingClientRect();
        const handleTop = sliderRect.top + clampedY;
        handle.style.position = 'fixed';
        handle.style.top = handleTop + 'px';
        handle.style.left = '0px';

        const track = slider.querySelector('.slider-track');
        if (track) track.style.top = clampedY + 'px';
    }

    function settleIfDone() {
        const closeEnough =
            currentY !== null &&
            targetY !== null &&
            Math.abs(currentY - targetY) < 0.25 &&
            currentAmount !== null &&
            targetAmount !== null &&
            Math.abs(currentAmount - targetAmount) < 0.01;
        if (closeEnough) {
            setVisual(targetY);
            currentY = targetY;
            currentAmount = targetAmount;
            if (pendingSave) {
                pendingSave = false;
                saveNumbersToStorage();
            }
            if (!isDragging) {
                if (rafId) cancelAnimationFrame(rafId);
                rafId = null;
            }
        }
    }

    function tick() {
        rafId = requestAnimationFrame(tick);

        if (currentY === null || targetY === null || currentAmount === null || targetAmount === null) return;

        // Ease (more responsive on drag, smoother on release)
        const posEase = isDragging ? 0.45 : 0.18;
        const amtEase = isDragging ? 0.35 : 0.14;
        currentY = lerp(currentY, targetY, posEase);
        currentAmount = lerp(currentAmount, targetAmount, amtEase);

        setVisual(currentY);

        // Apply effect smoothly (throttle to step granularity)
        if (lastAppliedAmount === null || Math.abs(currentAmount - lastAppliedAmount) >= STEP) {
            lastAppliedAmount = currentAmount;
            updateMaterialLayers(false, currentAmount);
        }

        settleIfDone();
    }

    function start() {
        if (!rafId) rafId = requestAnimationFrame(tick);
    }

    function setTargetFromClientY(clientY) {
        const rect = slider.getBoundingClientRect();
        const { minY, maxY } = getMetrics();
        const rawY = clientY - rect.top;
        const y = clamp(rawY, minY, maxY);
        targetY = y;
        targetAmount = yToAmount(y);
        if (currentY === null) currentY = y;
        if (currentAmount === null) currentAmount = targetAmount;
        start();
    }

    // Position numbers 1-5 evenly (keep UI readable)
    setTimeout(() => {
        const { minY, range } = getMetrics();
        const sliderNumbers = document.querySelectorAll('.slider-number');
        if (sliderNumbers.length === 5) {
            sliderNumbers.forEach((numEl, index) => {
                const t = index / 4;
                const pos = minY + t * range;
                numEl.style.position = 'absolute';
                numEl.style.top = pos + 'px';
                numEl.style.transform = 'translateY(-50%)';
                numEl.style.right = '-15px';
            });
        }

        // Initialize from saved value
        materialLayerAmount =
            (numbers[currentNumber].materialLayerAmount !== undefined
                ? numbers[currentNumber].materialLayerAmount
                : (numbers[currentNumber].materialLayerCount || 1));
        materialLayerAmount = clamp(materialLayerAmount, 1, 5);
        materialLayerCount = clamp(Math.round(materialLayerAmount), 1, 5);

        const initY = amountToY(materialLayerAmount);
        currentY = initY;
        targetY = initY;
        currentAmount = materialLayerAmount;
        targetAmount = materialLayerAmount;
        setVisual(initY);
        updateMaterialLayers(false, materialLayerAmount);
    }, 100);

    handle.addEventListener('mousedown', (e) => {
        isDragging = true;
        e.preventDefault();
        // Don't stop propagation to allow cursor tracking during drag
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        setTargetFromClientY(e.clientY);
        // Update custom cursor position while dragging
        const cursor = document.getElementById('customCursor');
        if (cursor) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        }
    });

    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        pendingSave = true;
        // keep easing to target, then save when settled
        start();
    });

    slider.addEventListener('click', (e) => {
        if (e.target === handle) return;
        setTargetFromClientY(e.clientY);
        pendingSave = true;
    });
}

// Reset slider to position 1 for current number
function resetSliderToPosition1() {
    const handle = document.getElementById('sliderHandle');
    if (!handle) return;
    
    const slider = document.getElementById('layerSlider');
    if (!slider) return;
    
    // For horizontal line slider that moves vertically, reset top position
    setTimeout(() => {
        const sliderHeight = slider.offsetHeight;
        const handleHeight = 20;
        const minY = handleHeight / 2;
        const maxY = sliderHeight - handleHeight / 2;
        const range = maxY - minY;
        
        // Position 1 is at the top (first of 5 positions)
        const position1 = minY;
        // Use fixed positioning relative to viewport
        const sliderRect = slider.getBoundingClientRect();
        const handleTop = sliderRect.top + position1;
        handle.style.position = 'fixed';
        handle.style.top = handleTop + 'px';
        handle.style.left = '0px';
        // Also update track position
        const track = slider.querySelector('.slider-track');
        if (track) {
            track.style.top = position1 + 'px';
        }
        materialLayerCount = 1;
        updateMaterialLayers();
    }, 100);
}

// Initialize direction button (360° rotatable)
function initDirectionButton() {
    const container = document.getElementById('directionControlContainer');
    const button = document.getElementById('directionButton');
    if (!container || !button) {
        console.error('Direction control elements not found');
        return;
    }
    
    let isDragging = false;
    
    // Load saved direction and offset multiplier for current number
    const savedDirection = numbers[currentNumber].materialDirection !== undefined 
        ? numbers[currentNumber].materialDirection 
        : materialDirection || 0;
    const savedOffsetMultiplier = numbers[currentNumber].materialOffsetMultiplier !== undefined
        ? numbers[currentNumber].materialOffsetMultiplier
        : materialOffsetMultiplier || 1.0;
    
    materialDirection = savedDirection;
    materialOffsetMultiplier = savedOffsetMultiplier;
    
    // Calculate initial position based on saved values
    // Direction: 0-360 degrees
    // Offset multiplier: 0.5 (center) to 2.0 (max distance)
    // Position will be set after container dimensions are known
    function setInitialPosition() {
        const containerRect = container.getBoundingClientRect();
        const containerCenterX = containerRect.width / 2;
        const containerCenterY = containerRect.height / 2;
        const maxDistance = Math.min(containerRect.width, containerRect.height) / 2 - 15; // Leave margin for circle
        
        // Map offset multiplier (0.5-2.0) to distance (0-maxDistance)
        // 1.0 = center (distance 0), 0.5 = min distance (closer to center), 2.0 = max distance (further out)
        // Linear mapping: 0.5 -> 0, 1.0 -> 0, 2.0 -> maxDistance
        // For values <= 1.0, distance is 0 (center)
        // For values > 1.0, map linearly from 1.0 to 2.0 -> 0 to maxDistance
        let distance = 0;
        if (savedOffsetMultiplier > 1.0) {
            // Map 1.0-2.0 to 0-maxDistance
            distance = ((savedOffsetMultiplier - 1.0) / 1.0) * maxDistance;
        } else if (savedOffsetMultiplier < 1.0) {
            // Map 0.5-1.0 to 0 (all center for now, or could map to negative if needed)
            distance = 0;
        }
        const directionRad = (savedDirection * Math.PI) / 180;
        
        const offsetX = distance * Math.cos(directionRad);
        const offsetY = distance * Math.sin(directionRad);
        
        // Set position relative to container center (absolute positioning within container)
        // Keep transform: translate(-50%, -50%) for centering
        button.style.left = (containerCenterX + offsetX) + 'px';
        button.style.top = (containerCenterY + offsetY) + 'px';
        button.style.transform = 'translate(-50%, -50%)';
    }
    
    // Set initial position after a short delay to ensure container is rendered
    // Also try immediately in case container is already rendered
    function trySetPosition() {
        if (container.offsetWidth > 0 && container.offsetHeight > 0) {
            setInitialPosition();
        } else {
            setTimeout(trySetPosition, 10);
        }
    }
    trySetPosition();
    
    // Also set position on window resize
    window.addEventListener('resize', () => {
        if (container.offsetWidth > 0 && container.offsetHeight > 0) {
            setInitialPosition();
        }
    });
    
    function updatePositionFromMouse(e) {
        const containerRect = container.getBoundingClientRect();
        const containerCenterX = containerRect.width / 2;
        const containerCenterY = containerRect.height / 2;
        
        // Get mouse position relative to container (not viewport)
        const mouseX = e.clientX - containerRect.left - containerCenterX;
        const mouseY = e.clientY - containerRect.top - containerCenterY;
        
        // Calculate distance from center
        const distance = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
        const maxDistance = Math.min(containerRect.width, containerRect.height) / 2 - 15; // Leave some margin for circle
        
        // Clamp distance to max
        const clampedDistance = Math.min(distance, maxDistance);
        
        // Calculate direction (angle in degrees, 0 = right, 90 = down)
        const angleRad = Math.atan2(mouseY, mouseX);
        const angleDeg = (angleRad * 180 / Math.PI);
        // Convert to 0-360 range (0 = right, 90 = down, 180 = left, 270 = up)
        let direction = (angleDeg + 360) % 360;
        
        // Calculate offset multiplier: 0.5 (center) to 2.0 (max distance)
        const offsetMultiplier = 0.5 + (clampedDistance / maxDistance) * 1.5;
        
        // Update position (pixels relative to container center)
        // Use the actual mouse position relative to container center, clamped to max distance
        const offsetX = clampedDistance * Math.cos(angleRad);
        const offsetY = clampedDistance * Math.sin(angleRad);
        
        button.style.left = (containerCenterX + offsetX) + 'px';
        button.style.top = (containerCenterY + offsetY) + 'px';
        button.style.transform = 'translate(-50%, -50%)';
        
        // Update custom cursor position while dragging
        const cursor = document.getElementById('customCursor');
        if (cursor) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        }
        
        // Update global variables
        materialDirection = direction;
        materialOffsetMultiplier = offsetMultiplier;
        
        // Update materials
        updateMaterialLayers(true); // true = update direction and offset only
    }
    
    button.addEventListener('mousedown', (e) => {
        isDragging = true;
        e.preventDefault();
        // Don't stop propagation to allow cursor tracking during drag
    });
    
    const mouseMoveHandler = (e) => {
        if (!isDragging) return;
        updatePositionFromMouse(e);
    };
    
    document.addEventListener('mousemove', mouseMoveHandler);
    
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            // Save direction and offset multiplier to current number
            numbers[currentNumber].materialDirection = materialDirection;
            numbers[currentNumber].materialOffsetMultiplier = materialOffsetMultiplier;
            saveNumbersToStorage();
        }
    });
}

// Update current number label below canvas
function updateCurrentNumberLabel() {
    const label = document.getElementById('currentNumberLabel');
    if (label) {
        label.textContent = currentNumber.toString();
    }
}


function mixColors() {
    const numberData = numbers[currentNumber];
    if (!numberData) {
        return;
    }
    
    const materials = numberData.materials || [];
    const stones = numberData.stones || [];

    // Nur Material-Typen berücksichtigen, die auch wirklich vorhanden sind
    const typesInUse = MATERIAL_TYPES.filter(type =>
        materials.some(m => m.type === type)
    );

    // Wenn keine Materialien vorhanden, nichts zu tun
    if (typesInUse.length === 0) {
        return;
    }

    // Aktuelle Farben je Schicht-Typ ermitteln (falls nichts gesetzt, Standardfarbe nehmen)
    const colorsPerType = typesInUse.map(type => {
        const mat = materials.find(m => m.type === type && m.color);
        return (mat && mat.color) || MATERIAL_DEFAULT_COLORS[type] || '#000000';
    });

    // Aktuelle Steinfarbe ermitteln (Standard: #0000ee)
    const currentStoneColor = stones.length > 0 && stones[0].color 
        ? stones[0].color 
        : getStoneColor();

    // Steine als erste Schicht einbeziehen: [Steine, circles, grid, brick, lines]
    const allColors = [currentStoneColor, ...colorsPerType];
    const allTypes = ['stones', ...typesInUse];

    // Wenn nur eine Schicht vorhanden, nichts zu rotieren
    if (allColors.length <= 1) {
        return;
    }

    // Farben zyklisch rotieren: letzte Farbe nach vorne
    const rotatedColors = [...allColors];
    const lastColor = rotatedColors.pop();
    rotatedColors.unshift(lastColor);

    // Neue Farbe auf alle Steine anwenden (erste Farbe in der Rotation)
    const newStoneColor = rotatedColors[0];
    stones.forEach(stone => {
        stone.color = newStoneColor;
    });

    // Neue Farben pro Typ auf alle Materialien dieses Typs anwenden
    typesInUse.forEach((type, idx) => {
        const newColor = rotatedColors[idx + 1]; // +1 weil Steine an Index 0
        materials.forEach(material => {
            if (material.type === type) {
                material.color = newColor;
            }
        });
    });
    
    renderCanvas();
    saveNumbersToStorage();
}

// Update material layers based on slider value and direction
function updateMaterialLayers(updateDirectionOnly = false, layerAmount = null) {
    const amount =
        layerAmount !== null && layerAmount !== undefined
            ? layerAmount
            : (materialLayerAmount !== undefined ? materialLayerAmount : materialLayerCount);
    const clampedAmount = Math.max(1, Math.min(5, amount));
    console.log('updateMaterialLayers called, layerAmount:', clampedAmount, 'stones:', numbers[currentNumber].stones.length, 'updateDirectionOnly:', updateDirectionOnly);
    
    // Only work if we have stones
    if (numbers[currentNumber].stones.length === 0) {
        console.log('No stones, clearing materials');
        numbers[currentNumber].materials = [];
        renderCanvas();
        return;
    }
    
    // If we're only updating direction, update positions of existing materials
    if (updateDirectionOnly && numbers[currentNumber].materials.length > 0) {
        console.log('Updating material positions for new direction');
        updateMaterialPositions();
        renderCanvas();
        return;
    }
    
    // Clear existing materials
    numbers[currentNumber].materials = [];
    
    // Add materials based on layer count
    // Position 1: Only stones (no materials)
    const materialTypes = ['circles', 'grid', 'brick', 'lines'];
    
    // Persist smooth value (and keep integer for legacy code)
    materialLayerAmount = clampedAmount;
    materialLayerCount = Math.max(1, Math.min(5, Math.round(clampedAmount)));
    numbers[currentNumber].materialLayerAmount = clampedAmount;
    numbers[currentNumber].materialLayerCount = materialLayerCount;

    if (clampedAmount > 1) {
        const fullLayers = Math.floor(clampedAmount); // 1..5
        const frac = clampedAmount - fullLayers; // 0.. <1

        // Add fully visible layers
        const fullMaterialLayers = Math.max(0, fullLayers - 1); // 0..4
        for (let i = 0; i < fullMaterialLayers; i++) {
            const materialType = materialTypes[i];
            if (materialType) {
                addMaterialLayer(materialType, i, 1);
            }
        }

        // Add next layer as fractional opacity (fade-in)
        if (frac > 0 && fullMaterialLayers < materialTypes.length) {
            const idx = fullMaterialLayers; // next layer index
            const materialType = materialTypes[idx];
            if (materialType) {
                addMaterialLayer(materialType, idx, frac);
            }
        }
    }
    
    console.log('Total materials after update:', numbers[currentNumber].materials.length);
    renderCanvas();
}

// Update positions of existing materials when direction changes
function updateMaterialPositions() {
    if (numbers[currentNumber].materials.length === 0 || numbers[currentNumber].stones.length === 0) {
        return;
    }
    
    const directionRad = (materialDirection * Math.PI) / 180;
    
    // Update each material based on its stone and stored distance
    numbers[currentNumber].materials.forEach((material) => {
        // Find the stone this material belongs to
        const stoneIndex = material.stoneIndex !== undefined ? material.stoneIndex : 
            numbers[currentNumber].stones.findIndex((stone, idx) => {
                // Try to match by proximity if stoneIndex is not set
                const distance = Math.sqrt(
                    Math.pow(material.x - stone.x, 2) + 
                    Math.pow(material.y - stone.y, 2)
                );
                return distance < 100; // Within reasonable distance
            });
        
        if (stoneIndex >= 0 && stoneIndex < numbers[currentNumber].stones.length) {
            const stone = numbers[currentNumber].stones[stoneIndex];
            
            // Use stored baseOffset (distance) if available, otherwise calculate from layerIndex
            let totalOffset;
            if (material.baseOffset !== undefined) {
                // Recalculate with current offset multiplier
                const baseOffset = 20;
                const layerIndex = material.layerIndex !== undefined ? material.layerIndex : 0;
                totalOffset = baseOffset * (layerIndex + 1) * materialOffsetMultiplier;
                // Update stored baseOffset
                material.baseOffset = totalOffset;
            } else {
                // Fallback: calculate from layerIndex if baseOffset wasn't stored
                const baseOffset = 20;
                const layerIndex = material.layerIndex !== undefined ? material.layerIndex : 0;
                totalOffset = baseOffset * (layerIndex + 1) * materialOffsetMultiplier;
                // Store it for future use
                material.baseOffset = totalOffset;
            }
            
            // Calculate new position using stored distance and new direction
            // This preserves the absolute distance, only changes the angle
            const offsetX = Math.cos(directionRad) * totalOffset;
            const offsetY = Math.sin(directionRad) * totalOffset;
            
            // Update position relative to the stone's current position
            material.x = stone.x + offsetX;
            material.y = stone.y + offsetY;
            
            // Ensure stoneIndex and layerIndex are set
            if (material.stoneIndex === undefined || material.stoneIndex !== stoneIndex) {
                material.stoneIndex = stoneIndex;
            }
            // Ensure layerIndex is set based on material type
            if (material.layerIndex === undefined) {
                const materialTypes = ['circles', 'grid', 'brick', 'lines'];
                const materialTypeIndex = materialTypes.indexOf(material.type);
                if (materialTypeIndex >= 0) {
                    material.layerIndex = materialTypeIndex;
                }
            }
        }
    });
}


// Calculate bounds of a number design (stones and materials)
function getNumberBounds(numberData) {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    
    if (numberData.stones && numberData.stones.length > 0) {
        numberData.stones.forEach(stone => {
            stone.shape.forEach(point => {
                const x = stone.x + point.x;
                const y = stone.y + point.y;
                minX = Math.min(minX, x);
                maxX = Math.max(maxX, x);
                minY = Math.min(minY, y);
                maxY = Math.max(maxY, y);
            });
        });
    }
    
    if (numberData.materials && numberData.materials.length > 0) {
        numberData.materials.forEach(material => {
            const materialSize = material.size;
            minX = Math.min(minX, material.x - materialSize / 2);
            maxX = Math.max(maxX, material.x + materialSize / 2);
            minY = Math.min(minY, material.y - materialSize / 2);
            maxY = Math.max(maxY, material.y + materialSize / 2);
        });
    }
    
    return { minX, maxX, minY, maxY, width: maxX - minX, height: maxY - minY };
}

// Render a number design at a specific position
function renderNumberDesign(ctx, numberData, offsetX, offsetY) {
    if (!numberData) return;
    
    // Draw materials first (behind stones)
    // Largest baseOffset = furthest back, drawn first
    if (numberData.materials && numberData.materials.length > 0) {
        const sortedMaterials = [...numberData.materials].sort((a, b) => {
            const offsetA = a.baseOffset !== undefined ? a.baseOffset : -Infinity;
            const offsetB = b.baseOffset !== undefined ? b.baseOffset : -Infinity;
            return offsetB - offsetA; // Descending sort (largest first)
        });
        
        sortedMaterials.forEach(material => {
            ctx.save();
            ctx.translate(offsetX, offsetY);
            // Apply alpha if defined
            if (material.alpha !== undefined) {
                ctx.globalAlpha = ctx.globalAlpha * material.alpha;
            }
            drawMaterial(ctx, material, material.x, material.y);
            ctx.restore();
        });
    }
    
    // Draw stones on top
    // For export, always render with stackLevel=0 and blendLevel=0 to match Step 2 exactly
    if (numberData.stones && numberData.stones.length > 0) {
        // if (blendLevel > 0) {
        //     ctx.globalCompositeOperation = 'multiply';
        // }
        
        numberData.stones.forEach(stone => {
            ctx.save();
            ctx.translate(offsetX, offsetY);
            ctx.translate(stone.x, stone.y);
            ctx.rotate((stone.rotation * Math.PI) / 180);
            
            // Always render single copy (stackLevel=0) for export to match Step 2
            const copies = 1; // Math.max(1, stackLevel);
            for (let j = 0; j < copies; j++) {
                const offset = j * 3;
                drawStone(ctx, stone.shape, offset, offset, stone.color);
            }
            
            ctx.restore();
        });
        
        ctx.globalCompositeOperation = 'source-over';
    }
}

// Check if a stone already has a specific material type
function stoneHasMaterial(stone, materialType) {
    const tolerance = 5; // Small tolerance for position matching
    const baseOffset = 40;
    
    let expectedX, expectedY;
    if (materialType === 'brick') {
        expectedX = stone.x + baseOffset;
        expectedY = stone.y + baseOffset;
    } else if (materialType === 'grid') {
        expectedX = stone.x + baseOffset * 2;
        expectedY = stone.y + baseOffset * 2;
    } else {
        return false;
    }
    
    return numbers[currentNumber].materials.some(material => {
        if (material.type !== materialType) {
            return false;
        }
        
        const distance = Math.sqrt(
            Math.pow(material.x - expectedX, 2) + 
            Math.pow(material.y - expectedY, 2)
        );
        
        return distance < tolerance;
    });
}

// Add material layer behind stones
function addMaterialLayer(materialType, layerIndex = 0, alpha = 1) {
    // Material layers appear offset behind stones
    // Only add materials if there are stones
    if (numbers[currentNumber].stones.length === 0) {
        console.log('No stones to add materials to');
        return;
    }
    
    // Calculate offset based on direction, layer index, and offset multiplier
    const baseOffset = 20; // Base offset amount per layer
    // Material 5 (lines) should be furthest back, so higher layerIndex = more offset
    // Apply offset multiplier to control distance
    const totalOffset = baseOffset * (layerIndex + 1) * materialOffsetMultiplier; // Each layer is further offset
    
    // Convert direction from degrees to radians
    const directionRad = (materialDirection * Math.PI) / 180;
    
    // Calculate offset based on direction
    const offsetX = Math.cos(directionRad) * totalOffset;
    const offsetY = Math.sin(directionRad) * totalOffset;
    
    console.log(`Adding material layer ${layerIndex}, type: ${materialType}, offset: (${offsetX.toFixed(2)}, ${offsetY.toFixed(2)}), direction: ${materialDirection}°`);
    
    // Use same size for all materials
    const baseSize = gridCellSize > 0 ? gridCellSize * 1.0 : 130;
    
    // Material color mapping
    const materialColors = {
        'circles': '#fc0000',
        'grid': '#00ffff',
        'brick': '#ff3e96',
        'lines': '#bec2cb'
    };
    
    // Add material for each stone
    numbers[currentNumber].stones.forEach((stone, stoneIndex) => {
        const material = {
            type: materialType,
            x: stone.x + offsetX,
            y: stone.y + offsetY,
            size: baseSize,
            rotation: 0,
            color: materialColors[materialType] || '#000000', // Default color
            alpha: Math.max(0, Math.min(1, alpha)),
            stoneIndex: stoneIndex, // Store which stone this material belongs to
            layerIndex: layerIndex, // Store the layer index (0, 1, 2, 3)
            baseOffset: totalOffset // Store the distance from stone (absolute distance, not direction-dependent)
        };
        
        numbers[currentNumber].materials.push(material);
    });
    
    console.log(`Added ${numbers[currentNumber].stones.length} materials of type ${materialType}`);
}

function startEffectAdjustment(effect, delta) {
    // Stop any existing adjustment
    stopEffectAdjustment();
    
    currentEffectAdjustment = { effect, delta };
    
    // Apply immediately
    adjustEffect(effect, delta);
    
    // Then continue applying at intervals
    effectInterval = setInterval(() => {
        adjustEffect(effect, delta);
    }, 50); // Adjust every 50ms for smooth continuous change
}

function stopEffectAdjustment() {
    if (effectInterval) {
        clearInterval(effectInterval);
        effectInterval = null;
        currentEffectAdjustment = null;
    }
}

// Effects
function adjustEffect(effect, delta) {
    switch(effect) {
        case 'color':
            colorLevel = Math.max(0, Math.min(10, colorLevel + delta));
            // Update colors of existing stones
            numbers[currentNumber].stones.forEach(stone => {
                stone.color = getStoneColor();
            });
            break;
        case 'blend':
            blendLevel = Math.max(0, Math.min(1, blendLevel + delta));
            break;
        case 'stack':
            stackLevel = Math.max(0, Math.min(5, stackLevel + delta));
            break;
        case 'effect01':
            effect01Level = Math.max(0, Math.min(10, effect01Level + delta));
            // Add rotation or size variation
            numbers[currentNumber].stones.forEach(stone => {
                stone.rotation += delta * 5;
            });
            break;
    }
    renderCanvas();
}

// View switching
function switchView(view) {
    currentView = view;
    
    document.querySelectorAll('.view-option').forEach(opt => opt.classList.remove('active'));
    
    if (view === 'one') {
        document.getElementById('oneView').classList.add('active');
        document.querySelector('.workspace').classList.remove('hidden');
        document.getElementById('allViewContainer').classList.remove('active');
    } else {
        document.getElementById('allView').classList.add('active');
        document.querySelector('.workspace').classList.add('hidden');
        document.getElementById('allViewContainer').classList.add('active');
        renderAllView();
    }
}

function renderAllView() {
    const grid = document.getElementById('allViewGrid');
    grid.innerHTML = '';
    
    for (let i = 0; i <= 9; i++) {
        const item = document.createElement('div');
        item.className = 'grid-item';
        
        const itemCanvas = document.createElement('canvas');
        itemCanvas.width = 700;
        itemCanvas.height = 980;
        
        const itemCtx = itemCanvas.getContext('2d');
        
        // Render materials first (behind stones)
        if (numbers[i].materials && numbers[i].materials.length > 0) {
            numbers[i].materials.forEach(material => {
                drawMaterial(itemCtx, material, material.x, material.y);
            });
        }
        
        // Render stones on top
        if (blendLevel > 0) {
            itemCtx.globalCompositeOperation = 'multiply';
        }
        
        numbers[i].stones.forEach(stone => {
            itemCtx.save();
            itemCtx.translate(stone.x, stone.y);
            itemCtx.rotate((stone.rotation * Math.PI) / 180);
            
            const copies = Math.max(1, stackLevel);
            for (let j = 0; j < copies; j++) {
                const offset = j * 3;
                drawStone(itemCtx, stone.shape, offset, offset, stone.color);
            }
            
            itemCtx.restore();
        });
        
        itemCtx.globalCompositeOperation = 'source-over';
        
        // Draw number label (bottom left)
        itemCtx.save();
        itemCtx.fillStyle = '#000';
        itemCtx.font = '14px Lausanne, Helvetica, Arial, sans-serif';
        itemCtx.textAlign = 'left';
        itemCtx.textBaseline = 'bottom';
        itemCtx.fillText(i.toString(), 10, itemCanvas.height - 10);
        itemCtx.restore();
        
        item.appendChild(itemCanvas);
        
        item.onclick = () => {
            currentNumber = i;
            updateCurrentNumberLabel(); // Update label with selected number
            
            // Load saved material layer count and direction for this number
            materialLayerAmount =
                (numbers[currentNumber].materialLayerAmount !== undefined
                    ? numbers[currentNumber].materialLayerAmount
                    : (numbers[currentNumber].materialLayerCount || 1));
            materialLayerAmount = Math.max(1, Math.min(5, materialLayerAmount));
            materialLayerCount = Math.max(1, Math.min(5, Math.round(materialLayerAmount)));
            materialDirection = numbers[currentNumber].materialDirection || 0;
            materialOffsetMultiplier = numbers[currentNumber].materialOffsetMultiplier !== undefined ? numbers[currentNumber].materialOffsetMultiplier : 1.0;
            
            // Update slider position to match saved layer count
            updateSliderPosition();
            
            // Reinitialize direction button to update position
            initDirectionButton();
            
            switchView('one');
            renderCanvas();
        };
        
        grid.appendChild(item);
    }
}

function changeNumber(delta) {
    saveNumbersToStorage(); // Save before changing number
    currentNumber = Math.max(0, Math.min(9, currentNumber + delta));
    updateCurrentNumberLabel(); // Update label with new number
    
    // Load saved material layer count and direction for this number
    materialLayerAmount =
        (numbers[currentNumber].materialLayerAmount !== undefined
            ? numbers[currentNumber].materialLayerAmount
            : (numbers[currentNumber].materialLayerCount || 1));
    materialLayerAmount = Math.max(1, Math.min(5, materialLayerAmount));
    materialLayerCount = Math.max(1, Math.min(5, Math.round(materialLayerAmount)));
    materialDirection = numbers[currentNumber].materialDirection || 0;
    materialOffsetMultiplier = numbers[currentNumber].materialOffsetMultiplier !== undefined ? numbers[currentNumber].materialOffsetMultiplier : 1.0;
    
    // Update slider position to match saved layer count
    updateSliderPosition();
    
    // Reinitialize direction button to update position
    initDirectionButton();
    
    // Update arrow visibility based on current number
    updateArrowVisibility();
    
    renderCanvas();
}

// Update arrow visibility based on current number
function updateArrowVisibility() {
    const leftArrow = document.querySelector('.nav-arrow-left');
    const rightArrow = document.querySelector('.nav-arrow-right');
    
    if (leftArrow) {
        // Hide left arrow when at number 0, but keep space (visibility instead of display)
        if (currentNumber === 0) {
            leftArrow.style.visibility = 'hidden';
        } else {
            leftArrow.style.visibility = 'visible';
        }
    }
    
    if (rightArrow) {
        // Hide right arrow when at number 9, but keep space (visibility instead of display)
        if (currentNumber === 9) {
            rightArrow.style.visibility = 'hidden';
        } else {
            rightArrow.style.visibility = 'visible';
        }
    }
}

// Update slider position based on current materialLayerCount
function updateSliderPosition() {
    const slider = document.getElementById('layerSlider');
    const handle = document.getElementById('sliderHandle');
    if (!slider || !handle) return;
    
    setTimeout(() => {
        const sliderHeight = slider.offsetHeight;
        const handleHeight = 20;
        const minY = handleHeight / 2;
        const maxY = sliderHeight - handleHeight / 2;
        const range = maxY - minY;
        
        // Calculate position for current materialLayerCount (1-5)
        const numPositions = 5;
        const positionIndex = materialLayerCount - 1; // 0-4 for layers 1-5
        const position = minY + (range / (numPositions - 1)) * positionIndex;
        
        // Use fixed positioning relative to viewport
        const sliderRect = slider.getBoundingClientRect();
        const handleTop = sliderRect.top + position;
        handle.style.position = 'fixed';
        handle.style.top = handleTop + 'px';
        handle.style.left = '0px';
        
        // Also update track position
        const track = slider.querySelector('.slider-track');
        if (track) {
            track.style.top = position + 'px';
        }
    }, 100);
}

async function clearCanvas() {
    // Clear all stones and materials from the current number
    numbers[currentNumber].stones = [];
    numbers[currentNumber].clickData = {};
    numbers[currentNumber].materials = [];
    numbers[currentNumber].drillClickCount = 0; // Reset drill click count
    // Reset slider to position 1
    numbers[currentNumber].materialLayerCount = 1;
    numbers[currentNumber].materialLayerAmount = 1;
    materialLayerCount = 1;
    materialLayerAmount = 1;
    resetSliderToPosition1();
    saveNumbersToStorage(); // Save after clearing
    renderCanvas();
}

async function clearAllCanvas() {
    // Clear all stones and materials from all numbers (0-9)
    for (let i = 0; i <= 9; i++) {
        numbers[i].stones = [];
        numbers[i].clickData = {};
        numbers[i].materials = [];
        numbers[i].drillClickCount = 0; // Reset drill click count
        // Reset slider to position 1 for each number
        numbers[i].materialLayerCount = 1;
        numbers[i].materialLayerAmount = 1;
    }
    // Reset current number's slider to position 1
    materialLayerCount = 1;
    materialLayerAmount = 1;
    resetSliderToPosition1();
    saveNumbersToStorage(); // Save after clearing
    renderCanvas(); // Update current view
    if (currentView === 'all') {
        renderAllView(); // Update all view if active
    }
}

async function exportPDF() {
    // Create a container for all pages
    const pdfContainer = document.createElement('div');
    pdfContainer.style.width = '700px';
    pdfContainer.style.background = '#fff';
    pdfContainer.style.position = 'absolute';
    pdfContainer.style.left = '-9999px';
    document.body.appendChild(pdfContainer);
    
    // Render all 31 pages
    for (let day = 1; day <= 31; day++) {
        const page = document.createElement('div');
        page.style.width = '700px';
        page.style.height = '1050px';
        page.style.position = 'relative';
        page.style.background = '#fff';
        page.style.marginBottom = '20px';
        page.style.border = '1px solid #000';
        
        // Create canvas for this page
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = 700;
        pageCanvas.height = 1050;
        const pageCtx = pageCanvas.getContext('2d');
        
        // Draw gray day number
        pageCtx.save();
        pageCtx.fillStyle = '#d0d0d0';
        pageCtx.font = '300 800px Lausanne, Helvetica, Arial, sans-serif';
        pageCtx.textAlign = 'center';
        pageCtx.textBaseline = 'middle';
        pageCtx.fillText(day.toString(), 350, 525);
        pageCtx.restore();
        
        // Draw stones
        if (blendLevel > 0) {
            pageCtx.globalCompositeOperation = 'multiply';
        }
        
        days[day].stones.forEach(stone => {
            pageCtx.save();
            pageCtx.translate(stone.x, stone.y);
            pageCtx.rotate((stone.rotation * Math.PI) / 180);
            
            const copies = Math.max(1, stackLevel);
            for (let i = 0; i < copies; i++) {
                const offset = i * 3;
                drawStone(pageCtx, stone.shape, offset, offset, stone.color);
            }
            
            pageCtx.restore();
        });
        
        pageCtx.globalCompositeOperation = 'source-over';
        
        // Add labels
        const yearLabel = document.createElement('div');
        yearLabel.textContent = '2026';
        yearLabel.style.position = 'absolute';
        yearLabel.style.top = '20px';
        yearLabel.style.left = '20px';
        yearLabel.style.fontSize = '18px';
        yearLabel.style.fontFamily = 'Lausanne, Helvetica, Arial, sans-serif';
        
        const monthLabel = document.createElement('div');
        monthLabel.textContent = String(day).padStart(2, '0');
        monthLabel.style.position = 'absolute';
        monthLabel.style.top = '20px';
        monthLabel.style.right = '20px';
        monthLabel.style.fontSize = '18px';
        monthLabel.style.fontFamily = 'Lausanne, Helvetica, Arial, sans-serif';
        
        page.appendChild(pageCanvas);
        page.appendChild(yearLabel);
        page.appendChild(monthLabel);
        pdfContainer.appendChild(page);
    }
    
    // Wait a bit for rendering
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Generate PDF
    const opt = {
        margin: 0,
        filename: 'calendar-2026-01.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'px', format: [700, 1070], orientation: 'portrait' }
    };
    
    try {
        await html2pdf().set(opt).from(pdfContainer).save();
    } catch (error) {
        console.error('PDF export error:', error);
        alert('Fehler beim Exportieren des PDFs. Bitte versuchen Sie es erneut.');
    } finally {
        // Clean up
        document.body.removeChild(pdfContainer);
    }
}

// Calendar functions
function getDaysInMonth(monthIndex, year = 2026) {
    // monthIndex is 0-based (0 = January, 11 = December)
    return new Date(year, monthIndex + 1, 0).getDate();
}

function selectMonth(monthIndex) {
    currentMonth = monthIndex;
    
    // Update active state in UI
    document.querySelectorAll('.month-option').forEach((opt, idx) => {
        if (idx === monthIndex) {
            opt.classList.add('active');
        } else {
            opt.classList.remove('active');
        }
    });
    
    renderCalendarPages();
}

function renderCalendarPages() {
    const grid = document.getElementById('calendarPagesGrid');
    grid.innerHTML = '';
    
    // Setup scroll cursor tracking for calendar pages container
    setupCalendarScrollCursor();
    
    // Get correct number of days in month
    const daysInMonth = getDaysInMonth(currentMonth, 2026);
    
    for (let day = 1; day <= daysInMonth; day++) {
        const page = document.createElement('div');
        page.className = 'calendar-page';
        
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = 700;
        pageCanvas.height = 1050;
        const pageCtx = pageCanvas.getContext('2d');
        
        // Draw background
        pageCtx.fillStyle = '#fff';
        pageCtx.fillRect(0, 0, 700, 1050);
        
        // Draw year label (top left)
        pageCtx.save();
        pageCtx.fillStyle = '#000';
        pageCtx.font = '18px Lausanne, Helvetica, Arial, sans-serif';
        pageCtx.textAlign = 'left';
        pageCtx.textBaseline = 'top';
        pageCtx.fillText('2026', 20, 20);
        pageCtx.restore();
        
        // Draw month label (top right)
        pageCtx.save();
        pageCtx.fillStyle = '#000';
        pageCtx.font = '18px Lausanne, Helvetica, Arial, sans-serif';
        pageCtx.textAlign = 'right';
        pageCtx.textBaseline = 'top';
        pageCtx.fillText(monthNames[currentMonth], 680, 20);
        pageCtx.restore();
        
        // Get the number design(s) to use for this day
        // For days 1-9: use single digit (not "01" but "1")
        // For days 10-31: combine two digits
        const canvasWidth = 700;
        const canvasHeight = 1050;
        const centerX = canvasWidth / 2;
        const centerY = canvasHeight / 2;
        
        // Use uniform scale like clock (same scale for all digits, maintains aspect ratio)
        const uniformScale = getClockUniformScale();
        const CALENDAR_SCALE_FACTOR = 0.5; // Scale factor to make calendar numbers smaller than clock
        const numberScale = uniformScale * CALENDAR_SCALE_FACTOR;
        const DIGIT_GAP = 20; // Gap between digits for two-digit numbers
        
        if (day < 10) {
            // Single digit: center it, use uniform scale
            const numberData = numbers[day];
            if (numberData) {
                const bounds = getNumberBounds(numberData);
                
                // Center the scaled number
                const offsetX = centerX - (bounds.minX + bounds.maxX) / 2 * numberScale;
                const offsetY = centerY - (bounds.minY + bounds.maxY) / 2 * numberScale;
                
                pageCtx.save();
                pageCtx.scale(numberScale, numberScale);
                renderNumberDesign(pageCtx, numberData, offsetX / numberScale, offsetY / numberScale);
                pageCtx.restore();
            }
        } else {
            // Two digits: each digit uses uniform scale, position them next to each other, with gap
            const dayStr = String(day);
        const digit1 = parseInt(dayStr[0]);
        const digit2 = parseInt(dayStr[1]);
        
            const numberData1 = numbers[digit1];
            const numberData2 = numbers[digit2];
            
            if (numberData1 && numberData2) {
                const bounds1 = getNumberBounds(numberData1);
                const bounds2 = getNumberBounds(numberData2);
                
                // Calculate positions for both digits (centered, with gap)
                const scaledWidth1 = bounds1.width * numberScale;
                const scaledWidth2 = bounds2.width * numberScale;
                const totalScaledWidth = scaledWidth1 + scaledWidth2 + DIGIT_GAP;
                
                // Position first digit (left)
                const offsetX1 = centerX - totalScaledWidth / 2 - bounds1.minX * numberScale;
                const offsetY1 = centerY - (bounds1.minY + bounds1.maxY) / 2 * numberScale;
                
                // Position second digit (right, with gap after first)
                const offsetX2 = centerX - totalScaledWidth / 2 + scaledWidth1 + DIGIT_GAP - bounds2.minX * numberScale;
                const offsetY2 = centerY - (bounds2.minY + bounds2.maxY) / 2 * numberScale;
                
                // Render first digit
                pageCtx.save();
                pageCtx.scale(numberScale, numberScale);
                renderNumberDesign(pageCtx, numberData1, offsetX1 / numberScale, offsetY1 / numberScale);
                pageCtx.restore();
                
                // Render second digit
                pageCtx.save();
                pageCtx.scale(numberScale, numberScale);
                renderNumberDesign(pageCtx, numberData2, offsetX2 / numberScale, offsetY2 / numberScale);
                pageCtx.restore();
            }
        }
        
        const dayStr = day.toString();
        
        pageCtx.save();
        pageCtx.fillStyle = '#000';
        pageCtx.font = '18px Lausanne, Helvetica, Arial, sans-serif';
        pageCtx.textAlign = 'left';
        pageCtx.textBaseline = 'bottom';
        pageCtx.fillText(dayStr, 20, pageCanvas.height - 20);
        pageCtx.restore();
        
        page.appendChild(pageCanvas);
        grid.appendChild(page);
    }
}

async function exportCalendarPDF() {
    // Check if jsPDF is available
    if (typeof window.jspdf === 'undefined') {
        alert('PDF-Bibliothek nicht geladen. Bitte Seite neu laden.');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    
    // Get correct number of days in month
    const daysInMonth = getDaysInMonth(currentMonth, 2026);
    
    // A5 format dimensions in mm: 148 x 210
    // A5 format in pixels at 96 DPI: ~559 x 794
    // Original canvas size: 700 x 1050
    // Scale factor to fit A5: min(559/700, 794/1050) ≈ 0.756
    const A5_WIDTH_MM = 148;
    const A5_HEIGHT_MM = 210;
    const ORIGINAL_WIDTH = 700;
    const ORIGINAL_HEIGHT = 1050;
    
    // Calculate scale to fit original content into A5
    const scaleX = A5_WIDTH_MM / (ORIGINAL_WIDTH * 0.264583); // Convert px to mm (96 DPI)
    const scaleY = A5_HEIGHT_MM / (ORIGINAL_HEIGHT * 0.264583);
    const scaleFactor = Math.min(scaleX, scaleY); // Use smaller scale to fit both dimensions
    
    // Create PDF document in A5 format
    const pdf = new jsPDF({
        unit: 'mm',
        format: 'a5',
        orientation: 'portrait'
    });
    
    // Clear caches before export to free memory
    circleRingCache.clear();
    if (window.brickCache) {
        window.brickCache.clear();
    }
    
    // Process pages in chunks to avoid blocking UI
    const CHUNK_SIZE = 3; // Process 3 pages at a time
    let currentDay = 1;
    
    const processChunk = async () => {
        const endDay = Math.min(currentDay + CHUNK_SIZE - 1, daysInMonth);
        
        for (let day = currentDay; day <= endDay; day++) {
        // Create canvas for this page with optimized resolution
        // 2x resolution for good quality and faster export
        const scale = 2; // 2x resolution for good quality
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = ORIGINAL_WIDTH * scale;
        pageCanvas.height = ORIGINAL_HEIGHT * scale;
        const pageCtx = pageCanvas.getContext('2d');
        
        // Enable better text rendering
        pageCtx.textRenderingOptimization = 'optimizeQuality';
        pageCtx.imageSmoothingEnabled = true;
        pageCtx.imageSmoothingQuality = 'high';
        
        // Scale context for higher resolution
        pageCtx.scale(scale, scale);
        
        // Fill white background
        pageCtx.fillStyle = '#fff';
        pageCtx.fillRect(0, 0, ORIGINAL_WIDTH, ORIGINAL_HEIGHT);
        
        
        pageCtx.save();
        pageCtx.fillStyle = '#000';
        pageCtx.font = '18px Lausanne, Helvetica, Arial, sans-serif';
        pageCtx.textAlign = 'left';
        pageCtx.textBaseline = 'top';
        pageCtx.fillText('2026', 10, 10); // Closer to corner (was 20, 20)
        pageCtx.restore();
        
        pageCtx.save();
        pageCtx.fillStyle = '#000';
        pageCtx.font = '18px Lausanne, Helvetica, Arial, sans-serif';
        pageCtx.textAlign = 'right';
        pageCtx.textBaseline = 'top';
        pageCtx.fillText(monthNames[currentMonth], ORIGINAL_WIDTH - 10, 10);
        pageCtx.restore();
        
        // Get the number design(s) to use for this day
        // For days 1-9: use single digit (not "01" but "1")
        // For days 10-31: combine two digits
        const canvasWidth = ORIGINAL_WIDTH;
        const canvasHeight = ORIGINAL_HEIGHT;
        const centerX = canvasWidth / 2;
        const centerY = canvasHeight / 2;
        
        // Use uniform scale like clock (same scale for all digits, maintains aspect ratio)
        const uniformScale = getClockUniformScale();
        const CALENDAR_SCALE_FACTOR = 0.5; // Scale factor to make calendar numbers smaller than clock
        const numberScale = uniformScale * CALENDAR_SCALE_FACTOR;
        const DIGIT_GAP = 20; // Gap between digits for two-digit numbers
        
        if (day < 10) {
            // Single digit: center it, use uniform scale
            const numberData = numbers[day];
            if (numberData) {
                const bounds = getNumberBounds(numberData);
                
                // Center the scaled number
                const offsetX = centerX - (bounds.minX + bounds.maxX) / 2 * numberScale;
                const offsetY = centerY - (bounds.minY + bounds.maxY) / 2 * numberScale;
                
                pageCtx.save();
                pageCtx.scale(numberScale, numberScale);
                renderNumberDesign(pageCtx, numberData, offsetX / numberScale, offsetY / numberScale);
                pageCtx.restore();
            }
        } else {
            // Two digits: each digit uses uniform scale, position them next to each other, with gap
            const dayStr = String(day);
        const digit1 = parseInt(dayStr[0]);
        const digit2 = parseInt(dayStr[1]);
        
            const numberData1 = numbers[digit1];
            const numberData2 = numbers[digit2];
            
            if (numberData1 && numberData2) {
                const bounds1 = getNumberBounds(numberData1);
                const bounds2 = getNumberBounds(numberData2);
                
                // Calculate positions for both digits (centered, with gap)
                const scaledWidth1 = bounds1.width * numberScale;
                const scaledWidth2 = bounds2.width * numberScale;
                const totalScaledWidth = scaledWidth1 + scaledWidth2 + DIGIT_GAP;
                
                // Position first digit (left)
                const offsetX1 = centerX - totalScaledWidth / 2 - bounds1.minX * numberScale;
                const offsetY1 = centerY - (bounds1.minY + bounds1.maxY) / 2 * numberScale;
                
                // Position second digit (right, with gap after first)
                const offsetX2 = centerX - totalScaledWidth / 2 + scaledWidth1 + DIGIT_GAP - bounds2.minX * numberScale;
                const offsetY2 = centerY - (bounds2.minY + bounds2.maxY) / 2 * numberScale;
                
                // Render first digit
                pageCtx.save();
                pageCtx.scale(numberScale, numberScale);
                renderNumberDesign(pageCtx, numberData1, offsetX1 / numberScale, offsetY1 / numberScale);
                pageCtx.restore();
                
                // Render second digit
                pageCtx.save();
                pageCtx.scale(numberScale, numberScale);
                renderNumberDesign(pageCtx, numberData2, offsetX2 / numberScale, offsetY2 / numberScale);
                pageCtx.restore();
            }
        }
        
        const dayStr = day.toString();
        
        pageCtx.save();
        pageCtx.fillStyle = '#000';
        pageCtx.font = '18px Lausanne, Helvetica, Arial, sans-serif';
        pageCtx.textAlign = 'left';
        pageCtx.textBaseline = 'bottom';
        pageCtx.fillText(dayStr, 10, ORIGINAL_HEIGHT - 10);
        pageCtx.restore();
        
            // Convert canvas to image data URL
            // Use PNG to preserve transparency (required for circles and brick holes)
            const imgData = pageCanvas.toDataURL('image/png');
            
            // Add page to PDF (except for first page which is already created)
            if (day > 1) {
                pdf.addPage('a5', 'portrait');
            }
            
            // Calculate scaled dimensions for A5 (in mm)
            const scaledWidth = ORIGINAL_WIDTH * scaleFactor * 0.264583; // Convert to mm
            const scaledHeight = ORIGINAL_HEIGHT * scaleFactor * 0.264583; // Convert to mm
            
            // Center the image on A5 page
            const offsetX = (A5_WIDTH_MM - scaledWidth) / 2;
            const offsetY = (A5_HEIGHT_MM - scaledHeight) / 2;
            
            // Add image to PDF page with scaled dimensions, use PNG format to preserve transparency
            pdf.addImage(imgData, 'PNG', offsetX, offsetY, scaledWidth, scaledHeight, undefined, 'SLOW');
        }
        
        currentDay = endDay + 1;
        
        // If there are more pages, process next chunk after a short delay
        if (currentDay <= daysInMonth) {
            // Use setTimeout to allow UI to update between chunks
            await new Promise(resolve => setTimeout(resolve, 10));
            await processChunk();
        } else {
            // All pages processed, save PDF
            try {
                pdf.save(`calendar-2026-${monthNames[currentMonth]}.pdf`);
            } catch (error) {
                console.error('PDF export error:', error);
                alert('Fehler beim Exportieren des PDFs: ' + error.message);
            }
        }
    };
    
    // Start processing
    await processChunk();
}

// Clock functionality
let clockInterval = null;

function initClock() {
    // Clear any existing interval
    if (clockInterval) {
        clearInterval(clockInterval);
    }
    
    // Update clock immediately
    updateClock();
    
    // Update clock every minute
    clockInterval = setInterval(updateClock, 60000);
}

function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    // Format as HH:MM (4 digits)
    const hourStr = String(hours).padStart(2, '0');
    const minuteStr = String(minutes).padStart(2, '0');
    
    const clockDisplay = document.getElementById('clockDisplay');
    clockDisplay.innerHTML = '';
    
    // Create container for clock numbers
    const clockNumbersContainer = document.createElement('div');
    clockNumbersContainer.className = 'clock-numbers-container';
    
    // Render hours as two-digit number (close together, no gap)
    const hoursContainer = document.createElement('div');
    hoursContainer.className = 'clock-two-digit';
    hoursContainer.style.display = 'flex';
    hoursContainer.style.alignItems = 'center';
    hoursContainer.style.gap = '0'; // No gap between digits
    renderTwoDigits(parseInt(hourStr[0]), parseInt(hourStr[1]), hoursContainer);
    clockNumbersContainer.appendChild(hoursContainer);
    
    // Add colon between hours and minutes (two stones stacked vertically with gap)
    const colon = renderClockColon();
    clockNumbersContainer.appendChild(colon);
    
    // Render minutes as two-digit number (close together, no gap)
    const minutesContainer = document.createElement('div');
    minutesContainer.className = 'clock-two-digit';
    minutesContainer.style.display = 'flex';
    minutesContainer.style.alignItems = 'center';
    minutesContainer.style.gap = '0'; // No gap between digits
    renderTwoDigits(parseInt(minuteStr[0]), parseInt(minuteStr[1]), minutesContainer);
    clockNumbersContainer.appendChild(minutesContainer);
    
    clockDisplay.appendChild(clockNumbersContainer);
}

const CLOCK_SCALE_FACTOR = 1.15; // Global scale factor for clock digits (1.0 = original)
const CLOCK_REFERENCE_SIZE = 700; // Reference size for consistent scaling (matches Step 2 canvas width)

// Calculate the maximum dimension across all digits (0-9) for uniform scaling
function getMaxDigitDimension() {
    let maxDimension = 0;
    
    for (let i = 0; i <= 9; i++) {
        const numberData = numbers[i];
        if (numberData) {
            const bounds = getNumberBounds(numberData);
            const dimension = Math.max(bounds.width, bounds.height);
            maxDimension = Math.max(maxDimension, dimension);
        }
    }
    
    return maxDimension || CLOCK_REFERENCE_SIZE; // Fallback to reference size if no data
}

// Get uniform scale for all clock digits
function getClockUniformScale() {
    const maxDimension = getMaxDigitDimension();
    const baseScale = CLOCK_REFERENCE_SIZE / maxDimension;
    return baseScale * CLOCK_SCALE_FACTOR;
}

// Render two digits next to each other with no gap
function renderTwoDigits(digit1, digit2, container) {
    const numberData1 = numbers[digit1];
    const numberData2 = numbers[digit2];
    
    if (!numberData1 || !numberData2) {
        // Fallback: render individual digits
        renderClockDigit(digit1, container);
        renderClockDigit(digit2, container);
        return;
    }
    
    // Calculate bounds for both digits
    const bounds1 = getNumberBounds(numberData1);
    const bounds2 = getNumberBounds(numberData2);
    
    // Use uniform scale for all digits (same scale for all)
    const scale = getClockUniformScale();
    
    // Calculate total width and positioning with uniform scale
    const totalWidth = bounds1.width + bounds2.width;
    const maxHeight = Math.max(bounds1.height, bounds2.height);
    
    // Calculate required SVG size based on scaled dimensions (with padding)
    const scaledWidth = totalWidth * scale;
    const scaledHeight = maxHeight * scale;
    const padding = 100;
    const svgSize = Math.max(Math.max(scaledWidth, scaledHeight) + padding * 2, 800); // Minimum 800px
    
    // Create SVG element instead of canvas
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.className = 'clock-digit-canvas';
    svg.setAttribute('width', svgSize);
    svg.setAttribute('height', svgSize);
    svg.setAttribute('viewBox', `0 0 ${svgSize} ${svgSize}`);
    
    const centerX = svgSize / 2;
    const centerY = svgSize / 2;
    
    // Position first digit (left)
    const offsetX1 = centerX - (totalWidth * scale) / 2 - bounds1.minX * scale;
    const offsetY1 = centerY - (bounds1.minY + bounds1.maxY) / 2 * scale;
    
    // Position second digit (right, directly next to first, no gap)
    const offsetX2 = centerX - (totalWidth * scale) / 2 + bounds1.width * scale - bounds2.minX * scale;
    const offsetY2 = centerY - (bounds2.minY + bounds2.maxY) / 2 * scale;
    
    // Draw materials first (behind stones) - sort by baseOffset like in Step 2
    const sortedMaterials1 = numberData1.materials ? [...numberData1.materials].sort((a, b) => {
        const offsetA = a.baseOffset !== undefined ? a.baseOffset : -Infinity;
        const offsetB = b.baseOffset !== undefined ? b.baseOffset : -Infinity;
        return offsetB - offsetA; // Absteigend sortieren (größte zuerst)
    }) : [];
    
    const sortedMaterials2 = numberData2.materials ? [...numberData2.materials].sort((a, b) => {
        const offsetA = a.baseOffset !== undefined ? a.baseOffset : -Infinity;
        const offsetB = b.baseOffset !== undefined ? b.baseOffset : -Infinity;
        return offsetB - offsetA; // Absteigend sortieren (größte zuerst)
    }) : [];
    
    // Draw materials for first digit (behind stones) as SVG
    sortedMaterials1.forEach(material => {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('transform', `translate(${offsetX1 + material.x * scale}, ${offsetY1 + material.y * scale}) rotate(${material.rotation}) scale(${scale})`);
        if (material.alpha !== undefined) {
            group.setAttribute('opacity', String(material.alpha));
        }
        
        const materialColor = material.color || MATERIAL_DEFAULT_COLORS[material.type] || '#000000';
        
        switch (material.type) {
            case 'circles':
                drawCirclesPattern(group, material.size, materialColor);
                break;
            case 'grid':
                drawGridPattern(group, material.size, materialColor);
                break;
            case 'brick': {
                const brickShape = generateBrickShape(material.size);
                const width = Math.abs(brickShape[1].x - brickShape[0].x);
                const height = Math.abs(brickShape[2].y - brickShape[1].y);
                
                const circleRadius = Math.min(width, height) * 0.18;
                const spacingX = width * 0.5;
                const spacingY = height * 0.5;
                
                const centerX = (brickShape[0].x + brickShape[1].x + brickShape[2].x + brickShape[3].x) / 4;
                const centerY = (brickShape[0].y + brickShape[1].y + brickShape[2].y + brickShape[3].y) / 4;
                
                let brickPathData = `M ${brickShape[0].x} ${brickShape[0].y} `;
                brickPathData += `L ${brickShape[1].x} ${brickShape[1].y} `;
                brickPathData += `L ${brickShape[2].x} ${brickShape[2].y} `;
                brickPathData += `L ${brickShape[3].x} ${brickShape[3].y} `;
                brickPathData += 'Z';
                
                for (let row = 0; row < 2; row++) {
                    for (let col = 0; col < 2; col++) {
                        const circleX = centerX + (col - 0.5) * spacingX;
                        const circleY = centerY + (row - 0.5) * spacingY;
                        const numPoints = 16;
                        const angleStep = (Math.PI * 2) / numPoints;
                        brickPathData += ` M ${circleX + circleRadius} ${circleY}`;
                        for (let i = 1; i <= numPoints; i++) {
                            const angle = i * angleStep;
                            const x = circleX + Math.cos(angle) * circleRadius;
                            const y = circleY + Math.sin(angle) * circleRadius;
                            brickPathData += ` L ${x} ${y}`;
                        }
                        brickPathData += ' Z';
                    }
                }
                
                const brickPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                brickPath.setAttribute('d', brickPathData);
                brickPath.setAttribute('fill', materialColor);
                brickPath.setAttribute('fill-rule', 'evenodd');
                group.appendChild(brickPath);
                break;
            }
            case 'lines':
                drawLinesPattern(group, material.size, materialColor);
                break;
        }
        
        svg.appendChild(group);
    });
    
    // Draw materials for second digit (behind stones) as SVG
    sortedMaterials2.forEach(material => {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('transform', `translate(${offsetX2 + material.x * scale}, ${offsetY2 + material.y * scale}) rotate(${material.rotation}) scale(${scale})`);
        if (material.alpha !== undefined) {
            group.setAttribute('opacity', String(material.alpha));
        }
        
        const materialColor = material.color || MATERIAL_DEFAULT_COLORS[material.type] || '#000000';
        
        switch (material.type) {
            case 'circles':
                drawCirclesPattern(group, material.size, materialColor);
                break;
            case 'grid':
                drawGridPattern(group, material.size, materialColor);
                break;
            case 'brick': {
                const brickShape = generateBrickShape(material.size);
                const width = Math.abs(brickShape[1].x - brickShape[0].x);
                const height = Math.abs(brickShape[2].y - brickShape[1].y);
                
                const circleRadius = Math.min(width, height) * 0.18;
                const spacingX = width * 0.5;
                const spacingY = height * 0.5;
                
                const centerX = (brickShape[0].x + brickShape[1].x + brickShape[2].x + brickShape[3].x) / 4;
                const centerY = (brickShape[0].y + brickShape[1].y + brickShape[2].y + brickShape[3].y) / 4;
                
                let brickPathData = `M ${brickShape[0].x} ${brickShape[0].y} `;
                brickPathData += `L ${brickShape[1].x} ${brickShape[1].y} `;
                brickPathData += `L ${brickShape[2].x} ${brickShape[2].y} `;
                brickPathData += `L ${brickShape[3].x} ${brickShape[3].y} `;
                brickPathData += 'Z';
                
                for (let row = 0; row < 2; row++) {
                    for (let col = 0; col < 2; col++) {
                        const circleX = centerX + (col - 0.5) * spacingX;
                        const circleY = centerY + (row - 0.5) * spacingY;
                        const numPoints = 16;
                        const angleStep = (Math.PI * 2) / numPoints;
                        brickPathData += ` M ${circleX + circleRadius} ${circleY}`;
                        for (let i = 1; i <= numPoints; i++) {
                            const angle = i * angleStep;
                            const x = circleX + Math.cos(angle) * circleRadius;
                            const y = circleY + Math.sin(angle) * circleRadius;
                            brickPathData += ` L ${x} ${y}`;
                        }
                        brickPathData += ' Z';
                    }
                }
                
                const brickPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                brickPath.setAttribute('d', brickPathData);
                brickPath.setAttribute('fill', materialColor);
                brickPath.setAttribute('fill-rule', 'evenodd');
                group.appendChild(brickPath);
                break;
            }
            case 'lines':
                drawLinesPattern(group, material.size, materialColor);
                break;
        }
        
        svg.appendChild(group);
    });
    
    // Draw stones on top as SVG - invert color if needed
    if (numberData1.stones && numberData1.stones.length > 0) {
        numberData1.stones.forEach(stone => {
            const copies = Math.max(1, stackLevel);
            for (let j = 0; j < copies; j++) {
                const offset = j * 3;
                const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                group.setAttribute('transform', `translate(${offsetX1 + (stone.x + offset) * scale}, ${offsetY1 + (stone.y + offset) * scale}) rotate(${stone.rotation}) scale(${scale})`);
                
                if (blendLevel > 0) {
                    group.setAttribute('style', 'mix-blend-mode: multiply;');
                }
                
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                const pathData = generateSVGPath(stone.shape);
                path.setAttribute('d', pathData);
                const stoneColor = clockInverted && stone.color === '#ffffff' ? '#000000' : stone.color;
                path.setAttribute('fill', stoneColor);
                
                group.appendChild(path);
                svg.appendChild(group);
            }
        });
    }
    
    if (numberData2.stones && numberData2.stones.length > 0) {
        numberData2.stones.forEach(stone => {
            const copies = Math.max(1, stackLevel);
            for (let j = 0; j < copies; j++) {
                const offset = j * 3;
                const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                group.setAttribute('transform', `translate(${offsetX2 + (stone.x + offset) * scale}, ${offsetY2 + (stone.y + offset) * scale}) rotate(${stone.rotation}) scale(${scale})`);
                
                if (blendLevel > 0) {
                    group.setAttribute('style', 'mix-blend-mode: multiply;');
                }
                
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                const pathData = generateSVGPath(stone.shape);
                path.setAttribute('d', pathData);
                const stoneColor = clockInverted && stone.color === '#ffffff' ? '#000000' : stone.color;
                path.setAttribute('fill', stoneColor);
                
                group.appendChild(path);
                svg.appendChild(group);
            }
        });
    }
    
    const digitContainer = document.createElement('div');
    digitContainer.className = 'clock-digit';
    digitContainer.appendChild(svg);
    container.appendChild(digitContainer);
}

function renderClockDigit(digit, container) {
    const digitContainer = document.createElement('div');
    digitContainer.className = 'clock-digit';
    
    // Get the number design from Step 2
    const numberData = numbers[digit];
    
    // Create SVG element instead of canvas
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.className = 'clock-digit-canvas';
    
    if (numberData && ((numberData.stones && numberData.stones.length > 0) || (numberData.materials && numberData.materials.length > 0))) {
        // Calculate scale to fit the design
        // Find the bounds of the design (including both stones and materials)
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        
        if (numberData.stones && numberData.stones.length > 0) {
            numberData.stones.forEach(stone => {
                stone.shape.forEach(point => {
                    const x = stone.x + point.x;
                    const y = stone.y + point.y;
                    minX = Math.min(minX, x);
                    maxX = Math.max(maxX, x);
                    minY = Math.min(minY, y);
                    maxY = Math.max(maxY, y);
                });
            });
        }
        
        if (numberData.materials && numberData.materials.length > 0) {
            numberData.materials.forEach(material => {
                // Approximate bounds for materials
                const materialSize = material.size;
                minX = Math.min(minX, material.x - materialSize / 2);
                maxX = Math.max(maxX, material.x + materialSize / 2);
                minY = Math.min(minY, material.y - materialSize / 2);
                maxY = Math.max(maxY, material.y + materialSize / 2);
            });
        }
        
        const designWidth = maxX - minX;
        const designHeight = maxY - minY;
        const designCenterX = (minX + maxX) / 2;
        const designCenterY = (minY + maxY) / 2;
        
        // Use uniform scale for all digits (same scale for all)
        const scale = getClockUniformScale();
        
        // Calculate required SVG size based on scaled dimensions (with padding)
        const scaledWidth = designWidth * scale;
        const scaledHeight = designHeight * scale;
        const padding = 100;
        const svgSize = Math.max(Math.max(scaledWidth, scaledHeight) + padding * 2, 800); // Minimum 800px
        
        svg.setAttribute('width', svgSize);
        svg.setAttribute('height', svgSize);
        svg.setAttribute('viewBox', `0 0 ${svgSize} ${svgSize}`);
        
        // Center offset
        const offsetX = svgSize / 2 - designCenterX * scale;
        const offsetY = svgSize / 2 - designCenterY * scale;
        
        const sortedMaterials = numberData.materials ? [...numberData.materials].sort((a, b) => {
            const offsetA = a.baseOffset !== undefined ? a.baseOffset : -Infinity;
            const offsetB = b.baseOffset !== undefined ? b.baseOffset : -Infinity;
            return offsetB - offsetA; // Absteigend sortieren (größte zuerst)
        }) : [];
        
        sortedMaterials.forEach(material => {
            const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            group.setAttribute('transform', `translate(${offsetX + material.x * scale}, ${offsetY + material.y * scale}) rotate(${material.rotation}) scale(${scale})`);
            if (material.alpha !== undefined) {
                group.setAttribute('opacity', String(material.alpha));
            }
            
            const materialColor = material.color || MATERIAL_DEFAULT_COLORS[material.type] || '#000000';
            
            switch (material.type) {
                case 'circles':
                    drawCirclesPattern(group, material.size, materialColor);
                    break;
                case 'grid':
                    drawGridPattern(group, material.size, materialColor);
                    break;
                case 'brick': {
                    const brickShape = generateBrickShape(material.size);
                    const width = Math.abs(brickShape[1].x - brickShape[0].x);
                    const height = Math.abs(brickShape[2].y - brickShape[1].y);
                    
                    const circleRadius = Math.min(width, height) * 0.18;
                    const spacingX = width * 0.5;
                    const spacingY = height * 0.5;
                    
                    const centerX = (brickShape[0].x + brickShape[1].x + brickShape[2].x + brickShape[3].x) / 4;
                    const centerY = (brickShape[0].y + brickShape[1].y + brickShape[2].y + brickShape[3].y) / 4;
                    
                    let brickPathData = `M ${brickShape[0].x} ${brickShape[0].y} `;
                    brickPathData += `L ${brickShape[1].x} ${brickShape[1].y} `;
                    brickPathData += `L ${brickShape[2].x} ${brickShape[2].y} `;
                    brickPathData += `L ${brickShape[3].x} ${brickShape[3].y} `;
                    brickPathData += 'Z';
                    
                    for (let row = 0; row < 2; row++) {
                        for (let col = 0; col < 2; col++) {
                            const circleX = centerX + (col - 0.5) * spacingX;
                            const circleY = centerY + (row - 0.5) * spacingY;
                            const numPoints = 16;
                            const angleStep = (Math.PI * 2) / numPoints;
                            brickPathData += ` M ${circleX + circleRadius} ${circleY}`;
                            for (let i = 1; i <= numPoints; i++) {
                                const angle = i * angleStep;
                                const x = circleX + Math.cos(angle) * circleRadius;
                                const y = circleY + Math.sin(angle) * circleRadius;
                                brickPathData += ` L ${x} ${y}`;
                            }
                            brickPathData += ' Z';
                        }
                    }
                    
                    const brickPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    brickPath.setAttribute('d', brickPathData);
                    brickPath.setAttribute('fill', materialColor);
                    brickPath.setAttribute('fill-rule', 'evenodd');
                    group.appendChild(brickPath);
                    break;
                }
                case 'lines':
                    drawLinesPattern(group, material.size, materialColor);
                    break;
            }
            
            svg.appendChild(group);
        });
        
        if (numberData.stones && numberData.stones.length > 0) {
            numberData.stones.forEach(stone => {
                const copies = Math.max(1, stackLevel);
                for (let j = 0; j < copies; j++) {
                    const offset = j * 3;
                    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                    group.setAttribute('transform', `translate(${offsetX + (stone.x + offset) * scale}, ${offsetY + (stone.y + offset) * scale}) rotate(${stone.rotation}) scale(${scale})`);
                    
                    if (blendLevel > 0) {
                        group.setAttribute('style', 'mix-blend-mode: multiply;');
                    }
                    
                    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    const pathData = generateSVGPath(stone.shape);
                    path.setAttribute('d', pathData);
                    const stoneColor = clockInverted && stone.color === '#ffffff' ? '#000000' : stone.color;
                    path.setAttribute('fill', stoneColor);
                    
                    group.appendChild(path);
                    svg.appendChild(group);
                }
            });
        }
    } else {
        // If no design exists, use default SVG size
        const svgSize = 800;
        svg.setAttribute('width', svgSize);
        svg.setAttribute('height', svgSize);
        svg.setAttribute('viewBox', `0 0 ${svgSize} ${svgSize}`);
        
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', svgSize / 2);
        text.setAttribute('y', svgSize / 2);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('font-family', 'Lausanne, Helvetica, Arial, sans-serif');
        text.setAttribute('font-size', '300');
        text.setAttribute('fill', '#d0d0d0');
        text.textContent = digit.toString();
        svg.appendChild(text);
    }
    
    digitContainer.appendChild(svg);
    container.appendChild(digitContainer);
}

// Render clock colon as two stones stacked vertically with gap
function renderClockColon() {
    const colonContainer = document.createElement('div');
    colonContainer.className = 'clock-colon';
    colonContainer.style.display = 'flex';
    colonContainer.style.flexDirection = 'column';
    colonContainer.style.alignItems = 'center';
    colonContainer.style.justifyContent = 'center';
    
    // Fixed stone size for colon (absolute, not scaled)
    const stoneSize = 450;
    const gap = 320; // Gap between stones
    
    // Calculate dimensions (no scaling)
    const totalHeight = stoneSize * 2 + gap;
    const svgSize = Math.max(stoneSize * 2, totalHeight) + 100; // Add padding
    
    // Create SVG element instead of canvas
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.className = 'clock-digit-canvas';
    svg.setAttribute('width', svgSize);
    svg.setAttribute('height', svgSize);
    svg.setAttribute('viewBox', `0 0 ${svgSize} ${svgSize}`);
    
    // Generate stone shapes
    const topStoneShape = generateStoneShape(stoneSize);
    const bottomStoneShape = generateStoneShape(stoneSize);
    
    // Calculate positions (centered horizontally, stacked vertically with gap)
    const centerX = svgSize / 2;
    const topY = svgSize / 2 - gap / 1;
    const bottomY = svgSize / 2 + gap / 2;
    
    // Stone color
    const stoneColor = clockInverted ? '#ffffff' : getStoneColor();
    
    // Draw top stone as SVG (no scaling, fixed size)
    const topGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    topGroup.setAttribute('transform', `translate(${centerX}, ${topY})`);
    
    if (blendLevel > 0) {
        topGroup.setAttribute('style', 'mix-blend-mode: multiply;');
    }
    
    const topPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const topPathData = generateSVGPath(topStoneShape);
    topPath.setAttribute('d', topPathData);
    topPath.setAttribute('fill', stoneColor);
    topGroup.appendChild(topPath);
    svg.appendChild(topGroup);
    
    // Draw bottom stone as SVG (no scaling, fixed size)
    const bottomGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    bottomGroup.setAttribute('transform', `translate(${centerX}, ${bottomY})`);
    
    if (blendLevel > 0) {
        bottomGroup.setAttribute('style', 'mix-blend-mode: multiply;');
    }
    
    const bottomPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const bottomPathData = generateSVGPath(bottomStoneShape);
    bottomPath.setAttribute('d', bottomPathData);
    bottomPath.setAttribute('fill', stoneColor);
    bottomGroup.appendChild(bottomPath);
    svg.appendChild(bottomGroup);
    
    colonContainer.appendChild(svg);
    return colonContainer;
}

// Clock invert functionality
let clockInverted = false;

// Toggle fullscreen mode for clock
function toggleClockFullscreen() {
    const clockView = document.getElementById('clockView');
    const fullscreenButton = document.getElementById('clockFullscreenButton');
    
    if (!clockView) return;
    
    // Check if currently in fullscreen
    const isFullscreen = clockView.classList.contains('fullscreen');
    
    if (isFullscreen) {
        // Exit fullscreen
        clockView.classList.remove('fullscreen');
        
        // Try to exit browser fullscreen if active
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        
        // Update button icon (expand icon)
        if (fullscreenButton) {
            fullscreenButton.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                </svg>
            `;
        }
    } else {
        // Enter fullscreen
        clockView.classList.add('fullscreen');
        
        // Try to enter browser fullscreen
        const element = clockView;
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
        
        // Update button icon (compress icon)
        if (fullscreenButton) {
            fullscreenButton.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
                </svg>
            `;
        }
    }
    
    // Re-render clock to adjust to new size
    setTimeout(() => {
        updateClock();
    }, 100);
}

// Handle browser fullscreen change events
document.addEventListener('fullscreenchange', () => {
    const clockView = document.getElementById('clockView');
    const fullscreenButton = document.getElementById('clockFullscreenButton');
    const cursor = document.getElementById('customCursor');
    
    if (!clockView) return;
    
    const isFullscreen = document.fullscreenElement === clockView || 
                        document.webkitFullscreenElement === clockView ||
                        document.msFullscreenElement === clockView;
    
    // Move cursor to fullscreen element or back to body
    if (isFullscreen && cursor && clockView) {
        if (!clockView.contains(cursor)) {
            clockView.appendChild(cursor);
        }
    } else if (cursor && cursor.parentElement !== document.body) {
        document.body.appendChild(cursor);
    }
    
    if (!isFullscreen && clockView.classList.contains('fullscreen')) {
        clockView.classList.remove('fullscreen');
        if (fullscreenButton) {
            fullscreenButton.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                </svg>
            `;
        }
    }
});

document.addEventListener('webkitfullscreenchange', () => {
    const clockView = document.getElementById('clockView');
    const fullscreenButton = document.getElementById('clockFullscreenButton');
    const cursor = document.getElementById('customCursor');
    
    if (!clockView) return;
    
    const isFullscreen = document.webkitFullscreenElement === clockView;
    
    // Move cursor to fullscreen element or back to body
    if (isFullscreen && cursor && clockView) {
        if (!clockView.contains(cursor)) {
            clockView.appendChild(cursor);
        }
    } else if (cursor && cursor.parentElement !== document.body) {
        document.body.appendChild(cursor);
    }
    
    if (!isFullscreen && clockView.classList.contains('fullscreen')) {
        clockView.classList.remove('fullscreen');
        if (fullscreenButton) {
            fullscreenButton.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                </svg>
            `;
        }
    }
});

function toggleClockInvert() {
    clockInverted = !clockInverted;
    const clockView = document.getElementById('clockView');

        if (clockInverted) {
        // Invert: black background, white stones, materials keep their color
        clockView.style.background = '#000';
        } else {
        // Normal: white background
        clockView.style.background = '#fff';
        }
    
    // Re-render clock with inverted state
    updateClock();
}

// Initialize custom cursor for Step 1 and Step 2
function initCursor() {
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');
    
    // Create custom cursor element if it doesn't exist
    let cursor = document.getElementById('customCursor');
    if (!cursor) {
        cursor = document.createElement('div');
        cursor.id = 'customCursor';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            transform: translate(-50%, -50%);
            display: none;
            background: #fff;
            mix-blend-mode: difference;
        `;
        document.body.appendChild(cursor);
    }

    // Create custom cursor label (was previously inside Step 1 and got hidden in Step 2/3)
    let label = document.getElementById('customCursorText');
    if (!label) {
        label = document.createElement('div');
        label.id = 'customCursorText';
        label.className = 'cursor-click-text';
        label.style.display = 'none';
        document.body.appendChild(label);
    }
    
    // Create animated drill text container for Step 1
    let drillTextContainer = document.getElementById('drillTextContainer');
    if (!drillTextContainer) {
        drillTextContainer = document.createElement('div');
        drillTextContainer.id = 'drillTextContainer';
        drillTextContainer.className = 'drill-text-container';
        drillTextContainer.style.cssText = `
            position: fixed;
            pointer-events: none;
            z-index: 10001;
            display: none;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        `;
        document.body.appendChild(drillTextContainer);
        
        // Create individual letter elements for "drill"
        const drillLetters = ['d', 'r', 'i', 'l', 'l'];
        drillLetters.forEach((letter, index) => {
            const letterEl = document.createElement('span');
            letterEl.className = 'drill-letter';
            letterEl.textContent = letter;
            letterEl.style.cssText = `
                position: absolute;
                font-size: 14px;
                font-family: 'Lausanne', Helvetica, Arial, sans-serif;
                color: #000;
                mix-blend-mode: difference;
                transform-origin: center center;
                white-space: nowrap;
            `;
            drillTextContainer.appendChild(letterEl);
        });
        
        console.log('Drill text container created with', drillLetters.length, 'letters');
    }
    
    // Animation state for drill text
    let drillAnimationAngle = 0;
    let drillAnimationFrame = null;
    let drillCursorX = 0;
    let drillCursorY = 0;
    let isDrillAnimationRunning = false;
    
    // Function to start/update drill text animation
    function startDrillTextAnimation(cursorX, cursorY) {
        drillCursorX = cursorX;
        drillCursorY = cursorY;
        
        // Make sure container is visible
        if (drillTextContainer) {
            drillTextContainer.style.display = 'block';
        }
        
        if (isDrillAnimationRunning) {
            return; // Animation already running
        }
        
        isDrillAnimationRunning = true;
        const radius = 35; // Radius of the circle
        const letters = drillTextContainer.querySelectorAll('.drill-letter');
        const totalLetters = letters.length;
        
        const totalArcSpan = Math.PI * 0.3;
        const letterSpacing = totalArcSpan / (totalLetters - 1);
        
        console.log('Starting drill animation with', totalLetters, 'letters at', cursorX, cursorY);
        
        if (totalLetters === 0) {
            console.error('No letters found in drill text container!');
            isDrillAnimationRunning = false;
            return;
        }
        
        const animate = () => {
            if (!isDrillAnimationRunning) {
                return;
            }
            
            drillAnimationAngle += 0.02;
            if (drillAnimationAngle >= Math.PI * 2) {
                drillAnimationAngle -= Math.PI * 2;
            }
            
            letters.forEach((letter, index) => {
                // Center the letters around the current animation angle
                const letterOffset = (index - (totalLetters - 1) / 2) * letterSpacing;
                const letterAngle = drillAnimationAngle + letterOffset;
                
                // Calculate position on circle
                const x = drillCursorX + Math.cos(letterAngle) * radius;
                const y = drillCursorY + Math.sin(letterAngle) * radius;
                
                // Position the letter
                letter.style.left = x + 'px';
                letter.style.top = y + 'px';
                
                // Rotate letter so it points outward from cursor
                // At 0° (top): normal orientation
                // At 90° (right): rotated 90° clockwise
                // At 180° (bottom): rotated 180° (upside down)
                // At 270° (left): rotated 270° clockwise
                const rotationAngle = (letterAngle * 180 / Math.PI) + 90; // +90 to align with circle tangent
                letter.style.transform = `translate(-50%, -50%) rotate(${rotationAngle}deg)`;
            });
            
            drillAnimationFrame = requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    // Function to update cursor position in animation
    function updateDrillTextAnimation(cursorX, cursorY) {
        drillCursorX = cursorX;
        drillCursorY = cursorY;
        
        // Start animation if not running
        if (!isDrillAnimationRunning) {
            startDrillTextAnimation(cursorX, cursorY);
        }
    }
    
    // Function to stop drill text animation
    function stopDrillTextAnimation() {
        isDrillAnimationRunning = false;
        if (drillAnimationFrame) {
            cancelAnimationFrame(drillAnimationFrame);
            drillAnimationFrame = null;
        }
    }
    
    // Make functions globally accessible
    window.stopDrillTextAnimation = stopDrillTextAnimation;
    window.startDrillTextAnimation = startDrillTextAnimation;
    window.updateDrillTextAnimation = updateDrillTextAnimation;
    window.isDrillAnimationRunning = () => isDrillAnimationRunning;
    
    // Text behavior:
    let hoverText = null;
    window.resetCursorText = () => {
        hoverText = null;
        label.style.display = 'none';
        drillTextContainer.style.display = 'none';
        stopDrillTextAnimation();
    };
    
    // Update cursor and text position on mouse move
    function updateCursor(e) {
        const isStep1 = currentStep === 1 && step1 && step1.classList.contains('active');
        const isStep2 = currentStep === 2 && step2 && step2.classList.contains('active');
        const isStep3 = currentStep === 3 && step3 && step3.classList.contains('active');
        const clockView = document.getElementById('clockView');
        const isClockFullscreen = clockView && clockView.classList.contains('fullscreen');
        const isBrowserFullscreen = document.fullscreenElement === clockView || 
                                     document.webkitFullscreenElement === clockView ||
                                     document.msFullscreenElement === clockView;
        const isAnyFullscreen = isClockFullscreen || isBrowserFullscreen;
        
        if (isStep1 || isStep2 || isStep3 || isAnyFullscreen) {
            cursor.style.display = 'block';
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            // Ensure cursor is above fullscreen elements
            if (isAnyFullscreen) {
                cursor.style.zIndex = '10002';
                // If in browser fullscreen, move cursor to fullscreen element
                if (isBrowserFullscreen && clockView && !clockView.contains(cursor)) {
                    clockView.appendChild(cursor);
                }
            } else {
                cursor.style.zIndex = '10000';
                // Move cursor back to body if not in fullscreen
                if (cursor.parentElement !== document.body) {
                    document.body.appendChild(cursor);
                }
            }

            // Label positioning (only if visible)
            label.style.left = e.clientX + 'px';
            label.style.top = (e.clientY - 10) + 'px';

            if (isStep1) {
                // Update text based on click count: 0 = "drill" (static), 1+ = "click again" (static)
                const clickCount = window.getStep1ClickCount ? window.getStep1ClickCount() : 0;
                // Hide animation container
                drillTextContainer.style.display = 'none';
                stopDrillTextAnimation();
                
                if (clickCount >= 1) {
                    // Show static "click again" text
                    label.style.display = 'block';
                    label.textContent = 'click again';
                } else {
                    // Show static "drill" text
                    label.style.display = 'block';
                    label.textContent = 'drill';
                }
            } else if ((isStep2 || isStep3) && hoverText) {
                drillTextContainer.style.display = 'none';
                stopDrillTextAnimation();
                label.style.display = 'block';
                label.textContent = hoverText;
            } else {
                drillTextContainer.style.display = 'none';
                stopDrillTextAnimation();
                label.style.display = 'none';
            }
        } else {
            cursor.style.display = 'none';
            label.style.display = 'none';
        }
    }
    
    // Update cursor position on pointer/mouse move.
    // Use capture phase so Step 2 draw handlers calling stopPropagation() can't block the cursor.
    document.addEventListener('pointermove', updateCursor, { capture: true, passive: true });
    document.addEventListener('mousemove', updateCursor, { capture: true, passive: true });
    
    
    // Setup hover text changes for Step 2 buttons
    function setupStep2HoverTexts() {
        // Direction button
        const directionButton = document.getElementById('directionButton');
        if (directionButton) {
            directionButton.addEventListener('mouseenter', () => {
                if (currentStep === 2) hoverText = 'drilling angle';
            });
            directionButton.addEventListener('mouseleave', () => {
                if (currentStep === 2) hoverText = null;
            });
        }
        
        // Slider handle and track
        const sliderHandle = document.getElementById('sliderHandle');
        const layerSlider = document.getElementById('layerSlider');
        if (sliderHandle) {
            sliderHandle.addEventListener('mouseenter', () => {
                if (currentStep === 2) hoverText = 'drill depth';
            });
            sliderHandle.addEventListener('mouseleave', () => {
                if (currentStep === 2) hoverText = null;
            });
        }
        if (layerSlider) {
            layerSlider.addEventListener('mouseenter', () => {
                if (currentStep === 2) hoverText = 'drill depth';
            });
            layerSlider.addEventListener('mouseleave', () => {
                if (currentStep === 2) hoverText = null;
            });
        }
        
        // Color button
        const colorButton = document.getElementById('colorButton');
        if (colorButton) {
            colorButton.addEventListener('mouseenter', () => {
                if (currentStep === 2) hoverText = 'change color';
            });
            colorButton.addEventListener('mouseleave', () => {
                if (currentStep === 2) hoverText = null;
            });
        }
        
        // One view button
        const oneView = document.getElementById('oneView');
        if (oneView) {
            oneView.addEventListener('mouseenter', () => {
                if (currentStep === 2) hoverText = 'one number';
            });
            oneView.addEventListener('mouseleave', () => {
                if (currentStep === 2) hoverText = null;
            });
        }
        
        // All view button
        const allView = document.getElementById('allView');
        if (allView) {
            allView.addEventListener('mouseenter', () => {
                if (currentStep === 2) hoverText = 'all numbers';
            });
            allView.addEventListener('mouseleave', () => {
                if (currentStep === 2) hoverText = null;
            });
        }
        
        // Clear button (find by onclick attribute or text content)
        const viewOptions = document.querySelectorAll('.view-option');
        viewOptions.forEach(option => {
            const span = option.querySelector('span');
            if (span && span.textContent === 'clear') {
                option.addEventListener('mouseenter', () => {
                    if (currentStep === 2) hoverText = 'clear current number';
                });
                option.addEventListener('mouseleave', () => {
                    if (currentStep === 2) hoverText = null;
                });
            }
            if (span && span.textContent === 'new') {
                option.addEventListener('mouseenter', () => {
                    if (currentStep === 2) hoverText = 'clear all numbers';
                });
                option.addEventListener('mouseleave', () => {
                    if (currentStep === 2) hoverText = null;
                });
            }
            // PDF option (next step button)
            if (option.classList.contains('pdf-option') && option.onclick && option.onclick.toString().includes('goToStep(3)')) {
                option.addEventListener('mouseenter', () => {
                    if (currentStep === 2) hoverText = 'next step';
                });
                option.addEventListener('mouseleave', () => {
                    if (currentStep === 2) hoverText = null;
                });
            }
        });
        
        // Navigation arrows
        const navArrows = document.querySelectorAll('.nav-arrow');
        navArrows.forEach(arrow => {
            arrow.addEventListener('mouseenter', () => {
                if (currentStep === 2) hoverText = 'next number';
            });
            arrow.addEventListener('mouseleave', () => {
                if (currentStep === 2) hoverText = null;
            });
        });
    }
    
    // Setup hover texts for Step 3 (Calendar view, Selection screen, Clock view)
    function setupStep3HoverTexts() {
        // Calendar PDF button
        const calendarPdfButton = document.getElementById('calendarPdfButton');
        if (calendarPdfButton) {
            calendarPdfButton.addEventListener('mouseenter', () => {
                if (currentStep === 3) hoverText = 'download month';
            });
            calendarPdfButton.addEventListener('mouseleave', () => {
                if (currentStep === 3) hoverText = null;
            });
        }
        
        // Calendar back button
        const calendarBackButton = document.querySelector('.calendar-back-arrow');
        if (calendarBackButton) {
            calendarBackButton.addEventListener('mouseenter', () => {
                if (currentStep === 3) hoverText = 'go back';
            });
            calendarBackButton.addEventListener('mouseleave', () => {
                if (currentStep === 3) hoverText = null;
            });
        }
        
        // Selection back arrow (Step 3 selection screen)
        const selectionBackArrow = document.querySelector('.selection-back-arrow');
        if (selectionBackArrow) {
            selectionBackArrow.addEventListener('mouseenter', () => {
                if (currentStep === 3) hoverText = 'go back';
            });
            selectionBackArrow.addEventListener('mouseleave', () => {
                if (currentStep === 3) hoverText = null;
            });
        }
        
        // Clock back arrow
        const clockBackArrow = document.querySelector('.clock-back-arrow');
        if (clockBackArrow) {
            clockBackArrow.addEventListener('mouseenter', () => {
                if (currentStep === 3) hoverText = 'go back';
            });
            clockBackArrow.addEventListener('mouseleave', () => {
                if (currentStep === 3) hoverText = null;
            });
        }
    }
    
    // Setup hover effect for selection back arrow when hovering over Clock option
    function setupSelectionArrowHover() {
        const clockOption = document.querySelector('.output-option[onclick*="clock"]');
        const step3 = document.getElementById('step3');
        
        if (clockOption && step3) {
            clockOption.addEventListener('mouseenter', () => {
                step3.classList.add('hovering-clock');
            });
            clockOption.addEventListener('mouseleave', () => {
                step3.classList.remove('hovering-clock');
            });
        }
    }
    
    // Setup hover texts when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setupStep2HoverTexts();
            setupStep3HoverTexts();
            setupSelectionArrowHover();
        });
    } else {
        setupStep2HoverTexts();
        setupStep3HoverTexts();
        setupSelectionArrowHover();
    }
}

function setupCalendarScrollCursor() {
    const container = document.querySelector('.calendar-pages-container');
    if (!container) return;
    
    let isScrolling = false;
    
    // Track when user starts scrolling (mousedown on scrollbar)
    container.addEventListener('mousedown', (e) => {
        // Check if click is on scrollbar area (right side of container)
        const rect = container.getBoundingClientRect();
        const scrollbarWidth = 20; // Match CSS scrollbar width
        if (e.clientX >= rect.right - scrollbarWidth) {
            isScrolling = true;
        }
    });
    
    // Update cursor position while scrolling
    container.addEventListener('mousemove', (e) => {
        if (isScrolling) {
            const cursor = document.getElementById('customCursor');
            if (cursor) {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
            }
        }
    });
    
    // Stop tracking when mouse is released
    document.addEventListener('mouseup', () => {
        isScrolling = false;
    });
    
    // Also track scroll events to update cursor
    container.addEventListener('scroll', (e) => {
        if (isScrolling) {
            const cursor = document.getElementById('customCursor');
            if (cursor) {
                // Get mouse position from the event if available
                const rect = container.getBoundingClientRect();
                const scrollbarWidth = 20;
                cursor.style.left = (rect.right - scrollbarWidth / 2) + 'px';
                // Keep vertical position at scrollbar thumb position
                const scrollPercent = container.scrollTop / (container.scrollHeight - container.clientHeight);
                const thumbTop = scrollPercent * (container.clientHeight - container.clientHeight * 0.5); // 50vh thumb
                cursor.style.top = (rect.top + thumbTop + container.clientHeight * 0.25) + 'px';
            }

        }
    });
}

window.addEventListener('load', init);
