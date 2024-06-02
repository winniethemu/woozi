import React from 'react';

import './Home.css';

function Home() {
  return (
    <div>
      <header>
        <h1>Welcome to Woozi!</h1>
      </header>
      <main>
        <button>Update Name</button>
        <button>Create Game</button>
        <button>Join Game</button>
        <button>Random Match</button>
      </main>
    </div>
  );
}

export default Home;
