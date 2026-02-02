
 // Seleziona il video tramite il suo ID
  const video = document.getElementById('introvideo');

  // Imposta un timer di 5000 millisecondi (5 secondi)
  setTimeout(() => {
    // Rende il video trasparente
    video.style.opacity = '0';
    
    // Rimuove completamente il video dal layout dopo la transizione
    setTimeout(() => {
      video.style.display = 'none';
    }, 900); // Aspetta 1 secondo (il tempo della transizione CSS)
    
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


// +++++++++++++++ CHECKBOX ORIGINALS +++++++++++++++++++++



// Seleziona tutte le checkbox dentro il div Originals
const filterCheckboxes = document.querySelectorAll('#Originals input[type="checkbox"]');

filterCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', applyFilters);
});

function applyFilters() {
    // 1. Trova quali filtri nazione sono attivi
    const activeCountries = ['ITA', 'DE', 'JP', 'FR', 'ES', 'ROM', 'NL', 'CZ']
        .filter(id => document.getElementById(id).checked);

    // 2. Trova quali filtri categoria sono attivi
    const activeCategories = ['signs', 'posters', 'packaging', 'books', 'tags', 'inscriptions']
        .filter(id => document.getElementById(id).checked);

    // 3. Prendi tutte le immagini della galleria Originals
    const images = document.querySelectorAll('.galleryO img');

    images.forEach(img => {
        const fileName = img.alt.toUpperCase(); // es: ARCH_ITA_MILANO_SIGN_1.WEBP
        
        // Verifica nazione: se nessuna è selezionata, passa il test. 
        // Se qualcuna è selezionata, il nome deve includerne una.
        const matchesCountry = activeCountries.length === 0 || 
                               activeCountries.some(country => fileName.includes(`_${country}_`));

        // Verifica categoria: logica simile (usiamo il singolare come nei tuoi file)
        // Nota: i tuoi ID sono plurali (signs), ma i file spesso singolari (sign). 
        // Normalizziamo il controllo:
        const matchesCategory = activeCategories.length === 0 || 
                                activeCategories.some(cat => {
                                    const singularCat = cat.replace(/s$/, "").toUpperCase(); 
                                    return fileName.includes(`_${singularCat}_`) || fileName.includes(`_${cat.toUpperCase()}_`);
                                });

        // Applica opacità
        if (matchesCountry && matchesCategory) {
            img.style.opacity = "1";
            img.style.pointerEvents = "auto"; // Cliccabile
        } else {
            img.style.opacity = "0.5";
            img.style.pointerEvents = "none"; // Non cliccabile se filtrata
        }
    });
}








/* =====================================================
   MODIFICA: GALLERIA FONTS CON GRUPPI
   ===================================================== */
function openGalleryF() {
    // 1. Pulizia e reset
    canvasF.innerHTML = ""; 
    canvasF.scrollTop = 0;
    canvasF.style.display = "block";

    const galleryF = document.createElement("div");
    galleryF.className = "galleryF";

    // Ordiniamo le immagini
    lettersImages.sort();

    let currentLetter = "";

    lettersImages.forEach(name => {
        const firstLetter = name.split('_')[0].toUpperCase();

        const imgF = document.createElement("img");
        imgF.src = `sources/letters/${name}`;
        imgF.alt = name;
        imgF.loading = "lazy";

        // Se è la prima volta che incontriamo questa lettera, diamo l'ID all'immagine
        if (firstLetter !== currentLetter) {
            currentLetter = firstLetter;
            imgF.id = "section-" + currentLetter; // L'ancora è l'immagine stessa
        }

        imgF.addEventListener("click", () => openModalF(imgF.src));
        galleryF.appendChild(imgF);
    });

    canvasF.appendChild(galleryF);
}

/* =====================================================
   GESTORE CLICK CHECKBOX FONTS (Aggiornato)
   ===================================================== */
const categoryLetterContainer = document.getElementById('category_letter');

