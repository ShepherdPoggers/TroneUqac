
let toilettes = []
/*Cette fonction permet de charger les toilettes depuis le dossier data. Elle s'assure aussi que les toilettes seront raffraichit. */
async function loadToilette() {
    toilettes = await fetch("data/toilettes.json").then(r => r.json());

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
        article.innerHTML = `<h2> ${toilette.numero_local}</h2>
        <img src=${toilette.image} alt="Une salle de bain">
        <h3> Note : ${noteMoyenne(toilette.notesGlobal)} </h3>
        <h3> Pavillon : ${toilette.pavillon} </h3>
        <h3> Étage : ${toilette.etage} </h3>`
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
    const toilettedonner = encodeURIComponent(JSON.stringify(toilette));
    window.location.href = `html_visualisation.html?toilette=${toilettedonner}`;
}

loadToilette();

