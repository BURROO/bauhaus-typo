/* ===============================
   RANDOM BACKGROUND
================================ */
const isSubPage = window.location.pathname.includes("/subs/");
const basePath = isSubPage ? "../source/" : "source/";

const images = [
  "marjan-blan-_kUxT8WkoeY-unsplash.jpg",
  "marjan-blan-5Ft4NWTmeJE-unsplash(1).jpg",
  "marjan-blan-40M5j2ygjnw-unsplash.jpg",
  "marjan-blan-794QUz5-cso-unsplash.jpg",
  "marjan-blan-ADfPdLBMeY8-unsplash.jpg",
  "marjan-blan-GOP07ZOjBEU-unsplash.jpg",
  "marjan-blan-qqz06qPB_F0-unsplash.jpg",
  "marjan-blan--Vc-ok8CeBU-unsplash.jpg"

].map(img => basePath + img);

document.body.style.backgroundImage =
  `url("${images[Math.floor(Math.random() * images.length)]}")`;
document.body.style.backgroundSize = "cover";
document.body.style.backgroundPosition = "center";


/* ===============================
   ENTRY LOGIC
================================ */
const entries = document.querySelectorAll(".entry");
const isMainPage = document.querySelector('input[name="entry"]') !== null;

let currentIndex = 0;
let radios, prevBtn, nextBtn, dayIndicator, navLinks;

if (isMainPage) {
  radios = document.querySelectorAll('input[name="entry"]');
  prevBtn = document.getElementById("prev");
  nextBtn = document.getElementById("next");
  dayIndicator = document.getElementById("dayIndicator");
  navLinks = document.querySelectorAll('.topnav a[data-target]');
}
if (isMainPage && navLinks) {
  navLinks.forEach((link, index) => {
    link.addEventListener("click", () => {
      showEntry(index);
    });
  });
}

