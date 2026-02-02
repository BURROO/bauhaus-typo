

//POINTER A STELLINA//
document.addEventListener("click", function(e) {
    const star = document.createElement("img");
    star.src ="SOURCES/img/star.PNG";
    star.className = "star";

    // Posizione della stellina
    star.style.left = e.pageX + "px";
    star.style.top = e.pageY + "px";

    // Aggiungi al body
    document.body.appendChild(star);

    // Rimuovi dopo l'animazione
    setTimeout(() => star.remove(), 300);
});

const listItems = document.querySelectorAll("#categoryList li");
//RESET della pagina//

document.getElementById("reset").addEventListener("click", function () {
    location.reload();
  });






  $(document).ready(function() {
    $('#gagarin').draggable();
    $("#gagarin1").draggable().resizable();
    $("#gagarin2").draggable().resizable();
    $("#madonna").draggable().resizable();
    });




    

 /*$(document).ready(function() {
    $('#maximalist').draggable();
    $('#papers').draggable();
    $('#icons').draggable();
    $('#drawings').draggable();
    $('#ornaments').draggable();
    $('#browsing').draggable();
    $('#collages').draggable();
    $('#windowsContainer').draggable();
    $("#illegible").draggable().resizable();
    });*/



    

/*-----------MAXIMALIST-------------*/

const openGallery_maximalist = document.getElementById("maximalist");
const overlay_maximalist = document.getElementById("overlay_maximalist");
const images_maximalist = document.querySelectorAll(".gallery img");

/* Apri galleria */
openGallery_maximalist.addEventListener("click", () => {
    overlay_maximalist.style.display = "block";
});

/* Chiudi cliccando su una immagine */
images_maximalist.forEach(img => {
    img.addEventListener("click", (e) => {
        e.target.remove(); // rimuove SOLO l'immagine cliccata

        // se non ci sono più immagini, chiude l'overlay
        if (document.querySelectorAll(".gallery img").length === 0) {
            overlay_maximalist.style.display = "none";
        }
    });
});


/*-----------PAPERS-------------*/

const openGallery_papers = document.getElementById("papers");
const overlay_papers = document.getElementById("overlay_papers");
const images_papers = document.querySelectorAll(".gallery img");

// Apri galleria //
openGallery_papers.addEventListener("click", () => {
    overlay_papers.style.display = "block";
});

// Chiudi cliccando su una immagine 
images_papers.forEach(img => {
    img.addEventListener("click", (e) => {
        e.target.remove(); // rimuove SOLO l'immagine cliccata

        // se non ci sono più immagini, chiude l'overlay//
        if (document.querySelectorAll(".gallery img").length === 0) {
            overlay_papers.style.display = "none";
        }
    });
});


