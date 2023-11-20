import React from 'react';
import { io } from 'socket.io-client';

import { SocketMessage } from '../../types';
import './App.css';

const socket = io('http://localhost:8000', { autoConnect: false });

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
  }, []);

  function handleJoinRoom(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    console.log(data.get('code'));
  }

  function handleCreateRoom() {
    // handle create room
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
