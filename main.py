from flask import Flask, jsonify, request, render_template, redirect, url_for, session
import json
from werkzeug.security import generate_password_hash, check_password_hash


app = Flask(__name__)
app.config["SECRET_KEY"] = "tonSecret"

def LoadToilettes():
    """Permet de charger les différentes toilettes depuis le Json"""
    with open("data/toilettes.json", "r", encoding="utf-8") as file:
        return json.load(file)

#Fonctions fait par ChatGPT    
def load_users():
    """Permet de charger la liste des utilisateurs"""
    try:
        with open("data/users.json", "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return []

def save_users(users):
    """Permet de sauvegarder un utilisateur dans le .json"""
    with open("data/users.json", "w", encoding="utf-8") as f:
        json.dump(users, f, indent=4, ensure_ascii=False)

def find_user(username):
    """Permet de gerer si un utilisateur existe déjà"""
    users = load_users()
    for user in users:
        if user["username"] == username:
            return user
    return None
#Fin des focntions de ChatGPT
    
def saveToilettes(data):

    """Permet de mettre à jour le fichier toilettes.json"""
    with open("data/toilettes.json", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
    
def trouverToilette(toilettes, numero):
    for toilette in toilettes:
        if toilette["numero_local"] == numero:
            return toilette

@app.route("/register", methods=["GET", "POST"])
#Fait par ChatGPT
def register():
    """Permet de gérer le register du site web"""
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        confirm = request.form.get("confirm-password")

        # Champs obligatoires
        if not (username and password and confirm):
            return redirect(url_for("register") + "?error=missing-fields")

        # Mots de passe doivent matcher
        if password != confirm:
            return redirect(url_for("register") + "?error=password-mismatch")

        # Vérifier si l'utilisateur existe déjà
        if find_user(username) is not None:
            return redirect(url_for("register") + "?error=user-exists")

        # Créer le user
        users = load_users()
        password_hash = generate_password_hash(password)
        users.append({
            "username": username,
            "password_hash": password_hash
        })
        save_users(users)

        # On peut connecter direct après création si tu veux
        session["username"] = username

        return redirect(url_for("loadPagePrincipal"))

    # GET → afficher la page HTML avec le formulaire
    return render_template("register.html")



@app.route("/login", methods=["GET", "POST"])
#Fait par ChatGPT
def login():
    """Permet de gérer le login du site Web"""
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        user = find_user(username)

        if user is None:
            return redirect(url_for("login") + "?error=invalid-credentials")

        if not check_password_hash(user["password_hash"], password):
            return redirect(url_for("login") + "?error=invalid-credentials")

        # Auth ok → on stocke l'utilisateur dans la session
        session["username"] = username

        return redirect(url_for("loadPagePrincipal"))

    return render_template("login.html")


@app.route("/", methods=["GET", "POST"])
def loadPagePrincipal():
    """Permet de faire charger la page principal"""
    print(session.get("username"))
    if session.get("username") is not None:
        return render_template("index.html")
    return redirect(url_for("login"))

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

@app.route("/logout")
def logout():
    session.clear()  # efface l’utilisateur connecté
    return redirect(url_for("login"))

@app.route("/back")
def back():
    return redirect(url_for("loadPagePrincipal"))

    
if __name__ == "__main__":
    app.run(debug=True)