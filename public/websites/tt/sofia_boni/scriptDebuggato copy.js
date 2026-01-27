
 // Seleziona il video tramite il suo ID
  const video = document.getElementById('introvideo');

  // Imposta un timer di 5000 millisecondi (5 secondi)
  setTimeout(() => {
    // Rende il video trasparente
    video.style.opacity = '0';
    
    // Rimuove completamente il video dal layout dopo la transizione
    setTimeout(() => {
      video.style.display = 'none';
    }, 1000); // Aspetta 1 secondo (il tempo della transizione CSS)
    
  }, 5000); 




/* =====================================================
   CONFIGURAZIONE E VARIABILI GLOBALI
   ===================================================== */
const buttons = document.querySelectorAll('.btn');
const panel = document.getElementById('side-panel');
const canvasO = document.getElementById("canvasO");
const canvasF = document.getElementById("canvasF");
const canvasI = document.getElementById("canvas");

// Immagini Originals (abbreviate per leggibilità, mantieni le tue)
const archiveImages = [
            "arch_CZ_praha_packaging_1.webp",
            "arch_DE_dresden_sign_1.webp",
            "arch_DE_leipzig_sign_2.webp",
            "arch_DE_leipzig_tag_1.webp",
            "arch_DE_weimar_inscription_1.webp", 
            "arch_ES_barcellona_sign_1.webp",
            "arch_ES_barcellona_sign_2.webp",
            "arch_ES_barcellona_sign_3.webp",
            "arch_ES_sevilla_packaging_1.webp", 
            "arch_ES_sevilla_sign_1.webp",
            "arch_ES_sevilla_sign_2.webp",
            "arch_ES_sevilla_sign_3.webp",
            "arch_ES_sevilla_sign_4.webp",
            "arch_ES_sevilla_sign_5.webp",
            "arch_FR_belfort_packaging_1.webp",
            "arch_FR_belfort_sign_1.webp",
            "arch_ITA_assisi_sign_1.webp",
            "arch_ITA_brescia_sign_1.webp",
            "arch_ITA_cesena_book_1.webp",
            "arch_ITA_cesena_packaging_1.webp",
            "arch_ITA_cesena_sign_1.webp",
            "arch_ITA_genova_sign_1.webp",
            "arch_ITA_genova_sign_2.webp",
            "arch_ITA_loano_sign_1.webp",
            "arch_ITA_milano_sign_1.webp",
            "arch_ITA_milano_tag_2.webp",
            "arch_ITA_sansepolcro_packaging_1.webp",
            "arch_ITA_sansepolcro_sign_1.webp",
            "arch_ITA_sansepolcro_sign_2.webp",
            "arch_ITA_sansepolcro_sign_3.webp",
            "arch_ITA_urbino_book_1.webp",
            "arch_ITA_urbino_inscription_1.webp",
            "arch_ITA_urbino_inscription_2.webp",
            "arch_JP_tokyo_poster_1.webp",
            "arch_NL_amsterdam_poster_1.webp",
            "arch_NL_amsterdm_poster_2.webp",
            "arch_NL_amsterdm_sign_1.webp",
            "arch_NL_amsterdm_tag_1.webp",
            "arch_ROM_bucarest_sign_1.webp"
 ];


