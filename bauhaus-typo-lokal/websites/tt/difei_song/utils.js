// ===== Utility Functions =====

// Shared layout helper so grid math stays consistent across sampling, spawning, and sizing.
function computeWordLayout(wordInput, resolutionInput) {
    const usingImage = (typeof gameState !== 'undefined') && gameState && gameState.imageMode && gameState.imageMask && gameState.imageMask.width && gameState.imageMask.height;
    if (usingImage) {
        const mask = gameState.imageMask;
        const margin = Number.isFinite(mask.margin) ? Math.max(0, Math.round(mask.margin)) : 0;
        const contentWidth = mask.width;
        const contentHeight = mask.height;
        const gridWidth = contentWidth + margin * 2;
        const gridHeight = contentHeight + margin * 2;
        return {
            word: '[Image]',
            lines: [],
            resolution: Math.max(contentWidth, contentHeight),
            glyphRegion: Math.max(contentWidth, contentHeight),
            marginPerSide: margin,
            spacingUnits: 0,
            lineSpacingUnits: 0,
            lineHeight: contentHeight,
            contentWidth,
            contentHeight,
            gridWidth,
            gridHeight,
            letterWidthUnits: contentWidth,
            letterWidthWithSpacing: contentWidth,
            useMetrics: false,
            imageMode: true
        };
    }

    // Don't force uppercase - preserve the case from wordBuffer
    const normalizedWord = (wordInput && wordInput.length > 0) ? wordInput : 'A';
    const resolution = (resolutionInput && resolutionInput > 0) ? resolutionInput : BASE_SIZE;

    const glyphRegion = resolution;
    const marginPerSide = Math.floor(glyphRegion / 2);
    const spacingUnits = Math.round(glyphRegion * 0.2);
    const lineSpacingUnits = Math.round(glyphRegion * 0.3);
    const lineHeight = glyphRegion;

    // Split into lines to support multi-line input
    const rawLines = normalizedWord.split(/\r?\n/);
    const safeLines = rawLines.length > 0 ? rawLines : [normalizedWord];

    // Use proportional metrics if a custom font is active
    const useMetrics = (typeof gameState !== 'undefined' && gameState && gameState.customFontFamily && gameState.glyphMetrics);

    // Measure each line individually
    const lines = safeLines.map(text => {
        const letterWidths = [];
        const letterStarts = [];
        let width = 0;

        const chars = text.split('');
        for (let i = 0; i < chars.length; i++) {
            const ch = chars[i];
            let w = glyphRegion;
            if (useMetrics) {
                try {
                    const m = gameState.glyphMetrics && gameState.glyphMetrics[ch];
                    if (m && typeof m.width === 'number' && m.width > 0) {
                        w = Math.min(glyphRegion, Math.max(1, Math.round(m.width)));
                    }
                } catch (e) {}
            }
            letterStarts.push(width);
            letterWidths.push(w);
            width += w;
            if (i < chars.length - 1) width += spacingUnits;
        }

        return { text, letterWidths, letterStarts, width };
    });

    // Determine content dimensions across all lines
    const contentWidth = lines.reduce((maxW, line) => Math.max(maxW, line.width), glyphRegion);
    const contentHeight = lines.length > 0
        ? lines.length * lineHeight + (lines.length - 1) * lineSpacingUnits
        : lineHeight;

    // Center each line horizontally within the max content width and record vertical offsets
    const lineOffsets = [];
    for (let idx = 0; idx < lines.length; idx++) {
        lineOffsets.push(idx * (lineHeight + lineSpacingUnits));
    }
    const centeredLines = lines.map((line, idx) => {
        const offsetX = Math.floor((contentWidth - line.width) / 2);
        return { ...line, offsetX, offsetY: lineOffsets[idx] };
    });

    const gridWidth = Math.ceil(contentWidth + marginPerSide * 2);
    const gridHeight = Math.ceil(contentHeight + marginPerSide * 2);

    // Provide legacy fields for monospace fallback code paths
    const letterWidthUnits = glyphRegion;
    const letterWidthWithSpacing = letterWidthUnits + spacingUnits;

    return {
        word: normalizedWord,
        lines: centeredLines,
        resolution,
        glyphRegion,
        marginPerSide,
        spacingUnits,
        lineSpacingUnits,
        lineHeight,
        contentWidth,
        contentHeight,
        gridWidth,
        gridHeight,
        letterWidthUnits,
        letterWidthWithSpacing,
        useMetrics: !!useMetrics
    };
}

