// =========================
// GLOBALS
// =========================
console.log("JS FILE LOADED");

let hanger;
let hanger_pos = 256;
let hanger_width = 0;
let hanger_height = 0;
let fakeCursor = null;
let hanger_target = hanger_pos;

const allPopups = [];

const complaintsNotesState = {
  notes: [],        
  activeId: null,
  counter: 1
};


// =========================
// DOORHANGER
// =========================
function show_doorhanger() {

  hanger = document.getElementById("doorhanger");
  if (!hanger) return;

  hanger.src = "img/cookies.png";

  hanger.style.position = "fixed";
  hanger.style.left = hanger_pos + "px";
  hanger.style.top = "-300px";              // Start außerhalb
  hanger.style.transition = "top 0.6s ease";

  hanger.addEventListener("load", () => {

    hanger_width  = hanger.offsetWidth;
    hanger_height = hanger.offsetHeight;

    // ▶️ Einfahren
    requestAnimationFrame(() => {
      hanger.style.top = "4px";
    });

    window.addEventListener("mousemove", on_mouse_move);

    window.addEventListener("mouseout", (e) => {
      if (!e.relatedTarget) {
        hanger.style.top = "4px";
      }
    });

    window.addEventListener("resize", () => {
      hanger_pos = Math.max(
        0,
        Math.min(window.innerWidth - hanger_width, hanger_pos)
      );
      hanger.style.left = hanger_pos + "px";
    });
  });
}


// =========================
// MOUSE LOGIC (ORIGINAL)
// =========================
document.addEventListener("mousemove", (e) => {
  fakeCursor.style.left = e.clientX + "px";
  fakeCursor.style.top  = e.clientY + "px";

  if (fakeCursor.classList.contains("loading")) return;

  const el = document.elementFromPoint(e.clientX, e.clientY);
  if (!el) return;

  // ❌ EXPLIZIT NICHT outline bei printer poll + introduction titlebar
  if (
    el.closest(".printer-poll-window .titlebar") ||
    el.closest(".printer-introduction .titlebar")
  ) {
    fakeCursor.classList.remove("outline");
    fakeCursor.classList.add("filled");
    return;
  }

  // ✅ normale clickable-regel
  if (
    el.closest(".clickable, .popup-img, .line.title, #checkbox-container")
  ) {
    fakeCursor.classList.add("outline");
    fakeCursor.classList.remove("filled");
  } else {
    fakeCursor.classList.remove("outline");
    fakeCursor.classList.add("filled");
  }
});



// =========================
// INIT
// =========================
window.addEventListener("load", show_doorhanger);


// =========================
// FAKE CURSOR (EINZIGER MOUSEMOVE)
// =========================
document.addEventListener("DOMContentLoaded", () => {
  fakeCursor = document.getElementById("fake-cursor");
  if (!fakeCursor) return;

  document.addEventListener("mousemove", (e) => {
    // Cursor folgt immer
    fakeCursor.style.left = e.clientX + "px";
    fakeCursor.style.top  = e.clientY + "px";

    // Während Loading: KEINE Zustandswechsel
    if (fakeCursor.classList.contains("loading")) return;

    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (
      el &&
      el.closest(".clickable, .popup-img, .line.title, #checkbox-container")
    ) {
      fakeCursor.classList.add("outline");
      fakeCursor.classList.remove("filled");
    } else {
      fakeCursor.classList.remove("outline");
      fakeCursor.classList.add("filled");
    }
  });
});

const cursor = document.getElementById("fake-cursor");

const clickableSelectors = [
  ".line.title",
  "a",
  "button",
  ".star-label",
  "input",
  "[data-clickable]"
];

document.addEventListener("mouseover", (e) => {
  if (e.target.closest(clickableSelectors.join(","))) {
    cursor.classList.add("outline");
  }
});

document.addEventListener("mouseout", (e) => {
  if (e.target.closest(clickableSelectors.join(","))) {
    cursor.classList.remove("outline");
  }
});




