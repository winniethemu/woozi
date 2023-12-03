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
import { Socket } from 'dgram';
import User, { IUser } from './models/user';
import Room from './models/room';

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
    room,
  });

  socket.on(
    SocketMessage.UPDATE_USER_NAME,
    async function handleUpdateName(name: string) {
      const query = { code: room.code, 'users._id': user._id };
      const update = { $set: { 'users.$.name': name } };
      const updatedRoom = await Room.findOneAndUpdate(query, update, {
        new: true,
      });

      await User.findOneAndUpdate(
        { _id: user._id },
        {
          $set: { name },
        }
      );

      io.to(room.code).emit(SocketMessage.UPDATE_USER_NAME, {
        room: updatedRoom,
      });
    }
  );

  socket.on('disconnect', async (reason) => {
    const updatedRoom = await leaveRoom(room.code, [user]);
    io.to(room.code).emit(SocketMessage.USER_DISCONNECTED, {
      room: updatedRoom,
    });
  });
});

// Start up
server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
