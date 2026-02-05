// HINWEIS: Füge in deine index-card-01.html im <head> ein:
// <script src="https://cdn.jsdelivr.net/npm/opentype.js@latest/dist/opentype.min.js"></script>

console.log("index-card-01.js loaded");

// Set default font to ABCFavorit-Regular on page load
window.addEventListener('DOMContentLoaded', function() {
    const defaultFont = 'ABCFavorit-Regular';
    document.documentElement.style.setProperty('--active-font', defaultFont);
    document.body.style.fontFamily = defaultFont;
    
    document.querySelectorAll('.card-title, .ui-button, .write-textarea, .textblock-text, .help-glyph, .card-description').forEach(el => {
        el.style.fontFamily = defaultFont;
    });
    
    console.log(`Default font set to: ${defaultFont}`);
});

// ========== INTERFACE FUNCTIONS (vom Interface übernommen) ==========

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
        
        // Apply to all elements with specific classes
        document.querySelectorAll('.card-title, .ui-button, .write-textarea, .textblock-text, .help-glyph, .card-description').forEach(el => {
            el.style.fontFamily = selectedFont;
        });
        
        console.log(`Font changed to: ${selectedFont}`);
        
        // Close dropdown
        fontModal.classList.remove('active');
    });
});

// Write button functionality - transforms into expanding textarea
const writeButton = document.getElementById('write-button');
let isTextField = false;
let textarea = null;

writeButton.addEventListener('click', function() {
    if (!isTextField) {
        // Get button position and dimensions
        const buttonRect = writeButton.getBoundingClientRect();
        
        // Create textarea
        textarea = document.createElement('textarea');
        textarea.id = 'write-textarea';
        textarea.className = 'write-textarea';
        textarea.placeholder = 'Start writing...';
        
        // Set position and dimensions dynamically
        textarea.style.position = 'fixed';
        textarea.style.left = buttonRect.left + 'px';
        textarea.style.top = buttonRect.top + 'px';
        textarea.style.width = buttonRect.width + 'px';
        textarea.style.minHeight = buttonRect.height + 'px';
        
        // Hide the button but keep its space
        writeButton.style.visibility = 'hidden';
        
        // Add textarea to body
        document.body.appendChild(textarea);
        
        // Auto-expand function
        function autoExpand() {
            textarea.style.height = 'auto';
            textarea.style.height = Math.max(buttonRect.height, textarea.scrollHeight) + 'px';
        }
        
        // Listen for input to expand vertically
        textarea.addEventListener('input', autoExpand);
        
        // Click outside to close
        function clickOutside(e) {
            if (e.target !== textarea) {
                // Remove textarea
                textarea.remove();
                // Show button again
                writeButton.style.visibility = 'visible';
                // Remove listener
                document.removeEventListener('click', clickOutside);
                isTextField = false;
            }
        }
        
        // Add click outside listener after a short delay
        setTimeout(() => {
            document.addEventListener('click', clickOutside);
        }, 100);
        
        // Focus the textarea
        textarea.focus();
        isTextField = true;
    }
});

// Invert, Outline, and Colorwheel Buttons
document.addEventListener("DOMContentLoaded", () => {

    const html = document.documentElement;
    const invertButton = document.getElementById("invert-button");
    const outlineButton = document.getElementById("outline-button");

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

    // Color Wheel Button
    const colorPicker = document.getElementById("color-picker");
    const colorWheelBtn = document.getElementById("Colorwheel-Button");

    if (colorPicker && colorWheelBtn) {
        colorWheelBtn.addEventListener("click", () => {
            colorPicker.click();
        });

        colorPicker.addEventListener("input", (e) => {
            html.style.setProperty("--base-color", e.target.value);
        });
    }

});

// ========== TEXTBLOCK RESIZE FUNCTIONALITY (Original behalten) ==========

// Track all textblocks and currently active one
let allTextblocks = [];
let activeTextblock = null;
let textblockCounter = 0; // Start at 0 since no initial textblock
let highestZIndex = 10;

// Helper function to bring textblock to front
function bringToFront(textblock) {
    highestZIndex++;
    textblock.style.zIndex = highestZIndex;
}

// No initial textblock - user must add them

// Add button functionality
const addButton = document.getElementById('add-button');
addButton.addEventListener('click', () => {
    textblockCounter++;
    const newTextblock = createTextblock(textblockCounter);
    document.querySelector('.card-1').appendChild(newTextblock);
    allTextblocks.push(newTextblock);
    setupTextblock(newTextblock);
    
    // Bring new textblock to front
    bringToFront(newTextblock);
});

