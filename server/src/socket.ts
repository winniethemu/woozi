import { Server, Socket } from 'socket.io';

import { MessageType, SocketMessage } from './types.js';
import { Game } from './db.js';

export default class SocketHandler {
  io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  async handleMessage(socket: Socket, message: SocketMessage) {
    if (!message.type || !message.payload) {
      console.error(`bad socket message: ${message}`);
      return;
    }

    // TODO: granular message format validation?

    switch (message.type) {
      case MessageType.JOIN_ROOM: {
        socket.join(message.payload);
        break;
      }
      case MessageType.PLACE_STONE: {
        const { code, move } = message.payload;
        const game = await Game.findOne({ code });
        if (game) {
          game.moves.push(move);
          await game.save();
          socket.to(code).emit(MessageType.PLACE_STONE, move);
        }
        break;
      }
    }
  }
}
