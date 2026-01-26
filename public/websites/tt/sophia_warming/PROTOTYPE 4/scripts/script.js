// Wiring UI -> metaballs renderer (unchanged behavior)
const inputLeft = document.getElementById('top-left');
const inputCenter = document.getElementById('top-center');
const inputRight = document.getElementById('top-right');
const canvasEl = document.getElementById('metaball-canvas');
const slider = document.getElementById('slider-distortion');

// Provide text lines to renderer
window.metaballUI = {
  getTextLines: function () {
    return [
      inputLeft.value || inputLeft.placeholder || '',
      inputCenter.value || inputCenter.placeholder || '',
      inputRight.value || inputRight.placeholder || ''
    ];
  },
};

// Initialize renderer on load
window.addEventListener('load', () => {
  if (window.metaballs && typeof window.metaballs.init === 'function') {
    window.metaballs.init(canvasEl);
    window.metaballs.render(Number(slider.value));
  }
});

// Render when inputs change
[inputLeft, inputCenter, inputRight].forEach(el => {
  el.addEventListener('input', () => {
    if (window.metaballs && typeof window.metaballs.render === 'function') {
      window.metaballs.render(Number(slider.value));
    }
  });
});

// Slider only controls distortion (no animation)
if (slider) {
  slider.addEventListener('input', (e) => {
    if (window.metaballs && typeof window.metaballs.render === 'function') {
      window.metaballs.render(Number(e.target.value));
    }
  });
}