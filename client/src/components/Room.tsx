import React from 'react';

import { useAppContext } from '../App';
import { SocketMessage } from '../types';

export default function Room() {
  const [room, setRoom] = React.useState(null);
  const [userName, setUserName] = React.useState(sessionStorage.getItem('userName'));
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
    socket.on(SocketMessage.USER_NAME_UPDATED, ({ user }) => {
      setUserName(user.name);
      sessionStorage.setItem('userName', user.name);
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
    const name = data.get('name')?.toString() ?? '';
    socket.emit("user_name_update", name);
  }

  let screen;
  if (userName) {
    screen = (
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
  } else {
    screen = (
      <div>
        <label>Your Name</label>
        <form onSubmit={handleUpdateName}>
          <input name="name" type="text"></input>
          <button type="submit">Save</button>
        </form>
      </div>
    );
  }

  return screen;
}
