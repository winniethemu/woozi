import { Socket } from 'socket.io-client';

/**
 * Shared type defs with server
 */
export enum SocketMessage {
  INVALID_USER = 'INVALID_USER',
  USER_CONNECTED = 'USER_CONNECTED',
}

/**
 * Client type defs
 */
export interface AppContextType {
  socket: Socket;
}
