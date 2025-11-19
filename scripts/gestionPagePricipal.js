


async function loadToilette() {
    let toilettes = await fetch("data/toilettes.json").then(r => r.json());
    const classementToilette = document.getElementById("toiletteClassement")
    
    
    toilettes.forEach(toilette => {
        let article = document.createElement('article')
        article.innerHTML = `<h2> ${toilette.numero_local}</h2>
        <h3> Note : ${noteMoyenne(toilette.notes)} </h3>
        <h3> Pavillon : ${toilette.pavillon} </h3>
        <h3> Étage : ${toilette.etage} </h3>`
        article.addEventListener('click', () => noterToilette(article))
        classementToilette.appendChild(article)
    });

}
 /* Fonction pour noter la toilette et l'afficher en une seule page. À faire*/
function noterToilette(article)
{
    console.log("Salut mec !", article);
}


function noteMoyenne(list)
{   
    let sum = 0
    for(let i = 0; i < list.length; i++)
    {
        sum += list[i];
    }
    return Math.round(sum / list.length)
}

loadToilette()

