import express from 'express';
import { createServer as createHTTPServer } from 'node:http';
import { createClient as createRedisClient } from 'redis';
import { Server as SocketServer } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

import { CLIENT_ROOT, PORT } from './consts.js';
import { MessageType } from './types.js';

const app = express();
const server = createHTTPServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: CLIENT_ROOT,
  },
});

const redisClient = createRedisClient();
redisClient.on('error', (err) => console.error('Redis Client Error', err));
await redisClient.connect();

io.use(async (socket, next) => {
  let token = socket.handshake.auth.token;
  if (token === null) {
    token = uuidv4();
    await redisClient.hSet(token, { name: 'Anonymous User' });
    socket.emit(MessageType.SET_USER_TOKEN, token);
  }
  next();
});

io.on('connection', (socket) => {
  console.log(`client connection: socket ${socket.id}`);
});

server.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});
