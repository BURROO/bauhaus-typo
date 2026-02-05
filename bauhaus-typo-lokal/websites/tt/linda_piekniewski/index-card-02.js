console.log("index-card-02.js loaded");

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
        
        // Apply to all elements including text boxes
        document.querySelectorAll('.card-title, .ui-button, .write-textarea, .textblock-text, .help-glyph, .card-description').forEach(el => {
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

// ===== MIRROR TEXT BOX FUNCTIONALITY =====

const addButton = document.getElementById('add-button');
const deleteButton = document.getElementById('delete-button');
const contentLayer = document.querySelector('.content-layer');
const cardElement = document.querySelector('.card-2');

let selectedBoxes = []; // Changed to array for multi-selection
let boxCounter = 0;

// Add button - creates a new text box
addButton.addEventListener('click', function() {
    // Position boxes diagonally like in _01
    const x = 100 + boxCounter * 50;
    const y = 150 + boxCounter * 50;
    createTextBox(x, y);
});

// Create a new text box at the specified position
function createTextBox(x, y, text = 'Lorem') {
    const template = document.getElementById('textbox-template');
    const textBox = template.content.cloneNode(true).querySelector('.textblock');
    
    const textblockText = textBox.querySelector('.textblock-text');
    textblockText.textContent = text;
    
    textBox.dataset.boxId = ++boxCounter;
    
    // First box (boxCounter === 1) is always 80pt, others are random
    let randomSize;
    if (boxCounter === 1) {
        // 80pt = 107px (80 * 96 / 72)
        randomSize = 107;
    } else {
        // Random font size between 80pt and 240pt (107px to 320px)
        randomSize = Math.floor(Math.random() * (320 - 107 + 1)) + 107;
    }
    textblockText.style.fontSize = randomSize + 'px';
    
    // Fixed outline-offset of 15px
    const outlineOffset = 15;
    textBox.style.setProperty('--outline-offset', `${outlineOffset}px`);
    
    // Calculate proportional stroke-width: max 2px at 36pt or above, scales down below
    const fontSizePt = pxToPt(randomSize);
    const strokeWidth = fontSizePt >= 36 ? 2 : (fontSizePt / 36) * 2;
    textBox.style.setProperty('--text-stroke-width', `${strokeWidth}px`);
    
    // Update info display with actual font size
    updateTextInfo(textBox, randomSize);
    
    // Position the box
    textBox.style.left = x + 'px';
    textBox.style.top = y + 'px';
    
    contentLayer.appendChild(textBox);
    
    // Bring box to front when text is focused
    textblockText.addEventListener('focus', function() {
        selectBox(textBox, false);
    });
    
    // Make box selectable - but allow text editing
    textBox.addEventListener('mousedown', function(e) {
        // Only select if clicking on padding/border area, not on text-content itself
        if (e.target === textblockText || textblockText.contains(e.target)) {
            // Allow text editing
            return;
        }
        e.stopPropagation();
        selectBox(textBox, e.shiftKey);
    });
    
    // Make box draggable
    makeBoxDraggable(textBox);
    
    // Make info fields editable
    setupInfoFieldListeners(textBox);
    
    // Select the new box
    selectBox(textBox, false);
    
    return textBox;
}

// Setup listeners for editable info fields (pt and %)
function setupInfoFieldListeners(textBox) {
    const textblockText = textBox.querySelector('.textblock-text');
    const infoFont = textBox.querySelector('.info-font');
    const infoScale = textBox.querySelector('.info-scale');
    
    // Handle pt input
    if (infoFont) {
        infoFont.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const value = parseFloat(infoFont.textContent);
                if (!isNaN(value) && value > 0) {
                    // Convert pt to px: pt * 96 / 72
                    const newSizePx = value * 96 / 72;
                    textblockText.style.fontSize = newSizePx + 'px';
                    
                    // Update stroke-width: max 2px at 36pt or above, scales down below
                    const strokeWidth = value >= 36 ? 2 : (value / 36) * 2;
                    textBox.style.setProperty('--text-stroke-width', `${strokeWidth}px`);
                    
                    updateTextInfo(textBox, newSizePx);
                }
                infoFont.blur();
            }
        });
        
        infoFont.addEventListener('blur', function() {
            // Restore format if user left field
            const currentSizePx = parseFloat(textblockText.style.fontSize);
            updateTextInfo(textBox, currentSizePx);
        });
        
        // Prevent drag when clicking info field
        infoFont.addEventListener('mousedown', function(e) {
            e.stopPropagation();
        });
    }
    
    // Handle % input
    if (infoScale) {
        infoScale.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const value = parseFloat(infoScale.textContent);
                if (!isNaN(value) && value > 0) {
                    // Convert % to pt: (% / 100) * 36
                    const ptValue = (value / 100) * 36;
                    // Convert pt to px: pt * 96 / 72
                    const newSizePx = ptValue * 96 / 72;
                    textblockText.style.fontSize = newSizePx + 'px';
                    
                    // Update stroke-width: max 2px at 36pt or above, scales down below
                    const strokeWidth = ptValue >= 36 ? 2 : (ptValue / 36) * 2;
                    textBox.style.setProperty('--text-stroke-width', `${strokeWidth}px`);
                    
                    updateTextInfo(textBox, newSizePx);
                }
                infoScale.blur();
            }
        });
        
        infoScale.addEventListener('blur', function() {
            // Restore format if user left field
            const currentSizePx = parseFloat(textblockText.style.fontSize);
            updateTextInfo(textBox, currentSizePx);
        });
        
        // Prevent drag when clicking info field
        infoScale.addEventListener('mousedown', function(e) {
            e.stopPropagation();
        });
    }
}

