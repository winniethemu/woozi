import { Socket } from 'socket.io-client';

/**
 * Shared type defs with server
 */
export enum SocketMessage {
  INVALID_USER = 'INVALID_USER',
  UNKNOWN_ROOM = 'UNKNWON_ROOM',
  UNKNOWN_SOCKET = 'UNKNWON_SOCKET',
  UNKNOWN_USER = 'UNKNWON_USER',
  UPDATE_USER_NAME = 'UPDATE_USER_NAME',
  USER_CONNECTED = 'USER_CONNECTED',
  USER_DISCONNECTED = 'USER_DISCONNECTED',
}

/**
 * Client type defs
 */
export interface AppContextType {
  socket: Socket;
}

export interface IUser {
  _id: string;
  name: string;
}

export interface IRoom {
  _id: string;
  code: string;
  users: IUser[];
}