function getLetterPixel(i, j, gridSize) {
    const useImageMask = (typeof gameState !== 'undefined') && gameState && gameState.imageMode && gameState.imageMask && gameState.imageMask.data;
    if (useImageMask) {
        const mask = gameState.imageMask;
        const margin = Number.isFinite(mask.margin) ? mask.margin : 0;
        if (i < margin || i >= mask.height + margin || j < margin || j >= mask.width + margin) return 0;
        const idx = (i - margin) * mask.width + (j - margin);
        return mask.data && mask.data[idx] ? 1 : 0;
    }

    // Support for multi-letter words with week-6 nearest-neighbor resampling
    let word = '';
    let resolution = gridSize;
    try {
        if (typeof gameState !== 'undefined') {
            if (typeof gameState.wordBuffer === 'string') {
                word = gameState.wordBuffer;
            }
            if (typeof gameState.gridSize === 'number') {
                resolution = gameState.gridSize;
            }
        }
    } catch (e) {
        // ignore
    }

    const layout = computeWordLayout(word, resolution);

    // Reject points that fall in the outer margins
    if (i < layout.marginPerSide || i >= layout.gridHeight - layout.marginPerSide ||
        j < layout.marginPerSide || j >= layout.gridWidth - layout.marginPerSide) {
        return 0;
    }

    // Local coords inside content area
    const localI = i - layout.marginPerSide;
    const localJ = j - layout.marginPerSide;

    // Determine which line this pixel falls into
    const lines = Array.isArray(layout.lines) ? layout.lines : [];
    const lineHeight = layout.lineHeight || layout.glyphRegion;
    const lineSpacing = (typeof layout.lineSpacingUnits === 'number') ? layout.lineSpacingUnits : Math.round(lineHeight * 0.3);

    let lineIndex = -1;
    let lineStartY = 0;
    for (let idx = 0; idx < lines.length; idx++) {
        const startY = typeof lines[idx].offsetY === 'number' ? lines[idx].offsetY : idx * (lineHeight + lineSpacing);
        const endY = startY + lineHeight;
        if (localI >= startY && localI < endY) {
            lineIndex = idx;
            lineStartY = startY;
            break;
        }
    }
    if (lineIndex === -1) return 0;

    const line = lines[lineIndex];
    const iWithinLine = localI - lineStartY;
    const lineOffsetX = typeof line.offsetX === 'number' ? line.offsetX : 0;
    const jWithinLine = localJ - lineOffsetX;

    if (jWithinLine < 0 || jWithinLine >= line.width) return 0;
    if (iWithinLine < 0 || iWithinLine >= lineHeight) return 0;

    // Figure out which letter and the position within that letter (supports variable widths)
    let letterIndex = -1;
    let posInLetter = 0;
    if (layout.useMetrics && line.letterStarts && line.letterWidths && line.letterStarts.length) {
        for (let idx = 0; idx < line.text.length; idx++) {
            const start = line.letterStarts[idx];
            const w = line.letterWidths[idx];
            if (jWithinLine >= start && jWithinLine < start + w) {
                letterIndex = idx;
                posInLetter = jWithinLine - start;
                break;
            }
        }
        if (letterIndex === -1) return 0; // in spacing gap
    } else {
        // Monospace fallback
        letterIndex = Math.floor(jWithinLine / layout.letterWidthWithSpacing);
        posInLetter = jWithinLine - letterIndex * layout.letterWidthWithSpacing;
        if (posInLetter >= layout.letterWidthUnits) return 0; // spacing
    }

    if (letterIndex >= line.text.length) return 0;

    // Lookup glyph bitmap
    const letter = line.text[letterIndex];
    let glyphArray = null;
    try {
        if (typeof GLYPHS !== 'undefined' && GLYPHS[letter]) {
            glyphArray = GLYPHS[letter];
        }
    } catch (e) {
        // ignore
    }
    if (!glyphArray) return 0;

    // Map from target glyphRegion to the source glyph bitmap resolution dynamically.
    const glyphDim = Math.max(1, Math.round(Math.sqrt(glyphArray.length)));
    const denomI = Math.max(1, lineHeight - 1);
    const sy = (glyphDim - 1) / denomI;

    let srcI = Math.round(iWithinLine * sy);
    srcI = Math.max(0, Math.min(glyphDim - 1, srcI));

    let srcJ;
    if (layout.useMetrics && typeof gameState !== 'undefined' && gameState.glyphMetrics && gameState.glyphMetrics[letter]) {
        const m = gameState.glyphMetrics[letter];
        const w = Math.max(1, line.letterWidths[letterIndex] || layout.letterWidthUnits);
        const activeW = Math.max(1, m.width);
        const denomJ = Math.max(1, w - 1);
        const t = denomJ > 0 ? (posInLetter / denomJ) : 0;
        const jWithin = Math.round(t * (activeW - 1));
        srcJ = Math.max(0, Math.min(glyphDim - 1, m.minCol + jWithin));
    } else {
        const denomJ = Math.max(1, layout.glyphRegion - 1);
        const sx = (glyphDim - 1) / denomJ;
        srcJ = Math.round(posInLetter * sx);
        srcJ = Math.max(0, Math.min(glyphDim - 1, srcJ));
    }

    return glyphArray[srcI * glyphDim + srcJ] ? 1 : 0;
}

