from http.server import BaseHTTPRequestHandler
from datetime import datetime, timedelta
from pymongo import MongoClient
import json
import os

# MongoDB connection
uri = os.environ.get('MONGODB_URI')
client = MongoClient(uri)
db = client['ssec_gate_attendance']

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        
        response = {
            'message': 'API is working!',
            'timestamp': datetime.now().isoformat()
        }
        
        self.wfile.write(json.dumps(response).encode())
        return

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data)
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        
        response = {
            'message': 'Data received',
            'data': data
        }
        
        self.wfile.write(json.dumps(response).encode())
        return