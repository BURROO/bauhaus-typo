document.addEventListener("DOMContentLoaded", () => {
/* =====================================================
   APHRODITE
   ===================================================== */

const aphroditeBtn = document.getElementById("aphroditeBtn");

const aphroditeOverlays = [
  document.getElementById("aphroditeText1"),
  document.getElementById("aphroditeText2"),
  document.getElementById("aphroditeText3"),
  document.getElementById("aphroditeText4"),
];

let aphroOpen = false;

if (aphroditeBtn && aphroditeOverlays.every(Boolean)) {
  aphroditeBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    if (!aphroOpen) {
      aphroOpen = true;

      // alle vorbereiten
      aphroditeOverlays.forEach((o) => {
        o.classList.remove("aphro-visible");
        o.classList.add("aphro-hidden");
      });

      // nacheinander einblenden
      aphroditeOverlays.forEach((o, i) => {
        setTimeout(() => {
          o.classList.remove("aphro-hidden");
          o.classList.add("aphro-visible");
        }, i * 180);
      });

    } else {
      aphroOpen = false;

      // ausblenden
      aphroditeOverlays.forEach((o) => {
        o.classList.remove("aphro-visible");
        o.classList.add("aphro-hidden");
      });
    }
  });
}

  /* =====================================================
     HOVER – BILDER NACH VORNE
     ===================================================== */
  const frontImages = [
    document.querySelector(".img-1"),
    document.querySelector(".img-3"),
    document.querySelector(".img-6"),
    document.querySelector(".img-5"),
  ];

  frontImages.forEach((img) => {
    if (!img) return;
    img.addEventListener("mouseenter", () => img.classList.add("is-front"));
    img.addEventListener("mouseleave", () => img.classList.remove("is-front"));
  });

  /* =====================================================
     DANIELA – WINDOWS POPUPS
     ===================================================== */
  const danielaBtn = document.getElementById("danielaBtn");
  const danielaContainer = document.getElementById("danielaPopups");

  if (danielaBtn && danielaContainer) {
    const popups = [
      { id: "maenner-merken", text: "Und warum sind Blondinenwitze immer so kurz?<br>Damit auch Männer sie sich merken können!", size: "medium" },
      { id: "brain", text: "Haben Blondinen Kopfschmerzen?<br>Nein. No brain, no pain.", size: "small" },
      { id: "uni", text: "Was ist eine Blondine auf der Uni? - Eine Besucherin.", size: "medium" },
      { id: "bett-zettel", text: "Warum klebt bei der Blondine ein A über dem Bett?<br>Damit sie beim Sex den Text nicht vergisst.", size: "large" },
      { id: "gehirnzellen", text: "Wie nennt man eine Blondine mit zwei Gehirnzellen? - Schwanger.", size: "small" },
      { id: "wand", text: "Was passiert, wenn sich eine Blondine an eine Wand lehnt? Die Wand fällt um. Warum? <br> Die Klügere gibt nach!", size: "medium" },
      { id: "pizza", text: "Kommt eine Blondine in eine Pizzaria.<br>Als der Kellner ihre Bestellung aufnehmen will fragt die Blondine ›Gibt es hier auch eine Pizza für Blondinen?‹<br>Darauf der Kellner:›Ja, aber die hat nichts drauf.‹", size: "medium" },
      { id: "stroh", text: "Zwei Blondinen bewerfen sich mit Stroh.<br>Wie nennt man das? - Gedankenaustausch.", size: "small" },
      { id: "wenden", text: "Wie kann man eine Blondine ewig beschäftigen?<br>Man nimmt einen Zettel und schreibt auf beiden Seiten: ›bitte wenden!‹", size: "small" },
      { id: "bierflasche", text: "Was haben eine Blondine und eine Bierflasche miteinander gemein?<br>Beide sind vom Hals aufwärts leer.", size: "medium" },
      { id: "arzt", text: "Kommt eine Blondine zum Gynäkologen und klagt:›immer wenn ich Wasser lasse, kommen bei mir Briefmarken raus.‹<br>Nach der Untersuchung stellt der Arzt fest:<br>›Gute Frau, das waren die Aufkleber, die man auf Bananen findet‹", size: "large" },
      { id: "schwarz", text: "Wie nennt man eine Blondine die sich die Haare schwarz färbt? - Künstliche Intelligenz.", size: "small" },
      { id: "kino", text: "Ein Mann spricht eine Blondine an…<br>›Na, schöne Frau, wohin gehen Sie denn mit den langen Beinen?‹ Blondine: ›Wenn nichts dazwischenkommt, ins Kino.‹", size: "large" },
    ];

    let opened = false;

    danielaBtn.addEventListener("click", () => {
      if (opened) return;
      opened = true;
      popups.forEach((p, i) => setTimeout(() => spawnPopup(p), i * 180));
    });

    function spawnPopup(p) {
      const el = document.createElement("div");
      el.className = `win-popup ${p.size}`;
      el.id = p.id;

      el.innerHTML = `
        <div class="win-header">
          <span>Program critical error</span>
          <button class="close-btn" type="button">×</button>
        </div>
        <div class="win-body">${p.text}</div>
      `;

      el.querySelector(".close-btn").addEventListener("click", () => el.remove());
      danielaContainer.appendChild(el);
    }
  }

  /* =====================================================
     DRAGGABLE WINDOWS – PARIS / ROSALIE / MARILYN
     ===================================================== */
  let topZ = 100000;

  $(".win-popup").draggable({
    handle: ".win-header",
    containment: "body",
  });

  $(document).on("mousedown", ".win-popup", function () {
    topZ++;
    $(this).css("z-index", topZ);
  });

  // PARIS
  $("#parisBtn").on("click", function (e) {
    e.stopPropagation();
    $("#parisPopup").removeClass("is-hidden").show();
    topZ++;
    $("#parisPopup").css("z-index", topZ);
  });

  $("#parisCloseBtn").on("click", function () {
    $("#parisPopup").addClass("is-hidden").hide();
  });

  // ROSALIE
  $("#rosalieBtn").on("click", function (e) {
    e.stopPropagation();
    $("#rosaliePopup").removeClass("is-hidden").show();
    topZ++;
    $("#rosaliePopup").css("z-index", topZ);
  });

  $("#rosalieCloseBtn").on("click", function () {
    $("#rosaliePopup").addClass("is-hidden").hide();
  });

  // MARILYN
  $("#marilynBtn").on("click", function (e) {
    e.stopPropagation();
    $("#marilynPopup").removeClass("is-hidden").show();
    topZ++;
    $("#marilynPopup").css("z-index", topZ);
  });

  $("#marilynCloseBtn").on("click", function () {
    $("#marilynPopup").addClass("is-hidden").hide();
  });
  $("#parisPopup, #rosaliePopup, #marilynPopup").addClass("is-hidden").hide();

  /* =====================================================
   INLINE LINK → PARIS POPUP
   ===================================================== */
