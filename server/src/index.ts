import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { Server as SocketServer } from 'socket.io';
import { createServer } from 'node:http';

import SocketHandler from './socket.js';
import apiRouter from './api.js';
import { CLIENT_ROOT, PORT, MONGODB_URL } from './consts.js';
import { User } from './db.js';

// HTTP server
const app = express();
const server = createServer(app);

// DB
async function db() {
  await mongoose.connect(MONGODB_URL || '');
}
db().catch((err) => console.error(err));

// Middleware
app.use(express.json());
app.use(cors({ origin: CLIENT_ROOT }));
app.use('/api', apiRouter);

// Socket server
export const io = new SocketServer(server, {
  cors: { origin: CLIENT_ROOT },
});
const socketHandler = new SocketHandler(io);

io.use(async (socket, next) => {
  const token = socket.handshake.auth.token || '';
  const userExists = await User.exists({ _id: token });
  if (!userExists) {
    return next(new Error('bad socket handshake: user not found'));
  }
  next();
});

io.on('connection', (socket) => {
  console.log(`client connection: socket ${socket.id}`);

  socket.onAny((event: string, payload) => {
    console.log(
      `message received: ${event}, ${JSON.stringify(payload, null, 2)}`
    );
    socketHandler.handleMessage(socket, { type: event, payload });
  });
});

// Start up
server.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});
