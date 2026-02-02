const LETTER_SPACING = {
    'dr': -10, 
    'ri': -60,  
    'll': -120, 
    'il': -120,
    'le': -140,
    'in': -150, 
    'my': 30, 
    'wa': 30,
    'ho': -20,
    'ol': -10,
    'ed': -10,
};

const LETTER_Y_OFFSET = {
    'y': 40, 
};

const SPACE_SPACING = {
    'I ': -40, 
    'a ': 60
};

const LETTER_PRESETS = {
    'I': {
        
        stones: [
            {col: 0, row: 0},
            {col: 0, row: 1},
            {col: 0, row: 2},  
            {col: 0, row: 3}, 
            {col: 0, row: 4},
            {col: 0, row: 5}, 
            {col: 0, row: 6}
        ]
    },
    'i': {
        
        stones: [
            {col: 0, row: 1},  
            {col: 0, row: 3}, 
            {col: 0, row: 4},
            {col: 0, row: 5}, 
            {col: 0, row: 6}
        ]
    },
    'd': {
        stones: [
            {col: 3, row: 0}, 
            {col: 3, row: 1}, 
            {col: 3, row: 2},
            {col: 1, row: 3}, {col: 2, row: 3}, {col: 3, row: 3}, 
            {col: 0, row: 4}, {col: 3, row: 4}, 
            {col: 0, row: 5}, {col: 3, row: 5},
            {col: 1, row: 6}, {col: 2, row: 6}, {col: 3, row: 6}
        ]
    },
    'r': {
        stones: [
            {col: 0, row: 3}, {col: 1, row: 3},
            {col: 0, row: 4}, {col: 2, row: 4},
            {col: 0, row: 5},
            {col: 0, row: 6},
        ]
    },
    'l': {
        stones: [
            {col: 0, row: 0}, {col: 0, row: 1}, {col: 0, row: 2},
            {col: 0, row: 3}, {col: 0, row: 4}, {col: 0, row: 5},
            {col: 0, row: 6}
        ]
    },
    'e': {
        stones: [
            {col: 1, row: 2}, {col: 2, row: 2},
            {col: 0, row: 3}, {col: 3, row: 3},
            {col: 0, row: 4}, {col: 1, row: 4}, {col: 2, row: 4}, {col: 3, row: 4},
            {col: 0, row: 5}, 
            {col: 1, row: 6}, {col: 2, row: 6}, {col:3, row: 6}
        ]
    },
    'a': {
        stones: [
            {col: 1, row: 2}, {col: 2, row: 2}, 
            {col: 0, row: 3}, {col: 3, row: 3},
            {col: 1, row: 4}, {col: 2, row: 4}, {col: 3, row: 4}, 
            {col: 0, row: 5}, {col: 3, row: 5},
            {col: 1, row: 6}, {col: 2, row: 6}, {col: 3, row: 6}
        ]
    },
    'h': {
        stones: [
            {col: 0, row: 0}, 
            {col: 0, row: 1}, 
            {col: 0, row: 2},
            {col: 0, row: 3}, {col: 1, row: 3}, {col: 2, row: 3}, 
            {col: 0, row: 4}, {col: 3, row: 4},
            {col: 0, row: 5}, {col: 3, row: 5},
            {col: 0, row: 6}, {col: 3, row: 6}
        ]
    },
    'o': {
        stones: [
            {col: 1, row: 2}, {col: 2, row: 2},
            {col: 0, row: 3}, {col: 3, row: 3},
            {col: 0, row: 4}, {col: 3, row: 4},
            {col: 0, row: 5}, {col: 3, row: 5},
            {col: 1, row: 6}, {col: 2, row: 6}, 
        ]
    },
    'n': {
        stones: [
            {col: 0, row: 3}, {col: 1, row: 3}, 
            {col: 0, row: 4}, {col: 2, row: 4},
            {col: 0, row: 5}, {col: 2, row: 5},
            {col: 0, row: 6}, {col: 2, row: 6}
        ]
    },
    'm': {
        stones: [
            {col: 0, row: 3}, {col: 1, row: 3}, {col: 3, row: 3}, 
            {col: 0, row: 4}, {col: 2, row: 4}, {col: 4, row: 4}, 
            {col: 0, row: 5}, {col: 2, row: 5}, {col: 4, row: 5},
            {col: 0, row: 6}, {col: 2, row: 6}, {col: 4, row: 6}
        ]
    },
    'y': {
        stones: [
            {col: 0, row: 2}, {col: 3, row: 2}, 
            {col: 0, row: 3}, {col: 3, row: 3}, 
            {col: 1, row: 4}, {col: 2, row: 4}, {col: 3, row: 4},
            {col: 3, row: 5}, 
            {col: 0, row: 6}, {col: 1, row: 6}, {col: 2, row: 6}, {col: 3, row: 6}
        ]
    },
    'w': {
        stones: [
            {col: 0, row: 3}, {col: 2, row: 3}, {col: 4, row: 3},
            {col: 0, row: 4}, {col: 2, row: 4}, {col: 4, row: 4},
            {col: 0, row: 5}, {col: 2, row: 5}, {col: 4, row: 5},
            {col: 1, row: 6}, {col: 3, row: 6}
        ]
    }
};

