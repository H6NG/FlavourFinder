from flask import Flask, request, jsonify
from flask import CORS

from dotenv import load_dotenv

load_dotenv(); 

app = Flask(__name__); 

@app.route('/')