const lettersImages = [ 
     "A_1.webp",
    "A_2.webp",
    "A_3.webp",
    "A_4.webp",
    "A_5.webp",
    "A_6.webp",
    "A_7.webp",
    "A_8.webp",
    "A_9.webp",
    "A_10.webp",
    "A_11.webp",
    "A_12.webp",
    "A_13.webp",
    "A_14.webp",
    "A_15.webp",
    "A_16.webp",
    "A_17.webp",
    "A_18.webp",
    "A_19.webp",
    "A_20.webp",
    "B_1.webp",
    "B_2.webp",
    "B_3.webp",
    "B_4.webp",
    "B_5.webp",
    "B_6.webp",
    "B_7.webp",
    "B_8.webp",
    "C_1.webp",
    "C_2.webp",
    "C_3.webp",
    "C_4.webp",
    "C_5.webp",
    "C_6.webp",
    "C_7.webp",
    "C_8.webp",
    "C_9.webp",
    "C_10.webp",
    "C_11.webp",
    "C_12.webp",
    "C_13.webp",
    "D_1.webp",
    "D_2.webp",
    "D_3.webp",
    "D_4.webp",
    "D_5.webp",
    "E_1.webp",
    "E_2.webp",
    "E_3.webp",
    "E_4.webp",
    "E_5.webp",
    "E_6.webp",
    "E_7.webp",
    "E_8.webp",
    "E_11.webp",
    "E_12.webp",
    "E_13.webp",
    "E_14.webp",
    "E_15.webp",
    "E_16.webp",
    "E_17.webp",
    "E_18.webp",
    "E_19.webp",
    "F_1.webp",
    "F_2.webp",
    "F_3.webp",
    "F_4.webp",
    "F_5.webp",
    "F_6.webp",
    "F_7.webp",
    "G_1.webp",
    "G_2.webp",
    "G_3.webp",
    "G_4.webp",
    "G_5.webp",
    "G_6.webp",
    "G_7.webp",
    "G_8.webp",
    "G_9.webp",
    "G_10.webp",
    "H_1.webp",
    "H_2.webp",
    "H_3.webp",
    "H_4.webp",
    "H_5.webp",
    "H_6.webp",
    "H_7.webp",
    "H_8.webp",
    "H_9.webp",
    "H_10.webp",
    "I_1.webp",
    "I_2.webp",
    "I_3.webp",
    "I_4.webp",
    "I_5.webp",
    "I_6.webp",
    "I_7.webp",
    "I_8.webp",
    "I_9.webp",
    "I_10.webp",
    "I_11.webp",
    "I_12.webp",
    "I_13.webp",
    "I_14.webp",
    "I_15.webp",
    "J_1.webp",
    "J_2.webp",
    "J_3.webp",
    "J_3.webp",
    "J_4.webp",
    "J_5.webp",
    "J_6.webp",
    "J_7.webp",
    "K_1.webp",
    "K_2.webp",
    "K_3.webp",
    "K_4.webp",
    "K_5.webp",
    "K_6.webp",
    "L_1.webp",
    "L_2.webp",
    "L_3.webp",
    "L_4.webp",
    "L_5.webp",
    "L_6.webp",
    "L_7.webp",
    "L_8.webp",
    "L_9.webp",
    "L_10.webp",
    "L_11.webp",
    "L_12.webp",
    "L_13.webp",
    "M_1.webp",
    "M_2.webp",
    "M_3.webp",
    "M_4.webp",
    "M_5.webp",
    "M_6.webp",
    "M_7.webp",
    "M_8.webp",
    "N_1.webp",
    "N_2.webp",
    "N_3.webp",
    "N_4.webp",
    "N_5.webp",
    "N_6.webp",
    "N_7.webp",
    "N_8.webp",
    "N_9.webp",
    "N_10.webp",
    "N_11.webp",
    "N_12.webp",
    "O_1.webp",
    "O_2.webp",
    "O_3.webp",
    "O_4.webp",
    "O_5.webp",
    "O_6.webp",
    "O_7.webp",
    "O_8.webp",
    "O_9.webp",
    "O_10.webp",
    "O_11.webp",
    "O_12.webp",
    "O_13.webp",
    "O_14.webp",
    "O_15.webp",
    "P_1.webp",
    "P_2.webp",
    "P_3.webp",
    "P_4.webp",
    "P_5.webp",
    "P_6.webp",
    "P_7.webp",
    "P_8.webp",
    "P_9.webp",
    "P_10.webp",
    "P_11.webp",
    "Q_1.webp",
    "Q_2.webp",
    "Q_3.webp",
    "Q_4.webp",
    "Q_5.webp",
    "Q_6.webp",
    "Q_7.webp",
    "R_1.webp",
    "R_2.webp",
    "R_3.webp",
    "R_4.webp",
    "R_5.webp",
    "R_6.webp",
    "R_9.webp",
    "R_10.webp",
    "R_11.webp",
    "R_12.webp",
    "R_13.webp",
    "R_14.webp",
    "R_15.webp",
    "R_16.webp",
    "R_17.webp",
    "R_18.webp",
    "S_1.webp",
    "S_2.webp",
    "S_3.webp",
    "S_4.webp",
    "S_5.webp",
    "S_6.webp",
    "S_7.webp",
    "S_8.webp",
    "S_9.webp",
    "S_10.webp",
    "S_11.webp",
    "S_12.webp",
    "S_13.webp",
    "S_14.webp",
    "S_15.webp",
    "S_16.webp",
    "T_1.webp",
    "T_2.webp",
    "T_3.webp",
    "T_4.webp",
    "T_5.webp",
    "T_6.webp",
    "T_7.webp",
    "T_8.webp",
    "T_9.webp",
    "T_10.webp",
    "T_11.webp",
    "U_1.webp",
    "U_2.webp",
    "U_3.webp",
    "U_4.webp",
    "U_5.webp",
    "U_6.webp",
    "U_7.webp",
    "U_8.webp",
    "V_1.webp",
    "V_2.webp",
    "V_3.webp",
    "V_4.webp",
    "V_5.webp",
    "V_6.webp",
    "V_7.webp",
    "W_1.webp",
    "W_2.webp",
    "W_3.webp",
    "W_4.webp",
    "X_1.webp",
    "X_2.webp",
    "X_3.webp",
    "Y_1.webp",
    "Y_2.webp",
    "Y_3.webp",
    "Y_4.webp",
    "Y_5.webp",
    "Y_6.webp",
    "Z_1.webp",
    "Z_2.webp",
    "Z_3.webp",
    "Z_4.webp",
    "Z_5.webp"
 ];


