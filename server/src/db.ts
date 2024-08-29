import mongoose, { Document, Schema, Types } from 'mongoose';

import { GameStatus, StoneType } from './types.js';

interface IUser extends Document {
  name: string;
}

interface Player {
  color: StoneType;
  userId: Types.ObjectId;
}

interface Move {
  player: Player;
  position: [number, number];
}

interface IGame extends Document {
  code: string;
  moves: Array<Move>;
  players: Array<Player>;
  status: GameStatus;
}

/**
 * Schemas
 */
const userSchema = new Schema({
  name: { type: String, required: true },
  // TODO: online or idle status? useful for random match
});

const playerSchema = new Schema({
  color: { type: String, required: true },
  userId: { type: Types.ObjectId, required: true },
});

const moveSchema = new Schema({
  player: playerSchema,
  position: [Number],
});

const gameSchema = new Schema({
  code: { type: String, required: true, unique: true },
  moves: [moveSchema],
  players: [playerSchema],
  status: { type: String, required: true },
});

/**
 * Models
 */
const Game = mongoose.model<IGame>('Game', gameSchema);
const User = mongoose.model<IUser>('User', userSchema);

export { Game, User };
