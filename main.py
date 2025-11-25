from flask import Flask, jsonify, request, render_template
import json


app = Flask(__name__)

def LoadToilettes():
    """Permet de charger les différentes toilettes depuis le Json"""
    with open("data/toilettes.json", "r", encoding="utf-8") as file:
        return json.load(file)
    
def saveToilettes(data):
    """Permet de mettre à jour le fichier toilettes.json"""
    with open("data/toilettes.json", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
    
def trouverToilette(toilettes, numero):
    for toilette in toilettes:
        if toilette["numero_local"] == numero:
            return toilette

@app.route("/", methods=["GET", "POST"])
def loadPagePrincipal():
    """Permet de faire charger la page principal"""
    return render_template("index.html")

@app.route("/toilettes", methods=["GET"])
def getToilettes():
    """Permet de réagire à un get provenant du JavaScript pour lui envoyer les toilettes"""
    return jsonify(LoadToilettes())

@app.route("/toilette/<numero>")
def pageToilette(numero):
    data = trouverToilette(LoadToilettes(), numero)
    return render_template("html_visualisation.html", toilette=data)
@app.route("/api/toilette/<numero>")
def apiGetToilette(numero):
    toilette = trouverToilette(LoadToilettes(), numero)
    return jsonify(toilette)

@app.route("/update", methods=["POST"])
def update_toilette():
    """
    Permet de réagrie à un POST provenenant du JavaScript pour 
    recevoir la note de la toilette.
    """
    data = request.json
    toilettes = LoadToilettes()
    print(data)
    toilette = trouverToilette(toilettes, data["numero_local"])
    toilette["notesGlobal"].append(data["noteGlobal"])
    toilette["notesProprete"].append(data["noteProprete"])
    toilette["notesAchalandage"].append(data["noteAchalandage"])
    toilette["notesPapier"].append(data["notePapier"])
    toilette["notesTemperature"].append(data["noteTemperature"])
    print(toilettes)
    saveToilettes(toilettes)
    
            
    return jsonify({"status": "ok"})    
    
if __name__ == "__main__":
    app.run(debug=True)