/* =====================================================
   FUNZIONE DI PULIZIA (EVITA SOVRAPPOSIZIONI)
   ===================================================== */
function closeEverything() {
    // Chiude il pannello laterale
    panel.classList.remove('open');
    
    // Nasconde tutti i gruppi di contenuto nel pannello
    const groups = document.querySelectorAll("#panel-content > div");
    groups.forEach(group => group.style.display = "none");

      // Nasconde e svuota i Canvas esterni
    if(canvasO) {
        canvasO.style.display = "none";
        canvasO.innerHTML = "";
    }
    if(canvasF) {
        canvasF.style.display = "none";
        canvasF.innerHTML = "";
      }    

    // // Nascondi i canvas delle gallerie
    // [canvasO, canvasF, canvasIs].forEach(c => {
    //     if(c) {
    //         c.style.display = "none";
    //         // Non svuotare l'innerHTML qui se vuoi che il filtro sia veloce, 
    //         // ma se vuoi "pulizia totale" lascialo pure.
    //     }
    // });

    // PULIZIA INTERACT: Svuota il wrapper delle immagini di testo
    const textWrapper = document.getElementById('textWrapper');
    if (textWrapper) {
        textWrapper.innerHTML = ""; 
    }
    
    // Nascondi anche il video se fosse ancora visibile
    const video = document.getElementById('introvideo');
    if(video) video.style.display = "none";
}



    // }
    // if(canvasI){
    //     canvasI.style.display = "none";
    //     canvasI.innerHTML = "";
    // }


/* =====================================================
   GESTORE UNICO CLICK PULSANTI
   ===================================================== */
buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        const panelId = btn.dataset.panel; // Beginning, Originals, Fonts, Interact

        // 1. Pulisci tutto prima di iniziare
        closeEverything();

        // 2. Mostra il contenuto specifico nel pannello laterale
        const visibleGroup = document.getElementById(panelId);
        if (visibleGroup) {
            visibleGroup.style.display = "block";
            panel.classList.add('open');
        }

        // 3. Logica Extra per Canvas specifici
        if (panelId === "Originals") {
            openGallery(); 
        } else if (panelId === "Fonts") {
            openGalleryF();
        }
    });
});





/* =====================================================
   GALLERIA ORIGINALS
   ===================================================== */
function openGallery() {
    // 1. Pulizia e reset scroll
    canvasO.innerHTML = ""; 
    canvasO.scrollTop = 0; 
    canvasO.style.display = "block";

    // 2. Creazione contenitore griglia
    const galleryO = document.createElement("div");
    galleryO.className = "galleryO";

    // 3. Inserimento immagini
    archiveImages.forEach(name => {
        const imgO = document.createElement("img");
        imgO.src = `sources/archive/${name}`;
        imgO.alt = name;
        imgO.loading = "lazy"; // Ottimizza il caricamento
        
        imgO.addEventListener("click", () => openModalO(imgO.src));
        galleryO.appendChild(imgO);
    });

    canvasO.appendChild(galleryO);
}

/* =====================================================
   GALLERIA FONTS (Uguale alla precedente)
   ===================================================== */
function openGalleryF() {
    // 1. Pulizia e reset scroll
    canvasF.innerHTML = ""; 
    canvasF.scrollTop = 0;
    canvasF.style.display = "block";

    const galleryF = document.createElement("div");
    galleryF.className = "galleryF";

    // Usiamo la tua lista lettersImages
    lettersImages.forEach(name => {
        const imgF = document.createElement("img");
        imgF.src = `sources/letters/${name}`;
        imgF.alt = name;
        imgF.loading = "lazy";

        imgF.addEventListener("click", () => openModalF(imgF.src));
        galleryF.appendChild(imgF);
    });

    canvasF.appendChild(galleryF);

}




/* Apertura Modale Originals */
function openModalO(src) {
    const modalO = document.getElementById("image-modalO");
    const modalImgO = document.getElementById("modal-imgO");
    modalImgO.src = src;
    modalO.classList.remove("hidden");
    document.body.style.overflow = "hidden"; // Blocca lo scroll della pagina
}

/* Apertura Modale Fonts */
function openModalF(src) {
    const modalF = document.getElementById("image-modalF");
    const modalImgF = document.getElementById("modal-imgF");
    modalImgF.src = src;
    modalF.classList.remove("hidden");
    document.body.style.overflow = "hidden";
}


