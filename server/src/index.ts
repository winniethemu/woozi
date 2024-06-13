import express from 'express';
import cors from 'cors';
import { EntityId, EntityKeyName } from 'redis-om';
import { Server as SocketServer } from 'socket.io';
import { createServer } from 'node:http';

import apiRouter from './api.js';
import { redisClient, userRepository } from './db.js';
import { CLIENT_ROOT, PORT } from './consts.js';
import { MessageType } from './types.js';

// HTTP server
const app = express();
const server = createServer(app);
app.use(express.json());
app.use(cors({ origin: CLIENT_ROOT }));
app.use('/api', apiRouter);

// Socket server
const io = new SocketServer(server, {
  cors: { origin: CLIENT_ROOT },
});

io.use(async (socket, next) => {
  const token = socket.handshake.auth.token || '';
  const user = await userRepository.fetch(token);
  const userExists = await redisClient.exists(user[EntityKeyName] as string);
  if (!userExists) {
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

// Start up
server.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});
