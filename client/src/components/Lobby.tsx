import React from 'react';
import { useNavigate } from 'react-router-dom';

import './Lobby.css';
import { SERVER_BASE_URL } from '../const';

export default function Lobby() {
  const [showUpdateName, setShowUpdateName] = React.useState(false);
  const navigate = useNavigate();

  function onboard(code: string, userId: string) {
    sessionStorage.setItem('code', code);
    sessionStorage.setItem('userId', userId);
    setShowUpdateName(true);
  }

  function handleJoin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const code = data.get('code')?.toString();
    if (!code) return; // TODO: provide error message
    fetch(`${SERVER_BASE_URL}/api/rooms/${code.toUpperCase()}/join`)
      .then((res) => res.json())
      .then((json) => onboard(json.room.code, json.userId));
  }

  function handleCreate() {
    fetch(`${SERVER_BASE_URL}/api/rooms`, {
      method: 'POST',
    })
      .then((res) => res.json())
      .then((json) => onboard(json.code, json.userId));
  }

  function handleUpdateName(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = data.get('username');
    if (!name) return; // TODO: provide error message
    const userId = sessionStorage.getItem('userId');
    fetch(`${SERVER_BASE_URL}/api/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    }).then(() => {
      const code = sessionStorage.getItem('code');
      navigate(`/room/${code}`);
    });
  }

  return (
    <div>
      {showUpdateName ? (
        <form onSubmit={handleUpdateName}>
          <input name="username"></input>
          <button type="submit">Update Name</button>
        </form>
      ) : (
        <>
          <section>
            <form onSubmit={handleJoin}>
              <input name="code"></input>
              <button type="submit">Join Room</button>
            </form>
          </section>
          <section>
            <button onClick={handleCreate}>Create Room</button>
          </section>
        </>
      )}
    </div>
  );
}
