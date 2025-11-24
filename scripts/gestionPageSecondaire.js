document.addEventListener("DOMContentLoaded", function() {
    // --- Récupération de la toilette depuis l’URL ---
    const params = new URLSearchParams(window.location.search);
    const toiletteString = params.get("toilette");
    const toilette = JSON.parse(decodeURIComponent(toiletteString));

    const name = document.getElementById("toiletteNumero");
    name.textContent = toilette.numero_local;

    console.log("Toilette reçue :", toilette);

    /* Sliders */
    const sliderProprete = document.getElementById("sliderProprete");
    const sliderAchalandage = document.getElementById("sliderAchalandage");
    const sliderPapier = document.getElementById("sliderPapier");
    const sliderTemperature = document.getElementById("sliderTemperature");

    const valeurProprete = document.getElementById("valeurProprete");
    const valeurAchalandage = document.getElementById("valeurAchalandage");
    const valeurPapier = document.getElementById("valeurPapier");
    const valeurTemperature = document.getElementById("valeurTemperature");

    function connecterSlider(slider, span) {
        slider.addEventListener("input", function() {
            span.textContent = slider.value;
        });
    }

    connecterSlider(sliderProprete, valeurProprete);
    connecterSlider(sliderAchalandage, valeurAchalandage);
    connecterSlider(sliderPapier, valeurPapier);
    connecterSlider(sliderTemperature, valeurTemperature);

    /* Étoiles */
    const etoiles = document.querySelectorAll(".etoile");
    let noteGlobale = 0;

    etoiles.forEach(function(etoile) {
        etoile.addEventListener("click", function() {
            noteGlobale = parseInt(etoile.dataset.value);
            console.log("Note globale :", noteGlobale);

            etoiles.forEach(function(e) {
                if (parseInt(e.dataset.value) <= noteGlobale) {
                    e.style.color = "gold";
                } else {
                    e.style.color = "black";
                }
            });
        });
    });

    /* Envoi de la note */
    const btnEnvoyerNote = document.getElementById("btnEnvoyerNote");
    const nomToilette = name.textContent; // maintenant que c'est rempli

    function retourAccueil() {
        const numero = encodeURIComponent(nomToilette);
        window.location.href = "index.html";
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

        alert("On a bien reçu votre évaluation de la toilette " + nomToilette + "");
        retourAccueil();
    });

    /* Bouton signaler */
    const btnSignaler = document.getElementById("btnSignaler");
    btnSignaler.addEventListener("click", function() {
        alert("Merci d'avoir signalé la toilette " + nomToilette + "");
    });
});
