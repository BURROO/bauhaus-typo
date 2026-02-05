// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
// 
const svgText = document.getElementById("svg-text")

// Functions we need

// • Empty Canvas
// • Render Grid
// • Render  Glyph
// • Render Text

// 全局状态：光标位置
let cursorIndex = 0; 

// ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
// Events / Interactions

const emptyCanvas = () => {
    const previousGlyph = document.getElementById('glyph-group')
    if (previousGlyph) previousGlyph.remove()
}


const renderGrid = () => {

    const width = bitmapFont.parameters.width
    const height = bitmapFont.parameters.height
    const { colPositions, rowPositions } = bitmapFont.parameters;

    const gridGroup =
        document.createElementNS('http://www.w3.org/2000/svg', 'g');

    gridGroup.setAttribute('class', 'grid')

    if (!bitmapFont.parameters.showGrid) return gridGroup; 

    // Create the grid - Vertical Lines
    const cols = colPositions || Array.from({length: bitmapFont.parameters.columns + 1}, (_, i) => i / bitmapFont.parameters.columns);
    
    cols.forEach(pos => {
        const x = pos * width;
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
        line.setAttribute('x1', x)
        line.setAttribute('x2', x)
        line.setAttribute('y1', 0)
        line.setAttribute('y2', height)
        gridGroup.appendChild(line)
    });

    // Create the grid - Horizontal Lines
    const rowsArr = rowPositions || Array.from({length: bitmapFont.parameters.rows + 1}, (_, i) => i / bitmapFont.parameters.rows);

    rowsArr.forEach(pos => {
        const y = pos * height;
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
        line.setAttribute('x1', 0)
        line.setAttribute('x2', width)
        line.setAttribute('y1', y)
        line.setAttribute('y2', y)
        gridGroup.appendChild(line)
    });

    return gridGroup
}


