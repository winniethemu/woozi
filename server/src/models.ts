import { GameStatus, Move } from './types.js';

export class Game {
  [key: string]: any;
  code: string;
  moves: Array<Move>;
  players: Array<string>;
  status: GameStatus;

  constructor(code: string, players: Array<string> = []) {
    this.code = code;
    this.moves = [];
    this.players = players;
    this.status = GameStatus.PENDING;
  }
}
