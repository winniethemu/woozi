import express, { Express } from 'express';
const app: Express = express();

import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
const server = http.createServer(app);

import { Server } from 'socket.io';
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

import indexRouter from './routes/api';
import socketHandler from './middlewares/socket';

const port = process.env.PORT;

app.use('/', indexRouter);
io.use(socketHandler);

server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
