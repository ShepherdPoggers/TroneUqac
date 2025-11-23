document.addEventListener("DOMContentLoaded", function() {

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

btnEnvoyerNote.addEventListener("click", function() {
    let valeurProprete = parseInt(sliderProprete.value);
    let valeurAchalandage = parseInt(sliderAchalandage.value);
    let valeurPapier = parseInt(sliderPapier.value);
    let valeurTemperature = parseInt(sliderTemperature.value);

    const note = {
    globale: noteGlobale,
    proprete: valeurProprete,
    achalandage: valeurAchalandage,
    papier: valeurPapier,
    temperature: valeurTemperature
};
    console.log("Proprete :", valeurProprete);
    console.log("Achalandage :", valeurAchalandage);
    console.log("Papier :", valeurPapier);
    console.log("Temperature :", valeurTemperature);

    alert("On a bien reçu votre évaluation de la toilette " + nomToilette + "");
 });

/*Cette fonction s'occupe du message après un signalement. Propabelement à changer dans le future */
 const btnSignaler = document.getElementById("btnSignaler");

 btnSignaler.addEventListener("click", function() {
    alert("Merci d'avoir signalé la toilette " + nomToilette + "");
})
})