// Delete button functionality
const deleteButton = document.getElementById('delete-button');
deleteButton.addEventListener('click', () => {
    if (activeTextblock) {
        allTextblocks = allTextblocks.filter(tb => tb !== activeTextblock);
        activeTextblock.remove();
        activeTextblock = null;
    }
});

// Create new textblock element
function createTextblock(number) {
    const template = document.getElementById('textblock-template');
    const textblock = template.content.cloneNode(true).querySelector('.textblock');
    textblock.style.top = (150 + (number - 1) * 50) + 'px';
    textblock.style.left = (100 + (number - 1) * 50) + 'px';

    return textblock;
}


// Setup textblock with all event listeners
function setupTextblock(textblock) {
    const textblockText = textblock.querySelector('.textblock-text');
    const textblockClip = textblock.querySelector('.textblock-clip');
    const textblockInfoFont = textblock.querySelector(".info-font");
    const textblockInfoScale = textblock.querySelector(".info-scale");
    
    const baseFontSizePx = parseFloat(getComputedStyle(textblockText).fontSize);
    const baseWidth = textblock.offsetWidth;
    let scale = 1;
    
    function pxToPt(px) {
        return px * 72 / 96;
    }
    
    function updateOutlineOffset(currentFontSize) {
        const outlineOffset = Math.round(currentFontSize * 0.15);
        textblock.style.setProperty('--outline-offset', `${outlineOffset}px`);
    }
    
    function updateTextInfo(currentScale = 1) {
        const fontSizePx = baseFontSizePx * currentScale;
        const fontSizePt = pxToPt(fontSizePx);
        
        textblockInfoFont.textContent = fontSizePt.toFixed(1) + " pt";
        textblockInfoScale.textContent = Math.round(currentScale * 100) + "%";
        
        updateOutlineOffset(fontSizePx);
    }
    
    // Initialize outline offset
    updateOutlineOffset(baseFontSizePx);
    
    // Bring to front when text is focused
    textblockText.addEventListener('focus', () => {
        allTextblocks.forEach(tb => tb.classList.remove('is-active'));
        textblock.classList.add('is-active');
        activeTextblock = textblock;
        bringToFront(textblock);
    });
    
    // Drag functionality
    let isDragging = false;
    let dragStartX, dragStartY, dragStartLeft, dragStartTop;
    
    const textblockDragZone = textblock.querySelector('.textblock-drag-zone');
    
    // Drag zone handles dragging
    textblockDragZone.addEventListener('mousedown', (e) => {
        // Deactivate all textblocks
        allTextblocks.forEach(tb => tb.classList.remove('is-active'));
        
        // Activate this textblock and bring to front
        textblock.classList.add('is-active');
        activeTextblock = textblock;
        bringToFront(textblock);
        
        isDragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        dragStartLeft = textblock.offsetLeft;
        dragStartTop = textblock.offsetTop;
        
        document.body.style.cursor = 'grabbing';
        e.preventDefault();
        e.stopPropagation();
    });
    
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const dx = e.clientX - dragStartX;
            const dy = e.clientY - dragStartY;
            
            textblock.style.left = (dragStartLeft + dx) + 'px';
            textblock.style.top = (dragStartTop + dy) + 'px';
        }
    });
    
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            document.body.style.cursor = 'default';
        }
    });
    
    // Activate when clicking on resize handles
    const handles = textblock.querySelectorAll('.resize-handle');
    handles.forEach(handle => {
        handle.addEventListener('mousedown', (e) => {
            // Deactivate all textblocks
            allTextblocks.forEach(tb => tb.classList.remove('is-active'));
            
            // Activate this textblock and bring to front
            textblock.classList.add('is-active');
            activeTextblock = textblock;
            bringToFront(textblock);
            
            let isResizing = true;
            let currentHandle = handle;
            let startX = e.clientX;
            let startY = e.clientY;
            let startWidth = textblock.offsetWidth;
            let startHeight = textblock.offsetHeight;
            let startLeft = textblock.offsetLeft;
            let startTop = textblock.offsetTop;
            
            e.preventDefault();
            e.stopPropagation();
            
            function onMouseMove(e) {
                if (!isResizing) return;
                
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                
                if (currentHandle.classList.contains('br')) {
                    const newWidth = Math.max(100, startWidth + dx);
                    const newHeight = Math.max(100, startHeight + dy);
                    textblock.style.width = newWidth + 'px';
                    textblock.style.height = newHeight + 'px';
                    
                    scale = newWidth / baseWidth;
                    textblockText.style.fontSize = (baseFontSizePx * scale) + 'px';
                    updateTextInfo(scale);
                } else if (currentHandle.classList.contains('bl')) {
                    const newWidth = Math.max(100, startWidth - dx);
                    const newHeight = Math.max(100, startHeight + dy);
                    textblock.style.width = newWidth + 'px';
                    textblock.style.height = newHeight + 'px';
                    textblock.style.left = (startLeft + dx) + 'px';
                    
                    scale = newWidth / baseWidth;
                    textblockText.style.fontSize = (baseFontSizePx * scale) + 'px';
                    updateTextInfo(scale);
                } else if (currentHandle.classList.contains('tr')) {
                    const newWidth = Math.max(100, startWidth + dx);
                    const newHeight = Math.max(100, startHeight - dy);
                    textblock.style.width = newWidth + 'px';
                    textblock.style.height = newHeight + 'px';
                    textblock.style.top = (startTop + dy) + 'px';
                    
                    scale = newWidth / baseWidth;
                    textblockText.style.fontSize = (baseFontSizePx * scale) + 'px';
                    updateTextInfo(scale);
                } else if (currentHandle.classList.contains('tl')) {
                    const newWidth = Math.max(100, startWidth - dx);
                    const newHeight = Math.max(100, startHeight - dy);
                    textblock.style.width = newWidth + 'px';
                    textblock.style.height = newHeight + 'px';
                    textblock.style.left = (startLeft + dx) + 'px';
                    textblock.style.top = (startTop + dy) + 'px';
                    
                    scale = newWidth / baseWidth;
                    textblockText.style.fontSize = (baseFontSizePx * scale) + 'px';
                    updateTextInfo(scale);
                } else if (currentHandle.classList.contains('r')) {
                    const newWidth = Math.max(100, startWidth + dx);
                    textblock.style.width = newWidth + 'px';
                    
                    scale = newWidth / baseWidth;
                    textblockText.style.fontSize = (baseFontSizePx * scale) + 'px';
                    updateTextInfo(scale);
                } else if (currentHandle.classList.contains('l')) {
                    const newWidth = Math.max(100, startWidth - dx);
                    textblock.style.width = newWidth + 'px';
                    textblock.style.left = (startLeft + dx) + 'px';
                    
                    scale = newWidth / baseWidth;
                    textblockText.style.fontSize = (baseFontSizePx * scale) + 'px';
                    updateTextInfo(scale);
                } else if (currentHandle.classList.contains('b')) {
                    const newHeight = Math.max(100, startHeight + dy);
                    textblock.style.height = newHeight + 'px';
                } else if (currentHandle.classList.contains('t')) {
                    const newHeight = Math.max(100, startHeight - dy);
                    textblock.style.height = newHeight + 'px';
                    textblock.style.top = (startTop + dy) + 'px';
                }
            }
            
            function onMouseUp() {
                isResizing = false;
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }
            
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    });
    
    // Activate when typing
    textblockText.addEventListener('focus', () => {
        // Deactivate all textblocks
        allTextblocks.forEach(tb => tb.classList.remove('is-active'));
        
        // Activate this textblock
        textblock.classList.add('is-active');
        activeTextblock = textblock;
    });
    
    // Initialize text info
    updateTextInfo(1);
}

// Deactivate when clicking outside all textblocks
document.addEventListener('click', (e) => {
    const clickedInsideTextblock = allTextblocks.some(tb => tb.contains(e.target));
    if (!clickedInsideTextblock) {
        allTextblocks.forEach(tb => tb.classList.remove('is-active'));
        activeTextblock = null;
    }
});

// Close button for card description
const closeDescriptionBtn = document.querySelector('.close-description');
const cardDescription = document.querySelector('.card-description');
const helpButton = document.getElementById('help-button');

// Help button opens card description
if (helpButton && cardDescription) {
    helpButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        cardDescription.style.display = 'block';
    });
}

