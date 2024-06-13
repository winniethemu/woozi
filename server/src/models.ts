import { Repository, Schema } from 'redis-om';

export const userSchema = new Schema('user', {
  name: { type: 'string' },
});

export const gameSchema = new Schema('game', {
  code: { type: 'string' },
  players: { type: 'string[]' },
});