/* ===============================
   UPDATE NAVIGATION ACTIVE STATE
================================ */
function updateNavigation(index) {
  if (!navLinks) return;
  
  navLinks.forEach((link, i) => {
    if (i === index) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

/* ===============================
   SHOW ENTRY
================================ */
function showEntry(index) {
  if (index < 0 || index >= entries.length) return;

  entries.forEach((entry, i) => {
    entry.classList.toggle("active", i === index);

    if (i === index) {
      const p = entry.querySelector("p");
      if (!p.dataset.text) p.dataset.text = p.innerHTML;
      p.innerHTML = "";

      switch (entry.dataset.type) {
        case "word":
          typeByWord(p);
          break;
        case "line":
          typeByLine(p);
          break;
        case "row":
          typeRowLetters(p);
          break;
        case "letterPerRow":
          typeByLetterPerRow(p);
          break;
        default:
          typeByLetter(p);
      }
    }
  });

  currentIndex = index;
  if (dayIndicator) dayIndicator.textContent = `Day ${index + 1}`;
  if (radios) radios[index].checked = true;

  updateNavigation(index);

  // remember last read entry
  localStorage.setItem("lastEntryIndex", index);

  // update subpage links
  updateSubLinks();
}

function updateSubLinks() {
  const activeEntry = entries[currentIndex];
  if (!activeEntry) return;
  const entryId = activeEntry.id;

  const links = activeEntry.querySelectorAll('a[href^="subs/"]');
  links.forEach(link => {
    const url = new URL(link.getAttribute("href"), window.location.origin);
    url.searchParams.set("from", entryId);
    link.setAttribute("href", url.pathname + url.search);
  });
}


/* ===============================
   NAVIGATION + STARTUP
================================ */
if (isMainPage) {
  prevBtn.addEventListener("click", () => showEntry(Math.max(currentIndex - 1, 0)));
  nextBtn.addEventListener("click", () => showEntry(Math.min(currentIndex + 1, entries.length - 1)));

  radios.forEach((radio, index) => {
    radio.addEventListener("change", () => showEntry(index));
  });

  document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const fromSub = params.get("from");

    const cameFromLanding = params.get("fromLanding") === "true";

    const intro = document.getElementById("introBox");

        if (intro) {
          if (cameFromLanding) {
            intro.open = true;
          } else {
            intro.open = false;
          }
        }



    let startIndex = 0;

    if (fromSub) {
      const hashIndex = [...entries].findIndex(e => e.id === fromSub);
      if (hashIndex !== -1) startIndex = hashIndex;
    }
    else if (cameFromLanding) {
      startIndex = 0;
      localStorage.setItem("lastEntryIndex", 0);
    }
    else {
      const savedIndex = localStorage.getItem("lastEntryIndex");
      if (savedIndex !== null) startIndex = parseInt(savedIndex, 10);
    }

    showEntry(startIndex);
  });
}


/* ===============================
   KEYBOARD NAVIGATION
================================ */
if (isMainPage) {
  document.addEventListener("keydown", e => {
    if (["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) return;

    if (e.key === "ArrowLeft") showEntry(Math.max(currentIndex - 1, 0));
    if (e.key === "ArrowRight") showEntry(Math.min(currentIndex + 1, entries.length - 1));
  });
}

/* ===============================
   AUTO TYPEWRITER FOR SUB PAGES
================================ */
if (!isMainPage) {
  document.addEventListener("DOMContentLoaded", () => {
    const entry = document.querySelector(".entry");
    if (!entry) return;

    const p = entry.querySelector("p");
    if (!p) return;

    if (!p.dataset.text) p.dataset.text = p.innerHTML;
    p.innerHTML = "";

    switch (entry.dataset.type) {
      case "word":
        typeByWord(p);
        break;
      case "line":
        typeByLine(p);
        break;
      case "row":
        typeRowLetters(p,10);
        break;
      case "letterPerRow":
        typeByLetterPerRow(p);
        break;
      default:
        typeByLetter(p,1);
    }
  });
}






/* =============================================================================================
   TYPEWRITER FUNCTIONS
================================================================================================ */
function typeByLetter(p, speed = 25) {
  const html = p.dataset.text;
  p.innerHTML = "";

  const container = document.createElement("div");
  container.innerHTML = html;
  const nodes = Array.from(container.childNodes);

  let nodeIndex = 0;

  function typeNode() {
    if (nodeIndex >= nodes.length) return;

    const node = nodes[nodeIndex];

    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      let charIndex = 0;

      function typeChar() {
        if (charIndex < text.length) {
          const span = document.createElement("span");
          span.textContent = text[charIndex];
          p.appendChild(span);
          setTimeout(() => span.classList.add("visible"), 10);
          charIndex++;
          setTimeout(typeChar, speed);
        } else {
          nodeIndex++;
          typeNode();
        }
      }

      typeChar();
    } else if (node.nodeName === "BR") {
      p.appendChild(document.createElement("br"));
      nodeIndex++;
      setTimeout(typeNode, speed);
    } else if (node.nodeName === "A") {
      // create a link and type letters inside it
      const link = document.createElement("a");
      link.href = node.href;
      p.appendChild(link);

      const text = node.textContent;
      let charIndex = 0;

      function typeLinkChar() {
        if (charIndex < text.length) {
          link.textContent += text[charIndex];
          charIndex++;
          setTimeout(typeLinkChar, speed);
        } else {
          nodeIndex++;
          setTimeout(typeNode, speed);
        }
      }

      typeLinkChar();
    } else {
      // other elements like <strong>, <em>
      const clone = node.cloneNode(true);
      p.appendChild(clone);
      nodeIndex++;
      setTimeout(typeNode, speed);
    }
  }

  typeNode();
}

function typeByWord(p, speed = 100) {
  const html = p.dataset.text;
  p.innerHTML = "";

  const container = document.createElement("div");
  container.innerHTML = html;
  const nodes = Array.from(container.childNodes);

  let nodeIndex = 0;

  function typeNode() {
    if (nodeIndex >= nodes.length) return;

    const node = nodes[nodeIndex];

    if (node.nodeType === Node.TEXT_NODE) {
      const words = node.textContent.split(/(\s+)/);
      let wordIndex = 0;

      function typeWordFunc() {
        if (wordIndex < words.length) {
          const span = document.createElement("span");
          span.textContent = words[wordIndex];
          p.appendChild(span);
          span.classList.add("visible");
          wordIndex++;
          setTimeout(typeWordFunc, speed);
        } else {
          nodeIndex++;
          setTimeout(typeNode, speed);
        }
      }

      typeWordFunc();
    } else if (node.nodeName === "BR") {
      p.appendChild(document.createElement("br"));
      nodeIndex++;
      setTimeout(typeNode, speed);
    } else if (node.nodeName === "A") {
      const link = document.createElement("a");
      link.href = node.href;
      p.appendChild(link);

      const words = node.textContent.split(/(\s+)/);
      let wordIndex = 0;

      function typeLinkWord() {
        if (wordIndex < words.length) {
          link.textContent += words[wordIndex];
          wordIndex++;
          setTimeout(typeLinkWord, speed);
        } else {
          nodeIndex++;
          setTimeout(typeNode, speed);
        }
      }

      typeLinkWord();
    } else {
      const clone = node.cloneNode(true);
      p.appendChild(clone);
      nodeIndex++;
      setTimeout(typeNode, speed);
    }
  }

  typeNode();
}

function typeByLine(p, speed = 700) {
  const html = p.dataset.text.trim();
  const lines = html.replace(/<br\s*\/?>/gi, "\n").split("\n").map(l => l.trim()).filter(l => l !== "");
  p.innerHTML = "";
  let i = 0;
  function type() {
    if (i < lines.length) {
      p.insertAdjacentHTML("beforeend", lines[i] + "<br>");
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

function typeRowLetters(p, speed = 500) {
  const html = p.dataset.text;
  const rows = html.split(/\n|<br\s*\/?>/);
  p.innerHTML = "";
  let i = 0;
  function type() {
    if (i < rows.length) {
      p.innerHTML += rows[i] + "<br>";
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

function typeByLetterPerRow(p, speed = 1) {
  const html = p.dataset.text;
  const rows = html.split(/\n|<br\s*\/?>/);
  p.innerHTML = "";
  let rowIndex = 0;
  let charIndex = 0;
  function type() {
    if (rowIndex < rows.length) {
      const row = rows[rowIndex];
      if (charIndex < row.length) {
        p.innerHTML += row[charIndex];
        charIndex++;
        setTimeout(type, speed);
      } else {
        p.innerHTML += "<br>";
        charIndex = 0;
        rowIndex++;
        setTimeout(type, speed);
      }
    }
  }
  type();
}



/* ===========================================================================================================================================================
   LANDING PAGE LOGIC
============================================================================================================================================================== */



function typeMatrix(container, rows = 20, cols = 20) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const total = rows * cols;
  container.innerHTML = "";
  
  // Build grid
  for (let i = 0; i < total; i++) {
    const span = document.createElement("span");
    span.textContent = chars[Math.floor(Math.random() * chars.length)];
    container.appendChild(span);
  }
  
  const spans = [...container.children];
  
  // Fade in all characters gradually
  spans.forEach((span, i) => {
    setTimeout(() => span.classList.add("visible"), i * 3);
  });
  
  // MINIMALIST RAIN DROPS
  const drops = Array(cols).fill(0).map(() => Math.floor(Math.random() * rows));
  
  function rain() {
    // Clear previous active states
    spans.forEach(s => s.classList.remove("active"));
    
    for (let col = 0; col < cols; col++) {
      const row = drops[col];
      const index = row * cols + col;
      
      if (index >= 0 && index < spans.length) {
        // Update character
        if (Math.random() > 0.7) {
          spans[index].textContent = chars[Math.floor(Math.random() * chars.length)];
        }
        
        // Mark as active (brighter)
        spans[index].classList.add("active");
      }
      
      drops[col]++;
      if (drops[col] >= rows) {
        drops[col] = 0;
      }
    }
  }
  
  const rainInterval = setInterval(rain, 80);
  
  // ENTER word positions
  const word = "ENTER";
  const centerRow = Math.floor((rows / 2)-1);
  const startCol = Math.floor((cols - word.length) / 2);
  const enterIndices = word.split("").map((char, i) => centerRow * cols + startCol + i);
  
  // Reveal ENTER on hover
  container.addEventListener("mouseenter", () => {
    word.split("").forEach((char, i) => {
      const idx = enterIndices[i];
      spans[idx].textContent = char;
      spans[idx].classList.add("center");
      spans[idx].classList.remove("visible", "active");
    });
  });
  
  // Hide ENTER on mouse leave (optional)
  container.addEventListener("mouseleave", () => {
    enterIndices.forEach(idx => {
      spans[idx].textContent = chars[Math.floor(Math.random() * chars.length)];
      spans[idx].classList.remove("center");
      spans[idx].classList.add("visible");
    });
  });
  
  // Cleanup on click
  const link = container.closest("a");
  if (link) {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      clearInterval(rainInterval);
      container.classList.add("fade-out");
      setTimeout(() => {
        window.location.href = link.href;
      }, 600);
    });
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const matrix = document.getElementById("matrix");
  if (matrix) {
    typeMatrix(matrix, 20, 20);
  }
});