if (categoryLetterContainer) {
    categoryLetterContainer.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox' && e.target.checked) {
            const letter = e.target.getAttribute('data-letter');
            const targetElement = document.getElementById("section-" + letter);

            if (targetElement) {
                // Scorriamo il canvasF fino alla posizione dell'immagine target
                targetElement.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }

            // Deseleziona le altre per chiarezza
            categoryLetterContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                if (cb !== e.target) cb.checked = false;
            });
        }
    });
}


/* Funzione Generica per aprire il modale */
function openModalO(src) {
    const modal = document.getElementById("image-modalO");
    const modalImg = document.getElementById("modal-imgO");
    modalImg.src = src;
    modal.classList.remove("hidden");
}

function openModalF(src) {
    const modal = document.getElementById("image-modalF");
    const modalImg = document.getElementById("modal-imgF");
    modalImg.src = src;
    modal.classList.remove("hidden");
}

/* Gestione della chiusura al click fuori dall'immagine */
[document.getElementById("image-modalO"), document.getElementById("image-modalF")].forEach(modal => {
    if(modal) {
        modal.addEventListener("click", (e) => {
            // Se il target del click è il contenitore scuro (e non l'immagine)
            if (e.target.tagName !== 'IMG') {
                modal.classList.add("hidden");
            }
        });
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
        link.download = 'BOFIArchive.png';
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
// function renderText(text) {
//   wrapper.innerHTML = "";

//   [...text].forEach(char => {
//     if (char === " ") {
//       const space = document.createElement("div");
//       space.style.width = "20px";
//       wrapper.appendChild(space);
//     } else {
//       const letter = char.toUpperCase();
//       const img = createLetterImage(letter);
//       if (img) wrapper.appendChild(img);
//     }
//   });
// }


function renderText(text) {
    textWrapper.innerHTML = ""; // Svuota il canvas

    for (let char of text) {
        // 1. GESTIONE INVIO (Cambio riga)
        if (char === "\n") {
            const br = document.createElement("div");
            br.style.flexBasis = "100%"; // Forza il flexbox ad andare a capo
            br.style.height = "0";
            textWrapper.appendChild(br);
            continue;
        }

        // 2. GESTIONE SPAZIO
        if (char === " ") {
            const space = document.createElement("div");
            // Usiamo lo stesso valore dello slider per rendere lo spazio coerente con le lettere
            const currentSize = document.getElementById('fontSize').value;
            space.style.width = `${currentSize}px`; 
            space.style.height = `${currentSize}px`;
            space.style.display = "inline-block";
            textWrapper.appendChild(space);
            continue;
        }

        // 3. GESTIONE LETTERE (Tuo codice esistente)
        const charUpper = char.toUpperCase();
        const matchingImages = lettersImages.filter(imgName => imgName.startsWith(charUpper + "_"));

        if (matchingImages.length > 0) {
            const randomImg = matchingImages[Math.floor(Math.random() * matchingImages.length)];
            const imgElement = document.createElement("img");
            imgElement.src = `sources/letters/${randomImg}`;
            imgElement.style.height = document.getElementById('fontSize').value + "px";
            imgElement.style.width = "auto";
            textWrapper.appendChild(imgElement);
        }
    }
}

// // AGGIUNTA: Genera uno z-index randomico tra 5 e 50
//     const randomZ = Math.floor(Math.random() * (50 - 5 + 1)) + 5;
//     imgElement.style.zIndex = randomZ;
//     imgElement.style.position = "relative"; // Necessario perché lo z-index funzioni

//     textWrapper.appendChild(imgElement);

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

fontSizeSlider.addEventListener('input', () => {
    const size = fontSizeSlider.value + "px";
    
    // Aggiorna le immagini
    const images = textWrapper.querySelectorAll('img');
    images.forEach(img => img.style.height = size);
    
    // Aggiorna i div che fungono da spazio (quelli che non hanno la classe della scia o dell'invio)
    const spaces = textWrapper.querySelectorAll('div:not([style*="flex-basis"])');
    spaces.forEach(sp => {
        sp.style.width = size;
        sp.style.height = size;
    });
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





/* =====================================================
   LOGICA SCIA DI IMMAGINI AL MOVIMENTO DEL MOUSE (SEZIONE INTERACT)
   ===================================================== */

const showReferencesCheckbox = document.querySelector('#Interact input[type="checkbox"]');
const interactCanvas = document.getElementById('canvas'); // Il canvas principale per le lettere
const mouseTrailImages = []; // Array per tenere traccia delle immagini della scia

// Funzione per generare un'immagine casuale dalla cartella archive
function getRandomArchiveImage() {
    const randomIndex = Math.floor(Math.random() * archiveImages.length);
    return `sources/archive/${archiveImages[randomIndex]}`;
}

// Funzione che crea e posiziona un'immagine al movimento del mouse
function handleMouseMove(event) {
    // Limita la creazione di immagini per performance (opzionale, ma consigliato)
    // Se ne creiamo troppe, il browser potrebbe rallentare.
    // Qui ne creiamo solo se l'ultima è stata creata almeno 50ms fa
    const currentTime = new Date().getTime();
    if (mouseTrailImages.length > 0 && (currentTime - mouseTrailImages[mouseTrailImages.length - 1].timestamp < 100)) {
        return; 
    }

    const img = document.createElement("img");
    img.src = getRandomArchiveImage();
    img.className = "mouse-trail-image"; // Aggiungiamo una classe per selezionarle facilmente dopo
    img.style.position = "absolute";
    img.style.left = `${event.clientX}px`;
    img.style.top = `${event.clientY}px`;
    img.style.pointerEvents = "none"; // Non deve interferire con i click
    
    // Dimensione casuale per un effetto più interessante (puoi regolarla)
    const randomSize = Math.floor(Math.random() * (150 - 50 + 1)) + 100; // tra 50px e 150px
    img.style.width = `${randomSize}px`;
    img.style.height = "auto";
    
    // Opacità leggera e casuale per un effetto "fantasma"
    img.style.opacity = `${Math.random() * (0.8 - 0.3) + 1}`; // tra 0.3 e 0.8
    
    // Z-index casuale per andare sopra o sotto le lettere
    // Assumiamo che le lettere abbiano un z-index di base, es. 10.
    // Quindi vogliamo z-index tra 1 e 20, ad esempio.
    const randomZIndex = Math.floor(Math.random() * 20) + 1; 
    img.style.zIndex = randomZIndex;

    document.body.appendChild(img); // Aggiungi l'immagine direttamente al body
    
    // Memorizza l'immagine e il timestamp per la limitazione e la pulizia
    mouseTrailImages.push({ element: img, timestamp: currentTime });

    // Opzionale: limita il numero di immagini nella scia
    // Se vuoi che le immagini più vecchie svaniscano o vengano rimosse dopo un po'
    if (mouseTrailImages.length > 30) { // Mantieni al massimo 30 immagini
        const oldImage = mouseTrailImages.shift(); // Rimuovi la più vecchia
        oldImage.element.remove();
    }
}

// Funzione per pulire tutte le immagini della scia
function clearMouseTrail() {
    mouseTrailImages.forEach(item => item.element.remove());
    mouseTrailImages.length = 0; // Svuota l'array
}

// Listener per la checkbox "Show references"
showReferencesCheckbox.addEventListener('change', () => {
    if (showReferencesCheckbox.checked) {
        // Attiva la scia di immagini
        document.addEventListener('mousemove', handleMouseMove);
        // Assicurati che il canvas delle lettere sia visibile se non lo è già
        interactCanvas.style.display = 'block';
    } else {
        // Disattiva la scia di immagini
        document.removeEventListener('mousemove', handleMouseMove);
        clearMouseTrail(); // Pulisci le immagini esistenti
    }
});

// Aggiungi un'ulteriore pulizia quando si cambia sezione dal pannello
// per essere sicuri che tutte le scie vengano rimosse se ci si sposta da Interact
const originalCloseEverything = closeEverything; // Salva la tua funzione originale
closeEverything = function() {
    originalCloseEverything(); // Esegui la tua pulizia normale
    clearMouseTrail(); // Pulisci la scia del mouse
    // Assicurati che la checkbox sia deselezionata quando esci da Interact
    showReferencesCheckbox.checked = false; 
    document.removeEventListener('mousemove', handleMouseMove); // Rimuovi il listener
};