// Close button hides card description
if (closeDescriptionBtn && cardDescription) {
    closeDescriptionBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        cardDescription.style.display = 'none';
    });
}

// ========== EXPORT FUNCTIONALITY ==========
const exportButton = document.getElementById('export-button');
console.log('Export button found:', exportButton);

if (exportButton) {
    exportButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Export button clicked');
        try {
            const card = document.querySelector('.card-1');
            if (!card) {
                alert('Error: Card element not found');
                return;
            }
            const cardRect = card.getBoundingClientRect();
            const cardWidth = cardRect.width;
            const cardHeight = cardRect.height;
            let svgContent = `<?xml version="1.0" encoding="UTF-8"?>\n`;
            svgContent += `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">\n`;
            // Background
            const cardSvg = card.querySelector('svg');
            if (cardSvg) {
                const cardPath = cardSvg.querySelector('path');
                if (cardPath) {
                    const fill = cardPath.getAttribute('fill') || '#FF0000';
                    svgContent += `  <rect width="${cardWidth}" height="${cardHeight}" fill="${fill}"/>\n`;
                }
            }
            // Textblöcke sammeln
            let textblocks = card.querySelectorAll('.textblock');
            if (textblocks.length === 0) textblocks = document.querySelectorAll('.textblock');
            if (textblocks.length === 0 && typeof allTextblocks !== 'undefined') textblocks = allTextblocks;
            if (textblocks.length === 0) {
                alert('No text elements found! Please add some text using the "Add" button first.');
                svgContent += '</svg>';
                const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'playground-01-export.svg';
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }, 100);
                return;
            }
            // Erst Schrift laden, dann alles als Pfad erzeugen
            if (window.opentype) {
                window.opentype.load('/ABCFavorit-Regular.otf', function(err, font) {
                    if (err) {
                        alert('Fehler beim Laden der Schrift: ' + err);
                        return;
                    }
                    let svgTextPaths = '';
                    // Zuerst alle Textblock-Pfade sammeln
                    Array.from(textblocks).forEach((textblock, i) => {
                        const textEl = textblock.querySelector('.textblock-text');
                        if (!textEl) return;
                        let text = textEl.value || textEl.textContent || textEl.innerText;
                        if (!text || text.trim() === '') text = textEl.placeholder || '';
                        if (!text || text.trim() === '') return;
                        const tbRect = textblock.getBoundingClientRect();
                        const clipEl = textblock.querySelector('.textblock-clip');
                        const clipRect = clipEl ? clipEl.getBoundingClientRect() : tbRect;
                        const clipX = clipRect.left - cardRect.left;
                        const clipY = clipRect.top - cardRect.top;
                        const style = window.getComputedStyle(textEl);
                        let fontSize = parseFloat(style.fontSize);
                        const infoFontEl = textblock.querySelector('.textblock-info span:first-child');
                        if (infoFontEl && infoFontEl.textContent.includes('pt')) {
                            const ptValue = parseFloat(infoFontEl.textContent);
                            fontSize = ptValue; // Direkt in pt an opentype.js übergeben
                        }
                        const textX = clipX + 15;
                        const textY = clipY + 15 + fontSize;
                        let textColor = style.color;
                        if (textColor.startsWith('rgb')) {
                            const match = textColor.match(/(\d+)/g);
                            if (match) {
                                textColor = '#' + match.slice(0,3).map(n => parseInt(n).toString(16).padStart(2,'0')).join('');
                            }
                        }
                        const path = font.getPath(text, textX, textY, fontSize);
                        svgTextPaths += `  <path d="${path.toPathData()}" fill="${textColor}"/>\n`;
                    });
                    // Dann alle anderen Elemente (Hintergründe, Handles, Info-Displays)
                    Array.from(textblocks).forEach((textblock, i) => {
                        const tbRect = textblock.getBoundingClientRect();
                        const clipEl = textblock.querySelector('.textblock-clip');
                        const clipRect = clipEl ? clipEl.getBoundingClientRect() : tbRect;
                        const clipX = clipRect.left - cardRect.left;
                        const clipY = clipRect.top - cardRect.top;
                        const clipWidth = clipRect.width;
                        const clipHeight = clipRect.height;
                        const clipStyle = window.getComputedStyle(clipEl || textblock);
                        const borderRadius = parseFloat(clipStyle.borderRadius) || 16;
                        svgContent += `  <rect x="${clipX}" y="${clipY}" width="${clipWidth}" height="${clipHeight}" rx="${borderRadius}" fill="white"/>\n`;
                        // Handles
                        const resizeHandles = textblock.querySelectorAll('.resize-handle');
                        if (resizeHandles.length > 0) {
                            resizeHandles.forEach(handle => {
                                const handleRect = handle.getBoundingClientRect();
                                const handleX = handleRect.left - cardRect.left;
                                const handleY = handleRect.top - cardRect.top;
                                const handleWidth = handleRect.width;
                                const handleHeight = handleRect.height;
                                const handleStyle = window.getComputedStyle(handle);
                                let handleBg = handleStyle.backgroundColor;
                                if (handleBg.startsWith('rgb')) {
                                    const match = handleBg.match(/(\d+)/g);
                                    if (match && match.length >= 3) {
                                        handleBg = '#' + match.slice(0,3).map(n => parseInt(n).toString(16).padStart(2,'0')).join('');
                                    }
                                }
                                const handleRadius = parseFloat(handleStyle.borderRadius) || 3;
                                svgContent += `  <rect x="${handleX}" y="${handleY}" width="${handleWidth}" height="${handleHeight}" rx="${handleRadius}" fill="${handleBg}"/>\n`;
                            });
                        }
                        // Info-Display
                        const infoEl = textblock.querySelector('.textblock-info');
                        if (infoEl) {
                            const infoSpans = infoEl.querySelectorAll('span');
                            infoSpans.forEach(span => {
                                const spanRect = span.getBoundingClientRect();
                                const spanX = spanRect.left - cardRect.left;
                                const spanY = spanRect.top - cardRect.top;
                                const spanWidth = spanRect.width;
                                const spanHeight = spanRect.height;
                                const spanStyle = window.getComputedStyle(span);
                                let spanBg = spanStyle.backgroundColor;
                                if (spanBg.startsWith('rgb')) {
                                    const match = spanBg.match(/(\d+)/g);
                                    if (match && match.length >= 3) {
                                        spanBg = '#' + match.slice(0,3).map(n => parseInt(n).toString(16).padStart(2,'0')).join('');
                                    }
                                }
                                const spanRadius = parseFloat(spanStyle.borderRadius) || 8;
                                let spanColor = spanStyle.color;
                                if (spanColor.startsWith('rgb')) {
                                    const match = spanColor.match(/(\d+)/g);
                                    if (match) {
                                        spanColor = '#' + match.slice(0,3).map(n => parseInt(n).toString(16).padStart(2,'0')).join('');
                                    }
                                }
                                const spanFontSize = parseFloat(spanStyle.fontSize);
                                const spanText = span.textContent;
                                svgContent += `  <rect x="${spanX}" y="${spanY}" width="${spanWidth}" height="${spanHeight}" rx="${spanRadius}" fill="${spanBg}"/>\n`;
                                // Text als Outline (Pfad) mit opentype.js
                                if (window.opentype && font) {
                                    // Exakte Zentrierung: Berechne BoundingBox und setze Pfad mittig im Rechteck
                                    const textPath = font.getPath(spanText, 0, 0, spanFontSize);
                                    const box = textPath.getBoundingBox();
                                    const textWidth = box.x2 - box.x1;
                                    const textHeight = box.y2 - box.y1;
                                    // Ziel: Mitte des Rechtecks (spanX + spanWidth/2, spanY + spanHeight/2)
                                    // Korrigiere für die BoundingBox des Textes
                                    const centerX = spanX + spanWidth / 2;
                                    const centerY = spanY + spanHeight / 2;
                                    // Offset: Mitte des Textes auf Mitte des Rechtecks
                                    const offsetX = centerX - (box.x1 + textWidth / 2);
                                    // Vertikal: optisch mittig, Grundlinie möglichst mittig im Button
                                    // Korrigiere Offset, damit Text nicht zu tief sitzt
                                    const offsetY = centerY - (box.y1 + textHeight / 2) + spanFontSize * 0.02;
                                    const centeredPath = font.getPath(spanText, offsetX, offsetY, spanFontSize);
                                    svgContent += `  <path d=\"${centeredPath.toPathData()}\" fill=\"${spanColor}\"/>\n`;
                                }
                            });
                        }
                    });
                    // Jetzt die Textpfade einfügen (über den weißen Rechtecken, unter den Handles/Info)
                    svgContent += svgTextPaths;
                    svgContent += '</svg>';
                    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'playground-01-export.svg';
                    document.body.appendChild(a);
                    a.click();
                    setTimeout(() => {
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                    }, 100);
                    console.log('Export complete');
                });
            } else {
                alert('opentype.js ist nicht geladen!');
            }
        } catch (error) {
            console.error('Export error:', error);
            alert('Export failed: ' + error.message);
        }
    });
}

// All old code has been replaced with new setupTextblock() function above