/* working titles */
document.addEventListener("DOMContentLoaded", () => {
  const trigger = document.getElementById("working-title");
  if (!trigger) return;

  const images = Array.from({ length: 25 }, (_, i) =>
    `img/ordnernamen_${String(i + 1).padStart(2, "0")}.png`
  );

  const POPUP_SIZE = 160;
  const MAX_TRIES = 300;
  let placed = [];

  function shuffle(arr) {
    return arr
      .map(v => ({ v, r: Math.random() }))
      .sort((a, b) => a.r - b.r)
      .map(o => o.v);
  }

  function overlaps(x, y) {
    return placed.some(p =>
      !(x + POPUP_SIZE < p.x ||
        x > p.x + POPUP_SIZE ||
        y + POPUP_SIZE < p.y ||
        y > p.y + POPUP_SIZE)
    );
  }

  function spawnPopup(src, delay) {
    const img = document.createElement("img");
    img.src = src;
    img.className = "popup-img clickable";

    let x, y, tries = 0;
    do {
      x = Math.random() * (window.innerWidth - POPUP_SIZE);
      y = Math.random() * (window.innerHeight - POPUP_SIZE);
      tries++;
    } while (overlaps(x, y) && tries < MAX_TRIES);

    if (tries >= MAX_TRIES) return;
    placed.push({ x, y });

    img.style.position = "fixed";
    img.style.left = x + "px";
    img.style.top = y + "px";
    img.style.width = POPUP_SIZE + "px";
    img.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
    img.style.cursor = "pointer";
    img.style.zIndex = 9999;
    img.style.opacity = "0";
    img.style.transition = "opacity 0.3s ease, transform 0.2s ease";

    document.body.appendChild(img);
    allPopups.push(img);

    setTimeout(() => {
      img.style.opacity = "1";
    }, delay);

    img.addEventListener("click", (e) => {
      e.stopPropagation();
      img.style.opacity = "0";
      img.style.transform += " scale(0.9)";
      setTimeout(() => {
        img.remove();
        const i = allPopups.indexOf(img);
        if (i > -1) allPopups.splice(i, 1);
      }, 200);
    });
  }

  trigger.addEventListener("click", () => {
    placed = [];
    shuffle(images).forEach((src, i) => spawnPopup(src, i * 30));
  });
});




// =========================
// FLIRTING CRIMES WINDOW
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const dtitle = document.getElementById("flirting-crimes");
  if (!dtitle) return;

  dtitle.addEventListener("click", () => {
    const win = document.createElement("div");
    win.className = "fake-window clickable";

   win.innerHTML = `
  <div class="titlebar">
    <span>flirting_crimes</span>
    <span class="close">×</span>
  </div>
  <div class="content">
    <div class="flirt-bg">
      <div class="star-layer"></div>
      <div class="popup-text clickable" id="flirting-text">click me</div>
    </div>
  </div>
`;

const starLayer = win.querySelector(".star-layer");

function spawnStars(layer, count = 48){
  layer.innerHTML = "";
  for (let i = 0; i < count; i++){
    const s = document.createElement("div");
    s.className = "star";

    // random position
    s.style.left = (Math.random() * 100) + "%";
    s.style.top  = (Math.random() * 100) + "%";

    // random size + timings
    const size = 3 + Math.random() * 5; // 3..8px
    s.style.setProperty("--s", size + "px");
    s.style.setProperty("--tw", (900 + Math.random() * 2200) + "ms");
    s.style.setProperty("--dr", (6500 + Math.random() * 12000) + "ms");

    // random drift direction
    const dx = (Math.random() * 40 - 20).toFixed(1);  // -20..20px
    const dy = (Math.random() * 28 - 14).toFixed(1);  // -14..14px
    s.style.setProperty("--dx", dx + "px");
    s.style.setProperty("--dy", dy + "px");

    // random phase offset
    s.style.animationDelay = (-Math.random() * 3000) + "ms";

    layer.appendChild(s);
  }
}

spawnStars(starLayer, 55);


    document.body.appendChild(win);
    allPopups.push(win);

    const texts = [
      "my dog looked almost exactly like that.",
      "be a good girl",
      "you look so innocent!",
      "may i tear your clothes apart?",
      "hey, you look super likeable!"
    ];

    let i = 0;
    const textEl = win.querySelector("#flirting-text");
    textEl.textContent = texts[0];

    textEl.addEventListener("click", (e) => {
      e.stopPropagation();
      i = (i + 1) % texts.length;
      textEl.textContent = texts[i];
    });

    win.querySelector(".close").addEventListener("click", () => {
      win.remove();
    });
  });
});


// =========================
// PURE CONNECTION → LOADING CURSOR
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const pure = document.getElementById("pure-connection");
  const fakeCursor = document.getElementById("fake-cursor");
  if (!pure || !fakeCursor) return;

  pure.addEventListener("click", (e) => {
    e.preventDefault();
    fakeCursor.classList.add("loading");

    setTimeout(() => {
      fakeCursor.classList.remove("loading");
    }, 6000);
  });
});


