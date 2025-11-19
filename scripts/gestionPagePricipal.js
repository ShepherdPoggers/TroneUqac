
let toilettes = []

async function loadToilette() {
    toilettes = await fetch("data/toilettes.json").then(r => r.json());

    renderToilette('note')

    const triToilettes = document.getElementById('triToilettes')
    triToilettes.addEventListener('change', (e) =>
        renderToilette(e.target.value)
    )

}


function renderToilette(critere) {

    const classementToilette = document.getElementById("toiletteClassement")
    classementToilette.innerHTML = ""

    toilettes.sort((a,b) => {
        switch (critere){
            case 'note':
                return noteMoyenne(b.notesGlobal) - noteMoyenne(a.notesGlobal)
            case 'etage':
                return a.etage - b.etage
            case 'pavillon':
                return a.pavillon.localeCompare(b.pavillon)
        }
        
    })

    toilettes.forEach(toilette => {
        let article = document.createElement('article')
        article.innerHTML = `<h2> ${toilette.numero_local}</h2>
        <img src=${toilette.image} alt="Une salle de bain">
        <h3> Note : ${noteMoyenne(toilette.notesGlobal)} </h3>
        <h3> Pavillon : ${toilette.pavillon} </h3>
        <h3> Étage : ${toilette.etage} </h3>`
        article.addEventListener('click', () => noterToilette(article))
        classementToilette.appendChild(article)
    });
}


function noteMoyenne(list) {
    let sum = 0
    for (let i = 0; i < list.length; i++) {
        sum += list[i];
    }
    return Math.round(sum / list.length)
}

/* Fonction pour noter la toilette et l'afficher en une seule page. À faire*/
function noterToilette(article) {
    console.log("Salut mec !", article);
}


loadToilette()

