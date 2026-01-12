const textLayer = document.getElementById("text-layer");
const controlFontSize = document.getElementById("control-font-size");
const controlWght = document.getElementById("control-wght");

controlFontSize.oninput = (event) => {
    textLayer.style.fontSize = event.target.value + "px";
};

controlWght.oninput = (event) => {
    textLayer.style.fontVariationSettings = `"wght" ${event.target.value}`;
};
