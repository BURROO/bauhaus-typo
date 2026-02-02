// Seleziono tutte le parole con data-img
document.querySelectorAll("li[data-img]").forEach(li => {
  li.addEventListener("click", () => {

    // Evita duplicati: controlla se esiste già un box con la stessa immagine
    const existing = document.querySelector(
      `.image-toggle[data-img="${li.dataset.img}"]`
    );
    if (existing) return;

    // Creo il div che conterrà l'immagine
    const div = document.createElement("div");
    div.classList.add("image-toggle");
    if (li.dataset.class) div.classList.add(li.dataset.class);
    div.dataset.img = li.dataset.img;

    // Creo il tag <img>
    const img = document.createElement("img");
    img.src = `images/${li.dataset.img}.webp`; // ← SOLO WEBP
    img.alt = li.textContent;

    // Inserisco immagine nel div
    div.appendChild(img);
    document.body.appendChild(div);

    // Mostro il box
    div.style.display = "block";

    /* AUTO-CHIUSURA */
    const delay = li.dataset.time ? parseInt(li.dataset.time) : 120000;
    const autoClose = setTimeout(() => {
      div.remove();
    }, delay);

    /* CHIUSURA MANUALE */
    div.addEventListener("click", () => {
      clearTimeout(autoClose);
      div.remove();
    });
  });
});


// ---------------- FILTRI ----------------
const stars = document.querySelectorAll('.star');
const allListItems = document.querySelectorAll('.list-centrate li');
const resetBtn = document.getElementById('reset-btn');

stars.forEach(star => {
  star.addEventListener('click', () => {
    star.classList.toggle('active');

    const activeFilters = Array.from(
      document.querySelectorAll('.star.active')
    ).map(s => s.getAttribute('data-filter'));

    allListItems.forEach(li => {
      const itemTag = li.getAttribute('data-tags');

      if (activeFilters.length === 0) {
        li.classList.remove('is-filtered');
      } else {
        activeFilters.includes(itemTag)
          ? li.classList.remove('is-filtered')
          : li.classList.add('is-filtered');
      }
    });
  });
});


// ---------------- RESET ----------------
resetBtn.addEventListener('click', () => {
  stars.forEach(s => s.classList.remove('active'));
  allListItems.forEach(li => li.classList.remove('is-filtered'));
  document.querySelectorAll('.image-toggle').forEach(div => div.remove());
});
