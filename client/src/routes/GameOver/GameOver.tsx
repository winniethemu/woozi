import { useLocation, useNavigate } from 'react-router-dom';

export default function GameOver() {
  const { state } = useLocation();
  const navigate = useNavigate();

  function handleRematch() {
    // TODO: reset game on server
    navigate(`/games/${state.code}`);
  }

  function handleExit() {
    // TODO: clean up game on server
    navigate(`/`);
  }

  return (
    <div>
      <h1>Game Over!</h1>
      <h2>{state.winner.color} has won.</h2>
      <button onClick={handleRematch}>Rematch</button>
      <button onClick={handleExit}>Exit</button>
    </div>
  );
}
