from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
import redis

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins='*')
redis_client = redis.Redis(host='localhost', port=6379, db=0)


@socketio.on('connect')
def connected():
    print("client has connected")


@socketio.on('my event')
def handle_event(message):
    print(message)


if __name__ == '__main__':
    socketio.run(app, debug=True, port=5174)
