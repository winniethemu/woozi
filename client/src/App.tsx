import React from 'react';
import { io } from 'socket.io-client';

import './App.css';
import { SERVER_BASE_URL } from './const';
import { SocketMessage } from './types';

const socket = io(SERVER_BASE_URL, { autoConnect: false });

function App() {
  const [inGame, setInGame] = React.useState(false);

  React.useEffect(() => {
    socket.on('connect_error', (err) => {
      if (err.message === SocketMessage.INVALID_USER) {
        console.log('invalid user');
      }
    });

    socket.onAny((event, ...args) => {
      console.log(event, args);
    });

    return () => {
      socket.off('connect_error');
    };
  }, []);

  function handleJoinRoom(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const code = data.get('code')?.toString() ?? '';
    fetch(`${SERVER_BASE_URL}/api/rooms/${code.toUpperCase()}/join`)
      .then((res) => res.json())
      .then((json) => {
        const { userId } = json;
        sessionStorage.setItem('userId', userId);
        socket.auth = { userId };
        socket.connect();
      });
  }

  function handleCreateRoom() {
    fetch(`${SERVER_BASE_URL}/api/rooms`, {
      method: 'POST',
    })
      .then((res) => res.json())
      .then((json) => {
        const { userId, code } = json;
        console.log(code);
        sessionStorage.setItem('userId', userId);
        socket.auth = { userId };
        socket.connect();
      });
  }

  return (
    <>
      {inGame ? (
        <p>We are in!</p>
      ) : (
        <>
          <form onSubmit={handleJoinRoom}>
            <input name="code" type="text"></input>
            <button type="submit">Join</button>
          </form>
          <button onClick={handleCreateRoom}>Create</button>
        </>
      )}
    </>
  );
}

export default App;
