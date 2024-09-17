import { Document, Types } from 'mongoose';

export enum MessageType {
  CONFIRM_UNDO = 'CONFIRM_UNDO',
  JOIN_GAME = 'JOIN_GAME',
  PERFORM_UNDO = 'PERFORM_UNDO',
  PLACE_STONE = 'PLACE_STONE',
  REQUEST_UNDO = 'REQUEST_UNDO',
  SET_USER = 'SET_USER',
  SYNC_GAME = 'SYNC_GAME',
  TIME_OUT = 'TIME_OUT',
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

export type GameBoard = Array<Array<StoneType | ''>>;

export type Vec2 = [number, number];

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
