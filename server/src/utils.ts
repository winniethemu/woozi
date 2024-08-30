import { ALPHA_NUM } from './consts.js';
import { GameStatus, IGame, StoneType } from './types.js';

function random(max: number, min = 0): number {
  return Math.floor(Math.random() * (max - min) + min);
}

export function createGameCode(): string {
  let code = '';
  for (let i = 0; i < 4; i++) {
    const char = ALPHA_NUM[random(ALPHA_NUM.length)];
    code += char;
  }
  return code;
}

export function randomColor() {
  const colors = [StoneType.BLACK, StoneType.WHITE];
  const index = random(2);
  return colors[index];
}

export function isParticipant(userId: string, game: IGame) {
  const { players } = game;
  return players.filter((player) => player.userId.equals(userId)).length > 0;
}

export function missingOpponent(game: IGame) {
  return game.players.length === 1 && game.status === GameStatus.PENDING;
}
