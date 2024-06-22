import mongoose, { Document, Schema, Types } from 'mongoose';

import { GameStatus, StoneType } from './types.js';

interface IUser extends Document {
  name: string;
}

interface IPlayer extends IUser {
  color: StoneType;
  userId: Types.ObjectId;
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

const playerSchema = new Schema({
  color: String,
  userId: Types.ObjectId,
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
const Move = mongoose.model<IMove>('Move', moveSchema);
const Player = mongoose.model<IPlayer>('Player', playerSchema);
const User = mongoose.model<IUser>('User', userSchema);

export { Game, Move, Player, User };
