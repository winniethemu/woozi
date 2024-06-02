from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins='*')


@socketio.on('connect')
def connected():
    print("client has connected")


@socketio.on('my event')
def handle_event(message):
    print(message)


if __name__ == '__main__':
    socketio.run(app, debug=True, port=5174)
