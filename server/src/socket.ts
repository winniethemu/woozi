import { Server, Socket } from 'socket.io';

import { MessageType, SocketMessage, StoneType } from './types.js';
import { Game } from './db.js';

export default class SocketHandler {
  io: Server;
  timer: ReturnType<typeof setInterval> | number;

  constructor(io: Server) {
    this.io = io;
    this.timer = 0;
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
        clearInterval(this.timer);

        const { code, move } = message.payload;
        const game = await Game.findOne({ code });
        if (!game) return;

        // update game
        game.moves.push(move);
        game.turn =
          game.turn === StoneType.BLACK ? StoneType.WHITE : StoneType.BLACK;
        await game.save();

        // set up clock
        this.timer = setInterval(() => {
          this.io.to(code).emit(MessageType.TIMER_COUNTDOWN);
        }, 1000);

        // communicate to clients
        socket.broadcast.to(code).emit(MessageType.PLACE_STONE, move);
        this.io.to(code).emit(MessageType.SYNC_GAME, {
          code: game.code,
          players: game.players,
          status: game.status,
          turn: game.turn,
        });
        return;
      }
    }
  }
}