const renderGlyph = (character, globalXOffset = 0) => {

    const currentLetterObj = bitmapFont.glyphs[character] || bitmapFont.glyphs['.notdef']
    const currentLetter = currentLetterObj.data

    const glyphGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    glyphGroup.setAttribute('id', 'glyph-group')

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    glyphGroup.appendChild(defs);

    if ((bitmapFont.parameters.pixelShape || 'square') === 'circle') {
        glyphGroup.style.isolation = 'isolate';
    }

    const width = bitmapFont.parameters.width
    const height = bitmapFont.parameters.height
    const columns = bitmapFont.parameters.columns
    const rows = bitmapFont.parameters.rows
    const { colPositions, rowPositions } = bitmapFont.parameters;

    const copies = bitmapFont.parameters.copies.count
    const slant = bitmapFont.parameters.slant || 0
    const noise = bitmapFont.parameters.noise || 0
    const waveAmplitude = bitmapFont.parameters.waveAmplitude || 0
    const waveFrequency = (bitmapFont.parameters.waveFrequency || 0) / 1000 

    const uniformCellWidth = width / columns;
    const uniformCellHeight = height / rows;

    const renderId = Math.floor(Math.random() * 1000000);

    const glyphCols = currentLetterObj.columns !== undefined ? currentLetterObj.columns : columns;
    const renderColumnsLimit = glyphCols + 1;

    for (let copyIndex = 0; copyIndex < copies; copyIndex++) {

        const currentTargetRadius = bitmapFont.parameters.radius - copyIndex * bitmapFont.parameters.copies.offset.scale
        
        const scaleX = (currentTargetRadius * 2) / uniformCellWidth
        const scaleY = (currentTargetRadius * 2) / uniformCellHeight

        for (let i = 0; i < renderColumnsLimit; i++) {

            for (let k = 0; k < rows; k++) {

                const rowCount = k * columns 
                const colCount = i
                
                let currentPixel = 0;
                let pixelIndex = rowCount + colCount; 

                if (i < columns) {
                    if (pixelIndex < currentLetter.length) {
                        currentPixel = currentLetter[pixelIndex];
                    }
                } 
                
                if (currentPixel !== 1 && currentPixel !== 0) continue;

                const slantOffset = (rows - 1 - k) * slant

                let cellW, cellH, cellX, cellY;
                
                if (!colPositions) {
                    cellW = uniformCellWidth;
                    cellX = i * uniformCellWidth;
                } else {
                    const getPos = (idx) => {
                        if (idx < colPositions.length) return colPositions[idx];
                        const lastPos = colPositions[colPositions.length - 1];
                        const extraCols = idx - (colPositions.length - 1);
                        return lastPos + extraCols * (1.0 / columns);
                    };

                    const cp1 = getPos(i + 1);
                    const cp0 = getPos(i);
                    cellW = (cp1 - cp0) * width;
                    cellX = cp0 * width;
                }

                if (!rowPositions || rowPositions.length <= k) {
                    const gridUnitHeight = height / rows;
                    cellH = gridUnitHeight;
                    cellY = k * gridUnitHeight;
                } else {
                    const rp1 = rowPositions[k+1] !== undefined ? rowPositions[k+1] : 1;
                    const rp0 = rowPositions[k] !== undefined ? rowPositions[k] : 0;
                    cellH = (rp1 - rp0) * height;
                    cellY = rp0 * height;
                }

                const pixelW = cellW * scaleX;
                const pixelH = cellH * scaleY;

                const x = cellX + cellW / 2 + slantOffset
                const y = cellY + cellH / 2

                const waveY = Math.sin((globalXOffset + x) * waveFrequency) * waveAmplitude
                const noiseX = (Math.random() - 0.5) * 2 * noise
                const noiseY = (Math.random() - 0.5) * 2 * noise

                const pixel = renderPixel(x + noiseX, y + waveY + noiseY, pixelW, pixelH, copyIndex, pixelIndex, character)

                if (currentPixel === 0) {
                     if (!bitmapFont.parameters.showNegativeSpace) {
                     continue; 
                     }
                     if (pixel) {
                         const safeChar = character === ' ' ? 'space' : character;
                         const gradId = `zgrad-${safeChar}-${copyIndex}-${pixelIndex}-${globalXOffset}-${renderId}`;
                         const isRadial = bitmapFont.parameters.gradientType === 'radial';
                         
                         const grad = document.createElementNS('http://www.w3.org/2000/svg', isRadial ? 'radialGradient' : 'linearGradient');
                         grad.setAttribute('id', gradId);
                         
                         const charGlyph = bitmapFont.glyphs[character] || bitmapFont.glyphs['.notdef'];
                         const safePixelIndex = pixelIndex % (charGlyph.gradientAngle?.length || 1);
                         const angleBase = (charGlyph.gradientAngle && charGlyph.gradientAngle[safePixelIndex]) || 0;
                         const angle = (angleBase + bitmapFont.parameters.gradientAngleOffset) % 360;
                         
                         const rad = angle * Math.PI / 180;
                         const xx = Math.cos(rad);
                         const yy = Math.sin(rad);

                         if (isRadial) {
                            grad.setAttribute('fx', (0.5 - xx * 0.35) * 100 + '%');
                            grad.setAttribute('fy', (0.5 - yy * 0.35) * 100 + '%');
                            grad.setAttribute('cx', '50%'); grad.setAttribute('cy', '50%'); grad.setAttribute('r', '50%');
                         } else {
                            grad.setAttribute('x1', (50 - xx * 50) + '%');
                            grad.setAttribute('y1', (50 - yy * 50) + '%');
                            grad.setAttribute('x2', (50 + xx * 50) + '%');
                            grad.setAttribute('y2', (50 + yy * 50) + '%');
                         }
                         
                         const stopsData = [
                             { offset: bitmapFont.parameters.zeroOffet0, color: bitmapFont.parameters.zeroColor0 },
                             { offset: bitmapFont.parameters.zeroOffet1, color: bitmapFont.parameters.zeroColor1 },
                             { offset: bitmapFont.parameters.zeroOffet2, color: bitmapFont.parameters.zeroColor2 }
                         ];
                         
                         stopsData.forEach(s => {
                             const stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
                             stop.setAttribute('offset', (s.offset || 0) + '%');
                             stop.setAttribute('stop-color', s.color || '#eeeeee'); 
                             grad.appendChild(stop);
                         });
                         
                         defs.appendChild(grad);
                         
                         const applyFill = (el) => {
                             el.setAttribute('fill', `url(#${gradId})`);
                             el.style.fill = `url(#${gradId})`;
                             el.style.stroke = 'none'; 
                         };

                         applyFill(pixel);
                         if (pixel.querySelectorAll) {
                             pixel.querySelectorAll('*').forEach(child => applyFill(child));
                         }
                     }
                }

                glyphGroup.appendChild(pixel)
            }
        }
    }

    return glyphGroup
}