const inlineParisLink = document.getElementById("inlineParisLink");

if (inlineParisLink) {
  inlineParisLink.addEventListener("click", (e) => {
    e.stopPropagation();

    const parisPopup = $("#parisPopup");

    // falls noch zu → öffnen
    if (parisPopup.hasClass("is-hidden")) {
      parisPopup.removeClass("is-hidden").show();
    }

    // immer nach vorne holen
    topZ++;
    parisPopup.css("z-index", topZ);
  });
}
/* =====================================================
   INLINE LINK → MARILYN POPUP
   ===================================================== */

document.querySelectorAll(".inline-marilyn").forEach((el) => {
  el.addEventListener("click", (e) => {
    e.stopPropagation();

    const marilynPopup = $("#marilynPopup");

    if (marilynPopup.hasClass("is-hidden")) {
      marilynPopup.removeClass("is-hidden").show();
    }

    topZ++;
    marilynPopup.css("z-index", topZ);
  });
  });

/* =====================================================
   PAMELA – ELEMENTE
   ===================================================== */

const pamelaBtn      = document.getElementById("pamelaBtn");
const pamelaOverlay  = document.getElementById("pamelaGalleryOverlay");
const pamelaClose    = document.getElementById("pamelaGalleryCloseBtn");
const pamelaGallery  = document.getElementById("pamelaGallery");
const pamelaBackdrop = document.getElementById("pamelaBackdrop");
const iconic         = document.getElementById("pamelaIconic");

