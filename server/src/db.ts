import { createClient } from 'redis';
import { Repository, Schema } from 'redis-om';

/**
 * Init DB
 */
const redisClient = createClient();
redisClient.on('error', (err) => console.error('Redis Client Error', err));
await redisClient.connect();

/**
 * Schemas
 */
const userSchema = new Schema('user', {
  name: { type: 'string' },
});

const gameSchema = new Schema('game', {
  code: { type: 'string' },
  players: { type: 'string[]' },
});

/**
 * Repositories
 */
const userRepository = new Repository(userSchema, redisClient);
const gameRepository = new Repository(gameSchema, redisClient);

export { redisClient, userRepository, gameRepository };
