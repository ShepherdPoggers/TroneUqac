document.addEventListener("DOMContentLoaded", async () => {
    /* Mise à jour visuelle des sliders (Chrome/Safari) */
    document.querySelectorAll('input[type="range"]').forEach(slider => {
        function update() {
            const min = slider.min ?? 0;
            const max = slider.max ?? 100;
            const percent = ((slider.value - min) / (max - min)) * 100;
            slider.style.setProperty('--percent', percent + '%');
        }
        slider.addEventListener('input', update);
        update();
    });

    /* Récupération du numéro dans l'URL */
    const numero = window.location.pathname.split("/").pop(); //Modifié par Elliot avec l'ajout du python
    const response = await fetch(`/api/toilette/${numero}`);

    const toilette = await response.json();

    document.getElementById("toiletteNumero").textContent = toilette.numero_local;

    const img = document.getElementById("toiletteImage");
    img.src = toilette.image;

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
        slider.addEventListener("input", function () {
            span.textContent = slider.value;
            mettreAJourEtoiles();
        });
    }

    connecterSlider(sliderProprete, valeurProprete);
    connecterSlider(sliderAchalandage, valeurAchalandage);
    connecterSlider(sliderPapier, valeurPapier);
    connecterSlider(sliderTemperature, valeurTemperature);

    /*Cette fonction s'occupe des étoiles. */

    const etoiles = document.querySelectorAll(".etoile");
    let noteGlobale = 0;

    function mettreAJourEtoiles() {
        const moyenne = (
            parseFloat(sliderProprete.value) +
            parseFloat(sliderAchalandage.value) +
            parseFloat(sliderPapier.value) +
            parseFloat(sliderTemperature.value)
        ) / 4;

        const noteArrondie = Math.round(moyenne * 2) / 2;
        noteGlobale = noteArrondie;

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
    }

    mettreAJourEtoiles();

    /*Cette fonction s'occupe de l'envoie de la note et du message que la personne voit après l'envoie. */
    const btnEnvoyerNote = document.getElementById("btnEnvoyerNote");
    const nomToilette = document.getElementById("toiletteNumero").textContent;

    function noterToilette() {
        const numero = encodeURIComponent(nomToilette);
        window.location.href = "/"; //Modifié par Elliot
    }
    btnEnvoyerNote.addEventListener("click", async function () {
        const numeroLocal = nomToilette;
        const evaluation = {
            numero_local : numeroLocal,
            noteGlobal: noteGlobale,
            noteProprete: parseFloat(sliderProprete.value),
            noteAchalandage: parseFloat(sliderAchalandage.value),
            notePapier: parseFloat(sliderPapier.value),
            noteTemperature: parseFloat(sliderTemperature.value)
        };
        //Ajouté par Elliot avec l'ajout du python
        const response = await fetch("/update", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(evaluation)
    });
        const result = await response.json();

        /*let evaluations = JSON.parse(localStorage.getItem("evaluations")) || {};
        if (!evaluations[numeroLocal]) evaluations[numeroLocal] = [];
        evaluations[numeroLocal].push(evaluation);
        localStorage.setItem("evaluations", JSON.stringify(evaluations));*/

        console.log("noteProprete :", evaluation.proprete);
        console.log("noteAchalandage :", evaluation.achalandage);
        console.log("notePapier :", evaluation.papier);
        console.log("noteTemperature :", evaluation.temperature);
        console.log("NotesGlobal :", evaluation.global);


        alert("On a bien reçu votre évaluation de la toilette " + nomToilette + "");

        noterToilette();
    });

    /*Message du button d'instruction.*/
    const btnInstruction = document.getElementById("btnInstruction");

    btnInstruction.addEventListener("click", function () {
        alert("Voici les instructions à suivre pour évaluer la toilette " + nomToilette + ":\n\n" +
        "La toilette sera évalué par 4 critères distincts, notés à l'aide des sliders ci-dessous.\n" +
        "• 1 -> la note la plus basse\n" +
        "• 5 -> la note la plus haute.\n" +
        "• Les étoiles affichent la note moyenne selon les critères d'évaluation que vous avez donnés.\n\n" +
        "Après avoir évaluer la toilette, appuyez sur « Envoyer la note». Votre évaluation sera enregistrée et le site vous renverra à la page principal.");
    });

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
})

