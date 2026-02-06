/*globals*/
console.log("JS FILE LOADED");

let allPopups = [];
let fakeCursor = null;

let hanger;
let hanger_pos = 256;
let hanger_width = 0;
let hanger_height = 0;


let teleportTimer = null;
let teleportOn = false;

/*cookie*/
function show_doorhanger() {
  hanger = document.getElementById("doorhanger");
  if (!hanger) return;

  hanger.src = "img/cookies.png";
  hanger.style.position = "fixed";
  hanger.style.left = hanger_pos + "px";
  hanger.style.top = "-300px";
  hanger.style.transition = "top 0.6s ease";

  const onReady = () => {
    hanger_width = hanger.offsetWidth;
    hanger_height = hanger.offsetHeight;

    requestAnimationFrame(() => {
      hanger.style.top = "4px";
    });

    window.addEventListener("mousemove", on_mouse_move);

    window.addEventListener("mouseout", (e) => {
      if (!e.relatedTarget) hanger.style.top = "4px";
    });

    window.addEventListener("resize", () => {
      hanger_pos = Math.max(0, Math.min(window.innerWidth - hanger_width, hanger_pos));
      hanger.style.left = hanger_pos + "px";
    });
  };

  if (hanger.complete) onReady();
  else hanger.addEventListener("load", onReady, { once: true });
}

function on_mouse_move(e) {
  if (!hanger) return;

  if (hanger_width * 2 > window.innerWidth) {
    if (e.clientX > hanger_pos && e.clientX < hanger_pos + hanger_width) {
      hanger.style.top = Math.min(4, e.clientY - hanger_height - 10) + "px";
    } else {
      hanger.style.top = "4px";
    }
  } else {
    hanger.style.top = "4px";

    if (e.clientY - 10 < hanger_height) {
      if (e.clientX > hanger_pos && e.clientX < hanger_pos + hanger_width) {
        if (e.clientX < hanger_width) {
          hanger_pos = e.clientX;
        } else if (e.clientX > window.innerWidth - hanger_width) {
          hanger_pos = e.clientX - hanger_width;
        } else {
          hanger_pos =
            e.clientX - ((e.clientX - hanger_pos < hanger_width / 2) ? 0 : hanger_width);
        }
        hanger.style.left = hanger_pos + "px";
      }
    }
  }
}

window.addEventListener("load", show_doorhanger);




/*working titles*/
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

    setTimeout(() => { img.style.opacity = "1"; }, delay);

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

/*pure connection*/
document.addEventListener("DOMContentLoaded", () => {
  const pure = document.getElementById("pure-connection");
  const fc = document.getElementById("fake-cursor");
  if (!pure || !fc) return;

  pure.addEventListener("click", (e) => {
    e.preventDefault();
    fc.classList.add("loading");
    setTimeout(() => fc.classList.remove("loading"), 6000);
  });
});


/*printer ragebait*/
(function () {
  if (window.__printer_ready__) return;
  window.__printer_ready__ = true;

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

 
  function trackPopup(win) {
    if (Array.isArray(window.allPopups)) window.allPopups.push(win);
  }

  function untrackPopup(win) {
    if (!Array.isArray(window.allPopups)) return;
    const i = window.allPopups.indexOf(win);
    if (i > -1) window.allPopups.splice(i, 1);
  }

  function removePopup(win) {
    if (!win) return;
    win.remove();
    untrackPopup(win);
  }

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

function spawnStep12Error() {
  const win = document.createElement("div");
  win.className = "fake-window printer-step step-12 clickable";

  const x = clamp(rand(20, window.innerWidth - 20), 20, window.innerWidth - 20);
  const y = clamp(rand(80, window.innerHeight - 40), 80, window.innerHeight - 40);

  win.style.left = x + "px";
  win.style.top = y + "px";
  win.style.transform = "translate(-50%, -50%)";

  win.innerHTML = `
    <div class="titlebar">
      <span>printer ragebait</span>
      <span class="close clickable">×</span>
    </div>
    <div class="content">
      <p class="pixel-error" data-text="error"><span data-text="error">error</span></p>
    </div>
  `;

  document.body.appendChild(win);
  trackPopup(win);

  win.querySelector(".close")?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    removePopup(win);
  });
}

function spawnStep12Burst(count = 16) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => spawnStep12Error(), i * 20);
  }
}

