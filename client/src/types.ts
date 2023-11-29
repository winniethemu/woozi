import { Socket } from 'socket.io-client';

export enum SocketMessage {
  INVALID_USER = 'INVALID_USER',
  USER_CONNECTED = 'USER_CONNECTED',
}

export interface AppContextType {
  socket: Socket;
}