// Gestione chiusura Originals
const modalO = document.getElementById("image-modalO");
modalO.addEventListener("click", (e) => {
    // Chiude se clicchi sullo sfondo (id del div) o sulla X (id dello span)
    if (e.target.id === "image-modalO" || e.target.id === "close-modalO") {
        modalO.classList.add("hidden");
        document.body.style.overflow = "auto"; // Ripristina lo scroll
    }
});

// Gestione chiusura Fonts
const modalF = document.getElementById("image-modalF");
modalF.addEventListener("click", (e) => {
    if (e.target.id === "image-modalF" || e.target.id === "close-modalF") {
        modalF.classList.add("hidden");
        document.body.style.overflow = "auto";
    }
});

// Selezioniamo il pulsante di download tramite il suo stile specifico o aggiungi un ID per comodità
const downloadBtn = document.querySelector('#downloadBtn');

downloadBtn.addEventListener('click', () => {
    const canvasElement = document.getElementById('canvas');

    // Utilizziamo html2canvas per "fotografare" il div
    html2canvas(canvasElement, {
        backgroundColor: null, // Mantiene la trasparenza se il tuo CSS lo prevede
        useCORS: true,         // Fondamentale se le immagini delle lettere sono su un altro dominio/cartella protetta
        scale: 2               // Aumenta la qualità del PNG (2x risoluzione)
    }).then(canvasGenerated => {
        // Convertiamo il canvas in un URL di dati PNG
        const image = canvasGenerated.toDataURL("image/png");
        
        // Creiamo un link temporaneo per forzare il download
        const link = document.createElement('a');
        link.download = 'il-mio-testo-personalizzato.png';
        link.href = image;
        link.click();
    });
});




/* =====================================================
   LOGICA INTERACT (TEXT RENDERER)
   ===================================================== */

/***********************
 * CONTROLLA SE UN'IMMAGINE ESISTE
 ***********************/
function imageExists(src) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

/***********************
 * CARICA TUTTE LE VARIANTI REALI
 ***********************/
async function loadLetterVariants() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const variants = {};

  for (let letter of letters) {
    variants[letter] = [];
    let idx = 1;

    while (true) {
      const src = `sources/letters/${letter}_${idx}.webp`;
      const exists = await imageExists(src);

      if (!exists) break;

      variants[letter].push(src);
      idx++;
    }
  }

  return variants;
}

/***********************
 * VARIABILI GLOBALI
 ***********************/
const input = document.getElementById("textInput");
const wrapper = document.getElementById("textWrapper");
const randomizeBtn = document.getElementById("randomizeBtn");

let LETTER_VARIANTS = {};
let currentText = "";

/***********************
 * CREA IMMAGINE LETTERA RANDOM (SICURA)
 ***********************/
function createLetterImage(letter) {
  const variants = LETTER_VARIANTS[letter];
  if (!variants || variants.length === 0) return null;

  const randomSrc = variants[Math.floor(Math.random() * variants.length)];

  const img = document.createElement("img");
  img.src = randomSrc;
  img.alt = letter;

  return img;
}

/***********************
 * RENDER TESTO NEL CANVAS
 ***********************/
function renderText(text) {
  wrapper.innerHTML = "";

  [...text].forEach(char => {
    if (char === " ") {
      const space = document.createElement("div");
      space.style.width = "20px";
      wrapper.appendChild(space);
    } else {
      const letter = char.toUpperCase();
      const img = createLetterImage(letter);
      if (img) wrapper.appendChild(img);
    }
  });
}

/***********************
 * EVENTI
 ***********************/
input.addEventListener("input", () => {
  currentText = input.value;
  renderText(currentText);
});

randomizeBtn.addEventListener("click", () => {
  if (currentText) renderText(currentText);
});

/***********************
 * INIZIALIZZAZIONE
 ***********************/
(async function init() {
  LETTER_VARIANTS = await loadLetterVariants();
  console.log("Varianti caricate:", LETTER_VARIANTS);
})();



/* DIMENSIONE TESTO */

const fontSizeSlider = document.getElementById("fontSize");

fontSizeSlider.addEventListener("input", () => {
  wrapper.style.setProperty("--letter-size", `${fontSizeSlider.value}px`);
});



/* VICINANAZA TESTO */

const fontDistanceSlider = document.getElementById("fontDistance");

// valore iniziale
updateLetterDistance(fontDistanceSlider.value);

fontDistanceSlider.addEventListener("input", () => {
  updateLetterDistance(fontDistanceSlider.value);
});

function updateLetterDistance(value) {
  const offset = value - 100; // valore neutro

  const images = document.querySelectorAll("#textWrapper img");

  images.forEach((img, index) => {
    if (index === 0) {
      img.style.marginLeft = "0px";
    } else {
      img.style.marginLeft = `${offset}px`;
    }
  });
}


