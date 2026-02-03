// const svgFiles = [
//     "svgzwischenpräsi/SVG00001.svg",
//     "svgzwischenpräsi/SVG00002.svg",
//     "svgzwischenpräsi/SVG00003.svg",
//     "svgzwischenpräsi/SVG00004.svg",
//     "svgzwischenpräsi/SVG00005.svg",
//     "svgzwischenpräsi/SVG00006.svg",
//     "svgzwischenpräsi/SVG00007.svg",
//     "svgzwischenpräsi/SVG00008.svg",
//     "svgzwischenpräsi/SVG00009.svg",
//     "svgzwischenpräsi/SVG00010.svg",
//     "svgzwischenpräsi/SVG00011.svg",
//     "svgzwischenpräsi/SVG00012.svg",
//     "svgzwischenpräsi/SVG00013.svg",
//     "svgzwischenpräsi/SVG00014.svg",
//     "svgzwischenpräsi/SVG00015.svg",
//     "svgzwischenpräsi/SVG00016.svg",
//     "svgzwischenpräsi/SVG00017.svg",
//     "svgzwischenpräsi/SVG00018.svg",
//     "svgzwischenpräsi/SVG00019.svg",
//     "svgzwischenpräsi/SVG00020.svg",
//     "svgzwischenpräsi/SVG00021.svg",
//     "svgzwischenpräsi/SVG00022.svg",
//     "svgzwischenpräsi/SVG00023.svg",
//     "svgzwischenpräsi/SVG00024.svg",
//     "svgzwischenpräsi/SVG00025.svg",
//     "svgzwischenpräsi/SVG00026.svg",
//     "svgzwischenpräsi/SVG00027.svg",
//     "svgzwischenpräsi/SVG00028.svg",
//     "svgzwischenpräsi/SVG00029.svg",
//     "svgzwischenpräsi/SVG00030.svg",
//     "svgzwischenpräsi/SVG00031.svg",
//     "svgzwischenpräsi/SVG00032.svg",
//     "svgzwischenpräsi/SVG00033.svg",
//     "svgzwischenpräsi/SVG00034.svg",
//     "svgzwischenpräsi/SVG00035.svg",
//     "svgzwischenpräsi/SVG00036.svg",
//     "svgzwischenpräsi/SVG00037.svg",
//     "svgzwischenpräsi/SVG00038.svg",
//     "svgzwischenpräsi/SVG00039.svg",
    
// ];

const synth = new Tone.Synth().toDestination();

