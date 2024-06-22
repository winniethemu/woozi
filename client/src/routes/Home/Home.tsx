import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';

import { SERVER_ROOT, USER_ID_KEY, USER_NAME_KEY } from '../../consts';

import './Home.css';

function Home() {
  const [userId, setUserId] = useLocalStorage(USER_ID_KEY, null);
  const [userName, setUserName] = useLocalStorage(USER_NAME_KEY, '');
  const [name, setName] = React.useState(userName);
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
      .then(({ code, color }) => {
        navigate(`/games/${code}`, { state: { code, color } });
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
          <button>Join Game</button>
        </div>
        <div>
          <button>Random Match</button>
        </div>
      </main>
    </div>
  );
}

export default Home;
