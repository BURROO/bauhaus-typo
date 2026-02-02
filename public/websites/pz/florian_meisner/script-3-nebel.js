const overlay = document.getElementById("blur-overlay");

document.addEventListener("mousemove", (e) => {
  const x = e.clientX;
  const y = e.clientY;

  overlay.style.maskImage = `radial-gradient(circle 300px at ${x}px ${y}px, transparent 0%, black 70%)`;
  overlay.style.webkitMaskImage = `radial-gradient(circle 300px at ${x}px ${y}px, transparent 0%, black 70%)`;
});


// Gegenläufiger Scroll-Effekt

document.addEventListener("DOMContentLoaded", () => {
  const textEl = document.querySelector(".headline-2-background");
  const imagesEl = document.querySelector(".images");

  if (!textEl || !imagesEl) return;

  const IMAGE_SPEED = 0.6;
  const TEXT_SPEED = 0.7;

  const TEXT_START = window.innerHeight * 0.001; // ab wann Text reinscrollt

  let ticking = false;

  function update() {
    const scrollY = window.scrollY;

    /* Bilder: gehen weg*/
    imagesEl.style.transform =
      `translateY(${scrollY * IMAGE_SPEED}px)`;

    /* Text: kommt rein */
    const textProgress = Math.max(0, scrollY - TEXT_START);

    const startY = window.innerHeight * 1.2; // 120vh
    textEl.style.transform = `translateY(${startY - textProgress * TEXT_SPEED}px)`;


    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  });

  update();
});