const svgCategories = {
    icons: [
        "./iconsrichtig/square1.svg",
        "./iconsrichtig/square2.svg",
        "./iconsrichtig/circle1.svg",
        "./iconsrichtig/circle2.svg",
        "./iconsrichtig/triangle1.svg",
        "./iconsrichtig/triangle2.svg",
        "./iconsrichtig/rechteck1.svg",
        "./iconsrichtig/rechteck2.svg",
        "./iconsrichtig/oval1.svg",
        "./iconsrichtig/oval2.svg",
        "./iconsrichtig/halfcircle1.svg",
        "./iconsrichtig/halfcircle2.svg",
        "./iconsrichtig/roundoffsquare1.svg",
        "./iconsrichtig/roundoffsquare2.svg",
        "./iconsrichtig/egg1.svg",
        "./iconsrichtig/egg2.svg",
        "./iconsrichtig/diamond1.svg",
        "./iconsrichtig/diamond2.svg",
        "./iconsrichtig/oneline.svg",
        "./iconsrichtig/threeline.svg",
        "./iconsrichtig/star51.svg",
        "./iconsrichtig/star52.svg",
        "./iconsrichtig/heart1.svg",
        "./iconsrichtig/heart2.svg",
        "./iconsrichtig/star41.svg",
        "./iconsrichtig/star42.svg",
        "./iconsrichtig/star101.svg",
        "./iconsrichtig/star102.svg",
        "./iconsrichtig/xflower1.svg",
        "./iconsrichtig/xflower2.svg",
        "./iconsrichtig/bling1.svg",
        "./iconsrichtig/bling2.svg",
        "./iconsrichtig/blume41.svg",
        "./iconsrichtig/blume42.svg",
        "./iconsrichtig/blume51.svg",
        "./iconsrichtig/blume52.svg",
        "./iconsrichtig/flower121.svg",
        "./iconsrichtig/flower122.svg",
        "./iconsrichtig/sun1.svg",
        "./iconsrichtig/sun2.svg",
        "./iconsrichtig/cloud1.svg",
        "./iconsrichtig/cloud2.svg",
        "./iconsrichtig/drop1.svg",
        "./iconsrichtig/drop2.svg",
        "./iconsrichtig/blitz1.svg",
        "./iconsrichtig/blitz2.svg",
        "./iconsrichtig/swirlr1.svg",
        "./iconsrichtig/swirlr2.svg",
        "./iconsrichtig/swirll1.svg",
        "./iconsrichtig/swirll2.svg",
        "./iconsrichtig/spongebobflower1.svg",
        "./iconsrichtig/spongebobflower2.svg",
        "./iconsrichtig/onenote1.svg",
        "./iconsrichtig/onenote2.svg",
        "./iconsrichtig/twonote1.svg",
        "./iconsrichtig/twonote2.svg",
        "./iconsrichtig/apple1.svg",
        "./iconsrichtig/apple2.svg",
        "./iconsrichtig/kirsche1.svg",
        "./iconsrichtig/kirsche2.svg",
        "./iconsrichtig/horsey1.svg",
        "./iconsrichtig/horsey2.svg",
        "./iconsrichtig/dragon1.svg",
        "./iconsrichtig/dragon2.svg",
    ],
    caslon: [
        "caslon/a.svg",
        "caslon/b.svg",
        "caslon/c.svg",
        "caslon/d.svg",
        "caslon/e.svg",
        "caslon/f.svg",
        "caslon/g.svg",
        "caslon/h.svg",
        "caslon/i.svg",
        "caslon/j.svg",
        "caslon/k.svg",
        "caslon/l.svg",
        "caslon/m.svg",
        "caslon/n.svg",
        "caslon/o.svg",
        "caslon/p.svg",
        "caslon/q.svg",
        "caslon/r.svg",
        "caslon/s.svg",
        "caslon/t.svg",
        "caslon/u.svg",
        "caslon/v.svg",
        "caslon/w.svg",
        "caslon/x.svg",
        "caslon/y.svg",
        "caslon/z.svg",
        "caslon/a_up.svg",
        "caslon/b_up.svg",
        "caslon/c_up.svg",
        "caslon/d_up.svg",
        "caslon/e_up.svg",
        "caslon/f_up.svg",
        "caslon/g_up.svg",
        "caslon/h_up.svg",
        "caslon/i_up.svg",
        "caslon/j_up.svg",
        "caslon/k_up.svg",
        "caslon/l_up.svg",
        "caslon/m_up.svg",
        "caslon/n_up.svg",
        "caslon/o_up.svg",
        "caslon/p_up.svg",
        "caslon/q_up.svg",
        "caslon/r_up.svg",
        "caslon/s_up.svg",
        "caslon/t_up.svg",
        "caslon/u_up.svg",
        "caslon/v_up.svg",
        "caslon/w_up.svg",
        "caslon/x_up.svg",
        "caslon/y_up.svg",
        "caslon/z_up.svg",
        "caslon/0.svg",
        "caslon/1.svg",
        "caslon/2.svg",
        "caslon/3.svg",
        "caslon/4.svg",
        "caslon/5.svg",
        "caslon/6.svg",
        "caslon/7.svg",
        "caslon/8.svg",
        "caslon/9.svg",
    ],
    aktiv: [
      "aktiv grotesk/a.svg",
      "aktiv grotesk/b.svg",
      "aktiv grotesk/c.svg",
      "aktiv grotesk/d.svg",
      "aktiv grotesk/e.svg",
      "aktiv grotesk/f.svg",
      "aktiv grotesk/g.svg",
      "aktiv grotesk/h.svg",
      "aktiv grotesk/i.svg",
      "aktiv grotesk/j.svg",
      "aktiv grotesk/k.svg",
      "aktiv grotesk/l.svg",
      "aktiv grotesk/m.svg",
      "aktiv grotesk/n.svg",
      "aktiv grotesk/o.svg",
      "aktiv grotesk/p.svg",
      "aktiv grotesk/q.svg",
      "aktiv grotesk/r.svg",
      "aktiv grotesk/s.svg",
      "aktiv grotesk/t.svg",
      "aktiv grotesk/u.svg",
      "aktiv grotesk/v.svg",
      "aktiv grotesk/w.svg",
      "aktiv grotesk/x.svg",
      "aktiv grotesk/y.svg",
      "aktiv grotesk/z.svg",
      "aktiv grotesk/a_up.svg",
      "aktiv grotesk/b_up.svg",
      "aktiv grotesk/c_up.svg",
      "aktiv grotesk/d_up.svg",
      "aktiv grotesk/e_up.svg",
      "aktiv grotesk/f_up.svg",
      "aktiv grotesk/g_up.svg",
      "aktiv grotesk/h_up.svg",
      "aktiv grotesk/i_up.svg",
      "aktiv grotesk/j_up.svg",
      "aktiv grotesk/k_up.svg",
      "aktiv grotesk/l_up.svg",
      "aktiv grotesk/m_up.svg",
      "aktiv grotesk/n_up.svg",
      "aktiv grotesk/o_up.svg",
      "aktiv grotesk/p_up.svg",
      "aktiv grotesk/q_up.svg",
      "aktiv grotesk/r_up.svg",
      "aktiv grotesk/s_up.svg",
      "aktiv grotesk/t_up.svg",
      "aktiv grotesk/u_up.svg",
      "aktiv grotesk/v_up.svg",
      "aktiv grotesk/w_up.svg",
      "aktiv grotesk/x_up.svg",
      "aktiv grotesk/y_up.svg",
      "aktiv grotesk/z_up.svg",
      "aktiv grotesk/0.svg",
      "aktiv grotesk/1.svg",
      "aktiv grotesk/2.svg",
      "aktiv grotesk/3.svg",
      "aktiv grotesk/4.svg",
      "aktiv grotesk/5.svg",
      "aktiv grotesk/6.svg",
      "aktiv grotesk/7.svg",
      "aktiv grotesk/8.svg",
      "aktiv grotesk/9.svg",

    ],

    swirls: [
        "swirls/SVG00001.svg",
        "swirls/SVG00002.svg",
        "swirls/SVG00003.svg",
        "swirls/SVG00004.svg",
        "swirls/SVG00005.svg",
        "swirls/SVG00006.svg",
        "swirls/SVG00007.svg",
        "swirls/SVG00008.svg",
        "swirls/SVG00009.svg",
        "swirls/SVG00010.svg",
        "swirls/SVG00011.svg",
        "swirls/SVG00012.svg",
        "swirls/SVG00013.svg",
        "swirls/SVG00014.svg",
        "swirls/SVG00015.svg",
        "swirls/SVG00016.svg",
        "swirls/SVG00017.svg",
        "swirls/SVG00018.svg",
        "swirls/SVG00019.svg",
        "swirls/SVG00020.svg",
        "swirls/SVG00021.svg",
        "swirls/SVG00022.svg",
        "swirls/SVG00023.svg",
        "swirls/SVG00024.svg",
        "swirls/SVG00025.svg",
        "swirls/SVG00026.svg",
    ],
};

