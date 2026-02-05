document.addEventListener("DOMContentLoaded", () => {

  const h2s = Array.from(document.querySelectorAll("#centeralign h2"));
  if (!h2s.length) return;

  const typeSpeed = 150;   // ms per character
  const holdMs = 700;     // pause when line is complete
  const gapMs = 200;      // pause before next line

  // Store original text
  const texts = h2s.map(h2 => h2.textContent);

  // Prepare elements
  h2s.forEach(h2 => {
    h2.textContent = "";
    h2.style.opacity = "1";
  });

  const wait = ms => new Promise(r => setTimeout(r, ms));

  async function typeIn(el, text) {
    for (let i = 0; i < text.length; i++) {
      el.textContent += text.charAt(i);
      await wait(typeSpeed);
    }
  }

  async function typeOut(el) {
    while (el.textContent.length > 0) {
      el.textContent = el.textContent.slice(0, -1);
      await wait(typeSpeed);
    }
  }

  async function loop() {
    let index = 0;
    while (true) {
      const el = h2s[index];
      const text = texts[index];

      await typeIn(el, text);
      await wait(holdMs);
      await typeOut(el);
      await wait(gapMs);

      index = (index + 1) % h2s.length;
    }
  }

  loop();

});



// Bouncy bounch Bereich 

(() => {
  const stage = document.querySelector(".bounce");
  const stone = document.getElementById("stone");

  if (!stage || !stone) {
    console.warn("stage oder stone nicht gefunden");
    return;
  }

  // Geschindigkeit 
  let x = 50, y = 50;
  let speed = 0.5;      
  let vx = speed;
  let vy = speed;



  function start() {
    function tick() {
      const stageRect = stage.getBoundingClientRect();
      const stoneRect = stone.getBoundingClientRect();

      const maxX = stageRect.width - stoneRect.width;
      const maxY = stageRect.height - stoneRect.height;

      x += vx;
      y += vy;

      if (x <= 0) { x = 0; vx *= -1; }
      if (x >= maxX) { x = maxX; vx *= -1; }

      if (y <= 0) { y = 0; vy *= -1; }
      if (y >= maxY) { y = maxY; vy *= -1; }

      stone.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  if (stone.complete && stone.naturalWidth > 0) {
    start();
  } else {
    stone.addEventListener("load", start, { once: true });
    stone.addEventListener("error", () => {
      console.error("Bild konnte nicht geladen werden (src prüfen):", stone.src);
    }, { once: true });
  }
})();
