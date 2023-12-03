import { Request } from 'express';
import { IUser } from './models/user';
import { Socket } from 'socket.io';
import { IRoom } from './models/room';

/**
 * Shared type defs with client
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
 * Server type defs
 */
export interface SessionRequest extends Request {
  user?: IUser;
}

export interface SessionSocket extends Socket {
  room?: IRoom;
  user?: IUser;
}