// =========================
// CLEAN
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const cleanBtn = document.getElementById("clean-button");
  if (!cleanBtn) return;

  cleanBtn.addEventListener("click", () => {
    allPopups.forEach(popup => popup.remove());
    allPopups.length = 0;
  });
});


 // =========================
// PRINTERS
// =========================



// ---- Steps (1–12)
const printerSteps = [
  { title: "printer ragebait", text: "step 1: open the print file.", img: "img/drucker_error-02.jpg" },
  { title: "printer ragebait", text: "step 2: click »print«.", img: "img/drucker_error-03.jpg" },
  { title: "printer ragebait", text: "step 3: wait. nothing is happening yet. this is expected.", img: "img/drucker_error-04.jpg" },
  { title: "printer ragebait", text: "step 4: document does not exist.", img: "img/drucker_error-05.jpg" },
  { title: "printer ragebait", text: "step 5: try again in disbelief.", img: "img/drucker_error-06.jpg" },
  { title: "printer ragebait", text: "step 6: printer not found.", img: "img/drucker_error-07.jpg" },
  { title: "printer ragebait", text: "step 7: searching for printer.", img: "img/drucker_error-08.jpg" },
  { title: "printer ragebait", text: "step 8: printer was there.", img: "img/drucker_error-09.jpg" },
  { title: "printer ragebait", text: "step 9: the document cannot be found. it was open a second ago.", img: "img/drucker_error-10.jpg" },
  { title: "printer ragebait", text: "step 10: click print.", img: "img/drucker_error-11.jpg" },
  { title: "printer ragebait", text: "step 11: hope.( mandatory )", img: "img/drucker_error-12.jpg" },
  { title: "printer ragebait", final: true }
];


// ---- Step Window
function openPrinterStep(index) {
  const step = printerSteps[index];
  if (!step) return;

  const isFinal = !!step.final;

  const win = document.createElement("div");
  win.className = isFinal
    ? "fake-window printer-step step-12 clickable"
    : `fake-window printer-step step-${index + 1} clickable`;

  win.innerHTML = `
    <div class="titlebar">
      <span>${step.title}</span>
      <span class="close clickable">×</span>
    </div>

    <div class="content">
      ${isFinal
        ? `<p class="pixel-error" data-text="error">error</p>`
        : `
          <img src="${step.img}" alt="" draggable="false">
          <div class="printer-step-text">${step.text}</div>
        `
      }
    </div>
  `;

  document.body.appendChild(win);
  allPopups.push(win);

  // click anywhere -> next step (aber NICHT auf close)
  win.addEventListener("click", (e) => {
    if (e.target.closest(".close")) return; // wichtig
    e.stopPropagation();
    if (!isFinal) openPrinterStep(index + 1);
  });
}



// ------------------------
// 1) Trigger: Klick auf "printer ragebait" Text
// ------------------------
document.addEventListener("DOMContentLoaded", () => {
  const trigger = document.getElementById("printer-ragebait");
  if (!trigger) return;
  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    openPrinterPoll();
  });
});

// ------------------------
// 2) Poll Window
// ------------------------
function openPrinterPoll() {
  const win = document.createElement("div");
  win.className = "fake-window printer-poll-window";

  win.innerHTML = `
    <div class="titlebar">
      <span>printer ragebait</span>
      <span class="close clickable">×</span>
    </div>

    <div class="content printer-poll">
      <h3>why did the printer fail this time?</h3>

      <label class="printer-option clickable" data-answer="paper">
        <input type="radio" name="printer"> paper jam ( there is no paper )
      </label>

      <label class="printer-option clickable" data-answer="ink">
        <input type="radio" name="printer"> ink empty ( it was full yesterday )
      </label>

      <label class="printer-option clickable" data-answer="driver">
        <input type="radio" name="printer"> driver issue ( i did nothing )
      </label>

      <label class="printer-option clickable" data-answer="fear">
        <input type="radio" name="printer"> printer sensed fear
      </label>

      <div class="printer-result">( choose wisely )</div>
    </div>
  `;

  document.body.appendChild(win);
  allPopups.push(win);

  win.querySelectorAll(".printer-option").forEach(option => {
    option.addEventListener("click", (e) => {
      e.stopPropagation();
      openPrinterResult(option.dataset.answer);
    });
  });

  // ❌ WEG: close.style.display = "none";
}


