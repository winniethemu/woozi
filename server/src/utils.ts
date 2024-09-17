import { ALPHA_NUM, BOARD_SIZE } from './consts.js';
import {
  GameBoard,
  GameStatus,
  IGame,
  Move,
  Player,
  StoneType,
  Vec2,
} from './types.js';

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

export function flipTurn(turn: StoneType) {
  return turn === StoneType.BLACK ? StoneType.WHITE : StoneType.BLACK;
}

export function winning(board: GameBoard, move: Move): Player | null {
  // horizontal
  if (stretch(board, move, [0, -1], [0, 1]) >= 5) return move.player;

  // vertical
  if (stretch(board, move, [-1, 0], [1, 0]) >= 5) return move.player;

  // left diagonal
  if (stretch(board, move, [-1, -1], [1, 1]) >= 5) return move.player;

  // right diagonal
  if (stretch(board, move, [1, -1], [-1, 1]) >= 5) return move.player;

  return null;
}

function stretch(board: GameBoard, move: Move, dLo: Vec2, dHi: Vec2): number {
  const { position, player } = move;
  let lo = position;
  let hi = position;

  while (true) {
    const [nr, nc] = vadd(lo, dLo);
    if (!outOfBound([nr, nc]) && board[nr][nc] === player.color) {
      lo = [nr, nc];
    } else {
      break;
    }
  }

  while (true) {
    const [nr, nc] = vadd(hi, dHi);
    if (!outOfBound([nr, nc]) && board[nr][nc] === player.color) {
      hi = [nr, nc];
    } else {
      break;
    }
  }

  return Math.max(Math.abs(lo[0] - hi[0]), Math.abs(lo[1] - hi[1])) + 1;
}

function vadd(u: Vec2, v: Vec2): Vec2 {
  return [u[0] + v[0], u[1] + v[1]];
}

function outOfBound(position: Vec2): boolean {
  const [row, col] = position;
  return row < 0 || row > BOARD_SIZE - 1 || col < 0 || col > BOARD_SIZE - 1;
}
