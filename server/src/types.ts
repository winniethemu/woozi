import { Request } from 'express';
import { IUser } from './models/user';

export enum SocketMessage {
  INVALID_USER = 'INVALID_USER',
}

export interface SessionRequest extends Request {
  user?: IUser;
}
