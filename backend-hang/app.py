from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity
)
from passlib.hash import argon2
import psycopg2
import os
import ssl
from pymongo import MongoClient
from datetime import datetime, timezone
from bson import ObjectId

app = Flask(__name__); 

CORS(app)
     
""", resources={
    r"/*": {
        "origins": ["https://c2tp.onrender.com"]
    }
})"""

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
    restHistory_collection = db["restaurantwentByUser"]
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
@jwt_required(refresh=True)
def refreshToken():
    user_id = get_jwt_identity()
    new_access = create_access_token(identity=user_id)
    return jsonify({"accessToken": new_access}), 200

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

@app.route('/api/changePassword', methods=['PUT'])
@jwt_required()
def changePassword():
    user_id = get_jwt_identity()

    try:
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({"error": "User not found"}), 404
    except Exception:
        return jsonify({"error": "Invalid user ID"}), 400

    data = request.get_json(silent=True) or {}

    old_password = data.get("oldPassword")
    new_password = data.get("newPassword")

    if not old_password or not new_password:
        return jsonify({"error": "oldPassword and newPassword required"}), 400

    try:
        if not argon2.verify(old_password, user["passwordHash"]):
            return jsonify({"error": "Old password incorrect"}), 401
    except:
        return jsonify({"error": "Old password incorrect"}), 401

    new_hash = argon2.hash(new_password)

    users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"passwordHash": new_hash}}
    )

    return jsonify({"message": "Password changed successfully"}), 200


@app.route('/api/deleteAccount', methods=['DELETE'])
@jwt_required()
def deleteAccount():
    user_id = get_jwt_identity()

    try:
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({"error": "User not found"}), 404
    except Exception:
        return jsonify({"error": "Invalid user ID"}), 400

    users_collection.delete_one({"_id": ObjectId(user_id)})

    return jsonify({"message": "Account deleted"}), 200

@app.route('/api/getPreferences', methods = ['GET'])
@jwt_required()
def getPreferences():
    user_id = get_jwt_identity()

    try:
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({"error": "User not found"}), 404
    except Exception:
        return jsonify({"error": "Invalid user ID"}), 400

    return jsonify({
        "preferences": user["preferences"],
        "favoriteCuisine": user.get("favoriteCuisine", [])
    }), 200


@app.route('/api/getUserSelf', methods=['GET'])
@jwt_required()
def getUserSelf():
    user_id = get_jwt_identity()

    try:
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({"error": "User not found"}), 404
    except Exception:
        return jsonify({"error": "Invalid user ID"}), 400

    return jsonify({
        "id": str(user["_id"]),
        "email": user["email"],
        "userName": user["userName"],
        "firstName": user["firstName"],
        "lastName": user["lastName"],
        "preferences": user["preferences"],
        "favoriteCuisine": user.get("favoriteCuisine", []),
        "createdAt": user["createdAt"]
    }), 200


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
    favoriteCuisine = data.get("favoriteCuisine", [])
    

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
@jwt_required()
def updatePreferences():
    user_id = get_jwt_identity()

    try:
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({"error": "User not found"}), 404
    except Exception:
        return jsonify({"error": "Invalid user ID"}), 400

    data = request.get_json(silent=True) or {}

    update_data = {}

    for field in ["glutenFree", "vegetarian", "vegan"]:
        if field in data:
            update_data[f"preferences.{field}"] = bool(data[field])

    if "favoriteCuisine" in data:
        if isinstance(data["favoriteCuisine"], list):
            update_data["favoriteCuisine"] = data["favoriteCuisine"]
        else:
            return jsonify({"error": "favoriteCuisine must be a list"}), 400

    if not update_data:
        return jsonify({"error": "No valid fields provided"}), 400

    users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update_data}
    )

    updated_user = users_collection.find_one({"_id": ObjectId(user_id)})
    updated_user["_id"] = str(updated_user["_id"])

    return jsonify({
        "message": "Preferences updated successfully",
        "preferences": updated_user["preferences"],
        "favoriteCuisine": updated_user.get("favoriteCuisine", [])
    }), 200

