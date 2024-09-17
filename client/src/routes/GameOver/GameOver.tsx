import { Flex } from '@radix-ui/themes';
import { useLocation, useNavigate } from 'react-router-dom';

import { SERVER_ROOT } from '../../consts';

export default function GameOver() {
  const { state } = useLocation();
  const navigate = useNavigate();

  function handleRematch() {
    // TODO: reset game on server
    navigate(`/games/${state.code}`);
  }

  async function handleExit() {
    try {
      await fetch(`${SERVER_ROOT}/api/games/${state.code}`, {
        method: 'DELETE',
      });
      navigate('/');
    } catch (err) {
      // no op
    }
  }

  return (
    <div>
      <h1>Game Over!</h1>
      <h2>{state.winner.color} has won.</h2>
      <Flex gap="3">
        <button onClick={handleRematch}>Rematch</button>
        <button onClick={handleExit}>Exit</button>
      </Flex>
    </div>
  );
}
