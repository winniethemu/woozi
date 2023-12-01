import React from 'react';
import { useNavigate } from 'react-router-dom';

import './Lobby.css';
import { SERVER_BASE_URL } from '../const';

export default function Lobby() {
  const navigate = useNavigate();

  function goToRoom(code: string, userId: string) {
    sessionStorage.setItem('code', code);
    sessionStorage.setItem('userId', userId);
    navigate(`/room/${code}`);
  }

  function handleJoinRoom(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const code = data.get('code')?.toString() ?? '';
    fetch(`${SERVER_BASE_URL}/api/rooms/${code.toUpperCase()}/join`)
      .then((res) => res.json())
      .then((json) => goToRoom(json.room.code, json.userId));
  }

  function handleCreateRoom() {
    fetch(`${SERVER_BASE_URL}/api/rooms`, {
      method: 'POST',
    })
      .then((res) => res.json())
      .then((json) => goToRoom(json.code, json.userId));
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