function openPrinterStep(index) {
  const step = printerSteps[index];
  if (!step) return;

  if (step.final) {
    spawnStep12Burst(20); 
    return;
  }

  const win = document.createElement("div");
  win.className = `fake-window printer-step step-${index + 1} clickable`;

  win.innerHTML = `
    <div class="titlebar">
      <span>${step.title}</span>
      <span class="close clickable">×</span>
    </div>
    <div class="content">
      <img src="${step.img}" alt="" draggable="false">
      <div class="printer-step-text">${step.text}</div>
    </div>
  `;

  document.body.appendChild(win);
  trackPopup(win);

  win.querySelector(".close")?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    removePopup(win);
  });

  win.addEventListener("click", (e) => {
    if (e.target.closest(".close")) return;
    e.stopPropagation();
    openPrinterStep(index + 1);
  });
}

  function openPrinterIntroduction() {
    const win = document.createElement("div");
    win.className = "fake-window printer-introduction";

    win.innerHTML = `
      <div class="titlebar">
        <span>printer ragebait</span>
        <span class="close clickable" aria-label="close">×</span>
      </div>
      <div class="content">
        <h3>still here?</h3>
        <p>then kindly go read the damn printing manual.<br>( it will not help )</p>
      </div>
    `;

    document.body.appendChild(win);
    trackPopup(win);

    win.querySelector(".close")?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      removePopup(win);
    });

    win.querySelector(".content")?.addEventListener("click", (e) => {
      e.stopPropagation();
      openPrinterStep(0);
    });
  }

  function openPrinterResult(answer) {
    const win = document.createElement("div");
    win.className = "fake-window printer-result-window";

    const correct = answer === "fear";

    win.innerHTML = `
      <div class="titlebar">
        <span>printer ragebait</span>
        <span class="close clickable" aria-label="close">×</span>
      </div>
      <div class="content">
        <h3>${correct ? "correct" : "wrong"}</h3>
        <p>${correct ? "the printer sensed weakness." : "the printer sensed weakness anyway."}</p>
      </div>
    `;

    document.body.appendChild(win);
    trackPopup(win);

    win.querySelector(".close")?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openPrinterIntroduction();
    });

    win.addEventListener("click", (e) => {
      if (e.target.closest(".close")) return;
      e.stopPropagation();
    });
  }

  function openPrinterPoll() {
    const win = document.createElement("div");
    win.className = "fake-window printer-poll-window";

    win.innerHTML = `
      <div class="titlebar">
        <span>printer ragebait</span>
        <span class="close clickable" aria-label="close">×</span>
      </div>

      <div class="content printer-poll">
        <h3>why did the printer fail this time?</h3>

        <label class="printer-option" data-answer="paper">
          <input type="radio" name="printer_poll" value="paper">
          paper jam ( there is no paper )
        </label>

        <label class="printer-option" data-answer="ink">
          <input type="radio" name="printer_poll" value="ink">
          ink empty ( it was full yesterday )
        </label>

        <label class="printer-option" data-answer="driver">
          <input type="radio" name="printer_poll" value="driver">
          driver issue ( i did nothing )
        </label>

        <label class="printer-option" data-answer="fear">
          <input type="radio" name="printer_poll" value="fear">
          printer sensed fear
        </label>

        <div class="printer-result">( choose wisely )</div>
      </div>
    `;

    document.body.appendChild(win);
    trackPopup(win);

    win.querySelector(".close")?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      removePopup(win);
    });

    win.querySelectorAll(".printer-option").forEach((label) => {
      label.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const input = label.querySelector("input[type='radio']");
        if (input) input.checked = true;
        openPrinterResult(label.dataset.answer);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    const trigger = document.getElementById("printer-ragebait");
    if (!trigger) return;

    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openPrinterPoll();
    });
  });

/*global close*/
  document.addEventListener("click", (e) => {
    const close = e.target.closest(".fake-window .close");
    if (!close) return;
    if (close.classList.contains("close-deco")) return;

    const win = close.closest(".fake-window");
    if (!win) return;

    if (win.classList.contains("printer-result-window")) return;

    e.preventDefault();
    e.stopPropagation();
    removePopup(win);
  });

  window.openPrinterPoll = openPrinterPoll;
  window.openPrinterStep = openPrinterStep;
})();


