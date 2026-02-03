
$(document).ready(function() {

let selectedElement = null; // Memorizza l'ultimo elemento cliccato

function makeInteractive(selector) {
    interact(selector)
        .draggable({
            inertia: true,
            modifiers: [
                interact.modifiers.restrictRect({
                    restriction: '#canvas',
                    endOnly: true
                })
            ],
            listeners: {
                move: dragMoveListener,
                // Quando l'utente inizia a trascinare, lo selezioniamo
                start(event) {
                    selectElement(event.target);
                }
            }
        })
        .resizable({
            edges: { left: true, right: true, bottom: true, top: true },
            listeners: {
                move(event) {
                    let { x, y } = event.target.dataset;
                    x = (parseFloat(x) || 0) + event.deltaRect.left;
                    y = (parseFloat(y) || 0) + event.deltaRect.top;

                    // Recuperiamo la rotazione attuale o impostiamo 0
                    let angle = parseFloat(event.target.getAttribute('data-angle')) || 0;

                    Object.assign(event.target.style, {
                        width: `${event.rect.width}px`,
                        height: `${event.rect.height}px`,
                        // Applichiamo sia translate che rotate
                        transform: `translate(${x}px, ${y}px) rotate(${angle}deg)`
                    });

                    Object.assign(event.target.dataset, { x, y });
                }
            },
            modifiers: [
                interact.modifiers.restrictSize({ min: { width: 20, height: 20 } })
                // rimosso aspectRatio per permettere scaling libero sulla X
            ]
        })
        .on('tap', function (event) {
            selectElement(event.currentTarget);
        });
}

// Funzione per "selezionare" l'immagine e portarla in primo piano
function selectElement(el) {
    if (selectedElement) {
        selectedElement.style.outline = "none"; // Rimuove bordo dal precedente
    }
    selectedElement = el;
    selectedElement.style.outline = "2px solid #88ff00"; // Feedback visivo
    
    // Porta l'elemento in cima agli altri (z-index)
    const allAssets = document.querySelectorAll('.draggable-asset');
    let maxZ = 0;
    allAssets.forEach(asset => {
        const z = parseInt(window.getComputedStyle(asset).zIndex) || 0;
        if (z > maxZ) maxZ = z;
    });
    selectedElement.style.zIndex = maxZ + 1;
}

// ASCOLTATORE TASTIERA
document.addEventListener('keydown', function(event) {
    if (!selectedElement) return;

    // Recuperiamo i dati attuali
    let angle = parseFloat(selectedElement.getAttribute('data-angle')) || 0;
    let x = parseFloat(selectedElement.getAttribute('data-x')) || 0;
    let y = parseFloat(selectedElement.getAttribute('data-y')) || 0;

    const rotationSpeed = 5; // Gradi di rotazione per ogni pressione

    if (event.key === "ArrowLeft") {
        angle -= rotationSpeed;
    } else if (event.key === "ArrowRight") {
        angle += rotationSpeed;
    } else {
        return; // Esci se non sono le frecce
    }

    // Applichiamo la rotazione mantenendo il translate
    selectedElement.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`;
    selectedElement.setAttribute('data-angle', angle);
    
    // Impedisce lo scrolling della pagina con le frecce
    event.preventDefault();
});

function dragMoveListener(event) {
    var target = event.target;
    var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}

$(document).on("mousedown", ".draggable-asset", function() {
    const $el = $(this);
    const canvas = document.getElementById('canvas');

    // Se l'immagine non è ancora dentro il canvas, la spostiamo lì
    if (!$el.parent().is("#canvas")) {
        const rect = this.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();

        // Calcoliamo la posizione relativa al foglio bianco
        const relativeX = rect.left - canvasRect.left;
        const relativeY = rect.top - canvasRect.top;

        // La spostiamo nel DOM dentro il canvas
        $el.appendTo("#canvas");

        // Resettiamo la posizione per farla apparire esattamente dove l'utente l'ha cliccata
        this.style.left = "0px";
        this.style.top = "0px";
        this.setAttribute('data-x', relativeX);
        this.setAttribute('data-y', relativeY);
        this.style.transform = `translate(${relativeX}px, ${relativeY}px)`;
        
        // Applichiamo l'interattività ora che è nel foglio
        if (!$el.hasClass("interact-enabled")) {
            $el.addClass("interact-enabled");
            makeInteractive(this);
        }
    }
});

     // --- MODIFICA SCATTER ASSETS ---
    function scatterAssets($container) {
        const assets = $container.find(".draggable-asset");
        assets.each(function() {
            const el = this; // Elemento DOM nativo per interact.js
            const $el = $(this);
            
            // Posizionamento casuale iniziale
            const randomX = Math.random() * (window.innerWidth - 200);
            const randomY = Math.random() * (window.innerHeight - 200);
            
            $el.css({
                left: "0px",
                top: "0px",
                display: "block",
                position: "absolute",
                transform: `translate(${randomX}px, ${randomY}px)`
            });

            // Inizializziamo i dati di posizione per interact.js
            el.setAttribute('data-x', randomX);
            el.setAttribute('data-y', randomY);

            // Applichiamo l'interattività se non già presente
            if (!$el.hasClass("interact-enabled")) {
                $el.addClass("interact-enabled");
                makeInteractive(el);
            }
        });
    }

    // Il resto del tuo codice per i click sulle categorie rimane uguale...
    $(".category").on("click", function() {
        const id = $(this).attr("id");
        const $overlay = $("#overlay_" + id);
        $overlay.show();
        scatterAssets($overlay);
        
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