// ------------------------
// 3) Result Window
// ------------------------
function openPrinterResult(answer) {
  const win = document.createElement("div");
  win.className = "fake-window printer-result-window";

 const isCorrect = answer === "fear";

win.innerHTML = `
  <div class="titlebar">
    <span>printer ragebait</span>
    <span class="close clickable">×</span>
  </div>
  <div class="content">
    <h3>${isCorrect ? "correct" : "wrong"}</h3>
    <p>
      ${isCorrect ? "the printer sensed weakness." : "the printer sensed weakness anyway."}
    </p>
  </div>
`;



  document.body.appendChild(win);
  allPopups.push(win);

  // Close -> Introduction öffnen
  win.querySelector(".close").addEventListener("click", (e) => {
    e.stopPropagation();
    openPrinterIntroduction();
  });
}

// ------------------------
// 4) Introduction Window (Manual)
// ------------------------
function openPrinterIntroduction() {
  const win = document.createElement("div");
  win.className = "fake-window printer-introduction";

  win.innerHTML = `
    <div class="titlebar">
      <span>printer ragebait</span>
      <span class="close clickable">×</span>
    </div>

    <div class="content">
      <h3>still here?</h3>
      <p>then kindly go read the damn printing manual.<br>(it will not help)</p>
      <p style="margin-top:10px;font-size:12px;opacity:0.75;"</p>
    </div>
  `;

  document.body.appendChild(win);
  allPopups.push(win);

  // click anywhere (aber NICHT auf close) -> steps starten
  win.addEventListener("click", (e) => {
    if (e.target.closest(".close")) return; // verhindert conflict
    e.stopPropagation();
    openPrinterStep(0);
  });
}


document.addEventListener("click", (e) => {
  const close = e.target.closest(".fake-window .close");
  if (!close) return;

  // DEKO-KREUZ: nix machen
  if (close.classList.contains("close-deco")) return;

  e.preventDefault();
  e.stopPropagation();

  const win = close.closest(".fake-window");
  if (!win) return;

 
});




