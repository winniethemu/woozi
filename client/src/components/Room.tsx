import React from 'react';

import { IRoom, IUser, SocketMessage } from '../types';
import { useAppContext } from '../App';

export default function Room() {
  const [room, setRoom] = React.useState<IRoom | null>(null);
  const [showUpdateName, setShowUpdateName] = React.useState<boolean>(() => {
    const value = sessionStorage.getItem('name');
    return !value;
  });
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

    socket.on(SocketMessage.UPDATE_USER_NAME, ({ room }) => {
      setRoom(room);
    });

    socket.auth = { code, userId };
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [socket, code, userId]);

  function handleUpdateName(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = data.get('username')?.toString();
    if (!name) return; // TODO: provide error message
    socket.emit(SocketMessage.UPDATE_USER_NAME, name);
    sessionStorage.setItem('name', name);
    setShowUpdateName(false);
  }

  return (
    <div>
      {showUpdateName ? (
        <form onSubmit={handleUpdateName}>
          <input name="username"></input>
          <button type="submit">Update Name</button>
        </form>
      ) : (
        room && (
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
        )
      )}
    </div>
  );
}
