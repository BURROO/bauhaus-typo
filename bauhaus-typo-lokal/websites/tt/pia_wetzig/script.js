const textLayer = document.getElementById("text-layer");
const controlFontSize = document.getElementById("control-font-size");
const controlWght = document.getElementById("control-wght");

document.getElementById("preview").addEventListener("click", () => {
    textLayer.classList.remove("is-editing");
});


controlFontSize.oninput = (event) => {
    textLayer.style.fontSize = event.target.value + "px";
};

const toggleFontBtn = document.getElementById("toggle-font");

let isSerif = false;

if (toggleFontBtn && textLayer) {
    toggleFontBtn.addEventListener("click", () => {
        isSerif = !isSerif;

        textLayer.style.fontFamily = isSerif
            ? '"big-caslon-fb", serif'
            : '"aktiv-grotesk", sans-serif';
    });
}


// PDF Export
document.getElementById("export-png").addEventListener("click", async () => {
    const preview = document.getElementById("preview");

    const canvas = await html2canvas(preview, {
        backgroundColor: "#ffffff",
        scale: 2,          // higher = sharper image
        useCORS: true
    });

    const imgData = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = imgData;
    link.download = "lettering_export.png";
    link.click();
});


const body = document.body;
const themeButtons = document.querySelectorAll("#backgrounds button");

themeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        const theme = btn.dataset.theme;

        body.classList.remove(
            "theme-1",
            "theme-2",
            "theme-3",
            "theme-4",
            "theme-5",
            "theme-6"
        );

        body.classList.add(theme);

        // Optional: visual active state
        themeButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
    });
});
