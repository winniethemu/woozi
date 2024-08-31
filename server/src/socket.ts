import { Server, Socket } from 'socket.io';

import { MessageType, SocketMessage } from './types.js';

export default class SocketHandler {
  io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  handleMessage(socket: Socket, message: SocketMessage) {
    if (!message.type || !message.payload) {
      console.warn('bad socket message: missing type or payload', message);
    }

    switch (message.type) {
      case MessageType.JOIN_ROOM: {
        socket.join(message.payload);
        break;
      }
      default: {
        throw new Error(`bad socket message: invalid type ${message.type}`);
      }
    }
  }
}
