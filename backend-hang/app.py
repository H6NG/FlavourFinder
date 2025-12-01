from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity
)
from passlib.hash import bcrypt
import psycopg2
import os

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


# Connection with the SQL postgres database 
try: 
    connection =  psycopg2.connect(
        host=db_host,
        dbname=db_name,
        user=db_user,
        password=db_password, 
        port=db_port
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
    data = request.get_json()

    email = data.get("email")
    userName = data.get("userName")
    password = data.get("password")
    token = data.get("token")
    firstName = data.get("firstName", "Hang")   
    lastName = data.get("lastName", "Liu")
    preferenceID = None

    if not email or not userName or not password:
        return jsonify({"error": "Missing required fields."}), 400

    hashed_pw = bcrypt.hash(password)

    try:
        cur = connection.cursor()
        cur.execute("""
            INSERT INTO "User"
            (email, userName, saltedHashedPW, firstName, lastName, userPreferenceID)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING id;
        """, (email, userName, hashed_pw, firstName, lastName, preferenceID))

        user_id = cur.fetchone()[0]
        connection.commit()
        cur.close()
        connection.close()

        access_token = create_access_token(identity=user_id)

        return jsonify({
            "id": user_id,
            "email": email,
            "name": userName,
            "token": access_token
        }), 201

    except Exception as e:
        print("Database error:", e)
        return jsonify({"error": "User may already exist!"}), 409

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