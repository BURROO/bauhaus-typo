$(document).ready(function() {

    /**
     * FUNZIONE: Attiva Drag e Resize su un elemento
     */
    function makeInteractive($element) {
        $element.draggable({
            stack: ".draggable-asset, .tab-img",
            containment: "body"
        }).resizable({
            aspectRatio: true,
            handles: "all"
        });
    }

    /**
     * FUNZIONE: Sparpaglia le immagini extra
     */
    function scatterAssets($container) {
        const assets = $container.find(".draggable-asset");
        assets.each(function() {
            const $el = $(this);
            const randomX = Math.random() * (window.innerWidth - 300);
            const randomY = Math.random() * (window.innerHeight - 300);
            
            $el.css({
                left: randomX + "px",
                top: randomY + "px",
                display: "block",
                position: "absolute"
            });

            if (!$el.hasClass("ui-draggable")) {
                makeInteractive($el);
            }
        });
    }

    // --- 1. GESTIONE CLICK SULLE CATEGORIE ---
    $(".category").on("click", function() {
        const id = $(this).attr("id");
        const $overlay = $("#overlay_" + id);
        
        $overlay.show();
        scatterAssets($overlay);

        // --- LOGICA DISEGNO (Hand Drawings) ---
        if (id === "drawings") {
            drawingActive = true;
            $("body").addClass("drawing-mode");
            $("#canvas").addClass("active"); // Attiva pointer-events via CSS
        } else {
            // Se vuoi che il disegno si disattivi cliccando altre categorie:
            // drawingActive = false;
            // $("body").removeClass("drawing-mode");
            // $("#canvas").removeClass("active");
        }

        // --- Altre Logiche Speciali ---
        if(id === "papers") {
            const colors = ['yellow', 'red', 'blue', '#88ff00', '#c03aff'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            $("body").css("background-color", randomColor);
        }

        if(id === "illegible") {
            $("body").css({ "font-family": "Mess_Light"});
        }
    });

    // --- 2. GESTIONE CHIUSURA TAB ---
    $(document).on("click", ".tab-img", function() {
        const $img = $(this);
        const $parentOverlay = $img.closest(".category-overlay");
        
        $img.fadeOut(50, function() {
            $(this).remove();
            if ($parentOverlay.find(".tab-img").length === 0) {
                $parentOverlay.find(".gallery").hide();
            }
        });
    });

    // --- 3. EFFETTO STELLINE AL CLICK ---
    $(document).on("click", function(e) {
        // Appare solo se non clicchiamo su elementi interattivi o sul canvas attivo
        if (!$(e.target).closest('.category, button, img, canvas').length) {
            const star = $('<img src="SOURCES/img/star.PNG" class="star">');
            star.css({
                left: e.pageX - 15 + "px",
                top: e.pageY - 15 + "px"
            });
            $('body').append(star);
            setTimeout(() => star.remove(), 300);
        }
    });

    // --- 4. RESET ---
    $("#reset").on("click", function() {
        location.reload();
    });

        // --- VARIABILI PER IL DISEGNO ---
    let isDrawing = false;
    let drawingActive = false;
    let ctx;
    const canvasContainer = document.getElementById('canvas');
    let realCanvas;

    // Funzione per inizializzare il piano di disegno
    function setupDrawingCanvas() {
        realCanvas = document.createElement('canvas');
        // Impostiamo le dimensioni reali del canvas come quelle del div CSS (595x842)
        realCanvas.width = 595; 
        realCanvas.height = 842;
        realCanvas.style.position = "absolute";
        realCanvas.style.top = "0";
        realCanvas.style.left = "0";
        
        canvasContainer.appendChild(realCanvas);
        ctx = realCanvas.getContext('2d');

        // Stile del tratto (Matita nera)
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";

        // Eventi mouse sul canvas
        $(realCanvas).on('mousedown', startDrawing);
        $(realCanvas).on('mousemove', draw);
        $(realCanvas).on('mouseup mouseleave', stopDrawing);
    }

    function startDrawing(e) {
        if (!drawingActive) return;
        isDrawing = true;
        ctx.beginPath();
        const rect = realCanvas.getBoundingClientRect();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    }

    function draw(e) {
        if (!isDrawing || !drawingActive) return;
        const rect = realCanvas.getBoundingClientRect();
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
    }

    function stopDrawing() {
        isDrawing = false;
    }

    // Inizializza il canvas subito
    setupDrawingCanvas();




});








// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


// const MM_PER_PX = 25.4 / 96;
// const items = document.querySelectorAll('.draggable-asset');
// let selectedId = null;


// /* ---------- LAYOUT MODEL ---------- */
// const layout = {
//   a: {
//     x: 20,
//     y: 30,
//     width: 100,
//     height: 70,
//     rotation: -5,
//     z: 1
//   },
//   b: {
//     x: 60,
//     y: 90,
//     width: 110,
//     height: 80,
//     rotation: 4,
//     z: 2
//   }
// };


// /* ---------- Z-INDEX TRACKING ---------- */
// let topZ = Math.max(...Object.values(layout).map(d => d.z));


// /* ---------- RENDER ---------- */
// function render(el) {
//   const d = layout[el.dataset.id]; // dataset.id matches layout key

//   el.style.left = d.x + 'mm';
//   el.style.top = d.y + 'mm';
//   el.style.width = d.width + 'mm';
//   el.style.height = d.height + 'mm';

//   // rotation is visual only, position stays real
//   el.style.transform = `rotate(${d.rotation}deg)`;

//   // z-index controls which item is on top
//   el.style.zIndex = d.z;
// }

// items.forEach(render);


// /* ---------- SELECTION ---------- */

// items.forEach(el => {
//   el.addEventListener('click', e => {
//     e.stopPropagation(); // prevent deselect
//     select(el.dataset.id);
//   });
// });


// document.body.addEventListener('click', () => {
//   selectedId = null;
//   items.forEach(i => i.classList.remove('selected'));
// });


// function select(id) {
//   // If already selected, do nothing
//   if (selectedId === id) return;

//   selectedId = id;

//   // Bring the selected item to the top
//   layout[id].z = ++topZ;

//   // Update visual selection state
//   items.forEach(el => {
//     const isSelected = el.dataset.id === id;
//     el.classList.toggle('selected', isSelected);

//     // Re-render only the selected element
//     if (isSelected) render(el);
//   });
// }


// /* ---------- INTERACT (DRAG + RESIZE) ---------- */

// interact('.draggable-asset')
//   .draggable({
//     listeners: {
//       move(e) {
//         // Get the layout data for this element
//         const d = layout[e.target.dataset.id];

//         const angle = d.rotation * Math.PI / 180;
//         const cos = Math.cos(angle);
//         const sin = Math.sin(angle);

//         // Convert pixel movement to millimeters
//         const dx = e.dx * MM_PER_PX;
//         const dy = e.dy * MM_PER_PX;

//         // Apply movement corrected for rotation
//         d.x += dx * cos + dy * sin;
//         d.y += -dx * sin + dy * cos;

//         // Apply changes to the screen
//         render(e.target);
//       }
//     }
//   })

//   .resizable({
//     aspectRatio: true,
//     handles: "all",
//     edges: { right: true, bottom: true }, // resize from bottom-right only
//     listeners: {
//       move(e) {
//         const d = layout[e.target.dataset.id];

//         // Convert pixel resize to millimeters
//         d.width += e.deltaRect.width * MM_PER_PX;
//         d.height += e.deltaRect.height * MM_PER_PX;

//         render(e.target);
//       }
//     }
//   });


/* ---------- ROTATION (KEYBOARD) ---------- */
document.addEventListener('keydown', e => {
  if (!selectedId) return; // no selected item → nothing to rotate

  const d = layout[selectedId];

  if (e.key === 'ArrowLeft') d.rotation -= 1;
  if (e.key === 'ArrowRight') d.rotation += 1;

  // Update the selected element visually
  render(document.querySelector(`[data-id="${selectedId}"]`));
});


/* ---------- PRINT ---------- */

document.getElementById('print').onclick = () => {
  window.print();
};














