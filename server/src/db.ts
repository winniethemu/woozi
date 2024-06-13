import { createClient } from 'redis';
import { Repository } from 'redis-om';

import { gameSchema, userSchema } from './models.js';

const redisClient = createClient();
redisClient.on('error', (err) => console.error('Redis Client Error', err));
await redisClient.connect();

const userRepository = new Repository(userSchema, redisClient);
const gameRepository = new Repository(gameSchema, redisClient);

export { redisClient, userRepository, gameRepository };