const pamelaImages = [
  "sharpay_evans.png",
  "barbie.png",
  "paris_hilton.png",
  "anna-nicole-smith.png",
  "karen_smith.png",
  "mae-west-klein.png",
  "brittney_spears.png",
  "marilyn_monroe.png",
  "elle_-woods.png",
  "madonna.png",
  "lana_turner.png",
  "dolly_parton.png",
  "rita_hayworth.png",
];


/* =====================================================
   PAPARAZZI FLASH (4 einzelne, random position, stärker)
   ===================================================== */

const flashes = Array.from(document.querySelectorAll(".paparazzi-flash"));
let paparazziTimer = null;

function triggerFlash(){
  if (!flashes.length) return;

  const el = flashes[Math.floor(Math.random() * flashes.length)];


  const margin = 120;
  const x = margin + Math.random() * (window.innerWidth  - margin * 2);
  const y = margin + Math.random() * (window.innerHeight - margin * 2);


  const size = 420 + Math.random() * 520; 
  
el.style.width  = `${size}px`;
el.style.height = `${size}px`;
el.style.left   = `${x}px`;
el.style.top    = `${y}px`;


  el.classList.remove("is-flashing");
  void el.offsetHeight; 
  el.classList.add("is-flashing");
}

function startPaparazzi(){
  stopPaparazzi();

  function loop(){

    const delay = 180 + Math.random() * 900; 
    paparazziTimer = setTimeout(() => {
      triggerFlash();

      
 if (Math.random() < 0.65){
  setTimeout(triggerFlash, 40 + Math.random() * 90);
}

      loop();
    }, delay);
  }

  loop();
}

function stopPaparazzi(){
  if (paparazziTimer){
    clearTimeout(paparazziTimer);
    paparazziTimer = null;
  }
}


/* =====================================================
   OPEN / CLOSE
   ===================================================== */

function openPamelaGallery(){
  if (!pamelaOverlay || !pamelaGallery || !pamelaBackdrop) return;

  pamelaOverlay.classList.remove("is-hidden");

  pamelaBackdrop.classList.remove("is-hidden");
  requestAnimationFrame(() => pamelaBackdrop.classList.add("is-visible"));

  if (iconic){
    iconic.classList.remove("is-visible");
    requestAnimationFrame(() => iconic.classList.add("is-visible"));
  }

  startPaparazzi();

  if (pamelaGallery.children.length === 0){
    pamelaImages.forEach((src, i) => {
      const img = document.createElement("img");
      img.src = src;
      img.alt = src;
      img.classList.add("pamela-img", `img--${src.replace(".png","")}`);
      pamelaGallery.appendChild(img);
      setTimeout(() => img.classList.add("is-in"), i * 180);
    });
  } else {
    [...pamelaGallery.children].forEach((img, i) => {
      img.classList.remove("is-in");
      setTimeout(() => img.classList.add("is-in"), i * 120);
    });
  }

  pamelaGallery.scrollLeft = 0;
}

function closePamelaGallery(){
  if (pamelaOverlay) pamelaOverlay.classList.add("is-hidden");

  if (pamelaBackdrop){
    pamelaBackdrop.classList.remove("is-visible");
    setTimeout(() => pamelaBackdrop.classList.add("is-hidden"), 350);
  }

  if (iconic) iconic.classList.remove("is-visible");

  stopPaparazzi();
}

/* =====================================================
   EVENTS
   ===================================================== */

if (pamelaBtn){
  pamelaBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    openPamelaGallery();
  });
}

if (pamelaClose){
  pamelaClose.addEventListener("click", (e) => {
    e.stopPropagation();
    closePamelaGallery();
  });
}

if (pamelaBackdrop){
  pamelaBackdrop.addEventListener("click", closePamelaGallery);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closePamelaGallery();
});

});