const categoryNames = Object.keys(svgCategories);
let currentCategoryIndex = 0;


const svgList = document.getElementById("svg-list");
const objectLayer = document.getElementById("object-layer");
const preview = document.getElementById("preview");

let activeSVG = null;

//TONE JS SOUND
document.body.addEventListener("click", async () => {
    await Tone.start();
    console.log("Audio ready");
}, { once: true });


let clickPlayer;
let audioReady = false;

async function initAudio() {
    if (audioReady) return;

    await Tone.start();

    clickPlayer = new Tone.Player({
        url: "mouse-click1.mp3",
        volume: -6
    }).toDestination();

    audioReady = true;
}

function playClick() {
    if (!audioReady || !clickPlayer) return;
    clickPlayer.start();
}

//BUTTON SOUNDS

document.getElementById("export-png").addEventListener("click", async () => {
    await initAudio();
    playClick();
});

document.getElementById("clear-canvas").addEventListener("click", async () => {
    await initAudio();
    playClick();
});

document.getElementById("backgrounds").addEventListener("click", async () => {
    await initAudio();
    playClick();
});

document.getElementById("toggle-svg-color").addEventListener("click", async () => {
    await initAudio();
    playClick();
});

document.getElementById("category-prev").addEventListener("click", async () => {
    await initAudio();
    playClick();
});

document.getElementById("category-next").addEventListener("click", async () => {
    await initAudio();
    playClick();
});

document.getElementById("control-scale").addEventListener("input", async () => {
    await initAudio();
    playClick();
});

document.getElementById("control-rotate").addEventListener("input", async () => {
    await initAudio();
    playClick();
});

//CATEGORIES SVGS
function renderSVGCategory() {
    svgList.innerHTML = "";

    const category = categoryNames[currentCategoryIndex];
    const files = svgCategories[category];

    files.forEach((path) => {
        const img = document.createElement("img");
        console.log(path)
        img.src = `./${path}`;
        img.classList.add("svg-thumb");
        img.draggable = true;

        img.addEventListener("click", () => spawnSVG(path));

        img.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", path);
            const dragIcon = new Image();
            dragIcon.src = path;
            e.dataTransfer.setDragImage(dragIcon, 40, 40);
        });

        svgList.appendChild(img);
    });

    updateCategoryLabel();
}

