import React from 'react';
import { useLocalStorage } from 'usehooks-ts';

import { SERVER_ROOT, USER_ID_KEY, USER_NAME_KEY } from '../consts';
import { useSocket } from '../contexts/SocketContext';

import './Home.css';

function Home() {
  const [userId] = useLocalStorage(USER_ID_KEY, null);
  const [userName, setUserName] = useLocalStorage(USER_NAME_KEY, '');
  const [name, setName] = React.useState(userName);
  useSocket();

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
          <button>Create Game</button>
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