const renderText = () => {

    const text = bitmapFont.preview.text || "" 
    const spacing = bitmapFont.parameters.spacing
    const globalColumns = bitmapFont.parameters.columns 
    const { colPositions, width: totalWidth } = bitmapFont.parameters;
    const lineHeight = bitmapFont.parameters.height
    const sizeScale = bitmapFont.parameters.size || 1

    svgText.innerHTML = ""

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.setAttribute('id', 'svg-defs')
    svgText.appendChild(defs);

    const gridEl = renderGrid();
    if(gridEl) svgText.appendChild(gridEl);

    const textGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g')

    let charCounter = 0; 
    let cursorData = null; 

    const lines = text.split('\n')
    let maxWidth = 0
    
    lines.forEach((lineStr, lineIdx) => {
        const lineGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g')
        lineGroup.setAttribute('transform', `translate(${spacing / 2}, ${lineIdx * lineHeight})`)

        let currentX = 0
        
        if (lineStr.length === 0) {
            if (charCounter === cursorIndex) {
                cursorData = { x: currentX + spacing/2, y: lineIdx * lineHeight, height: lineHeight };
            }
            charCounter++; 
        } else {
            lineStr.split("").forEach((character) => {
                
                if (charCounter === cursorIndex) {
                    cursorData = { x: currentX + spacing/2, y: lineIdx * lineHeight, height: lineHeight };
                }

                const glyph = renderGlyph(character, currentX)
                glyph.setAttribute('transform', `translate(${currentX}, 0)`)
                
                const glyphObj = bitmapFont.glyphs[character] || bitmapFont.glyphs['.notdef']
                const gCols = glyphObj.columns !== undefined ? glyphObj.columns : globalColumns;
                const effectiveCols = gCols + 1;
                
                let posVal;
                if (colPositions && colPositions.length > effectiveCols) {
                    posVal = colPositions[effectiveCols];
                } else {
                    posVal = effectiveCols / globalColumns;
                }
                if (posVal === undefined) posVal = 1;

                const glyphWidth = posVal * totalWidth;
                currentX += glyphWidth + spacing
                
                lineGroup.appendChild(glyph)
                
                charCounter++; 
            })

            // 行末处理
            if (lineIdx < lines.length - 1) {
                if (charCounter === cursorIndex) {
                    cursorData = { x: currentX + spacing/2, y: lineIdx * lineHeight, height: lineHeight };
                }
                charCounter++; // 换行符
            } else {
                if (charCounter === cursorIndex) {
                    cursorData = { x: currentX + spacing/2, y: lineIdx * lineHeight, height: lineHeight };
                }
            }
        }

        maxWidth = Math.max(maxWidth, currentX)
        textGroup.appendChild(lineGroup)
    })

    // --- 绘制光标 ---
    if (cursorData) {
        const cursorWidth = 3; // 你的光标宽度

        const cursor = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        
        // 👇👇👇 核心修改 👇👇👇
        // 逻辑：cursorData.x 是右边字的起点。
        // 我们要向左移：(光标宽度 3px) + (你想要的空隙 4px) = 总共减 7
        cursor.setAttribute('x', cursorData.x - 350); 
        // 👆👆👆 试一下 -7 或 -8，这样光标就会完全跑到左边，露出空隙
        
        // 注意：你原来的代码里写了两遍 setAttribute('x'...), 下面这句旧的删掉
        // cursor.setAttribute('x', cursorData.x); <--- 删掉这行，防止冲突

        cursor.setAttribute('y', cursorData.y + lineHeight * 0); 
        cursor.setAttribute('width', cursorWidth); 
        cursor.setAttribute('height', lineHeight * 0.7); 
        cursor.setAttribute('fill', 'var(--text-color)'); 
        cursor.setAttribute('class', 'typing-cursor'); 
        textGroup.appendChild(cursor);
    }

    const width = Math.max(maxWidth, totalWidth) 
    const height = Math.max(lines.length * lineHeight, lineHeight) 

    svgText.setAttribute('viewBox', `0 0 ${width} ${height}`)
    svgText.style.width = '100%'
    svgText.style.height = '100%'
    svgText.style.transformOrigin = 'center center'
    svgText.style.transform = `scale(${sizeScale})`

    svgText.appendChild(textGroup)
    
    // 每次渲染（打字/点击）都重置计时器
    resetCursorTimer();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
    });
} else {
}

