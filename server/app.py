from flask import Flask, request, jsonify, session
from flask_session import Session
from flask_bcrypt import Bcrypt #pip install Flask-Bcrypt = https://pypi.org/project/Flask-Bcrypt/
#from flask_cors import CORS, cross_origin #ModuleNotFoundError: No module named 'flask_cors' = pip install Flask-Cors
from models import db, User
from config import ApplicationConfig 
 
app = Flask(__name__)
app.config['SECRET_KEY'] = 'vbjvsieomvdpognszvzrivnbeoib864531648531'
app.config.from_object(ApplicationConfig)

bcrypt = Bcrypt(app) 
server_session = Session(app)
# CORS(app, supports_credentials=True)

db.init_app(app)  
with app.app_context():
    db.create_all()
 
# @app.route("/")
# def hello_world():
#     return "Hello, World!"

@app.route("/@me")
def get_current_user():
    user_id = session.get("user_id")
    
    if not user_id :
        return jsonify({"error": "Unauthorized"}), 401
    
    user = User.query.filter_by(id=user_id).first()
    
    return jsonify({
        "id": user.id,
        "email": user.email
    })

#_________________________________________________
#_________________________________________________
@app.route("/register", methods=["POST"])
def register():
    firstname = request.json["firstname"]
    lastname = request.json["lastname"]
    email = request.json["email"]
    password = request.json["password"]
 
    user_exists = User.query.filter_by(email=email).first() is not None
 
    if user_exists:
        return jsonify({"error": "Email already exists"}), 409
     
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(firstname=firstname, lastname=lastname, email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
 
    #session["user_id"] = new_user.id
 
    return jsonify({
        "id": new_user.id,
        "email": new_user.email
    })

#_________________________________________________
#_________________________________________________
@app.route("/login", methods=["POST"])
def login_user():
    email = request.json["email"]
    password = request.json["password"]
  
    user = User.query.filter_by(email=email).first()
  
    if user is None:
        return jsonify({"error": "Unauthorized Access"}), 401
  
    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Unauthorized"}), 401
      
    session["user_id"] = user.id
  
    return jsonify({
        "id": user.id,
        "email": user.email
    })

if __name__ == "__main__":
    app.run(debug=True)