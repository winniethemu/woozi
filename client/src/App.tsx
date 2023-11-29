import React from 'react';
import { io } from 'socket.io-client';

import './App.css';
import { SERVER_BASE_URL } from './const';
import { SocketMessage } from './types';

const socket = io(SERVER_BASE_URL, { autoConnect: false });

function App() {
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
        const { room, userId } = json;
        sessionStorage.setItem('code', room.code);
        sessionStorage.setItem('userId', userId);
        socket.auth = { code: room.code, userId };
        socket.connect();
      });
  }

  function handleCreateRoom() {
    fetch(`${SERVER_BASE_URL}/api/rooms`, {
      method: 'POST',
    })
      .then((res) => res.json())
      .then((json) => {
        const { code, userId } = json;
        sessionStorage.setItem('code', code);
        sessionStorage.setItem('userId', userId);
        socket.auth = { code, userId };
        socket.connect();
      });
  }

  return (
    <>
      <form onSubmit={handleJoinRoom}>
        <input name="code" type="text"></input>
        <button type="submit">Join</button>
      </form>
      <button onClick={handleCreateRoom}>Create</button>
    </>
  );
}

export default App;
