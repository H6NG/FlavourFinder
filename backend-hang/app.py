from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity
)
from passlib.hash import argon2
import psycopg2
import os
import ssl
from pymongo import MongoClient
from datetime import datetime, timezone

app = Flask(__name__); 
CORS(app); 

load_dotenv(); 

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
jwt = JWTManager(app)

db_host = os.getenv("db_host")
db_name = os.getenv("db_name")
db_user = os.getenv("db_user")
db_password = os.getenv("db_password")
db_port = os.getenv("db_port")


mongo_uri = os.getenv("MONGO_URI")
mongo_db = os.getenv("MONGO_DB")
mongo_collection = os.getenv("MONGO_COLLECTION")

try: 
    client = MongoClient(mongo_uri)
    db = client["auth"]
    users_collection = db["user"]
    print("Connected to MangoDB")

except Exception as e: 

    print("Error:", e)

# Connection with the SQL postgres database 
try: 
    connection =  psycopg2.connect(
        host=db_host,
        dbname=db_name,
        user=db_user,
        password=db_password, 
        port=db_port,
        sslmode='require'
    )
    print("FOR DEBUG ONLY: Connected to the PostgreSQL database successfully.")
    
except Exception as e: 
    print("FOR DEBUG ONLY: Failed to connect to PostgreSQL database:", e)

# Routes

@app.route('/')
def home():
    return "For DEBUGGING: Flask backend connected to PostgreSQL securely."

@app.route('/api/refreshToken', methods=['GET'])
def refreshToken(): 

    pass


@app.route('/api/getChoice', methods = ['GET'])
def getChoice():
    pass

@app.route('/api/makeChoice', methods = ['POST'])
def makeChoice():
    pass


@app.route('/api/recommendRestaurauntGuest', methods = ['POST'])
def recommendRestaurantGuest(): 
    pass

@app.route('/api/recommendRestaurauntUser', methods = ['POST'])
def recommendRestaurantUser():
    pass

@app.route('/api/changePassword', methods = ['PUT'])
def changePassword():
    pass

@app.route('/api/deleteAccount', methods = ['DELETE'])
def deleteAccount():
    pass

@app.route('/api/getPreferences', methods = ['GET'])
def getPreferences():
    pass

@app.route('/api/getUserSelf', methods = ['GET'])
def getUserSelf():
    pass

@app.route('/api/registerUser', methods = ['POST'])
def registerUser():
    
    data = request.get_json(silent=True) or {}
    email = data.get("email")
    username = data.get("userName")
    password = data.get("password")
    first = data.get("firstName")
    last = data.get("lastName")
    glutenFree = data.get("glutenFree", False)
    vegetarian = data.get("vegetarian", False)
    vegan = data.get("vegan", False)
    favoriteCuisine = data.get("favouriteCuisine", [])
    

    if not all([email, username, password, first, last]):
            return jsonify({"error": "Missing required fields"}), 400
    
    if "@" not in email:
        return jsonify({"error": "Invalid email format"}), 400

    existing = users_collection.find_one({"email": email})
    if existing:
        return jsonify({"error": "Email already registered"}), 409

    try:
        
        password_hash = argon2.hash(password)

        user_doc = {
            "email": email,
            "userName": username,
            "passwordHash": password_hash,
            "firstName": first,
            "lastName": last,
            "preferences": {
                "glutenFree": glutenFree,
                "vegetarian": vegetarian,
                "vegan": vegan
            },
            "favoriteCuisine": favoriteCuisine,
            "createdAt": datetime.now(timezone.utc)
        }

        result = users_collection.insert_one(user_doc)

        return jsonify({
            "message": "User registered successfully",
            "userId": str(result.inserted_id)
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/api/updatePreferences', methods = ['PUT'])
def updatePreferences():
    pass
@app.route('/api/updateUserInfo', methods = ['POST'])
def updateUserInfo():
    pass

@app.route('/api/userLogin', methods = ['POST'])
def userLogin():
    pass

@app.route('/api/userLogout', methods = ['POST'])
def userLogout():
    pass


if __name__ == '__main__': 
    app.run (debug=True)