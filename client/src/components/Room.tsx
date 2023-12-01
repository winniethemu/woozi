import React from 'react';

import { useAppContext } from '../App';
import { SocketMessage } from '../types';

export default function Room() {
  const [room, setRoom] = React.useState(null);
  const { socket } = useAppContext();
  const code = sessionStorage.getItem('code');
  const userId = sessionStorage.getItem('userId');

  React.useEffect(() => {
    socket.on(SocketMessage.USER_CONNECTED, ({ room }) => {
      setRoom(room);
    });
    socket.on(SocketMessage.USER_DISCONNECTED, ({ room }) => {
      setRoom(room);
    });
    socket.auth = { code, userId };
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [socket, code, userId]);

  return (
    <div>
      {room && (
        <>
          <header>
            <h1>Room {room.code}</h1>
          </header>
          <ol>
            {room.users.map((user: string) => (
              <li key={user}>{user}</li>
            ))}
          </ol>
        </>
      )}
    </div>
  );
}