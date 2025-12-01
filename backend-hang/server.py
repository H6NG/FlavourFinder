from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import psycopg2
import os

load_dotenv(); 

db_host = os.getenv("db_host")
db_name = os.getenv("db_name")
db_user = os.getenv("db_user")
db_password = os.getenv("db_password")
db_port = os.getenv("db_port")

app = Flask(__name__); 
CORS(app); 


# Connection with the SQL postgres database 

connection =  psycopg2.connect(
    host=db_host,
    dbname=db_name,
    user=db_user,
    password=db_password, 
    port=db_port
)

# Routes

@app.route('/')
def home():
    return "For DEBUGGING: Flask backend connected to MongoDB securely."

@app.route('/api/refreshToken', methods=['GET'])
def refreshToken(): 




@app.route('/api/getChoice', methods = ['GET'])
def getChoice():


@app.route('/api/makeChoice', methods = ['POST'])
def makeChoice():



@app.route('/api/recommendRestaurauntGuest', methods = ['POST'])
def recommendRestaurantGuest(): 


@app.route('/api/recommendRestaurauntUser', methods = ['POST'])
def recommendRestaurantUser():


@app.route('/api/changePassword', methods = ['PUT'])
def changePassword():


@app.route('/api/deleteAccount', methods = ['DELETE'])
def deleteAccount():


@app.route('/api/getPreferences', methods = ['GET'])
def getPreferences():
    

@app.route('/api/getUserSelf', methods = ['GET'])
def getUserSelf():


@app.route('/api/registerUser', methods = ['POST'])
def registerUser():


@app.route('/api/updatePreferences', methods = ['PUT'])
def updatePreferences():

@app.route('/api/updateUserInfo', methods = ['POST'])
def updateUserInfo():


@app.route('/api/userLogin', methods = ['POST'])
def userLogin():


@app.route('/api/userLogout', methods = ['POST'])
def userLogout():



if __name__ == '__main__': 
    app.run (debug=True)