/*verification*/
document.addEventListener("DOMContentLoaded", () => {
  const trigger = document.getElementById("betrayal-captcha");
  if (!trigger) return;

  const betrayalImages = [
    "img/betrayal_01.jpg",
    "img/betrayal_02.jpg",
    "img/betrayal_03.webp",
    "img/betrayal_04.webp",
    "img/betrayal_05.webp",
    "img/betrayal_06.webp",
    "img/betrayal_07.jpg",
    "img/betrayal_08.jpg",
    "img/betrayal_09.jpg",
    "img/betrayal_10.jpg",
    "img/betrayal_11.jpg",
    "img/betrayal_12.png",
    "img/betrayal_13.jpg",
    "img/betrayal_14.jpg",
    "img/betrayal_15.jpg",
    "img/betrayal_16.jpg",
    "img/betrayal_17.jpg",
    "img/betrayal_18.jpg",
    "img/betrayal_19.jpg",
    "img/betrayal_20.jpeg",
    "img/betrayal_21.jpg",
    "img/betrayal_22.jpg",
    "img/betrayal_23.jpg",
    "img/betrayal_24.webp",
    "img/betrayal_25.jpg",
    "img/betrayal_26.jpg",
    "img/betrayal_27.jpg",
  ];

  const GRID_SIZE = 9;

  const interfaceLies = [
   "interesting choice.",
  "that one feels empty.",
  "too confident.",
  "you hesitated.",
  "most people miss one.",
  "that was fast.",
  "are you sure about that?",
  "no, not like that.",
  "you skipped something.",
  "this says more about you.",
  "that wasn't necessary.",
  "you seem certain.",
  "try to be honest.",
  "almost.",
  "not quite."
  ];

  const nextRemembering = [
    "next",
    "try again",
    "no, really. next.",
    "fine.",
    "you missed something.",
    "just continue.",
    "this won't help.",
    "why are you still here?",
    "you can stop.",
    "you can stop."
  ];

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  trigger.addEventListener("click", () => {
    const win = document.createElement("div");
    win.className = "fake-window betrayal-window clickable";

    win.innerHTML = `
      <div class="titlebar">
        <span>betrayal verification</span>
        <span class="close">×</span>
      </div>
      <div class="content">
        <div class="betrayal-overtitle">category</div>
        <div class="betrayal-title">select all images with potential for betrayal</div>
        <div class="betrayal-hint" id="betrayal-hint">
          click everything that feels like betrayal
        </div>

        <div class="betrayal-grid" id="betrayal-grid"></div>

        <div class="betrayal-controls">
          <div class="betrayal-status" id="betrayal-status">0 selected</div>
          <div style="display:flex; gap:8px;">
            <button class="betrayal-btn ghost" id="betrayal-clear">clear</button>
            <button class="betrayal-btn" id="betrayal-next">next</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(win);
    allPopups.push(win);

    const gridEl   = win.querySelector("#betrayal-grid");
    const statusEl = win.querySelector("#betrayal-status");
    const hintEl   = win.querySelector("#betrayal-hint");
    const nextBtn  = win.querySelector("#betrayal-next");
    const clearBtn = win.querySelector("#betrayal-clear");
    const closeBtn = win.querySelector(".close");

    let deck = shuffle(betrayalImages);
    let selectedCount = 0;
    let rounds = 0;
    let nextMood = 0;

    function setStatus() {
      statusEl.textContent = `${selectedCount} selected`;
    }

    function refillIfNeeded() {
      if (deck.length < GRID_SIZE) deck = shuffle(betrayalImages);
    }

    function lie(force = false) {
      if (!force && Math.random() > 0.55) return;
      hintEl.textContent =
        interfaceLies[Math.floor(Math.random() * interfaceLies.length)];
    }

    function meta() {
      if (rounds === 4) hintEl.textContent = "it doesn't get clearer.";
      if (rounds === 7) hintEl.textContent = "most people stop here.";
      if (rounds === 10) hintEl.textContent = "you can leave if you want.";
      if (rounds > 12 && Math.random() < 0.25)
        hintEl.textContent = "this keeps going.";
    }

    function clearSelection() {
      selectedCount = 0;
      setStatus();
      gridEl.querySelectorAll(".betrayal-tile.selected")
        .forEach(t => t.classList.remove("selected"));
    }

    function renderGrid() {
      rounds++;
      refillIfNeeded();
      clearSelection();
      gridEl.innerHTML = "";

      const batch = deck.splice(0, GRID_SIZE);

      batch.forEach((src) => {
        const tile = document.createElement("div");
        tile.className = "betrayal-tile clickable";
        tile.innerHTML = `<img src="${src}" alt="">`;

        tile.addEventListener("click", (e) => {
          e.stopPropagation();

          const tiles = [...gridEl.querySelectorAll(".betrayal-tile")];

          // --- ADD-ON 2: falsches Tile reagiert (12%)
          let targetTile = tile;
          if (Math.random() < 0.12 && tiles.length > 1) {
            const others = tiles.filter(t => t !== tile);
            targetTile = others[Math.floor(Math.random() * others.length)];
          }

          targetTile.classList.toggle("selected");
          selectedCount = gridEl.querySelectorAll(".betrayal-tile.selected").length;
          setStatus();

          lie();

          // --- ADD-ON 1: Selbst-Entauswahl (25%)
          if (targetTile.classList.contains("selected") && Math.random() < 0.25) {
            setTimeout(() => {
              targetTile.classList.remove("selected");
              selectedCount = gridEl.querySelectorAll(".betrayal-tile.selected").length;
              setStatus();
              hintEl.textContent = "maybe not that one.";
            }, 1200 + Math.random() * 600);
          }
        });

        gridEl.appendChild(tile);
      });

      meta();
      lie();
    }

    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      nextMood = Math.min(nextMood + 1, nextRemembering.length - 1);
      nextBtn.textContent = nextRemembering[nextMood];
      renderGrid();
      lie(true);
    });

    clearBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      clearSelection();
      hintEl.textContent = "okay.";
    });

    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      win.remove();
      const i = allPopups.indexOf(win);
      if (i > -1) allPopups.splice(i, 1);
    });

    renderGrid();
  });
});


/*complaints*/
function openComplaintsLogin() {
  const win = document.createElement("div");
  win.className = "fake-window complaints-login clickable";

  win.innerHTML = `
    <div class="titlebar">
      <div class="traffic">
        <span class="dot red"></span>
        <span class="dot yellow"></span>
        <span class="dot green"></span>
      </div>
      <div class="title">chat</div>
      <span class="close">×</span>
    </div>

    <div class="content">
      <div class="complaints-login-ui">
        <div class="complaints-url">gamechatshop.com/chat.html</div>

        <label>username</label>
        <input type="text" value="rnununwayyy" readonly />

        <label>password</label>
        <input type="password" value="••••••••••••••" readonly />

        <div class="remember">
          <input type="checkbox" checked />
          <span>remember me on this computer</span>
        </div>

        <button type="button" class="login-btn">login</button>
        <div class="tiny">please log in.</div>
      </div>
    </div>
  `;

  document.body.appendChild(win);
  allPopups.push(win);

  const closeBtn = win.querySelector(".close");
  const loginBtn = win.querySelector(".login-btn");
  const tiny = win.querySelector(".tiny");

  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    win.remove();
    allPopups.splice(allPopups.indexOf(win), 1);
  });

 loginBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  tiny.textContent = "logging in…";

  // nach kurzer fake-verzögerung: Notes öffnen
  setTimeout(() => {
    tiny.textContent = "connected.";
    openComplaintsNotes(); // <-- neues Notes Fenster
  }, 650);
});
}

document.addEventListener("DOMContentLoaded", () => {
  const trigger = document.getElementById("complaints-box");
  if (!trigger) return;

  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    openComplaintsLogin();
  });
});

function openComplaintsNotes() {
  const win = document.createElement("div");
  win.className = "fake-window complaints-notes clickable";

  win.innerHTML = `
    <div class="titlebar">
      <div class="traffic">
        <span class="dot red"></span>
        <span class="dot yellow"></span>
        <span class="dot green"></span>
      </div>
      <div class="title">notes</div>
    </div>

    <div class="content">
      <div class="complaints-notes-sidebar">
        <div class="label">complaints</div>
        <div id="complaints-notes-list"></div>
      </div>

      <div class="complaints-notes-main">
        <div class="complaints-notes-toolbar">
          <div class="left">
            <div class="note-title" id="complaints-note-title">untitled note</div>
            <div class="note-sub" id="complaints-note-sub">draft</div>
          </div>
          <div class="right">
            <button class="notes-btn" type="button" id="complaints-discard">discard</button>
            <button class="notes-btn primary" type="button" id="complaints-submit">submit</button>
          </div>
        </div>

        <div class="complaints-notes-editor">
          <textarea id="complaints-editor" spellcheck="false"
            placeholder="type your complaint… (the system is listening. allegedly.)"></textarea>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(win);
  allPopups.push(win);

  const listEl   = win.querySelector("#complaints-notes-list");
  const editorEl = win.querySelector("#complaints-editor");
  const titleEl  = win.querySelector("#complaints-note-title");
  const subEl    = win.querySelector("#complaints-note-sub");
  const discard  = win.querySelector("#complaints-discard");
  const submit   = win.querySelector("#complaints-submit");

  // ---- helpers
  const nowStamp = () => {
    const d = new Date();
    return d.toLocaleString(undefined, { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });
  };

  const makeTitle = (body) => {
    const t = (body || "").trim().split("\n")[0].trim();
    if (!t) return "untitled complaint";
    return t.length > 22 ? t.slice(0, 22).trim() + "…" : t;
  };

  const setActive = (id) => {
    complaintsNotesState.activeId = id;
    renderList();
  };

  const getActive = () => complaintsNotesState.notes.find(n => n.id === complaintsNotesState.activeId);

  // ---- rendering
  function renderList() {
    listEl.innerHTML = "";

    // Wenn es noch keine Notizen gibt: kleine Platzhalter-Note anzeigen (nicht speichernd)
    if (complaintsNotesState.notes.length === 0) {
      const empty = document.createElement("div");
      empty.className = "complaints-notes-item";
      empty.innerHTML = `
        <div class="name">no notes yet</div>
        <div class="preview">submit something. or don’t.</div>
        <div class="meta">${nowStamp()}</div>
      `;
      listEl.appendChild(empty);
      return;
    }

    // Neueste oben
    const sorted = complaintsNotesState.notes.slice().sort((a,b) => b.createdAt - a.createdAt);

    sorted.forEach((note) => {
      const item = document.createElement("div");
      item.className = "complaints-notes-item clickable";
      if (note.id === complaintsNotesState.activeId) item.classList.add("active");

      const preview = (note.body || "").trim().replace(/\s+/g, " ");
      const previewShort = preview.length > 48 ? preview.slice(0, 48) + "…" : (preview || "…");

      item.innerHTML = `
        <div class="name">${note.title}</div>
        <div class="preview">${previewShort}</div>
        <div class="meta">${note.stamp}</div>
      `;

      item.addEventListener("click", (e) => {
        e.stopPropagation();
        // beim Klick alte Notiz laden (read-only-ish Gefühl)
        const n = note;
        titleEl.textContent = n.title;
        subEl.textContent = "submitted";
        editorEl.value = n.body;
        setActive(n.id);
      });

      listEl.appendChild(item);
    });
  }

  function openFreshDraft() {
    titleEl.textContent = "untitled note";
    subEl.textContent = "draft";
    editorEl.value = "";
    editorEl.placeholder = "type your complaint… (the system is listening. allegedly.)";
    setActive(null);
    editorEl.focus();
  }

  // initial state
  renderList();
  openFreshDraft();

  // discard = leeren
  discard.addEventListener("click", (e) => {
    e.stopPropagation();
    editorEl.value = "";
    subEl.textContent = "draft (wiped)";
    editorEl.placeholder = "okay. nothing happened.";
  });

  // submit = speichern + neue draft öffnen
  submit.addEventListener("click", (e) => {
    e.stopPropagation();

    const body = editorEl.value || "";
    const trimmed = body.trim();

    // wenn leer: beleidigt
    if (!trimmed) {
      subEl.textContent = "draft (empty)";
      editorEl.placeholder = "submit what, exactly?";
      return;
    }

    const newNote = {
      id: "c" + (complaintsNotesState.counter++),
      title: makeTitle(trimmed),
      body: trimmed,
      createdAt: Date.now(),
      stamp: nowStamp()
    };

    complaintsNotesState.notes.push(newNote);

    // subtiler lie: "saved locally" (aber du machst nichts persistentes)
    subEl.textContent = "saved.";
    titleEl.textContent = newNote.title;

    // Note als „active“ markieren, damit sie kurz highlighted ist
    setActive(newNote.id);

    // nach kurzer Zeit: neue leere Notiz öffnen
    setTimeout(() => {
      openFreshDraft();
      renderList();
    }, 350);
  });
}


document.addEventListener("DOMContentLoaded", () => {
  const targets = document.querySelectorAll(
    ".printer-step p, .printer-introduction p, .printer-result-window p"
  );

  targets.forEach(el => {
    el.innerHTML = el.innerHTML.replace(
      /\(([^)]+)\)/g,
      '<span class="paren">($1)</span>'
    );
  });
});


// =========================
// SUB SCAM – VIDEO HINTER TV
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const trigger = document.getElementById("sub-scam");
  if (!trigger) return;

  trigger.addEventListener("click", (e) => {
    e.stopPropagation();

    // toggle
    const existing = document.querySelector(".subscam-tv");
    if (existing) {
      existing.remove();
      return;
    }

    const tv = document.createElement("div");
    tv.className = "subscam-tv clickable";

    tv.innerHTML = `
      <video loop playsinline>
        <source src="video/sub_scam_fernseher.mp4" type="video/mp4">
      </video>
      <img src="img/fernseher_01.png" alt="tv">
    `;

    document.body.appendChild(tv);
    allPopups.push(tv);

    const video = tv.querySelector("video");

    // ⭐ DAS ist der entscheidende Teil ⭐
    video.currentTime = 0;
    video.volume = 1.0;

    const playPromise = video.play();
    if (playPromise && playPromise.catch) {
      playPromise.catch(err => {
        console.warn("Autoplay with sound blocked:", err);
      });
    }
  });
});

