import express, { Express, Request, Response } from 'express';
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

const port = process.env.PORT;

// Use the routes defined in routes/index.js
app.use('/', indexRouter);

io.on('connection', (socket) => {
  console.log('user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
