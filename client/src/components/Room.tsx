import React from 'react';

import { useAppContext } from '../App';
import { IRoom, IUser, SocketMessage } from '../types';

export default function Room() {
  const [room, setRoom] = React.useState<IRoom | null>(null);
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
    // socket.on(SocketMessage.UPDATE_USER_NAME, ({ room }) => {
    //   setRoom(room);
    // });
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
            {room.users.map((user: IUser) => (
              <li key={user._id}>{user.name}</li>
            ))}
          </ol>
        </>
      )}
    </div>
  );
}
