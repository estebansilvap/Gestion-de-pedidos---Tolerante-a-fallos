from flask import Flask, request, send_from_directory, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app) 

servers = [
    "http://localhost:5000",
    "http://localhost:5001"
]

current = 0

@app.route('/')
def home():
    return send_from_directory('../frontend', 'index.html')

@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory('../frontend', filename)

@app.route('/api/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def balancear(path):
    global current
    server = servers[current]
    current = (current + 1) % len(servers)
    url = f"{server}/api/{path}"
    print(f"Petición enviada a {server}")

    try:
        response = requests.request(
            method=request.method,
            url=url,
            data=request.form
        )

        # ← solo reenvía Content-Type, no todos los headers
        return response.content, response.status_code, {
            'Content-Type': response.headers.get('Content-Type', 'application/json')
        }

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=8000, debug=True)