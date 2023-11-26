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
    console.log(data.get('code'));
  }

  function handleCreateRoom() {
    fetch(`${SERVER_BASE_URL}/api/rooms`, {
      method: 'POST',
      mode: 'cors',
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
      });
  }

  return (
    <>
      {inGame ? (
        <p>We are in!</p>
      ) : (
        <form onSubmit={handleJoinRoom}>
          <input name="code" type="text"></input>
          <button type="submit">Join</button>
          <button onClick={handleCreateRoom}>Create</button>
        </form>
      )}
    </>
  );
}

export default App;
