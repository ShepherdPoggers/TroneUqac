document.addEventListener("DOMContentLoaded", function() {
 /* Récupération du numéro dans l'URL */
const params = new URLSearchParams(window.location.search);
    const toiletteString = params.get("toilette");
    const toilette = JSON.parse(toiletteString); 

    document.getElementById("toiletteNumero").textContent = toilette.numero_local;

    const img = document.getElementById("toiletteImage");
    img.src = toilette.image;

});

console.log(toilette.numero_local);

/*Cette fonction s'occupe des sliders de critère d'évaluation. */
const sliderProprete = document.getElementById("sliderProprete");
const sliderAchalandage = document.getElementById("sliderAchalandage");
const sliderPapier = document.getElementById("sliderPapier");
const sliderTemperature = document.getElementById("sliderTemperature");

const valeurProprete = document.getElementById("valeurProprete");
const valeurAchalandage = document.getElementById("valeurAchalandage");
const valeurPapier = document.getElementById("valeurPapier");
const valeurTemperature = document.getElementById("valeurTemperature");

function connecterSlider(slider, span) {
    slider.addEventListener("input", function(){
        span.textContent = slider.value;
    });
    }

    connecterSlider(sliderProprete, valeurProprete);
    connecterSlider(sliderAchalandage, valeurAchalandage);
    connecterSlider(sliderPapier, valeurPapier);
    connecterSlider(sliderTemperature, valeurTemperature);
    
/*Cette fonction s'occupe des étoiles. */

const etoiles = document.querySelectorAll(".etoile");
let noteGlobale = 0;

etoiles.forEach(function(etoile) {
    etoile.addEventListener("click", function() {
        noteGlobale = parseInt(etoile.dataset.value);
        console.log("Note globale :", noteGlobale)

        etoiles.forEach(function(e) {
            if (parseInt(e.dataset.value) <= noteGlobale) {
                e.style.color = "gold"; 
            } else {
                e.style.color = "black";
            }
        });
    });
});

/*Cette fonction s'occupe de l'envoie de la note et du message que la personne voit après l'envoie. */
const btnEnvoyerNote = document.getElementById("btnEnvoyerNote");
const nomToilette = document.getElementById("toiletteNumero").textContent;

function noterToilette() {
    const numero = encodeURIComponent(nomToilette);
    window.location.href =  "index.html";
}
btnEnvoyerNote.addEventListener("click", function() {
    const numeroLocal = nomToilette;
    const evaluation = {
        notesGlobal: noteGlobale,
        noteProprete: parseFloat(sliderProprete.value),
        noteAchalandage: parseFloat(sliderAchalandage.value),
        notePapier: parseFloat(sliderPapier.value),
        noteTemperature: parseFloat(sliderTemperature.value)
    };

    let evaluations = JSON.parse(localStorage.getItem("evaluations")) || {};
    if (!evaluations[numeroLocal]) evaluations[numeroLocal] = [];
    evaluations[numeroLocal].push(evaluation);
    localStorage.setItem("evaluations", JSON.stringify(evaluations));

    console.log("Proprete :", evaluation.proprete);
    console.log("Achalandage :", evaluation.achalandage);
    console.log("Papier :", evaluation.papier);
    console.log("Temperature :", evaluation.temperature);
    console.log("Note globale :", evaluation.global);

    
    alert("On a bien reçu votre évaluation de la toilette " + nomToilette + "");

    noterToilette();
 });

/*Cette fonction s'occupe du message après un signalement. Propabelement à changer dans le future */
 const btnSignaler = document.getElementById("btnSignaler");

 btnSignaler.addEventListener("click", function() {
    alert("Merci d'avoir signalé la toilette " + nomToilette + "");
});

