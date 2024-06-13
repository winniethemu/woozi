import { useParams } from 'react-router-dom';

export default function Game() {
  const { code } = useParams();
  return <p>Welcome to the game {code}!</p>;
}