/*betrayal captcha*/
document.addEventListener("DOMContentLoaded", () => {
  const trigger = document.getElementById("betrayal-captcha");
  if (!trigger) return;

  const betrayalImages = [
    "img/betrayal_01.jpg","img/betrayal_02.jpg","img/betrayal_03.webp","img/betrayal_04.webp",
    "img/betrayal_05.webp","img/betrayal_06.webp","img/betrayal_07.jpg","img/betrayal_08.jpg",
    "img/betrayal_09.jpg","img/betrayal_10.jpg","img/betrayal_11.jpg","img/betrayal_12.png",
    "img/betrayal_13.jpg","img/betrayal_14.jpg","img/betrayal_15.jpg","img/betrayal_16.jpg",
    "img/betrayal_17.jpg","img/betrayal_18.jpg","img/betrayal_19.jpg","img/betrayal_20.jpeg",
    "img/betrayal_21.jpg","img/betrayal_22.jpg","img/betrayal_23.jpg","img/betrayal_24.webp",
    "img/betrayal_25.jpg","img/betrayal_26.jpg","img/betrayal_27.jpg",
  ];

  const GRID_SIZE = 9;

  const interfaceLies = [
    "interesting choice.","that one feels empty.","too confident.","you hesitated.","most people miss one.",
    "that was fast.","are you sure about that?","no, not like that.","you skipped something.","this says more about you.",
    "that wasn't necessary.","you seem certain.","try to be honest.","almost.","not quite."
  ];

  const nextRemembering = [
    "next","try again","no, really. next.","fine.","you missed something.","just continue.",
    "this won't help.","why are you still here?","you can stop.","you can stop."
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
        <span>betrayal captcha</span>
        <span class="close clickable">×</span>
      </div>
      <div class="content">
        <div class="betrayal-overtitle">verification</div>
        <div class="betrayal-title">select all images with potential for betrayal</div>
        <div class="betrayal-hint" id="betrayal-hint">click everything that feels like betrayal</div>
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

    function setStatus() { statusEl.textContent = `${selectedCount} selected`; }
    function refillIfNeeded() { if (deck.length < GRID_SIZE) deck = shuffle(betrayalImages); }

    function lie(force = false) {
      if (!force && Math.random() > 0.55) return;
      hintEl.textContent = interfaceLies[Math.floor(Math.random() * interfaceLies.length)];
    }

    function meta() {
      if (rounds === 4) hintEl.textContent = "it doesn't get clearer.";
      if (rounds === 7) hintEl.textContent = "most people stop here.";
      if (rounds === 10) hintEl.textContent = "you can leave if you want.";
      if (rounds > 12 && Math.random() < 0.25) hintEl.textContent = "this keeps going.";
    }

    function clearSelection() {
      selectedCount = 0;
      setStatus();
      gridEl.querySelectorAll(".betrayal-tile.selected").forEach(t => t.classList.remove("selected"));
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

          let targetTile = tile;
          if (Math.random() < 0.12 && tiles.length > 1) {
            const others = tiles.filter(t => t !== tile);
            targetTile = others[Math.floor(Math.random() * others.length)];
          }

          targetTile.classList.toggle("selected");
          selectedCount = gridEl.querySelectorAll(".betrayal-tile.selected").length;
          setStatus();
          lie();

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


/*sub scam*/
document.addEventListener("DOMContentLoaded", () => {
  const trigger = document.getElementById("sub-scam");
  if (!trigger) return;

  trigger.addEventListener("click", (e) => {
    e.stopPropagation();

    const existing = document.querySelector(".subscam-tv");
    if (existing) { existing.remove(); return; }

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
    video.currentTime = 0;
    video.volume = 1.0;

    const playPromise = video.play();
    if (playPromise && playPromise.catch) {
      playPromise.catch(err => console.warn("Autoplay with sound blocked:", err));
    }
  });
});


function rand(min, max) { return Math.random() * (max - min) + min; }
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

function getMovables() {
  const nodes = [
    ...document.querySelectorAll(
      ".popup-img, .fake-window, .subscam-tv, .printer-step, .betrayal-window, .complaints-login, .complaints-notes"
    )
  ];
  for (const el of allPopups) if (el && el.nodeType === 1) nodes.push(el);
  return [...new Set(nodes)].filter(el => document.body.contains(el));
}

function teleportElement(el) {
  if (el.id === "clean-button") return;
  if (el.classList.contains("dvd-clean")) return;
  if (el.classList.contains("fc-heart-wrap")) return;

  const rect = el.getBoundingClientRect();
  const w = Math.max(40, rect.width);
  const h = Math.max(40, rect.height);

  const maxX = window.innerWidth - w - 8;
  const maxY = window.innerHeight - h - 8;

  const x = clamp(rand(8, maxX), 8, maxX);
  const y = clamp(rand(8, maxY), 8, maxY);

  el.classList.add("teleport-hide");

  setTimeout(() => {
    el.style.left = x + "px";
    el.style.top = y + "px";
    el.style.right = "auto";
    el.style.bottom = "auto";

    if (el.classList.contains("fake-window") || el.classList.contains("popup-img")) {
      el.style.transform = "none";
    }

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
    const shuffled = els.slice().sort(() => Math.random() - 0.5);
    shuffled.slice(0, moveEachTick).forEach(teleportElement);
  }, intervalMs);
}

function stopTeleporting() {
  teleportOn = false;
  if (teleportTimer) clearInterval(teleportTimer);
  teleportTimer = null;
}

/*out of sync*/
document.addEventListener("DOMContentLoaded", () => {
  const chaos = document.getElementById("out-of-sync");
  if (!chaos) return;

  function fireClick(el) {
    if (!el) return;
    el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
  }

  chaos.addEventListener("click", (e) => {
    e.stopPropagation();

    if (!teleportOn) startTeleporting(520, 6);
    else stopTeleporting();

    const triggers = [
      document.getElementById("working-title"),
      document.getElementById("flirting-crimes"),
      document.getElementById("printer-ragebait"),
      document.getElementById("betrayal-captcha"),
      document.getElementById("complaints-box"),
      document.getElementById("sub-scam"),
      document.getElementById("pure-connection"),
    ];

    let t = 0;
    triggers.forEach((el) => {
      setTimeout(() => fireClick(el), t);
      t += 120;
    });

    setTimeout(() => fireClick(document.getElementById("working-title")), t + 250);
    setTimeout(() => fireClick(document.getElementById("working-title")), t + 500);

    setTimeout(() => {
      for (let i = 0; i < 11; i++) setTimeout(() => openPrinterStep(i), i * 90);
      setTimeout(() => openPrinterStep(11), 11 * 90 + 150);
    }, t + 650);
  });
});


/*flirting crimes*/
if (!window.__fc_init__) {
  window.__fc_init__ = true;

  const flirting = {
    starsOn: false,
    timers: [],
    lanes: null,
    lanesSig: "",
    queueBusy: false,
    activeHearts: 0,
    runWantsStop: false,
    heartW: 260,
  };

  const heartQueue = [];

  function tset(fn, ms) {
    const id = setTimeout(fn, ms);
    flirting.timers.push(id);
    return id;
  }

  function clearAllTimers() {
    flirting.timers.forEach((id) => clearTimeout(id));
    flirting.timers.length = 0;
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function spawnGlobalStars(count = 110) {
    const layer = document.getElementById("global-stars");
    if (!layer) return;

    layer.innerHTML = "";
    for (let i = 0; i < count; i++) {
      const s = document.createElement("div");
      s.className = "star";
      s.dataset.fc = "1";
      s.style.left = Math.random() * 100 + "%";
      s.style.top = Math.random() * 100 + "%";

      const size = 3 + Math.random() * 6;
      s.style.setProperty("--s", size + "px");
      s.style.setProperty("--tw", 900 + Math.random() * 2400 + "ms");
      s.style.setProperty("--dr", 6500 + Math.random() * 12000 + "ms");
      s.style.animationDelay = -Math.random() * 3000 + "ms";

      layer.appendChild(s);
    }

    layer.classList.add("on");
    flirting.starsOn = true;
  }

  function stopGlobalStars() {
    const layer = document.getElementById("global-stars");
    if (!layer) return;
    layer.classList.remove("on");
    layer.innerHTML = "";
    flirting.starsOn = false;
  }

  function maybeStopStars() {
    if (flirting.runWantsStop && flirting.activeHearts <= 0 && heartQueue.length === 0) {
      stopGlobalStars();
      flirting.runWantsStop = false;
    }
  }

  const MARGIN = 24;

  function lanesSignature() {
    return `${window.innerWidth}x${window.innerHeight}@${window.devicePixelRatio || 1}`;
  }

  function measureHeartWidthPx() {
    const tmpWrap = document.createElement("div");
    tmpWrap.style.position = "fixed";
    tmpWrap.style.left = "-9999px";
    tmpWrap.style.top = "-9999px";
    tmpWrap.style.visibility = "hidden";
    tmpWrap.style.pointerEvents = "none";
    tmpWrap.dataset.fc = "1";

    const tmpImg = document.createElement("img");
    tmpImg.src = "img/herz.png";
    tmpImg.className = "falling-heart";
    tmpImg.alt = "";
    tmpImg.draggable = false;
    tmpImg.dataset.fc = "1";

    tmpWrap.appendChild(tmpImg);
    document.body.appendChild(tmpWrap);

    const w = tmpImg.getBoundingClientRect().width || 260;
    tmpWrap.remove();

    return w;
  }

  function laneGapPx() {
    return clamp(Math.round(window.innerWidth * 0.05), 26, 120);
  }

  function buildLanes() {
    const heartW = measureHeartWidthPx();
    flirting.heartW = heartW;

    const gap = laneGapPx();
    const laneW = heartW + gap;

    const usable = Math.max(0, window.innerWidth - MARGIN * 2);
    const count = Math.max(1, Math.floor(usable / laneW));

    const lanes = [];
    for (let i = 0; i < count; i++) {
      const x = MARGIN + (i + 0.5) * laneW;
      lanes.push({ x, busyUntil: 0 });
    }

    return lanes;
  }

  function ensureLanes() {
    const sig = lanesSignature();
    if (!flirting.lanes || flirting.lanesSig !== sig) {
      flirting.lanes = buildLanes();
      flirting.lanesSig = sig;
    }
  }

  function reserveLane(durationMs) {
    ensureLanes();

    const now = Date.now();
    const lanes = flirting.lanes;

    let lane = lanes.find((l) => l.busyUntil <= now);
    if (!lane) {
      lane = lanes.reduce((best, l) => (l.busyUntil < best.busyUntil ? l : best), lanes[0]);
    }

    const wait = Math.max(0, lane.busyUntil - now);
    lane.busyUntil = now + wait + durationMs + 900;

    return { x: lane.x, wait };
  }

  function spawnHeartNow(text) {
    const dur = 7 + Math.random() * 5;
    const durMs = dur * 1000;

    let lane = { x: window.innerWidth * 0.5, wait: 0 };
    try {
      lane = reserveLane(durMs);
    } catch (e) {
      console.warn("[flirting-crimes] reserveLane failed:", e);
    }

    const { x, wait } = lane;

    const doSpawn = () => {
      const wrap = document.createElement("div");
      wrap.className = "fc-heart-wrap clickable";
      wrap.dataset.fc = "1";

      wrap.style.position = "fixed";
      wrap.style.left = x + "px";
      wrap.style.top = "-180px";

      wrap.style.animationName = "fc-fall";
      wrap.style.animationDuration = `${dur}s`;
      wrap.style.animationTimingFunction = "linear";
      wrap.style.animationFillMode = "forwards";
      wrap.style.animationPlayState = "running";

      wrap.style.setProperty("--r", (Math.random() * 16 - 8).toFixed(1) + "deg");

      const img = document.createElement("img");
      img.src = "img/herz.png";
      img.className = "falling-heart";
      img.alt = "";
      img.draggable = false;
      img.dataset.fc = "1";

      const label = document.createElement("div");
      label.className = "falling-heart-label";
      label.textContent = text;
      label.dataset.fc = "1";

      wrap.appendChild(img);
      wrap.appendChild(label);

      document.body.appendChild(wrap);

      if (typeof allPopups !== "undefined" && Array.isArray(allPopups)) {
        allPopups.push(wrap);
      }

      flirting.activeHearts++;

      const PAUSE_MS = 2600;
      wrap.addEventListener("click", (e) => {
        e.stopPropagation();
        if (wrap.dataset.paused === "1") return;
        wrap.dataset.paused = "1";
        wrap.style.animationPlayState = "paused";
        tset(() => {
          if (!document.body.contains(wrap)) return;
          wrap.style.animationPlayState = "running";
          wrap.dataset.paused = "0";
        }, PAUSE_MS);
      });

      tset(() => {
        if (document.body.contains(wrap)) wrap.remove();
        flirting.activeHearts--;
        maybeStopStars();
      }, durMs + 400);
    };

    if (wait > 0) tset(doSpawn, wait);
    else doSpawn();
  }

  function pumpQueue() {
    if (flirting.queueBusy) return;
    flirting.queueBusy = true;

    const startDelay = 900 + Math.random() * 600;

    tset(function runNext() {
      if (heartQueue.length === 0) {
        flirting.queueBusy = false;
        maybeStopStars();
        return;
      }

      const item = heartQueue.shift();
      spawnHeartNow(item.text);

      const nextDelay = 1200 + Math.random() * 1400;
      tset(runNext, nextDelay);
    }, startDelay);
  }

  function startRun(lines) {
    const bag = shuffle(lines);
    bag.forEach((txt) => heartQueue.push({ text: txt }));
    pumpQueue();
    flirting.runWantsStop = true;
  }

  function clearFlirtingCrimes() {
    clearAllTimers();
    heartQueue.length = 0;
    flirting.queueBusy = false;
    flirting.lanes = null;
    flirting.lanesSig = "";
    flirting.activeHearts = 0;
    flirting.runWantsStop = false;
    stopGlobalStars();

    document.querySelectorAll('[data-fc="1"]').forEach((el) => el.remove());
  }

  window.clearFlirtingCrimes = clearFlirtingCrimes;

  document.addEventListener("DOMContentLoaded", () => {
    const trigger = document.getElementById("flirting-crimes");
    if (!trigger) return;

    const lines = [
      "my dog looked almost exactly like that. i don’t know which one of you i’d rather get to know now…",
      "be a good girl!",
      "you look so innocent!",
      "may i tear your clothes apart?",
      "what do you think would be the hottest thing a girl can like?",
      "hey, you look super likeable! or am i mistaken?",
      "tired of being an adult? be my baby then",
      "you’ll be mcdonalds and i’ll be nike, cause i’ll be doing it and you’ll be loving it.",
      "well hey baby are you an english tense? because what we have is past perfect.",
      "i would get into the candy-van for you!",
      "your hand looks lonely. may i hold it?",
      "can i massage and lick your feet for 100€?",
      "heyy, i would like to massage your feet and clean your shoes if you don’t mind.",
      "how would you feel about having a buddy who licks you clean after another guy has come inside you?",
      "may i?",
      "may god continue to send u terrible matches, until u choose me",
    ];

    const invalidate = () => {
      flirting.lanes = null;
      flirting.lanesSig = "";
    };
    window.addEventListener("resize", invalidate);
    window.addEventListener("orientationchange", invalidate);

    trigger.addEventListener("click", (e) => {
  console.log("FLIRTING CRIMES CLICK ✅", e.target);
  e.stopPropagation();
  ensureLanes();
  if (!flirting.starsOn) spawnGlobalStars(110);
  startRun(lines);
});

  });
}


/*clean*/
document.addEventListener("DOMContentLoaded", () => {
  const cleanBtn = document.getElementById("clean-button");
  if (!cleanBtn) return;

  cleanBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    stopTeleporting();

    allPopups.forEach(p => p?.remove?.());
    allPopups.length = 0;

    if (typeof window.clearFlirtingCrimes === "function") {
      window.clearFlirtingCrimes();
    } else {
      document.querySelectorAll('[data-fc="1"]').forEach(el => el.remove());
    }

    clearPrinterRagebait();
  });
});


if (!window.__dvd_clean_init__) {
  window.__dvd_clean_init__ = true;

  const dvd = {
    el: null,
    raf: 0,
    x: 60,
    y: 60,
    vx: 1.2,
    vy: 0.95,
    hue: 0,
    last: 0,
  };

  function clampLocal(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function setHue(h) {
    dvd.hue = ((h % 360) + 360) % 360;
    dvd.el.style.filter = `hue-rotate(${dvd.hue}deg) saturate(1.7) brightness(1.1)`;
  }

  function bumpHue() {
    setHue(dvd.hue + 60 + Math.random() * 200);
  }

  function tick(ts) {
    if (!dvd.el) return;

    const dt = dvd.last ? Math.min(40, ts - dvd.last) : 16;
    dvd.last = ts;

    const r = dvd.el.getBoundingClientRect();
    const w = r.width || 120;
    const h = r.height || 40;

    const maxX = Math.max(0, window.innerWidth - w);
    const maxY = Math.max(0, window.innerHeight - h);

    dvd.x += dvd.vx * (dt / 16);
    dvd.y += dvd.vy * (dt / 16);

    let hit = false;

    if (dvd.x <= 0) { dvd.x = 0; dvd.vx *= -1; hit = true; }
    else if (dvd.x >= maxX) { dvd.x = maxX; dvd.vx *= -1; hit = true; }

    if (dvd.y <= 0) { dvd.y = 0; dvd.vy *= -1; hit = true; }
    else if (dvd.y >= maxY) { dvd.y = maxY; dvd.vy *= -1; hit = true; }

    if (hit) bumpHue();

    dvd.x = clampLocal(dvd.x, 0, maxX);
    dvd.y = clampLocal(dvd.y, 0, maxY);

    dvd.el.style.transform = `translate3d(${dvd.x}px, ${dvd.y}px, 0)`;
    dvd.raf = requestAnimationFrame(tick);
  }

  function start() {
    const btn = document.getElementById("clean-button");
    if (!btn) return false;

    dvd.el = btn;
    dvd.el.classList.add("dvd-clean", "clickable");

    const r = dvd.el.getBoundingClientRect();
    const w = r.width || 120;
    const h = r.height || 40;

    dvd.x = Math.random() * Math.max(1, window.innerWidth - w);
    dvd.y = Math.random() * Math.max(1, window.innerHeight - h);

    setHue(Math.random() * 360);

    cancelAnimationFrame(dvd.raf);
    dvd.last = 0;
    dvd.raf = requestAnimationFrame(tick);
    return true;
  }

  function startWithRetries() {
    if (start()) return;
    let tries = 0;
    const timer = setInterval(() => {
      tries++;
      if (start() || tries > 20) clearInterval(timer);
    }, 150);
  }

  document.addEventListener("DOMContentLoaded", startWithRetries);
  window.addEventListener("load", startWithRetries);

  window.addEventListener("resize", () => {
    if (!dvd.el) return;
    const r = dvd.el.getBoundingClientRect();
    dvd.x = clampLocal(dvd.x, 0, Math.max(0, window.innerWidth - r.width));
    dvd.y = clampLocal(dvd.y, 0, Math.max(0, window.innerHeight - r.height));
  });
}

function clearPrinterRagebait() {

  document.querySelectorAll(
    ".printer-poll-window, " +
    ".printer-result-window, " +
    ".printer-introduction, " +
    ".fake-window.printer-step"
  ).forEach(el => el.remove());

}

/*complaints box*/
(function () {
  if (window.__complaints_ready__) return;
  window.__complaints_ready__ = true;

  const STORAGE_KEY = "betrayal_complaints_notes_v1";
  const state = { notes: [], counter: 1, activeId: null };

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (!Array.isArray(data.notes)) return;
      state.notes = data.notes;
      state.counter = data.counter || (data.notes.length + 1);
    } catch {}
  }

  function save() {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ notes: state.notes, counter: state.counter })
    );
  }

  function stamp() {
    const d = new Date();
    return d.toLocaleString(undefined, {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function titleFrom(title, body) {
    const t = (title || "").trim();
    if (t) return t.slice(0, 32);
    const b = (body || "").trim().split("\n")[0];
    return b ? b.slice(0, 32) : "untitled complaint";
  }

  function loginWindow() {
    const w = document.createElement("div");
    w.className = "fake-window complaints-login clickable";

    w.innerHTML = `
      <div class="titlebar">
        <div class="traffic">
          <span class="dot red"></span>
          <span class="dot yellow"></span>
          <span class="dot green"></span>
        </div>
        <div class="title">login</div>
      </div>

      <div class="content">
        <div class="complaints-login-head"></div>

        <form class="complaints-login-form" autocomplete="off">
          <div class="complaints-login-field">
            <label for="cl-user">username</label>
            <input id="cl-user" value="please_stay" readonly>
          </div>

          <div class="complaints-login-field">
            <label for="cl-pass">password</label>
            <input id="cl-pass" type="password" value="••••••••••••••" readonly>
          </div>

        <div class="complaints-login-actions">
  <button type="button" class="notes-btn primary login-btn clickable">login</button>
</div>
    `;

    return w;
  }

  function openLogin() {
    const w = loginWindow();
    document.body.appendChild(w);
    allPopups.push(w);

    const close = w.querySelector(".dot.red");
    if (close) {
      close.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        w.remove();
        const i = allPopups.indexOf(w);
        if (i > -1) allPopups.splice(i, 1);
      });
    }

    const loginBtn = w.querySelector(".login-btn");
    if (loginBtn) {
      loginBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        w.remove();
        const i = allPopups.indexOf(w);
        if (i > -1) allPopups.splice(i, 1);

        setTimeout(() => openNotes(), 0);
      });
    }
  }

  function notesWindow() {
    const w = document.createElement("div");
    w.className = "fake-window complaints-notes clickable";
    w.innerHTML = `
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
          <div class="complaints-notes-list"></div>
        </div>
        <div class="complaints-notes-main">
          <div class="complaints-notes-toolbar">
            <input class="note-title-input" placeholder="untitled note">
            <button class="notes-btn primary clickable">submit</button>
          </div>
          <div class="complaints-notes-editor">
            <textarea placeholder="type your complaint… ( the system is listening. allegedly. )"></textarea>
          </div>
        </div>
      </div>`;
    return w;
  }

  function render(win) {
    const list = win.querySelector(".complaints-notes-list");
    list.innerHTML = "";

    if (!state.notes.length) {
      list.innerHTML = `<div class="complaints-notes-item">no notes yet</div>`;
      return;
    }

    state.notes
      .slice()
      .sort((a, b) => b.createdAt - a.createdAt)
      .forEach((n) => {
        const d = document.createElement("div");
        d.className = "complaints-notes-item clickable";
        if (n.id === state.activeId) d.classList.add("active");
        d.innerHTML = `
          <div class="name">${n.title}</div>
          <div class="preview">${(n.body || "").slice(0, 60)}</div>
          <div class="meta">${n.stamp}</div>`;
        d.onclick = () => {
          state.activeId = n.id;
          win.querySelector(".note-title-input").value = n.title;
          win.querySelector("textarea").value = n.body;
          render(win);
        };
        list.appendChild(d);
      });
  }

  function fresh(win) {
    state.activeId = null;
    win.querySelector(".note-title-input").value = "";
    win.querySelector("textarea").value = "";
    render(win);
  }

  function openNotes() {
    load();
    const w = notesWindow();
    document.body.appendChild(w);
    allPopups.push(w);

    const close = w.querySelector(".dot.red");
    if (close) {
      close.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        w.remove();
        const i = allPopups.indexOf(w);
        if (i > -1) allPopups.splice(i, 1);
      };
    }

    const btn = w.querySelector(".notes-btn");
    const title = w.querySelector(".note-title-input");
    const area = w.querySelector("textarea");

    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();

      const body = area.value.trim();
      if (!body) return;

      const note = {
        id: "c" + state.counter++,
        title: titleFrom(title.value, body),
        body,
        createdAt: Date.now(),
        stamp: stamp(),
      };

      state.notes.push(note);
      save();
      fresh(w);
    };

    render(w);
    fresh(w);
  }

  document.addEventListener("click", (e) => {
    const t = e.target.closest("#complaints-box");
    if (!t) return;
    e.preventDefault();
    e.stopPropagation();
    openLogin();
  });
})();


