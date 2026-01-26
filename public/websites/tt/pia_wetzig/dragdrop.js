const svgFiles = [
    "svgs/shape1.svg",
    "svgs/shape2.svg",
    "svgs/shape3.svg",
    "svgs/shape4.svg",
    "svgs/shape5.svg",
    "svgs/shape6.svg",
    "svgs/shape7.svg",
    "svgs/shape8.svg",
    "svgs/shape9.svg",
    "svgs/shape10.svg",
    "svgs/shape11.svg",
    "svgs/shape12.svg",
    "svgs/shape13.svg",
];

const svgList = document.getElementById("svg-list");
const objectLayer = document.getElementById("object-layer");
const preview = document.getElementById("preview");

let activeSVG = null;

// SVG Thumbnails anzeigen, draggable setzen und Dragstart definieren
svgFiles.forEach((path) => {
    const img = document.createElement("img");
    img.src = path;
    img.classList.add("svg-thumb");
    // img.setAttribute("draggable", "true");

    img.draggable = true;
    // Klick zum Einfügen
    img.addEventListener("click", () => spawnSVG(path));

    // Dragstart: Pfad mitgeben
    img.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", path);
        // Optional: Drag-Image, sonst Standard-Thumbnail
        const dragIcon = new Image();
        dragIcon.src = path;
        e.dataTransfer.setDragImage(dragIcon, 40, 40);
    });

    svgList.appendChild(img);
});

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

// Aktivieren und Steuern der Skalierung/Drehung
document.getElementById("preview").addEventListener("click", () => {
    clearActiveSVG();
});

function setActiveSVG(svg) {
    activeSVG = svg;
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

function showTransformControls(show) {
    document.getElementById("label-scale").style.display = show ? "flex" : "none";
    document.getElementById("label-rotate").style.display = show ? "flex" : "none";
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
