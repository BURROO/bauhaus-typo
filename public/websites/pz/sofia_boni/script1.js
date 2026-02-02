$(document).ready(function() {

    /* ---------- 1. CONFIGURAZIONE MODELLO E INTERACT ---------- */
    const MM_PER_PX = 25.4 / 96; // Conversione pixel -> millimetri
    let selectedId = null;
    let topZ = 1000;
    const layout = {}; // Database degli oggetti presenti sullo schermo

    /**
     * Registra l'elemento nel modello matematico e attiva l'interattività
     */
    function makeInteractive($el) {
        let id = $el.attr('data-id');
        if (!id) {
            id = 'item_' + Math.random().toString(36).substr(2, 9);
            $el.attr('data-id', id);
        }

        // Se l'elemento non è nel database layout, lo aggiungiamo
        if (!layout[id]) {
            const pos = $el.position();
            layout[id] = {
                x: pos.left * MM_PER_PX,
                y: pos.top * MM_PER_PX,
                width: ($el.width() || 150) * MM_PER_PX,
                height: ($el.height() || 150) * MM_PER_PX,
                rotation: (Math.random() * 10) - 5, // Rotazione punk iniziale
                z: ++topZ
            };
        }

        // Attiviamo le maniglie di ridimensionamento visive (jQuery UI)
        if (!$el.hasClass("ui-resizable")) {
            $el.resizable({
                aspectRatio: true,
                handles: "all",
                stop: function(event, ui) {
                    // Sincronizziamo il modello dopo il ridimensionamento manuale
                    layout[id].width = ui.size.width * MM_PER_PX;
                    layout[id].height = ui.size.height * MM_PER_PX;
                    render($el[0]);
                }
            });
        }

        render($el[0]);
    }

    /**
     * Applica le trasformazioni CSS basate sui millimetri e gradi
     */
    function render(el) {
        const id = el.getAttribute('data-id');
        const d = layout[id];
        if (!d) return;

        el.style.left = d.x + 'mm';
        el.style.top = d.y + 'mm';
        el.style.width = d.width + 'mm';
        el.style.height = d.height + 'mm';
        el.style.transform = `rotate(${d.rotation}deg)`;
        el.style.zIndex = d.z;
    }

    /* ---------- 2. GESTIONE DISEGNO (HAND DRAWINGS) ---------- */
    let isDrawing = false;
    let drawingActive = false;
    let ctx;
    const canvasContainer = document.getElementById('canvas');
    let realCanvas;

    function setupDrawingCanvas() {
        if (!canvasContainer) return;
        realCanvas = document.createElement('canvas');
        // Dimensioni fisse per un foglio A4 a 72dpi circa (595x842px)
        realCanvas.width = 595; 
        realCanvas.height = 842;
        realCanvas.style.position = "absolute";
        realCanvas.style.top = "0";
        realCanvas.style.left = "0";
        canvasContainer.appendChild(realCanvas);
        
        ctx = realCanvas.getContext('2d');
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";

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

    function stopDrawing() { isDrawing = false; }
    
    setupDrawingCanvas();

    /* ---------- 3. LOGICA INTERACT.JS (DRAG & SELEZIONE) ---------- */
    interact('.draggable-asset')
        .draggable({
            listeners: {
                move(e) {
                    const id = e.target.getAttribute('data-id');
                    const d = layout[id];
                    if (!d) return;

                    const angle = d.rotation * Math.PI / 180;
                    const dx = e.dx * MM_PER_PX;
                    const dy = e.dy * MM_PER_PX;

                    // Correzione del trascinamento in base alla rotazione dell'oggetto
                    d.x += dx * Math.cos(angle) + dy * Math.sin(angle);
                    d.y += -dx * Math.sin(angle) + dy * Math.cos(angle);

                    render(e.target);
                }
            }
        });

    // Selezione dell'elemento al click
    $(document).on('click', '.draggable-asset', function(e) {
        e.stopPropagation();
        selectedId = $(this).attr('data-id');
        $(".draggable-asset").removeClass('selected');
        $(this).addClass('selected');
        
        // Porta in primo piano
        layout[selectedId].z = ++topZ;
        render(this);
    });

    // Deseleziona cliccando sullo sfondo
    $(document).on('click', function() {
        selectedId = null;
        $(".draggable-asset").removeClass('selected');
    });

    /* ---------- 4. ROTAZIONE DA TASTIERA ---------- */
    document.addEventListener('keydown', e => {
        if (!selectedId) return;
        const d = layout[selectedId];
        const el = document.querySelector(`[data-id="${selectedId}"]`);

        if (e.key === 'ArrowLeft') d.rotation -= 2;
        if (e.key === 'ArrowRight') d.rotation += 2;
        
        render(el);
    });

    /* ---------- 5. GESTIONE CLICK CATEGORIE ---------- */
    $(".category").on("click", function() {
        const id = $(this).attr("id");
        const $overlay = $("#overlay_" + id);
        
        $overlay.show();

        // Sparpaglia le immagini
        const $assets = $overlay.find(".draggable-asset");
        $assets.each(function() {
            const $img = $(this);
            const randomX = Math.random() * (window.innerWidth - 300);
            const randomY = Math.random() * (window.innerHeight - 300);
            
            $img.css({
                left: randomX + "px",
                top: randomY + "px",
                display: "block",
                position: "absolute"
            });

            makeInteractive($img);
        });

        // Logiche specifiche per categoria
        if (id === "drawings") {
            drawingActive = true;
            $("body").addClass("drawing-mode");
            $("#canvas").addClass("active");
        }

        if(id === "papers") {
            const colors = ['yellow', 'red', 'blue', '#88ff00', '#c03aff'];
            $("body").css("background-color", colors[Math.floor(Math.random() * colors.length)]);
        }

        if(id === "illegible") {
            $("body").css({ "font-family": "Mess_Light" });
        }
    });

    // Chiusura tab
    $(document).on("click", ".tab-img", function() {
        const $img = $(this);
        const $parentOverlay = $img.closest(".category-overlay");
        $img.fadeOut(100, function() {
            $(this).remove();
            if ($parentOverlay.find(".tab-img").length === 0) {
                $parentOverlay.find(".gallery").hide();
            }
        });
    });

    /* ---------- 6. STELLINE E PULSANTI EXTRA ---------- */
    $(document).on("click", function(e) {
        if (!$(e.target).closest('.category, button, img, canvas').length) {
            const star = $('<img src="SOURCES/img/star.PNG" class="star">');
            star.css({ left: e.pageX - 15 + "px", top: e.pageY - 15 + "px" });
            $('body').append(star);
            setTimeout(() => star.remove(), 300);
        }
    });

    $("#reset").on("click", function() {
        location.reload();
    });

    /* ---------- 7. EXPORT PDF (HTML2CANVAS) ---------- */
    $("#print").on("click", function() {
        // Rimuoviamo il bordo di selezione prima dello scatto
        $(".selected").removeClass("selected");

        // Usiamo html2canvas per fotografare l'intera pagina
        html2canvas(document.body, {
            useCORS: true,
            allowTaint: true,
            backgroundColor: $("body").css("background-color"),
            scale: 2 // Alta qualità
        }).then(canvas => {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            const imgData = canvas.toDataURL('image/png');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save("my_punk_zine.pdf");
        });
    });
});