
let toilettes = []
/*Cette fonction permet de charger les toilettes depuis le dossier data. Elle s'assure aussi que les toilettes seront raffraichit. */
async function loadToilette() {
    toilettes = await fetch("/toilettes").then(r => r.json());

    tri('note')

    const triToilettes = document.getElementById('triToilettes')
    triToilettes.addEventListener('change', (e) =>
        tri(e.target.value)
    )

}

/*Cette fonction s'occupe du tri des toilettes. */
function tri(critere) {


    toilettes.sort((a, b) => {
        switch (critere) {
            case 'note':
                return noteMoyenne(b.notesGlobal) - noteMoyenne(a.notesGlobal)
            case 'etage':
                return a.etage - b.etage
            case 'pavillon':
                return a.pavillon.localeCompare(b.pavillon)
        }

    })
    renderToilette(toilettes)


}
/*Cette fonction s'occupe de l'ajout au fichier HTML de toute les toilettes */
function renderToilette(toilettes) {
    const classementToilette = document.getElementById("toiletteClassement")
    classementToilette.innerHTML = ""

    toilettes.forEach(toilette => {
        let article = document.createElement('article')
        article.innerHTML = `
        <div class="toilette-card">
            <div class="toilette-image">
                <img src="${toilette.image}" alt="Toilette ${toilette.numero_local}">
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
            </div>
        </div>`;
        // Récupérer la note moyenne
        let note = noteMoyenne(toilette.notesGlobal);

        // Arrondir à 0.5 près
        let noteArrondie = Math.round(note * 2) / 2;

        // Récupérer les étoiles de CET article
        let etoiles = article.querySelectorAll(".etoile");

        // Appliquer les classes comme dans la page individuelle
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
/*Cette fonction permet de calculer la moyenne d'une liste*/
function noteMoyenne(list) {
    let sum = 0
    for (let i = 0; i < list.length; i++) {
        sum += list[i];
    }
    return Math.round(sum / list.length)
}

/*Fonction pour noter la toilette et l'afficher en une seule page. À faire*/
function noterToilette(toilette) {
    const numero = encodeURIComponent(toilette.numero_local);
    window.location.href = `/toilette/${numero}`;
}


loadToilette();