function changeBg() {
      const colors = ['yellow', 'red', 'blue', ' rgb(136, 255, 0)', ' rgb(192, 58, 255)'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      document.body.style.backgroundColor = randomColor;
    }




/*-----------ICONS-------------*/

const openGallery_icons = document.getElementById("icons");
const overlay_icons = document.getElementById("overlay_icons");
const images_icons = document.querySelectorAll(".gallery img");

/* Apri galleria */
openGallery_icons.addEventListener("click", () => {
    overlay_icons.style.display = "block";
});

/* Chiudi cliccando su una immagine */
images_icons.forEach(img => {
    img.addEventListener("click", (e) => {
        e.target.remove(); // rimuove SOLO l'immagine cliccata

        // se non ci sono più immagini, chiude l'overlay
        if (document.querySelectorAll(".gallery img").length === 0) {
            overlay_icons.style.display = "none";
        }
    });
});



/*------------------------------FACCE DELLE ICONE------------------------ */



const openGallery_icons_faces = document.getElementById("icons");
const overlay_icons_faces = document.getElementById("faces");
const images_icons_faces = document.querySelectorAll(".cutouts img");

/* Apri galleria */
openGallery_icons_faces.addEventListener("click", () => {
    overlay_icons_faces.style.display = "block";
});

/* Chiudi cliccando su una immagine
images_icons_faces.forEach(img => {
    img.addEventListener("click", (e) => {
        e.target.remove(); // rimuove SOLO l'immagine cliccata

        // se non ci sono più immagini, chiude l'overlay
        if (document.querySelectorAll(".gallery img").length === 0) {
            overlay_icons_faces.style.display = "none";
        }
    });
}); */



/*-----------DRAWINGS-------------*/

const openGallery_drawings = document.getElementById("drawings");
const overlay_drawings = document.getElementById("overlay_drawings");
const images_drawings = document.querySelectorAll(".gallery img");

/* Apri galleria */
openGallery_drawings.addEventListener("click", () => {
    overlay_drawings.style.display = "block";
});

/* Chiudi cliccando su una immagine */
images_drawings.forEach(img => {
    img.addEventListener("click", (e) => {
        e.target.remove(); // rimuove SOLO l'immagine cliccata

        // se non ci sono più immagini, chiude l'overlay
        if (document.querySelectorAll(".gallery img").length === 0) {
            overlay_drawings.style.display = "none";
        }
    });
});


/*-----------ORNAMENTS-------------*/

const openGallery_ornaments = document.getElementById("ornaments");
const overlay_ornaments = document.getElementById("overlay_ornaments");
const images_ornaments = document.querySelectorAll(".gallery img");

/* Apri galleria */
openGallery_ornaments.addEventListener("click", () => {
    overlay_ornaments.style.display = "block";
});

/* Chiudi cliccando su una immagine */
images_ornaments.forEach(img => {
    img.addEventListener("click", (e) => {
        e.target.remove(); // rimuove SOLO l'immagine cliccata

        // se non ci sono più immagini, chiude l'overlay
        if (document.querySelectorAll(".gallery img").length === 0) {
            overlay_ornaments.style.display = "none";
        }
    });
});


/*-----------COLLAGES-------------*/

const openGallery_collages = document.getElementById("collages");
const overlay_collages = document.getElementById("overlay_collages");
const images_collages = document.querySelectorAll(".gallery img");

/* Apri galleria */
openGallery_collages.addEventListener("click", () => {
    overlay_collages.style.display = "block";
});

/* Chiudi cliccando su una immagine */
images_collages.forEach(img => {
    img.addEventListener("click", (e) => {
        e.target.remove(); // rimuove SOLO l'immagine cliccata

        // se non ci sono più immagini, chiude l'overlay
        if (document.querySelectorAll(".gallery img").length === 0) {
            overlay_collages.style.display = "none";
        }
    });
});


/*-----------ILLEGIBLE-------------*/

const openGallery_illegible = document.getElementById("illegible");
const overlay_illegible = document.getElementById("overlay_illegible");
const images_illegible = document.querySelectorAll(".gallery img");

/* Apri galleria */
openGallery_illegible.addEventListener("click", () => {
    overlay_illegible.style.display = "block";
});

/* Chiudi cliccando su una immagine */
images_illegible.forEach(img => {
    img.addEventListener("click", (e) => {
        e.target.remove(); // rimuove SOLO l'immagine cliccata

        // se non ci sono più immagini, chiude l'overlay
        if (document.querySelectorAll(".gallery img").length === 0) {
            overlay_illegible.style.display = "none";
        }
    });
});


        /*---------------------------ILLEGIBLE ACTION------------------------------------*/

//         const illegibleBtn = document.getElementById("illegible");
//         const body = document.body;

//         illegibleBtn.addEventListener("click", () => {
//         body.classList.toggle("Mess-Light_woff");
//         });


//         illegibleBtn.addEventListener("click", () => {
//     console.log("CLICK FUNZIONA");
//     body.classList.toggle("Mess-Light_woff");
// });

    function messBlack() {
    //   const colors = ['yellow', 'red', 'blue', 'green', 'purple'];
    //   const randomColor = colors[Math.floor(Math.random() * colors.length)];

      document.body.style.backgroundColor = 'rgb(17, 17, 17)';
      document.body.style.fontFamily = "Mess_Light";
    //   document.getElementsByClassName
    }




/*-----------BROWSING EXPERIENCE-------------*/

const openGallery_browsing = document.getElementById("browsing");
const overlay_browsing = document.getElementById("overlay_browsing");
const images_browsing = document.querySelectorAll(".gallery img");

/* Apri galleria */
openGallery_browsing.addEventListener("click", () => {
    overlay_browsing.style.display = "block";
});

/* Chiudi cliccando su una immagine */
images_browsing.forEach(img => {
    img.addEventListener("click", (e) => {
        e.target.remove(); // rimuove SOLO l'immagine cliccata

        // se non ci sono più immagini, chiude l'overlay
        if (document.querySelectorAll(".gallery img").length === 0) {
            overlay_browsing.style.display = "none";
        }
    });
});




