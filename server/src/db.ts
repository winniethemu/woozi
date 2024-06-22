import mongoose, { Document, Schema, Types } from 'mongoose';

import { GameStatus } from './types.js';

interface IUser extends Document {
  name: string;
}

interface IMove extends Document {
  player: IUser;
  position: [number, number];
}

interface IGame extends Document {
  code: string;
  moves: Array<IMove>;
  players: Types.DocumentArray<IUser>;
  status: GameStatus;
}

/**
 * Schemas
 */
const userSchema = new Schema({
  name: { type: String, required: true },
});

const moveSchema = new Schema({
  player: userSchema,
  position: [Number],
});

const gameSchema = new Schema({
  code: { type: String, required: true, unique: true },
  moves: [moveSchema],
  players: [userSchema],
  status: { type: String, required: true },
});

/**
 * Models
 */
const User = mongoose.model<IUser>('User', userSchema);
const Move = mongoose.model<IMove>('Move', moveSchema);
const Game = mongoose.model<IGame>('Game', gameSchema);

export { User, Move, Game };
