import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import mongoose from 'mongoose';
import { Server } from 'socket.io';

import apiRouter from './routes/api';
import { authHandler } from './socket';
import { CLIENT_BASE_URL, corsOptions } from './const';
import { SessionSocket, SocketMessage } from './types';
import { leaveRoom } from './controllers/roomsController';
// import { updateUserName } from './controllers/usersController';

// Read env variables from .env
dotenv.config();

const app: Express = express();
const server = http.createServer(app);
const port = process.env.PORT;

// Set up DB
async function db() {
  await mongoose.connect(process.env.DB_URL || '');
}
db().catch((err) => console.log(err));

// HTTP API server
app.use(express.json());
app.use(cors(corsOptions));
app.use('/api', apiRouter);

// Websocket server
const io = new Server(server, {
  cors: {
    origin: CLIENT_BASE_URL,
  },
});
io.use(authHandler);
io.on('connection', async function handleConnect(socket: SessionSocket) {
  // validated during authHandler
  const room = socket.room!;
  const user = socket.user!;

  socket.join(room.code);
  io.to(room.code).emit(SocketMessage.USER_CONNECTED, {
    user,
    room,
  });

  socket.on('disconnect', async (reason) => {
    const updatedRoom = await leaveRoom(room.code, [user]);
    io.to(room.code).emit(SocketMessage.USER_DISCONNECTED, {
      user,
      room: updatedRoom,
    });
  });

  // socket.on('user_name_update', async (newName: string) => {
  //   console.log(newName);
  //   user = await updateUserName(newName, user)
  //   socket.user = user
  //   io.to(room.code).emit(SocketMessage.USER_NAME_UPDATED, {
  //     user,
  //   });
  // });
});

// Start up
server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
