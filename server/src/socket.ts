import { Server, Socket } from 'socket.io';

import { GameStatus, MessageType, Player, SocketMessage } from './types.js';
import { Game } from './db.js';
import { flipTurn } from './utils.js';

export default class SocketHandler {
  io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  async handleMessage(socket: Socket, message: SocketMessage) {
    // TODO: granular message format validation?
    if (!message.type || !message.payload) {
      console.error(`error: bad socket message: ${message}`);
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
        if (!game) {
          console.error(`error: game ${code} not found`);
          return;
        }

        // update game
        game.moves.push(move);
        game.turn = flipTurn(game.turn);
        await game.save();

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
      case MessageType.TIME_OUT: {
        const { player, game } = message.payload;
        const winner = game.players.filter(
          (p: Player) => p.color !== player.color
        )[0];
        await Game.deleteOne({ code: game.code });
        this.io.to(game.code).emit(MessageType.SYNC_GAME, {
          ...game,
          status: GameStatus.COMPLETED,
          winner,
        });
        return;
      }
      case MessageType.REQUEST_UNDO: {
        const { code } = message.payload;
        // forward request to opponent
        socket.broadcast.to(code).emit(MessageType.REQUEST_UNDO);
        return;
      }
      case MessageType.CONFIRM_UNDO: {
        const { code } = message.payload;
        const game = await Game.findOne({ code });
        if (!game) {
          console.error(`error: game ${code} not found`);
          return;
        }
        const move = game.moves.pop();
        game.turn = flipTurn(game.turn);
        await game.save();
        this.io.to(code).emit(MessageType.SYNC_GAME, {
          code: game.code,
          players: game.players,
          moves: game.moves,
          status: game.status,
          turn: game.turn,
        });
        this.io.to(code).emit(MessageType.PERFORM_UNDO, move);
        return;
      }
    }
  }
}
