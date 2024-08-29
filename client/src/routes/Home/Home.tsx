import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';

import { GameData } from '../../types';
import { SERVER_ROOT, USER_ID_KEY, USER_NAME_KEY } from '../../consts';

import './Home.css';

function Home() {
  const [userId, setUserId] = useLocalStorage<string | null>(USER_ID_KEY, null);
  const [userName, setUserName] = useLocalStorage<string>(USER_NAME_KEY, '');
  const [name, setName] = React.useState<string>(userName);
  const [code, setCode] = React.useState<string>('');
  const navigate = useNavigate();

  React.useEffect(() => {
    fetch(`${SERVER_ROOT}/api/users/${userId}`)
      .then((res) => res.json())
      .then((json) => {
        setUserId(json.id);
        setUserName(json.name);
      });
  }, [userId, setUserId, setUserName]);

  function updateName() {
    fetch(`${SERVER_ROOT}/api/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    }).then(() => {
      setUserName(name);
    });
  }

  function createGame() {
    fetch(`${SERVER_ROOT}/api/games`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    })
      .then((res) => res.json())
      .then((data: GameData) => {
        navigate(`/games/${data.code}`, { state: data });
      });
  }

  function joinGame() {
    fetch(`${SERVER_ROOT}/api/games/${code.toUpperCase()}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    })
      .then((res) => res.json())
      .then((data: GameData) => {
        navigate(`/games/${data.code}`, { state: data });
      });
  }

  return (
    <div>
      <header>
        <h1>Welcome to Woozi, {userName}!</h1>
      </header>
      <main>
        <div>
          <button onClick={updateName}>Update Name</button>
          <input
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
          />
        </div>
        <div>
          <button onClick={createGame}>Create Game</button>
        </div>
        <div>
          <button onClick={joinGame}>Join Game</button>
          <input
            value={code}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCode(e.target.value)
            }
          />
        </div>
        <div>
          <button>Random Match</button>
        </div>
      </main>
    </div>
  );
}

export default Home;
