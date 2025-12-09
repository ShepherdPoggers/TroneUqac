
let toilettes_ = []
let critereTriCourant_ = 'note'
let filtrePavillon_ = 'tous'
let filtreType_ = 'tous'
let filtreEtage_ = 'tous'

/*Cette fonction permet de charger les toilettes depuis le dossier data. Elle s'assure aussi que les toilettes seront raffraichit. */
async function loadToilette() {
    toilettes_ = await fetch("/toilettes").then(r => r.json());
    initFiltres()
    // Tri initial par note globale avec filtres = "tous"
    appliquerFiltresEtTri()
}

/*Initialisation des boutons de filtres (pavillon, type, étage) */
function initFiltres() {
    const pavBtns = document.querySelectorAll('[data-filtre-pavillon]')
    pavBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            pavBtns.forEach(b => b.classList.remove('filtre-actif'))
            btn.classList.add('filtre-actif')
            filtrePavillon_ = btn.getAttribute('data-filtre-pavillon')
            appliquerFiltresEtTri()
        })
    })

    const typeBtns = document.querySelectorAll('[data-filtre-type]')
    typeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            typeBtns.forEach(b => b.classList.remove('filtre-actif'))
            btn.classList.add('filtre-actif')
            filtreType_ = btn.getAttribute('data-filtre-type')
            appliquerFiltresEtTri()
        })
    })

    const etageBtns = document.querySelectorAll('[data-filtre-etage]')
    etageBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            etageBtns.forEach(b => b.classList.remove('filtre-actif'))
            btn.classList.add('filtre-actif')
            filtreEtage_ = btn.getAttribute('data-filtre-etage')
            appliquerFiltresEtTri()
        })
    })

    const triBtns = document.querySelectorAll('[data-tri]');
    triBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            triBtns.forEach(b => b.classList.remove('filtre-actif'));
            btn.classList.add('filtre-actif');
            critereTriCourant_ = btn.getAttribute('data-tri');
            appliquerFiltresEtTri();
        });
    });

}

/*Applique les filtres (pavillon/type/étage) puis le tri courant, puis affiche*/
function appliquerFiltresEtTri() {
    // On part de la liste complète
    let liste = toilettes_.slice()
    if (filtrePavillon_ !== 'tous') {
        liste = liste.filter(t => t.pavillon === filtrePavillon_)
    }
    if (filtreType_ !== 'tous') {
        liste = liste.filter(t => t.type === filtreType_)
    }
    if (filtreEtage_ !== 'tous') {
        liste = liste.filter(t => String(t.etage) === filtreEtage_)
    }
    // Tri en fonction du critère courant
    liste.sort((a, b) => {
        switch (critereTriCourant_) {
            case 'note': // Note globale
                return noteMoyenne(b.notesGlobal) - noteMoyenne(a.notesGlobal)
            case 'proprete':
                return noteMoyenne(b.notesProprete) - noteMoyenne(a.notesProprete)
            case 'achalandage':
                return noteMoyenne(b.notesAchalandage) - noteMoyenne(a.notesAchalandage)
            case 'papier':
                return noteMoyenne(b.notesPapier) - noteMoyenne(a.notesPapier)
            case 'temperature':
                return noteMoyenne(b.notesTemperature) - noteMoyenne(a.notesTemperature)
            default:
                return 0
        }
    })
    renderToilette(liste)
}

/*Cette fonction s'occupe du tri des toilettes. */
function tri(critere) {
    critereTriCourant_ = critere
    appliquerFiltresEtTri()
}

/*Cette fonction s'occupe de l'ajout au fichier HTML de toute les toilettes */
function renderToilette(listeToilettes) {
    const classementToilette = document.getElementById("toiletteClassement")
    classementToilette.innerHTML = ""
    listeToilettes.forEach(toilette => {
        const noteGlobale = noteMoyenne(toilette.notesGlobal)
        let article = document.createElement('article')
        article.innerHTML = `
            <div class="toilette-card">
                <div class="toilette-image">
                    <img src="${toilette.image}"
                    alt="Toilette ${toilette.numero_local}"
                    onerror="this.onerror=null; this.src='static/images/logo_toilette.png';">
                </div>
                <div class="toilette-info">
                    <div class="toilette-header">
                        <h2>${toilette.numero_local}</h2>
                        <div class="etoiles">
                            <span class="etoile" data-value="1"></span>
                            <span class="etoile" data-value="2"></span>
                            <span class="etoile" data-value="3"></span>
                            <span class="etoile" data-value="4"></span>
                            <span class="etoile" data-value="5"></span>
                        </div>
                    </div>
                    <div class="toilette-details">
                        <p><span>Type :</span> ${toilette.type}</p>
                        <p><span>Pavillon :</span> ${toilette.pavillon}</p>
                        <p><span>Étage :</span> ${toilette.etage}</p>
                    </div>
                    <div class="toilette-notes">
                        ${buildNoteBar("Propreté", noteMoyenne(toilette.notesProprete))}
                        ${buildNoteBar("Achalandage", noteMoyenne(toilette.notesAchalandage))}
                        ${buildNoteBar("Papier", noteMoyenne(toilette.notesPapier))}
                        ${buildNoteBar("Température", noteMoyenne(toilette.notesTemperature))}
                    </div>
                </div>
            </div>`;
        let note = noteGlobale
        let noteArrondie = Math.round(note * 2) / 2
        let etoiles = article.querySelectorAll(".etoile")
        etoiles.forEach((e) => {
            const val = parseInt(e.dataset.value);
            e.classList.remove("full", "half");
            if (noteArrondie >= val) {
                e.classList.add("full");
            }
            else if (noteArrondie >= val - 0.5) {
                e.classList.add("half");
            }
        });
        article.addEventListener('click', () => noterToilette(toilette))
        classementToilette.appendChild(article)
    });
}

function buildNoteBar(label, value) {
    const val = isNaN(value) ? 0 : value
    const fixedVal = Number(val).toFixed(1) // 🔥 Toujours 1 décimale
    const pourcentage = (val / 5) * 100
    return `
        <div class="note-row" style="display:flex; align-items:center;">
            <span style="display:inline-block; width:110px; font-weight:bold;">${label}</span>
            <div style="
                flex:1;
                height:10px;
                background-color:#d0d87a;
                border-radius:5px;
                overflow:hidden;
                border:1px solid #808000;
            ">
                <div style="
                    height:100%;
                    width:${pourcentage}%;
                    background-color:#f2a623;
                "></div>
            </div>
            <span style="min-width:10px; 
                text-align:right;
                margin-left: 6px;
            ">${fixedVal}</span>
        </div>`
}

/*Cette fonction permet de calculer la moyenne d'une liste*/
function noteMoyenne(list) {
    let sum = 0
    for (let i = 0; i < list.length; i++) {
        sum += list[i];
    }
    return Math.round((sum / list.length) * 2)/2;
}

/*Fonction pour noter la toilette et l'afficher en une seule page. À faire*/
function noterToilette(toilette) {
    const numero = encodeURIComponent(toilette.numero_local);
    window.location.href = `/toilette/${numero}`;
}

loadToilette();

// ===========================
// BOUTON DÉCONNEXION
// ===========================
const btnLogout = document.getElementById("btnLogout");
if (btnLogout) {
    btnLogout.addEventListener("click", () => {
        window.location.href = "/logout";
    });
}

// ===========================
// BOUTON RETOUR
// ===========================
const btnBack = document.getElementById("btnBack");
if (btnBack) {
    btnBack.addEventListener("click", () => {
        window.location.href = "/back";
    });
}
    