// =========================
// OUT OF SYNC → CHAOS MODE
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const chaos = document.getElementById("out-of-sync");
  if (!chaos) return;

  function fireClick(el) {
    if (!el) return;
    el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
  }

  chaos.addEventListener("click", (e) => {
    e.stopPropagation();

    // Liste deiner "Eskalations"-Trigger
    const triggers = [
      document.getElementById("working-title"),      // spawnt 25 ordnernamen popups
      document.getElementById("flirting-crimes"),    // fake window
      document.getElementById("printer-ragebait"),   // poll + result + manual + steps (klick-weiter)
      document.getElementById("betrayal-captcha"),   // betrayal window
      document.getElementById("complaints-box"),     // login + notes
      document.getElementById("sub-scam"),           // tv/video (falls du das so gebaut hast)
      document.getElementById("pure-connection"),    // loading cursor
      document.getElementById("doorhanger")          // optional: falls du darauf noch extra click-effekte baust
    ];

    // Wichtig: leicht staffeln, damit sich nichts “verschluckt”
    let t = 0;
    triggers.forEach((el) => {
      setTimeout(() => fireClick(el), t);
      t += 120;
    });

    // EXTRA: noch mehr Müll → working-title nochmal (mehr popups)
    setTimeout(() => fireClick(document.getElementById("working-title")), t + 250);
    setTimeout(() => fireClick(document.getElementById("working-title")), t + 500);

    // EXTRA: Printer Steps sofort hochjagen (wenn openPrinterStep global existiert)
    // Damit es wirklich "voll" wird, ohne dass du 11x klicken musst:
    setTimeout(() => {
      if (typeof openPrinterStep === "function") {
        // 1–11 in schneller Folge
        for (let i = 0; i < 11; i++) {
          setTimeout(() => openPrinterStep(i), i * 90);
        }
        // final error
        setTimeout(() => openPrinterStep(11), 11 * 90 + 150);
      }
    }, t + 650);

    // EXTRA: Complaints Notes auch direkt öffnen (falls Funktion global ist)
    setTimeout(() => {
      if (typeof openComplaintsNotes === "function") openComplaintsNotes();
    }, t + 900);
  });
});