/* fake cursor */
document.addEventListener("DOMContentLoaded", () => {
  fakeCursor = document.getElementById("fake-cursor");
  if (!fakeCursor) return;

  document.addEventListener("mousemove", (e) => {
    fakeCursor.style.left = e.clientX + "px";
    fakeCursor.style.top  = e.clientY + "px";

    if (fakeCursor.classList.contains("loading")) return;

    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (!el) return;

    const inLogin         = el.closest(".complaints-login");
    const inNotes         = el.closest(".complaints-notes");
    const inPrinterPoll   = el.closest(".printer-poll-window");
    const inPrinterResult = el.closest(".printer-result-window");
    const inPrinterIntro  = el.closest(".printer-introduction");
    const inPrinterStep   = el.closest(".fake-window.printer-step:not(.step-12)");
    const inBetrayal      = el.closest(".betrayal-window");

    let isClickable = false;

    if (inLogin) {
      isClickable = !!el.closest(
        ".complaints-login .login-btn, " +
        ".complaints-login .dot.red, " +
        ".complaints-login #cl-user, " +
        ".complaints-login #cl-pass"
      );
    }
    else if (inNotes) {
      isClickable = !!el.closest(
        ".complaints-notes .complaints-notes-item, " +
        ".complaints-notes textarea, " +
        ".complaints-notes .note-title-input, " +
        ".complaints-notes .dot.red, " +
        ".complaints-notes .complaints-notes-toolbar .notes-btn.primary"
      );
    }
    else if (inPrinterPoll) {
      isClickable = !!el.closest(".printer-poll-window input[type='radio']");
    }
    else if (inPrinterResult) {
      isClickable = !!el.closest(".printer-result-window .close");
    }
    else if (inPrinterIntro) {
      const inContent = !!el.closest(".printer-introduction .content");
      const onClose   = !!el.closest(".printer-introduction .close");
      isClickable = inContent && !onClose;
    }
    else if (inPrinterStep) {
      isClickable = !!el.closest(".fake-window.printer-step:not(.step-12) .content");
    }
    else if (inBetrayal) {
      isClickable = !!el.closest(
        ".betrayal-window .betrayal-tile, " +
        ".betrayal-window .close, " +
        ".betrayal-window #betrayal-clear, " +
        ".betrayal-window #betrayal-next"
      );
    }
    else {
      const title = el.closest(".line.title");
      const isBetrayalList = !!el.closest(".textblock.seven");

      isClickable =
        !!el.closest(".fc-heart-wrap, .clickable, a, button, input, .popup-img, #checkbox-container, [data-clickable]")
        || (title && !isBetrayalList);
    }

    fakeCursor.classList.toggle("outline", isClickable);
    fakeCursor.classList.toggle("filled", !isClickable);
  });
});



