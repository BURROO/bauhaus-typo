// Filters aus localStorage laden oder leeres Objekt
const filters = JSON.parse(localStorage.getItem("filters")) || {};

// JSON laden und Releases erstellen
fetch("data/releases.json")
  .then(res => res.json())
  .then(data => {
    createReleases(data);
    applyFilters();
  });

// Releases erzeugen
function createReleases(data) {
  const grid = document.querySelector(".releases-grid");
  grid.innerHTML = ""; // vorher leeren

  data.forEach(item => {
    const div = document.createElement("div");
    div.className = "release";


// Informations erstellen
fetch("data/releases.json")
    .then(res => res.json())
    .then(data => {
        createReleaseInformation(data);
    })

// ReleaseInformations erzeugen
function createReleaseInformation(data) {
  const grid = document.querySelector(".releaseInfo");
  grid.innerHTML = "";

  data.forEach(item =>{
    const p = document.createElement("p");
    p.className = "informations";
  }
  )
}

    // Arrays als CSV speichern, Strings direkt
    div.dataset.year = item.year;
    div.dataset.genre = Array.isArray(item.genre) ? item.genre.join(",") : item.genre;
    div.dataset.vibe = Array.isArray(item.vibe) ? item.vibe.join(",") : item.vibe;
    div.dataset.media = Array.isArray(item.media) ? item.media.join(",") : item.media;
    div.dataset.color = Array.isArray(item.color) ? item.color.join(",") : item.color;
    div.dataset.tierlist = Array.isArray(item.tierlist) ? item.tierlist.join(",") :item.tierlist;
    div.dataset.graphic = Array.isArray(item.graphic) ? item.graphic.join(",") :item.graphic;

    const img = document.createElement("img");
    img.src = "cover/"+item.id+".jpg";
    img.loading = "lazy";

    div.appendChild(img);
    grid.appendChild(div);

    const info = document.createElement("div");
    info.className = "release-info";

    const title = document.createElement("h3");
    title.textContent = item.name;

    const comment = document.createElement("p");
    comment.textContent = item.comments;

    info.appendChild(title);
    info.appendChild(comment);
    div.appendChild(info);
  });
}

// Filter anwenden
function applyFilters() {
  document.querySelectorAll(".release").forEach(release => {
    let show = true;

    for (const key in filters) {
      if (filters[key] === "all") continue; // überspringen, wenn "show all" gewählt

      const value = release.dataset[key];

      // Prüfen, ob das Attribut ein Array (CSV) ist
      if (value.includes(",")) {
        const valuesArray = value.split(",");
        if (!valuesArray.includes(filters[key])) {
          show = false;
          break;
        }
      } else {
        if (value !== filters[key]) {
          show = false;
          break;
        }
      }
    }

    release.style.display = show ? "block" : "none";
  });

  toggleEmptyState();
}

function toggleEmptyState() {
  const grid = document.querySelector(".releases-grid");
  let emptyState = document.querySelector(".no-releases");

  const releases = document.querySelectorAll(".release");

  // TRUE, wenn mindestens ein Release sichtbar ist
  const hasVisibleReleases = [...releases].some(release => {
    return window.getComputedStyle(release).display !== "none";
  });

  // Empty-State einmal erstellen
  if (!emptyState) {
    emptyState = document.createElement("div");
    emptyState.className = "no-releases";
    emptyState.textContent = "sorry, for your applied filters.... there are no releases............... available yet... I´m working on it! please select some new..... filters!..........................................";
    grid.appendChild(emptyState);
  }

  emptyState.style.display = hasVisibleReleases ? "none" : "block";
}

// Optional: Filter speichern, wenn Dropdowns geändert werden
document.querySelectorAll(".selection select").forEach(select => {
  select.addEventListener("change", e => {
    filters[e.target.id] = e.target.value;
    localStorage.setItem("filters", JSON.stringify(filters));
    applyFilters();
  });
});

let textVisible = true;

// Button auswählen
const toggleBtn = document.getElementById("toggleTextBtn");

toggleBtn.addEventListener("click", () => {
    textVisible = !textVisible; // Status umdrehen

    // Alle Release-Infos ein-/ausblenden
    document.querySelectorAll(".release-info").forEach(info => {
        info.style.display = textVisible ? "block" : "none";
    });

    // Button-Text anpassen
    toggleBtn.textContent = textVisible ? "I only wanna see the covers" : "show me some infos";
});