// Update position of focus outline for fixed positioning
// Helper function to convert px to pt
function pxToPt(px) {
    return px * 72 / 96;
}

// Helper function to calculate percentage (36pt = 100%)
function calculatePercentage(pt) {
    return (pt / 36) * 100;
}

// Update text info display (pt and %)
function updateTextInfo(textBox, fontSizePx) {
    const infoFont = textBox.querySelector('.info-font');
    const infoScale = textBox.querySelector('.info-scale');
    
    const fontSizePt = pxToPt(fontSizePx);
    const percentage = calculatePercentage(fontSizePt);
    
    if (infoFont) infoFont.textContent = fontSizePt.toFixed(1) + " pt";
    if (infoScale) infoScale.textContent = Math.round(percentage) + "%";
}

// Select a text box (with multi-select support via Shift key)
function selectBox(box, isShiftClick = false) {
    if (isShiftClick) {
        // Multi-selection mode with Shift
        if (box.classList.contains('selected')) {
            // Deselect if already selected
            box.classList.remove('selected');
            const index = selectedBoxes.indexOf(box);
            if (index > -1) {
                selectedBoxes.splice(index, 1);
            }
        } else {
            // Add to selection
            box.classList.add('selected');
            selectedBoxes.push(box);
            bringToFront(box);
        }
    } else {
        // Single selection mode (no Shift)
        // Deselect all boxes
        document.querySelectorAll('.textblock').forEach(b => {
            b.classList.remove('selected');
        });
        selectedBoxes = [];
        
        // Select this box
        box.classList.add('selected');
        selectedBoxes.push(box);
        bringToFront(box);
    }
}

// Bring a box to the front
function bringToFront(box) {
    const allBoxes = Array.from(document.querySelectorAll('.textblock'));
    const maxZ = Math.max(10, ...allBoxes.map(b => parseInt(b.style.zIndex) || 10));
    box.style.zIndex = maxZ + 1;
}

// Deselect all boxes
function deselectAll() {
    document.querySelectorAll('.textblock').forEach(b => {
        b.classList.remove('selected');
    });
    selectedBoxes = [];
}

// Deselect all boxes when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.textblock') && !e.target.closest('#add-button')) {
        deselectAll();
    }
});

