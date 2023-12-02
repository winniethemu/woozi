import { Socket } from 'socket.io-client';

/**
 * Shared type defs with server
 */
export enum SocketMessage {
  INVALID_USER = 'INVALID_USER',
  UNKNOWN_ROOM = 'UNKNWON_ROOM',
  UNKNOWN_SOCKET = 'UNKNWON_SOCKET',
  UNKNOWN_USER = 'UNKNWON_USER',
  USER_CONNECTED = 'USER_CONNECTED',
  USER_DISCONNECTED = 'USER_DISCONNECTED',
  USER_NAME_UPDATED = 'USER_NAME_UPDATED',
}

/**
 * Client type defs
 */
export interface AppContextType {
  socket: Socket;
}