//NAVIGATION FOR SVG CATEGORIES
document.getElementById("category-prev").addEventListener("click", () => {
    currentCategoryIndex =
        (currentCategoryIndex - 1 + categoryNames.length) % categoryNames.length;
    renderSVGCategory();
});

document.getElementById("category-next").addEventListener("click", () => {
    currentCategoryIndex =
        (currentCategoryIndex + 1) % categoryNames.length;
    renderSVGCategory();

});

function updateCategoryLabel() {
    const label = document.getElementById("category-label");
    label.textContent = categoryNames[currentCategoryIndex].toUpperCase();
}


// Prevent default dragover und drop auf Preview
preview.addEventListener("dragover", (e) => {
    e.preventDefault();
});

// Drop-Event auf Preview abfangen
preview.addEventListener("drop", (e) => {
    e.preventDefault();

    const path = e.dataTransfer.getData("text/plain");
    if (!path) return;

    // Position relativ zum Preview
    const rect = preview.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    spawnSVG(path, x, y);
});

// SVG ins Objekt-Layer spawnen, mit optionaler Position
function spawnSVG(path, left = 50, top = 50) {
    const img = document.createElement("img");
    img.src = path;
    img.classList.add("draggable-svg");

    img.style.left = left + "px";
    img.style.top = top + "px";
    img.style.width = "120px";
    img.style.transform = "rotate(0deg)";

    objectLayer.appendChild(img);

    makeDraggable(img);

    img.addEventListener("click", (e) => {
        e.stopPropagation();
        setActiveSVG(img);
    });

    img.addEventListener("dblclick", (e) => {
        e.stopPropagation();
        if (activeSVG === img) {
            img.remove();
            clearActiveSVG();
        }
    });
}

// Drag & Drop Funktion
function makeDraggable(el) {
    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;

    el.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - el.offsetLeft;
        offsetY = e.clientY - el.offsetTop;
        el.style.cursor = "grabbing";
        e.preventDefault();
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        el.style.left = e.clientX - offsetX + "px";
        el.style.top = e.clientY - offsetY + "px";
    });

    document.addEventListener("mouseup", () => {
        if (isDragging) {
            isDragging = false;
            el.style.cursor = "grab";
        }
    });
}


// SVG COLOR TOGGLE — ONLY AFFECTS THE SELECTED SVG

const colorToggleBtn = document.getElementById("toggle-svg-color");

colorToggleBtn.addEventListener("click", () => {
    // No SVG selected → do nothing
    if (!activeSVG) return;

    // activeSVG IS the <img> element
    // Toggle white/black by CSS filter
    activeSVG.classList.toggle("svg-white");
});



// Aktivieren und Steuern der Skalierung/Drehung
document.getElementById("preview").addEventListener("click", () => {
    clearActiveSVG();
});

function setActiveSVG(svg) {
    // REMOVE highlight from previously active SVG
    if (activeSVG) {
        activeSVG.classList.remove("selected");
    }

    // SET new active SVG
    activeSVG = svg;
    activeSVG.classList.add("selected");

    showTransformControls(true);

    const widthPx = parseFloat(svg.style.width) || 120;
    document.getElementById("control-scale").value = (widthPx / 120) * 100;

    const transform = svg.style.transform || "rotate(0deg)";
    const match = transform.match(/rotate\(([-\d.]+)deg\)/);
    const angle = match ? parseFloat(match[1]) : 0;
    document.getElementById("control-rotate").value = angle;
}


function clearActiveSVG() {
    activeSVG = null;
    showTransformControls(false);
}


document.getElementById("control-scale").addEventListener("input", (e) => {
    if (!activeSVG) return;

    const scalePercent = e.target.value;
    const newWidth = 120 * (scalePercent / 100);
    activeSVG.style.width = newWidth + "px";
});

document.getElementById("control-rotate").addEventListener("input", (e) => {
    if (!activeSVG) return;

    const angle = e.target.value;
    activeSVG.style.transform = `rotate(${angle}deg)`;
});


function clearCanvas() {
    // Remove all SVGs
    objectLayer.innerHTML = "";

    // Reset text
    const textLayer = document.getElementById("text-layer");
    if (textLayer) {
        textLayer.textContent = "..."; // initial placeholder
    }

    // Clear selection / active SVG
    if (typeof clearSelection === "function") {
        clearSelection();
    }

    if (typeof clearActiveSVG === "function") {
        clearActiveSVG();
    }

    // Reset transform sliders
    const scale = document.getElementById("control-scale");
    const rotate = document.getElementById("control-rotate");

    if (scale) scale.value = 100;
    if (rotate) rotate.value = 0;
}

document.getElementById("clear-canvas").addEventListener("click", () => {
    clearCanvas();
});


renderSVGCategory();
