import { Request } from 'express';
import { IUser } from './models/user';
import { Socket } from 'socket.io';

export enum SocketMessage {
  INVALID_USER = 'INVALID_USER',
  USER_CONNECTED = 'USER_CONNECTED',
}

export interface SessionRequest extends Request {
  user?: IUser;
}

export interface SessionSocket extends Socket {
  userId?: string;
}