// =========================
// TELEPORT POPUPS (MOVE BY DISAPPEARING)
// =========================
let teleportTimer = null;
let teleportOn = false;

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function getMovables() {
  // alles, was typischerweise bei dir "aufpoppt"
  const nodes = [
    ...document.querySelectorAll(
      ".popup-img, .fake-window, .subscam-tv, .printer-step, .betrayal-window, .complaints-login, .complaints-notes"
    )
  ];

  // zusätzlich: alles, was du in allPopups trackst (falls was nicht im selector ist)
  if (Array.isArray(window.allPopups)) {
    for (const el of window.allPopups) {
      if (el && el.nodeType === 1) nodes.push(el);
    }
  }

  // dupes raus
  return [...new Set(nodes)].filter(el => document.body.contains(el));
}

function teleportElement(el) {
  // nur Elemente bewegen, die "sichtbar" sind
  const rect = el.getBoundingClientRect();
  const w = Math.max(40, rect.width);
  const h = Math.max(40, rect.height);

  // viewport bounds
  const maxX = window.innerWidth - w - 8;
  const maxY = window.innerHeight - h - 8;

  const x = clamp(rand(8, maxX), 8, maxX);
  const y = clamp(rand(8, maxY), 8, maxY);

  // Teleport: kurz verschwinden, neue Position, wieder erscheinen
  el.classList.add("teleport-hide");

  setTimeout(() => {
    // Wichtig: wir setzen direkt top/left und neutralisieren ggf. center-transform
    el.style.left = x + "px";
    el.style.top = y + "px";
    el.style.right = "auto";
    el.style.bottom = "auto";

    // Falls das Element normalerweise per translate(-50%,-50%) zentriert wird:
    // wir überschreiben es, damit top/left wirklich gelten
    el.style.transform = "none";

    el.classList.remove("teleport-hide");
    el.classList.add("teleport-show");
    setTimeout(() => el.classList.remove("teleport-show"), 140);
  }, 90);
}

