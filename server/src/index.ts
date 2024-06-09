import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

import { CLIENT_ROOT, PORT } from './consts';
import { MessageType } from './types';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: CLIENT_ROOT,
  },
});

// TODO: use Redis
const users: Record<string, any> = {};

io.use((socket, next) => {
  let token = socket.handshake.auth.token;
  if (token === null) {
    token = uuidv4();
    users[token] = { name: 'Anonymous User' };
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