function calculateGridSizeForWord(word) {
    const layout = computeWordLayout(word, BASE_SIZE);
    return Math.ceil(Math.max(layout.gridWidth, layout.gridHeight));
}

function initBirds(gameState) {
    gameState.birds = [];
    gameState.foods = [];

    // Get word layout based on current word and resolution
    const layout = computeWordLayout(gameState.wordBuffer || 'A', gameState.gridSize || BASE_SIZE);
    const cellSize = gameState.cellSize || 20;
    const yOffset = gameState.spawnOffsetRows || 0;
    
    // Calculate horizontal offset to center the birds
    const totalGridWidth = gameState.renderGridWidth || layout.gridWidth;
    const xOffset = Math.floor((totalGridWidth - layout.gridWidth) / 2);

    if (gameState.useGridMovement === false) {
        // Free floating mode: create birds at text positions in pixel coordinates
        for (let i = 0; i < layout.gridHeight; i++) {
            for (let j = 0; j < layout.gridWidth; j++) {
                if (getLetterPixel(i, j, layout.gridHeight) === 1) {
                    // Convert grid coordinates to pixel coordinates
                    const gridX = j + xOffset;
                    const gridY = i + yOffset;
                    const pixelX = gridX * cellSize + cellSize / 2;
                    const pixelY = gridY * cellSize + cellSize / 2;
                    
                    const b = new Bird(pixelX, pixelY);
                    // Home position is same as starting position in free mode
                    b.homeX = pixelX;
                    b.homeY = pixelY;
                    const or = (typeof gameState.offsetRange === 'number') ? gameState.offsetRange : 0;
                    b.offsetX = (Math.random() * 2 - 1) * or;
                    b.offsetY = (Math.random() * 2 - 1) * or;
                    b.homeBias = 0.9 + Math.random() * 0.2;
                    gameState.birds.push(b);
                }
            }
        }
    } else {
        // Grid mode: original behavior - only create birds at text positions, not the entire padded grid
        for (let i = 0; i < layout.gridHeight; i++) {
            for (let j = 0; j < layout.gridWidth; j++) {
                if (getLetterPixel(i, j, layout.gridHeight) === 1) {
                    const b = new Bird(j + xOffset, i + yOffset);
                    const or = (typeof gameState.offsetRange === 'number') ? gameState.offsetRange : 0;
                    b.offsetX = (Math.random() * 2 - 1) * or;
                    b.offsetY = (Math.random() * 2 - 1) * or;
                    b.homeBias = 0.9 + Math.random() * 0.2;
                    gameState.birds.push(b);
                }
            }
        }
    }
}

function spawnFood(gameState) {
    gameState.foods = [];

    const layout = computeWordLayout(gameState.wordBuffer || 'A', gameState.gridSize || BASE_SIZE);
    const yOffset = gameState.spawnOffsetRows || 0;

    for (let i = 0; i < layout.gridHeight; i++) {
        for (let j = 0; j < layout.gridWidth; j++) {
            if (getLetterPixel(i, j, layout.gridHeight) === 1) {
                gameState.foods.push({ x: j, y: i + yOffset });
            }
        }
    }
}

function calculateCanvasWidth(word, resolution, canvasHeight) {
    if (typeof gameState !== 'undefined' && gameState.imageMode && gameState.imageMask) {
        const layout = computeWordLayout(word, resolution);
        const pixelSize = canvasHeight / layout.gridHeight;
        const canvasWidth = layout.gridWidth * pixelSize;
        return Math.ceil(canvasWidth);
    }

    if (!canvasHeight || canvasHeight < 1) canvasHeight = 600;

    const layout = computeWordLayout(word, resolution);
    // Match cell size to what computeGridInfo sets: CANVAS_SIZE / (gridSize + 2*margin)
    const pixelSize = canvasHeight / layout.gridHeight;
    const canvasWidth = layout.gridWidth * pixelSize;

    return Math.ceil(canvasWidth);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

