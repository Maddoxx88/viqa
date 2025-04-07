import json
from flask import Flask, jsonify, request

app = Flask(__name__)

# Basic test route
@app.route('/')
def home():
    return "Voice Insurance API is running!"

if __name__ == '__main__':
   app.run(port=8080)