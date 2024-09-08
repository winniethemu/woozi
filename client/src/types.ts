import { Socket } from 'socket.io-client';

export interface SocketContextType {
  socket: Socket;
}

export type GameBoard = Array<Array<StoneType | ''>>;

export enum MessageType {
  JOIN_GAME = 'JOIN_GAME',
  PLACE_STONE = 'PLACE_STONE',
  SET_USER = 'SET_USER',
  SYNC_GAME = 'SYNC_GAME',
  TIMER_COUNTDOWN = 'TIMER_COUNTDOWN',
}

export enum CellType {
  BOTTOM_EDGE = 'BOTTOM_EDGE',
  BOTTOM_LEFT_CORNER = 'BOTTOM_LEFT_CORNER',
  BOTTOM_RIGHT_CORNER = 'BOTTOM_RIGHT_CORNER',
  LEFT_EDGE = 'LEFT_EDGE',
  MIDDLE = 'MIDDLE',
  RIGHT_EDGE = 'RIGHT_EDGE',
  TOP_EDGE = 'TOP_EDGE',
  TOP_LEFT_CORNER = 'TOP_LEFT_CORNER',
  TOP_RIGHT_CORNER = 'TOP_RIGHT_CORNER',
}

export enum StoneType {
  BLACK = 'black',
  WHITE = 'white',
}

export enum GameStatus {
  PENDING = 'PENDING',
  PLAYING = 'PLAYING',
  COMPLETED = 'COMPLETED',
}

export interface Player {
  userId: string;
  color: StoneType;
}

export interface Move {
  player: Player;
  position: [number, number];
}

export interface GameData {
  code: string;
  players: Player[];
  moves: Move[];
  status: GameStatus;
  turn: StoneType;
}