function startTeleporting(intervalMs = 650, moveEachTick = 4) {
  stopTeleporting();
  teleportOn = true;

  teleportTimer = setInterval(() => {
    const els = getMovables();
    if (!els.length) return;

    // wähle pro Tick nur ein paar aus (sonst ist es zu heftig)
    const shuffled = els.slice().sort(() => Math.random() - 0.5);
    shuffled.slice(0, moveEachTick).forEach(teleportElement);
  }, intervalMs);
}

function startOverwhelmTeleporting() {
  stopTeleporting();
  teleportOn = true;

  // Werte zum Tunen:
  const intervalMs = 100;      // 🔥 Tick speed (kleiner = schneller)
  const moveEachTick = 20;    // 🔥 wie viele pro Tick springen
  const fullWipeEvery = 9;    // alle X Ticks: alle auf einmal springen (0 = aus)

  let tick = 0;

  teleportTimer = setInterval(() => {
    tick++;

    const els = getMovables();
    if (!els.length) return;

    // gelegentlich: kompletter Bildschirm-"wipe"
    const doWipe = fullWipeEvery > 0 && (tick % fullWipeEvery === 0);

    if (doWipe) {
      els.forEach(teleportElement);
      return;
    }

    // sonst: viele zufällige pro Tick
    const shuffled = els.slice().sort(() => Math.random() - 0.5);
    shuffled.slice(0, Math.min(moveEachTick, shuffled.length)).forEach(teleportElement);

  }, intervalMs);
}

function stopTeleporting() {
  teleportOn = false;
  if (teleportTimer) clearInterval(teleportTimer);
  teleportTimer = null;
}

document.addEventListener("DOMContentLoaded", () => {
  const chaos = document.getElementById("out-of-sync");
  if (!chaos) return;

  chaos.addEventListener("click", (e) => {
    e.stopPropagation();

    if (!teleportOn) {
      // schneller = nervöser
      startTeleporting(520, 6);  // alle 520ms, 6 elemente pro tick
    } else {
      stopTeleporting();
    }
  });
});