// Step 1 State
let step1ClickCount = 0;
let step1Letters = null;
let step1MaterialDirection = 0;
let step1TargetDirection = 0;
let step1AnimationFrame = null;

window.getStep1ClickCount = () => step1ClickCount;

function initStep1MaterialGrid() {
    const container = document.getElementById('materialGridContainer');
    if (!container) return;
    
    // Hide the material grid container
    container.innerHTML = '';
    container.style.display = 'none';
    
    // Hide intro text
    const introText = document.getElementById('introText');
    if (introText) {
        introText.style.display = 'none';
    }
    
    // Initialize Step 1 canvas
    const canvasContainer = document.getElementById('step1CanvasContainer');
    const canvas = document.getElementById('step1Canvas');
    const svg = document.getElementById('step1StonesSvg');
    
    if (!canvas || !svg || !canvasContainer) return;
    
    // Set canvas size to full viewport
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        svg.setAttribute('width', window.innerWidth);
        svg.setAttribute('height', window.innerHeight);
        svg.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`);
        renderStep1Letters();
    };
    
    resizeCanvas();
    if (!window.step1ResizeHandler) {
        window.step1ResizeHandler = resizeCanvas;
        window.addEventListener('resize', resizeCanvas);
    }
    
    // Initialize letters data - Text mit großem I am Anfang
    const text = "I drilled a hole in my wall";
    const letters = text.split('').filter(char => {
        if (char === ' ') return false;
        // Check both uppercase and lowercase
        return LETTER_PRESETS[char] || LETTER_PRESETS[char.toLowerCase()];
    });
    step1Letters = letters.map(letter => ({
        letter: letter, // Behalte Original-Groß-/Kleinschreibung
        stones: [],
        materials: [],
        x: 0,
        y: 0,
        width: 0,
        height: 0
    }));
    
    // Create stones and materials for each letter
    // Use same grid size as numbers (5 columns, 7 rows)
    // Scale to match original text size (510px font-size) - much smaller
    const baseLetterSize = Math.min(window.innerWidth, window.innerHeight) * 0.04; // Much smaller scale
    let letterSize = Math.max(25, Math.min(45, baseLetterSize)); // Clamp between 25 and 45
    
    // Skalierungsfaktor für Textblock und Gaps
    const scaleFactor = 1.2;
    letterSize = letterSize * scaleFactor;
    
    const letterSpacing = letterSize * 0.1; // Engerer Abstand zwischen Buchstaben
    const lineHeight = letterSize * 7 + letterSize * 0.3; // Höhe einer Zeile (7 rows + spacing)
    
    let currentX = 0;
    let currentY = 0; // Will be calculated based on total height
    let lineStartX = 0;
    
    // Text in Zeilen aufteilen: "i drilled", "a hole in", "my wall"
    const lines = [
        ['I', ' ', 'd', 'r', 'i', 'l', 'l', 'e', 'd'],
        ['a', ' ', 'h', 'o', 'l', 'e'],
        ['i', 'n', 'm', 'y', ' ', 'w', 'a', 'l', 'l']
    ];
    
    // First pass: Calculate width of each line to find maximum width
    const lineWidths = [];
    lines.forEach((line, lineIndex) => {
        let totalLineWidth = 0;
        line.forEach((char, charIndex) => {
            if (char !== ' ') {
                totalLineWidth += letterSize * 5; // Letter width
                // Add spacing after letter (except for last letter)
                if (charIndex < line.length - 1 && line[charIndex + 1] !== ' ') {
                    const nextChar = line[charIndex + 1];
                    const pair = char + nextChar;
                    let spacing = letterSpacing; // Default
                    if (LETTER_SPACING[pair] !== undefined) {
                        spacing = LETTER_SPACING[pair] * scaleFactor; // Skaliert mit 1.3
                    } else if (LETTER_SPACING[char] !== undefined) {
                        spacing = LETTER_SPACING[char] * scaleFactor; // Skaliert mit 1.3
                    }
                    totalLineWidth += spacing;
                }
            } else {
                // Space character - check for individual spacing
                const prevChar = charIndex > 0 ? line[charIndex - 1] : null;
                let spaceWidth = letterSize * 1; // Default
                if (prevChar && SPACE_SPACING[prevChar + ' '] !== undefined) {
                    spaceWidth = SPACE_SPACING[prevChar + ' '] * scaleFactor; // Skaliert mit 1.3
                }
                totalLineWidth += spaceWidth;
            }
        });
        lineWidths.push(totalLineWidth);
    });
    
    // Find maximum line width for centering
    const maxLineWidth = Math.max(...lineWidths);
    
    // Calculate total height for vertical centering (using vh)
    const totalHeight = lines.length * lineHeight;
    // Vertikal zentriert: 50vh - halbe Höhe des Textblocks
    currentY = (window.innerHeight * 0.5) - (totalHeight / 2);
    
    let letterIndex = 0;
    lines.forEach((line, lineIndex) => {
        // Calculate total line width with individual spacing values
        let totalLineWidth = lineWidths[lineIndex];
        
        // Zentriert: Jede Zeile wird an der maximalen Breite zentriert
        currentX = (window.innerWidth - maxLineWidth) / 2;
        lineStartX = currentX;
        
        line.forEach((char, charIndex) => {
            if (char === ' ') {
                // Check for individual space spacing
                const prevChar = charIndex > 0 ? line[charIndex - 1] : null;
                let spaceWidth = letterSize * 1; // Default
                if (prevChar && SPACE_SPACING[prevChar + ' '] !== undefined) {
                    spaceWidth = SPACE_SPACING[prevChar + ' '] * scaleFactor; // Skaliert mit 1.3
                }
                currentX += spaceWidth;
            } else {
                // Check for exact match first (for uppercase I), then lowercase
                const preset = LETTER_PRESETS[char] || LETTER_PRESETS[char.toLowerCase()];
                if (preset && step1Letters[letterIndex]) {
                    const letterData = step1Letters[letterIndex];
                    letterData.x = currentX;
                    // Apply y-offset if defined (eine row = letterSize)
                    let yOffset = 0;
                    if (LETTER_Y_OFFSET[char] !== undefined) {
                        // Wenn Wert 0 ist, bedeutet das "eine row nach unten" = letterSize
                        yOffset = LETTER_Y_OFFSET[char] === 0 ? letterSize : LETTER_Y_OFFSET[char] * scaleFactor;
                    } else if (LETTER_Y_OFFSET[char.toLowerCase()] !== undefined) {
                        yOffset = LETTER_Y_OFFSET[char.toLowerCase()] === 0 ? letterSize : LETTER_Y_OFFSET[char.toLowerCase()] * scaleFactor;
                    }
                    letterData.y = currentY + yOffset;
                    letterData.width = letterSize * 5; // 5 columns
                    letterData.height = letterSize * 7; // 7 rows
                    
                    // Create stones for this letter (5x7 grid like numbers)
                    const stoneSize = letterSize * 0.95;
                    preset.stones.forEach(stonePos => {
                        // Clamp to valid grid bounds (0-4 cols, 0-6 rows)
                        const clampedCol = Math.max(0, Math.min(4, stonePos.col));
                        const clampedRow = Math.max(0, Math.min(6, stonePos.row));
                        const x = currentX + clampedCol * letterSize + letterSize / 2;
                        // Use letterData.y instead of currentY to respect y-offset
                        const y = letterData.y + clampedRow * letterSize + letterSize / 2;
                        const size = stoneSize + Math.random() * stoneSize * 0.03;
                        const shapePoints = generateStoneShape(size);
                        
                        letterData.stones.push({
                            x: x,
                            y: y,
                            size: size,
                            shape: shapePoints,
                            color: getStoneColor(),
                            rotation: Math.random() * 360
                        });
                    });
                    
                    // Create materials for each stone (wie bei Ziffern - alle in gleicher Richtung)
                    // Alle Materialien werden in der gleichen Richtung angeordnet (nicht preset.direction)
                    const baseOffset = 10; // Reduzierter Versatz für weniger Gap
                    const materialTypes = ['circles', 'grid', 'brick', 'lines'];
                    // Start with direction 0 (alle gleichmäßig hintereinander)
                    const uniformDirection = 0;
                    const directionRad = (uniformDirection * Math.PI) / 180;
                    
                    materialTypes.forEach((materialType, layerIndex) => {
                        letterData.stones.forEach((stone, stoneIndex) => {
                            const totalOffset = baseOffset * (layerIndex + 1);
                            const offsetX = Math.cos(directionRad) * totalOffset;
                            const offsetY = Math.sin(directionRad) * totalOffset;
                            
                            const material = {
                                x: stone.x + offsetX,
                                y: stone.y + offsetY,
                                size: stone.size,
                                type: materialType,
                                rotation: 0, // Keine Rotation, wie in Step 2
                                color: MATERIAL_DEFAULT_COLORS[materialType],
                                baseOffset: totalOffset,
                                layerIndex: layerIndex,
                                stoneX: stone.x,
                                stoneY: stone.y,
                                stoneIndex: stoneIndex
                            };
                            
                            letterData.materials.push(material);
                        });
                    });
                    
                    // Calculate spacing for this letter
                    // Check for letter pair first (current + next), then single letter, then default
                    let spacing = letterSpacing; // Default spacing in pixels
                    const nextChar = charIndex < line.length - 1 ? line[charIndex + 1] : null;
                    
                    if (nextChar && nextChar !== ' ') {
                        // Check for letter pair (e.g. "Id", "ll")
                        const pair = char + nextChar;
                        if (LETTER_SPACING[pair] !== undefined) {
                            spacing = LETTER_SPACING[pair] * scaleFactor; // Skaliert mit 1.3
                        } else if (LETTER_SPACING[char] !== undefined) {
                            // Check for single letter
                            spacing = LETTER_SPACING[char] * scaleFactor; // Skaliert mit 1.3
                        }
                    } else if (LETTER_SPACING[char] !== undefined) {
                        // Last letter in line, check for single letter spacing
                        spacing = LETTER_SPACING[char] * scaleFactor; // Skaliert mit 1.3
                    }
                    
                    currentX += letterSize * 5 + spacing; // 5 columns + individual spacing in pixels
                    letterIndex++;
                }
            }
        });
        
        currentY += lineHeight;
    });
    
    // Initial render
    renderStep1Letters();
    
    // Handle clicks
    const step1 = document.getElementById('step1');
    if (step1 && !step1.hasAttribute('data-material-click-handler')) {
        step1.setAttribute('data-material-click-handler', 'true');
        
        step1.addEventListener('click', (e) => {
            if (currentStep === 1) {
                step1ClickCount++;
                if (step1ClickCount === 1) {
                    // First click: show materials and stop drill animation
                    renderStep1Letters();
                    // Stop drill animation immediately
                    if (window.stopDrillTextAnimation) {
                        window.stopDrillTextAnimation();
                    }
                    const drillTextContainer = document.getElementById('drillTextContainer');
                    if (drillTextContainer) {
                        drillTextContainer.style.display = 'none';
                    }
                    // Update cursor text immediately by triggering a mousemove event
                    const mouseEvent = new MouseEvent('mousemove', {
                        clientX: e.clientX,
                        clientY: e.clientY,
                        bubbles: true
                    });
                    document.dispatchEvent(mouseEvent);
                } else if (step1ClickCount >= 2) {
                    // Second click: go to step 2
                    goToStep(2);
                }
            }
        });
    }
    
    // Handle mouse movement for cursor tracking (only add once)
    // Cursor tracking soll wie Richtungs-Button funktionieren - berechnet Winkel vom Zentrum zum Cursor
    // Mit smooth interpolation für flüssige Bewegung
    if (!step1.hasAttribute('data-mousemove-handler')) {
        step1.setAttribute('data-mousemove-handler', 'true');
        
        // Smooth interpolation function
        const updateMaterials = () => {
            if (currentStep === 1 && step1ClickCount >= 1 && step1Letters) {
                // Smooth interpolation towards target direction
                const lerp = (a, b, t) => {
                    // Handle angle wrapping (0-360)
                    let diff = b - a;
                    if (diff > 180) diff -= 360;
                    if (diff < -180) diff += 360;
                    return a + diff * t;
                };
                
                step1MaterialDirection = lerp(step1MaterialDirection, step1TargetDirection, 0.4); // 0.4 = schneller und flüssig
                
                // Update material positions based on current direction
                step1Letters.forEach(letterData => {
                    const directionRad = (step1MaterialDirection * Math.PI) / 180;
                    letterData.materials.forEach(material => {
                        const totalOffset = material.baseOffset || (10 * (material.layerIndex + 1));
                        const offsetX = Math.cos(directionRad) * totalOffset;
                        const offsetY = Math.sin(directionRad) * totalOffset;
                        
                        // Update position relative to stone
                        if (letterData.stones[material.stoneIndex]) {
                            const stone = letterData.stones[material.stoneIndex];
                            material.x = stone.x + offsetX;
                            material.y = stone.y + offsetY;
                        }
                    });
                });
                
                renderStep1Letters();
                
                // Continue animation if still in step 1
                if (currentStep === 1 && step1ClickCount >= 1) {
                    step1AnimationFrame = requestAnimationFrame(updateMaterials);
                }
            }
        };
        
        document.addEventListener('mousemove', (e) => {
            if (currentStep === 1 && step1ClickCount >= 1) {
                // Calculate direction angle from center to cursor (like direction button)
                const centerX = window.innerWidth / 2;
                const centerY = window.innerHeight / 2;
                const dx = e.clientX - centerX;
                const dy = e.clientY - centerY;
                
                // Calculate angle in degrees (0-360)
                let angle = Math.atan2(dy, dx) * (180 / Math.PI);
                angle = (angle + 360) % 360; // Normalize to 0-360
                
                // Update target direction (will be smoothly interpolated)
                step1TargetDirection = angle;
                
                // Start animation loop if not already running
                if (!step1AnimationFrame) {
                    step1AnimationFrame = requestAnimationFrame(updateMaterials);
                }
            }
        }, { passive: true });
        
        // Stop animation when leaving step 1
        const originalGoToStep = window.goToStep;
        if (!window.step1GoToStepWrapped) {
            window.step1GoToStepWrapped = true;
            window.goToStep = function(step) {
                if (step !== 1 && step1AnimationFrame) {
                    cancelAnimationFrame(step1AnimationFrame);
                    step1AnimationFrame = null;
                }
                return originalGoToStep(step);
            };
        }
    }
}

function renderStep1Letters() {
    const canvas = document.getElementById('step1Canvas');
    const svg = document.getElementById('step1StonesSvg');
    
    if (!canvas || !svg || !step1Letters) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Clear SVG
    svg.innerHTML = '';
    
    step1Letters.forEach(letterData => {
        // Draw materials if clickCount >= 1
        if (step1ClickCount >= 1) {
            const sortedMaterials = [...letterData.materials].sort((a, b) => {
                return (b.baseOffset || 0) - (a.baseOffset || 0);
            });
            
            sortedMaterials.forEach(material => {
                const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                
                // Material position is already updated based on cursor direction
                group.setAttribute('transform', `translate(${material.x}, ${material.y}) rotate(${material.rotation})`);
                
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
                        
                        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                        path.setAttribute('d', brickPathData);
                        path.setAttribute('fill', materialColor);
                        path.setAttribute('fill-rule', 'evenodd'); // Wichtig für die vier Löcher
                        group.appendChild(path);
                        break;
                    }
                    case 'lines': {
                        const numLines = 8;
                        const lineSpacing = material.size / (numLines + 1);
                        for (let i = 1; i <= numLines; i++) {
                            const y = -material.size / 2 + i * lineSpacing;
                            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                            line.setAttribute('x1', -material.size / 2);
                            line.setAttribute('y1', y);
                            line.setAttribute('x2', material.size / 2);
                            line.setAttribute('y2', y);
                            line.setAttribute('stroke', materialColor);
                            line.setAttribute('stroke-width', 2);
                            group.appendChild(line);
                        }
                        break;
                    }
                }
                
                svg.appendChild(group);
            });
        }
        
        // Draw stones (always visible)
        letterData.stones.forEach(stone => {
            const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            group.setAttribute('transform', `translate(${stone.x}, ${stone.y}) rotate(${stone.rotation})`);
            
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const pathData = generateSVGPath(stone.shape);
            path.setAttribute('d', pathData);
            path.setAttribute('fill', stone.color);
            group.appendChild(path);
            
            svg.appendChild(group);
        });
    });
}
