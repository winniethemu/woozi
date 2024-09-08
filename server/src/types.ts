import { Document, Types } from 'mongoose';

export enum MessageType {
  JOIN_GAME = 'JOIN_GAME',
  PLACE_STONE = 'PLACE_STONE',
  SET_USER = 'SET_USER',
  SYNC_GAME = 'SYNC_GAME',
  TIMER_COUNTDOWN = 'TIMER_COUNTDOWN',
}

export enum GameStatus {
  PENDING = 'PENDING',
  PLAYING = 'PLAYING',
  COMPLETED = 'COMPLETED',
}

export enum StoneType {
  BLACK = 'black',
  WHITE = 'white',
}

export interface IUser extends Document {
  name: string;
}

export interface Player {
  color: StoneType;
  userId: Types.ObjectId;
}

export interface Move {
  player: Player;
  position: [number, number];
}

export interface IGame extends Document {
  code: string;
  moves: Array<Move>;
  players: Array<Player>;
  status: GameStatus;
  turn: StoneType;
}

export interface SocketMessage {
  type: string;
  payload: any;
}
