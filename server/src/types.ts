export enum MessageType {
  SET_USER = 'SET_USER',
}

export enum GameStatus {
  PENDING = 'PENDING',
  PLAYING = 'PLAYING',
  COMPLETED = 'COMPLETED',
}

export interface Move {
  player: string;
  position: [number, number];
}