if (bitmapFont && bitmapFont.preview && bitmapFont.preview.text) {
    cursorIndex = bitmapFont.preview.text.length;
}

const svgContainer = document.getElementById('typing')

// --- 键盘输入 ---
window.addEventListener('keydown', (event) => {
    resetCursorTimer(); // 按键唤醒光标

    const key = event.key
    const text = bitmapFont.preview.text
    
    if (key === 'ArrowLeft') {
        if (cursorIndex > 0) {
            cursorIndex--;
            renderText();
        }
        return;
    }

    if (key === 'ArrowRight') {
        if (cursorIndex < text.length) {
            cursorIndex++;
            renderText();
        }
        return;
    }
    
    if (key === 'Backspace') {
        event.preventDefault()
        if (cursorIndex > 0) {
            const left = text.slice(0, cursorIndex - 1); 
            const right = text.slice(cursorIndex);       
            bitmapFont.preview.text = left + right;
            cursorIndex--; 
            renderText()
        }
        return
    }
    
    if (key === 'Delete') {
        event.preventDefault()
        if (cursorIndex < text.length) {
            const left = text.slice(0, cursorIndex);
            const right = text.slice(cursorIndex + 1); 
            bitmapFont.preview.text = left + right;
            renderText()
        }
        return
    }
    
    if (key === 'Enter') {
        event.preventDefault()
        const left = text.slice(0, cursorIndex);
        const right = text.slice(cursorIndex);
        bitmapFont.preview.text = left + '\n' + right;
        cursorIndex++;
        renderText()
        return
    }
    
    if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
        event.preventDefault()
        const left = text.slice(0, cursorIndex);
        const right = text.slice(cursorIndex);
        bitmapFont.preview.text = left + key + right;
        cursorIndex++;
        renderText()
    }
})

// --- 鼠标点击定位 ---
svgText.addEventListener('mousedown', (e) => {
    resetCursorTimer(); // 点击唤醒光标

    const point = svgText.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
    
    const svgPoint = point.matrixTransform(svgText.getScreenCTM().inverse());
    const clickX = svgPoint.x;
    const clickY = svgPoint.y;

    const lineHeight = bitmapFont.parameters.height;
    const spacing = bitmapFont.parameters.spacing;
    const totalWidth = bitmapFont.parameters.width;
    const globalColumns = bitmapFont.parameters.columns;
    const colPositions = bitmapFont.parameters.colPositions;

    const text = bitmapFont.preview.text;
    const lines = text.split('\n');
    
    let lineIndex = Math.floor(clickY / lineHeight);
    if (lineIndex < 0) lineIndex = 0;
    if (lineIndex >= lines.length) lineIndex = lines.length - 1;

    let charCountBeforeLine = 0;
    for (let i = 0; i < lineIndex; i++) {
        charCountBeforeLine += lines[i].length + 1; 
    }

    const currentLineStr = lines[lineIndex];
    let currentX = spacing / 2; 
    let foundColIndex = currentLineStr.length; 

    for (let i = 0; i < currentLineStr.length; i++) {
        const char = currentLineStr[i];
        
        const glyphObj = bitmapFont.glyphs[char] || bitmapFont.glyphs['.notdef'];
        const gCols = glyphObj.columns !== undefined ? glyphObj.columns : globalColumns;
        const effectiveCols = gCols + 1;

        let posVal;
        if (colPositions && colPositions.length > effectiveCols) {
            posVal = colPositions[effectiveCols];
        } else {
            posVal = effectiveCols / globalColumns;
        }
        if (posVal === undefined) posVal = 1;

        const glyphWidth = posVal * totalWidth;
        const charCenter = currentX + glyphWidth / 2;

        if (clickX < charCenter) {
            foundColIndex = i;
            break;
        }

        currentX += glyphWidth + spacing;
    }

    cursorIndex = charCountBeforeLine + foundColIndex;
    renderText();
    
    svgContainer.focus();
});