// Make a box draggable
function makeBoxDraggable(box) {
    let isDragging = false;
    let hasMoved = false;
    let startX, startY, initialLeft, initialTop;
    
    const dragZone = box.querySelector('.textblock-drag-zone');
    
    // Drag zone handles all dragging
    dragZone.addEventListener('mousedown', function(e) {
        // Select box and bring to front
        selectBox(box, e.shiftKey);
        
        isDragging = true;
        hasMoved = false;
        startX = e.clientX;
        startY = e.clientY;
        
        const rect = box.getBoundingClientRect();
        const cardRect = cardElement.getBoundingClientRect();
        
        initialLeft = rect.left - cardRect.left;
        initialTop = rect.top - cardRect.top;
        
        document.body.style.cursor = 'grabbing';
        dragZone.style.cursor = 'grabbing';
        e.preventDefault();
        e.stopPropagation();
    });
    
    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            // Check if mouse has moved more than 3 pixels
            if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
                hasMoved = true;
            }
            
            if (hasMoved) {
                box.style.left = (initialLeft + deltaX) + 'px';
                box.style.top = (initialTop + deltaY) + 'px';
            }
        }
    });
    
    document.addEventListener('mouseup', function(e) {
        if (isDragging) {
            isDragging = false;
            document.body.style.cursor = '';
            dragZone.style.cursor = 'grab';
        }
    });
}

// Copy-Paste functionality with mirroring (supports multiple boxes)
document.addEventListener('copy', function(e) {
    if (selectedBoxes.length > 0) {
        const boxesData = selectedBoxes.map(box => ({
            text: box.textContent,
            left: parseFloat(box.style.left),
            top: parseFloat(box.style.top),
            fontSize: box.style.fontSize,
            boxId: box.dataset.boxId
        }));
        
        e.clipboardData.setData('text/plain', JSON.stringify(boxesData));
        e.preventDefault();
        
        console.log('Boxes copied:', boxesData);
    }
});

document.addEventListener('paste', function(e) {
    try {
        const clipboardData = e.clipboardData.getData('text/plain');
        const boxesData = JSON.parse(clipboardData);
        
        // Check if it's an array (multiple boxes) or single box
        const dataArray = Array.isArray(boxesData) ? boxesData : [boxesData];
        
        if (dataArray.length > 0 && dataArray[0].text !== undefined) {
            // Get card dimensions
            const cardRect = cardElement.getBoundingClientRect();
            const cardWidth = cardRect.width;
            const cardHeight = cardRect.height;
            
            // Deselect all current boxes
            deselectAll();
            
            // Create boxes at random positions for each copied box
            dataArray.forEach(boxData => {
                // Generate random position within card bounds
                // Leave some margin (50px) from edges
                const margin = 50;
                const randomLeft = Math.random() * (cardWidth - margin * 2) + margin;
                const randomTop = Math.random() * (cardHeight - margin * 2) + margin;
                
                // Create the box at random position
                const newBox = createTextBox(randomLeft, randomTop, boxData.text);
                
                // Apply the same font size
                if (boxData.fontSize) {
                    newBox.style.fontSize = boxData.fontSize;
                }
                
                // Add to selection
                newBox.classList.add('selected');
                selectedBoxes.push(newBox);
                
                console.log('Box pasted at random position:', {
                    x: randomLeft,
                    y: randomTop
                });
            });
            
            e.preventDefault();
        }
    } catch (error) {
        // Not a text box - ignore
        console.log('Paste ignored (not a text box)');
    }
});

// Delete button - removes all selected boxes
deleteButton.addEventListener('click', function() {
    if (selectedBoxes.length > 0) {
        selectedBoxes.forEach(box => box.remove());
        selectedBoxes = [];
    }
});

// Delete with keyboard (Delete or Backspace) - removes all selected boxes
document.addEventListener('keydown', function(e) {
    if ((e.key === 'Delete' || e.key === 'Backspace') && selectedBoxes.length > 0) {
        // Only delete if not editing text in any box
        const isEditingText = selectedBoxes.some(box => document.activeElement === box);
        
        if (!isEditingText) {
            selectedBoxes.forEach(box => box.remove());
            selectedBoxes = [];
            e.preventDefault();
        }
    }
});

// Sync text editing across all selected boxes
document.addEventListener('input', function(e) {
    if (e.target.classList.contains('textblock-text')) {
        const currentText = e.target;
        const currentBox = currentText.closest('.textblock');
        if (currentBox && selectedBoxes.includes(currentBox) && selectedBoxes.length > 1) {
            const newText = currentText.textContent;
            // Update all other selected boxes
            selectedBoxes.forEach(box => {
                if (box !== currentBox) {
                    const boxText = box.querySelector('.textblock-text');
                    if (boxText) {
                        boxText.textContent = newText;
                    }
                }
            });
        }
    }
});

// Help button and card description
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
