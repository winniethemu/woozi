import express from 'express';
import { EntityId, Repository } from 'redis-om';
import { Server as SocketServer } from 'socket.io';
import { createClient as createRedisClient } from 'redis';
import { createServer as createHTTPServer } from 'node:http';
import { v4 as uuidv4 } from 'uuid';

import { CLIENT_ROOT, PORT } from './consts.js';
import { MessageType } from './types.js';
import { userSchema } from './models.js';

const app = express();
const server = createHTTPServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: CLIENT_ROOT,
  },
});

const redis = createRedisClient();
redis.on('error', (err) => console.error('Redis Client Error', err));
await redis.connect();

const userRepository = new Repository(userSchema, redis);

io.use(async (socket, next) => {
  const token = socket.handshake.auth.token || '';
  const user = await userRepository.fetch(token);
  if (!user[EntityId]) {
    const record = await userRepository.save({ name: 'Anonymous User' });
    socket.emit(MessageType.SET_USER, {
      id: record[EntityId],
      name: record.name,
    });
  }
  next();
});

io.on('connection', (socket) => {
  console.log(`client connection: socket ${socket.id}`);
});

server.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});