svgContainer.addEventListener('click', (e) => {
    if(e.target === svgContainer) {
        svgContainer.focus();
        resetCursorTimer();
    }
})

let animationStartTime = Date.now()
const animationDuration = 4000 

const updateGradientAngles = () => {
    const currentTime = Date.now()
    const elapsed = (currentTime - animationStartTime) % (animationDuration * 2)
    
    let progress = elapsed / animationDuration
    let offset
    
    if (progress <= 1) {
        offset = progress * 30
    } else {
        offset = (2 - progress) * 30
    }
    
    bitmapFont.parameters.gradientAngleOffset = offset
    
    const gradients = document.querySelectorAll('#svg-defs linearGradient, #svg-defs radialGradient')
    
    gradients.forEach(gradient => {
        const gradientId = gradient.getAttribute('id')
        
        const parts = gradientId.split('-')
        if (parts.length >= 3) {
            const pixelIndex = parseInt(parts[1])
            const character = parts[2]
            
            const characterObj = bitmapFont.glyphs[character] || bitmapFont.glyphs['.notdef']
            const angleArray = characterObj.gradientAngle
            let angle = angleArray[pixelIndex] || 0
            angle = (angle + bitmapFont.parameters.gradientAngleOffset) % 360
            
            const rad = angle * Math.PI / 180
            const xx = Math.cos(rad)
            const yy = Math.sin(rad)
            
            if (gradient.tagName === 'radialGradient') {
                const focusOffset = 0.35;
                const fx = 0.5 - xx * focusOffset;
                const fy = 0.5 - yy * focusOffset;
                
                gradient.setAttribute('fx', (fx * 100).toFixed(2) + '%');
                gradient.setAttribute('fy', (fy * 100).toFixed(2) + '%');
            } else {
                const x1 = (50 - xx * 50).toFixed(2) + '%'
                const y1 = (50 - yy * 50).toFixed(2) + '%'
                const x2 = (50 + xx * 50).toFixed(2) + '%'
                const y2 = (50 + yy * 50).toFixed(2) + '%'
                
                gradient.setAttribute('x1', x1)
                gradient.setAttribute('y1', y1)
                gradient.setAttribute('x2', x2)
                gradient.setAttribute('y2', y2)
            }
        }
    })
}

// =======================================================
// 👇👇👇 核心修改：光标 3秒自动隐藏逻辑 (不监听鼠标移动) 👇👇👇
// =======================================================

let cursorHideTimer = null;

function resetCursorTimer() {
    // 1. 显示光标
    const cursor = document.querySelector('.typing-cursor');
    if (cursor) {
        cursor.classList.remove('hidden');
    }

    // 2. 清除旧定时器
    if (cursorHideTimer) {
        clearTimeout(cursorHideTimer);
    }

    // 3. 3秒后隐藏
    cursorHideTimer = setTimeout(() => {
        const cursorNow = document.querySelector('.typing-cursor');
        if (cursorNow) {
            cursorNow.classList.add('hidden');
        }
    }, 3000);
}