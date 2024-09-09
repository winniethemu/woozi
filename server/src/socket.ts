import { Server, Socket } from 'socket.io';

import { MessageType, SocketMessage, StoneType } from './types.js';
import { Game } from './db.js';
import { TIME_TO_MOVE } from './consts.js';

export default class SocketHandler {
  io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  async handleMessage(socket: Socket, message: SocketMessage) {
    // TODO: granular message format validation?
    if (!message.type || !message.payload) {
      console.error(`bad socket message: ${message}`);
      return;
    }

    switch (message.type) {
      case MessageType.JOIN_GAME: {
        const { code } = message.payload;
        socket.join(code);
        return;
      }
      case MessageType.PLACE_STONE: {
        const { code, move } = message.payload;
        const game = await Game.findOne({ code });
        if (!game) return;

        // update game
        game.moves.push(move);
        game.turn =
          game.turn === StoneType.BLACK ? StoneType.WHITE : StoneType.BLACK;
        await game.save();

        // communicate to clients
        socket.broadcast.to(code).emit(MessageType.PLACE_STONE, move);
        this.io.to(code).emit(MessageType.SYNC_GAME, {
          code: game.code,
          players: game.players,
          status: game.status,
          ts: Date.now(),
          turn: game.turn,
        });
        return;
      }
    }
  }
}
