import React from 'react';
import { useNavigate } from 'react-router-dom';

import './Lobby.css';
import { SERVER_BASE_URL } from '../const';

export default function Lobby() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  function onboard(code: string, userId: string) {
    localStorage.setItem('code', code);
    localStorage.setItem('userId', userId);
    navigate(`/room/${code}`);
  }

  function handleJoin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const code = data.get('code')?.toString();
    if (!code) return; // TODO: provide error message
    fetch(`${SERVER_BASE_URL}/api/rooms/${code.toUpperCase()}/join`, {
      headers: {
        'X-User-Id': userId || '',
      },
    })
      .then((res) => res.json())
      .then((json) => onboard(json.room.code, json.userId));
  }

  function handleCreate() {
    fetch(`${SERVER_BASE_URL}/api/rooms`, {
      method: 'POST',
      headers: {
        'X-User-Id': userId || '',
      },
    })
      .then((res) => res.json())
      .then((json) => onboard(json.code, json.userId));
  }

  return (
    <div>
      <section>
        <form onSubmit={handleJoin}>
          <input name="code"></input>
          <button type="submit">Join Room</button>
        </form>
      </section>
      <section>
        <button onClick={handleCreate}>Create Room</button>
      </section>
    </div>
  );
}