@app.route('/api/updateUserInfo', methods=['POST'])
@jwt_required()
def updateUserInfo():
    user_id = get_jwt_identity()

    try:
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({"error": "User not found"}), 404
    except Exception:
        return jsonify({"error": "Invalid user ID"}), 400

    data = request.get_json(silent=True) or {}
    update_fields = {}

    if "email" in data:
        email = data["email"].strip().lower()
        if "@" not in email:
            return jsonify({"error": "Invalid email format"}), 400
        existing = users_collection.find_one({"email": email, "_id": {"$ne": ObjectId(user_id)}})
        if existing:
            return jsonify({"error": "Email already in use"}), 409
        update_fields["email"] = email

    if "userName" in data:
        update_fields["userName"] = data["userName"].strip()

    if "firstName" in data:
        update_fields["firstName"] = data["firstName"].strip()

    if "lastName" in data:
        update_fields["lastName"] = data["lastName"].strip()

    if not update_fields:
        return jsonify({"error": "No valid fields provided"}), 400

    users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update_fields}
    )

    updated = users_collection.find_one({"_id": ObjectId(user_id)})
    updated["_id"] = str(updated["_id"])

    return jsonify({
        "message": "User info updated successfully",
        "user": {
            "id": updated["_id"],
            "email": updated["email"],
            "userName": updated["userName"],
            "firstName": updated["firstName"],
            "lastName": updated["lastName"]
        }
    }), 200


@app.route('/api/userLogin', methods=['POST'])
def userLogin():
    data = request.get_json(silent=True) or {}

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    user = users_collection.find_one({"email": email})
    if not user:
        return jsonify({"error": "Invalid email or password"}), 401

    try:
        if not argon2.verify(password, user["passwordHash"]):
            return jsonify({"error": "Invalid email or password"}), 401
    except:
        return jsonify({"error": "Invalid email or password"}), 401

    access = create_access_token(identity=str(user["_id"]))
    refresh = create_refresh_token(identity=str(user["_id"]))

    return jsonify({
        "message": "Login successful",
        "accessToken": access,
        "refreshToken": refresh
    }), 200


@app.route('/api/userLogout', methods=['POST'])
@jwt_required()
def userLogout():
    return jsonify({"message": "Logged out successfully"}), 200


@app.route('/api/addHistory', methods=['POST'])
@jwt_required()
def addHistory():
    user_id = get_jwt_identity()

    try:
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({"error": "User not found"}), 404
    except:
        return jsonify({"error": "Invalid user ID"}), 400

    data = request.get_json(silent=True) or {}

    restaurantId = data.get("restaurantId")
    restaurantName = data.get("restaurantName")
    location = data.get("location", {})
    notes = data.get("notes", "")

    if not restaurantId or not restaurantName:
        return jsonify({"error": "restaurantId and restaurantName required"}), 400

    doc = {
        "userId": ObjectId(user_id),
        "restaurantId": restaurantId,
        "restaurantName": restaurantName,
        "location": location,
        "notes": notes,
        "visitedAt": datetime.now(timezone.utc)
    }

    restHistory_collection.insert_one(doc)

    return jsonify({"message": "History added"}), 201

@app.route('/api/getHistory', methods=['GET'])
@jwt_required()
def getHistory():
    user_id = get_jwt_identity()

    try:
        ObjectId(user_id)
    except:
        return jsonify({"error": "Invalid user ID"}), 400

    docs = list(
        restHistory_collection.find({"userId": ObjectId(user_id)})
        .sort("visitedAt", -1)
    )

    for d in docs:
        d["_id"] = str(d["_id"])
        d["userId"] = str(d["userId"])

    return jsonify({"history": docs}), 200


if __name__ == '__main__': 
    app.run (debug=True)