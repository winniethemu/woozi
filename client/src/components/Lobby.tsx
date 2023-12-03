import React from 'react';
import { useNavigate } from 'react-router-dom';

import './Lobby.css';
import { SERVER_BASE_URL } from '../const';

export default function Lobby() {
  const [showUpdateName, setShowUpdateName] = React.useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  function onboard(code: string, userId: string) {
    localStorage.setItem('code', code);
    localStorage.setItem('userId', userId);
    if (!localStorage.getItem('name')) {
      setShowUpdateName(true);
    } else {
      navigate(`/room/${code}`);
    }
  }

  function handleJoin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const code = data.get('code')?.toString();
    if (!code) return; // TODO: provide error message
    fetch(`${SERVER_BASE_URL}/api/rooms/${code.toUpperCase()}/join`, {
      headers: {
        'X-User-ID': userId || '',
      },
    })
      .then((res) => res.json())
      .then((json) => onboard(json.room.code, json.userId));
  }

  function handleCreate() {
    fetch(`${SERVER_BASE_URL}/api/rooms`, {
      method: 'POST',
      headers: {
        'X-User-ID': userId || '',
      },
    })
      .then((res) => res.json())
      .then((json) => onboard(json.code, json.userId));
  }

  function handleUpdateName(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const code = localStorage.getItem('code');
    const data = new FormData(e.currentTarget);
    const name = data.get('username')?.toString();
    if (!name) return; // TODO: provide error message
    const userId = localStorage.getItem('userId');
    fetch(`${SERVER_BASE_URL}/api/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-User-ID': userId || '',
      },
      body: JSON.stringify({ name, code }),
    })
      .then((res) => res.json())
      .then(() => {
        localStorage.setItem('name', name);
        const roomCode = localStorage.getItem('code');
        navigate(`/room/${roomCode}`);
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
