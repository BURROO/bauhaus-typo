$(document).ready(function() {

    const MM_PER_PX = 25.4 / 96;
    let topZ = 1000;
    const layout = {};

    // 1. FUNZIONE RENDER (Aggiorna lo stile visivo)
    function render(el) {
        const id = el.getAttribute('data-id');
        const d = layout[id];
        if (!d) return;

        $(el).css({
            'left': d.x + 'mm',
            'top': d.y + 'mm',
            'width': d.width + 'mm',
            'height': d.height + 'mm',
            'z-index': d.z,
            'transform': 'rotate(' + d.rotation + 'deg)',
            'position': 'absolute'
        });
    }

    // 2. RENDERE INTERATTIVI GLI ASSET
    function makeInteractive($el) {
        let id = $el.attr('data-id');
        if (!id) {
            id = 'item_' + Math.random().toString(36).substr(2, 9);
            $el.attr('data-id', id);
        }

        // Se non esiste nel database, calcola posizione iniziale
        if (!layout[id]) {
            const pos = $el.position();
            layout[id] = {
                x: pos.left * MM_PER_PX,
                y: pos.top * MM_PER_PX,
                width: 40, // Larghezza standard in mm
                height: 40, // Altezza standard in mm
                rotation: (Math.random() * 10) - 5,
                z: ++topZ
            };
        }

        // Applichiamo jQuery UI Resizable per lo STRETCH
        if (!$el.hasClass("ui-resizable")) {
            $el.resizable({
                aspectRatio: false, // Permette ridimensionamento libero
                handles: "all",
                stop: function(event, ui) {
                    layout[id].width = ui.size.width * MM_PER_PX;
                    layout[id].height = ui.size.height * MM_PER_PX;
                    layout[id].x = ui.position.left * MM_PER_PX;
                    layout[id].y = ui.position.top * MM_PER_PX;
                    render($el[0]);
                }
            });
        }

        render($el[0]);
    }

    // 3. LOGICA DI TRASCINAMENTO (INTERACT.JS)
    interact('.draggable-asset').draggable({
        inertia: true,
        modifiers: [
            interact.modifiers.restrictRect({
                restriction: 'parent', // Non far uscire l'immagine dall'area
                endOnly: true
            })
        ],
        listeners: {
            move(event) {
                const target = event.target;
                const id = target.getAttribute('data-id');
                if (!layout[id]) return;

                // Aggiorna le coordinate nel modello (convertendo il delta pixel in mm)
                layout[id].x += event.dx * MM_PER_PX;
                layout[id].y += event.dy * MM_PER_PX;

                render(target);
            }
        }
    });

    // 4. CLICK SULLE CATEGORIE
    $(".category").on("click", function() {
        const catId = $(this).attr("id");
        const $overlay = $("#overlay_" + catId);
        
        $overlay.fadeIn().css("display", "block");

        $overlay.find(".draggable-asset").each(function() {
            const $img = $(this);
            
            // Posizionamento casuale iniziale se non sono già stati toccati
            if (!$img.attr('data-id')) {
                const rx = Math.random() * (window.innerWidth - 200);
                const ry = Math.random() * (window.innerHeight - 200);
                $img.css({ left: rx + "px", top: ry + "px" });
            }

            $img.css("pointer-events", "auto"); // Cruciale: riabilita i click
            makeInteractive($img);
        });

        // Logiche speciali
        if (catId === "drawings") {
            drawingActive = true;
            $("#canvas").addClass("active").css("pointer-events", "auto");
            $("body").addClass("drawing-mode");
        }
    });

    // 5. SELEZIONE E ROTAZIONE DA TASTIERA
    $(document).on('mousedown', '.draggable-asset', function() {
        $(".draggable-asset").removeClass('selected');
        $(this).addClass('selected');
        const id = $(this).attr('data-id');
        layout[id].z = ++topZ;
        render(this);
    });

    document.addEventListener('keydown', function(e) {
        const $selected = $(".draggable-asset.selected");
        if ($selected.length === 0) return;
        
        const id = $selected.attr('data-id');
        if (e.key === 'ArrowLeft') layout[id].rotation -= 5;
        if (e.key === 'ArrowRight') layout[id].rotation += 5;
        
        render($selected[0]);
    });

    // --- MANTIENI IL RESTO DEL TUO CODICE (Export PDF, Stelline, etc.) ---
    // (Incolla qui sotto la tua logica di disegno su canvas e l'export PDF)
    
    // Esempio rapido Reset
    $("#reset").on("click", function() { location.reload(); });
});

    /* ---------- 3. GESTIONE DISEGNO (HAND DRAWINGS) ---------- */
    let isDrawing = false;
    let drawingActive = false;
    let ctx;
    const canvasContainer = document.getElementById('canvas');
    let realCanvas;

    function setupDrawingCanvas() {
        if (!canvasContainer) return;
        realCanvas = document.createElement('canvas');
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

    /* ---------- 4. SELEZIONE E ROTAZIONE ---------- */
    $(document).on('click', '.draggable-asset', function(e) {
        e.stopPropagation();
        selectedId = $(this).attr('data-id');
        $(".draggable-asset").removeClass('selected');
        $(this).addClass('selected');
        
        layout[selectedId].z = ++topZ;
        render(this);
    });

    $(document).on('click', function() {
        selectedId = null;
        $(".draggable-asset").removeClass('selected');
    });

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

    /* ---------- 6. STELLINE E RESET ---------- */
    $(document).on("click", function(e) {
        if (!$(e.target).closest('.category, button, img, canvas, .ui-resizable-handle').length) {
            const star = $('<img src="SOURCES/img/star.PNG" class="star">');
            star.css({ left: e.pageX - 15 + "px", top: e.pageY - 15 + "px" });
            $('body').append(star);
            setTimeout(() => star.remove(), 300);
        }
    });

    $("#reset").on("click", function() {
        location.reload();
    });

    /* ---------- 7. EXPORT PDF ---------- */
    $("#print").on("click", function() {
        $(".selected").removeClass("selected");

        html2canvas(document.body, {
            useCORS: true,
            allowTaint: true,
            backgroundColor: $("body").css("background-color"),
            scale: 2 
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