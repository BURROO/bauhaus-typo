console.log("script.js loaded");

// Loading screen
window.addEventListener('load', function() {
    const loadingScreen = document.getElementById('loading-screen');
    const interfaceWrapper = document.querySelector('.interface-wrapper');
    const cardDescription = document.querySelector('.card-description');
    const descriptionText = document.querySelector('.description-text');
    
    // Wait for the loading bar to complete (2s animation + small delay)
    setTimeout(function() {
        loadingScreen.classList.add('hidden');
        
        // Spread cards after loading screen fades
        setTimeout(function() {
            interfaceWrapper.classList.add('cards-spread');
        }, 200);
        
        // Show card description after cards spread - no animation
        setTimeout(function() {
            if (cardDescription && descriptionText) {
                const originalText = descriptionText.getAttribute('data-text');
                descriptionText.textContent = originalText;
                cardDescription.style.opacity = '1';
                cardDescription.style.visibility = 'visible';
            }
        }, 800);
        
        // Remove from DOM after fade transition
        setTimeout(function() {
            loadingScreen.remove();
        }, 500);
    }, 2200);
});

// Set default font to ABCFavorit-Regular on page load
window.addEventListener('DOMContentLoaded', function() {
    const defaultFont = 'ABCFavorit-Regular';
    document.documentElement.style.setProperty('--active-font', defaultFont);
    document.body.style.fontFamily = defaultFont;
    
    document.querySelectorAll('.card-title, .ui-button, .write-textarea, .help-glyph, .card-description').forEach(el => {
        el.style.fontFamily = defaultFont;
    });
    
    console.log(`Default font set to: ${defaultFont}`);
});

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
        document.querySelectorAll('.card-title, .ui-button, .write-textarea, .help-glyph, .card-description').forEach(el => {
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

// Help button functionality
const helpButton = document.getElementById('help-button');
const cardDescription = document.querySelector('.card-description');
const closeDescription = document.querySelector('.close-description');
const descriptionText = document.querySelector('.description-text');

// Store the original text as data attribute
if (descriptionText) {
    const originalText = descriptionText.textContent.trim();
    descriptionText.setAttribute('data-text', originalText);
    descriptionText.textContent = ''; // Clear the text initially
}

// Typewriter effect function
let isTyping = false;

function typeWriter(element, text, speed = 20) {
    if (isTyping) return;
    
    isTyping = true;
    let i = 0;
    element.textContent = ''; // Clear before starting
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            isTyping = false;
        }
    }
    
    type();
}

if (helpButton && cardDescription && descriptionText) {
    helpButton.addEventListener('click', function() {
        if (cardDescription.style.visibility === 'visible') {
            cardDescription.style.opacity = '0';
            cardDescription.style.visibility = 'hidden';
        } else {
            const originalText = descriptionText.getAttribute('data-text');
            descriptionText.textContent = originalText;
            cardDescription.style.opacity = '1';
            cardDescription.style.visibility = 'visible';
        }
    });
}

if (closeDescription && cardDescription) {
    closeDescription.addEventListener('click', function() {
        cardDescription.style.opacity = '0';
        cardDescription.style.visibility = 'hidden';
        isTyping = false;
    });
}

// Invert, Outline, and Colorwheel Buttons//
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

    //Color Wheel Button//
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

