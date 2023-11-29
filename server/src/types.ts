import { Request } from 'express';
import { IUser } from './models/user';
import { Socket } from 'socket.io';

/**
 * Shared type defs with client
 */
export enum SocketMessage {
  INVALID_USER = 'INVALID_USER',
  USER_CONNECTED = 'USER_CONNECTED',
}

/**
 * Server type defs
 */
export interface SessionRequest extends Request {
  user?: IUser;
}

export interface SessionSocket extends Socket {
  code?: string;
  userId?: string;
}
