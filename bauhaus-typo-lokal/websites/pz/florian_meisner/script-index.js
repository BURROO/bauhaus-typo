document.addEventListener("mousemove", parallax);

const img = document.querySelector(".stone-img");

function parallax(e) {
  const w = window.innerWidth / 2;
  const h = window.innerHeight / 2;

  const mouseX = e.clientX - w;
  const mouseY = e.clientY - h;

  // STARKER Effekt + entgegengesetzte Richtung
  const moveX = -mouseX * 1.08;
  const moveY = -mouseY * 1.08;

  img.style.transform = `
    translate(${moveX}px, ${moveY}px)
  `;
}
