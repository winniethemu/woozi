import express, { Express } from 'express';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';

import apiRouter from './routes/api';
import { connectionHandler, userHandler } from './socket';

const app: Express = express();
const server = http.createServer(app);
const port = process.env.PORT;
dotenv.config();

app.use('/', apiRouter);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
  },
});
io.use(userHandler);
io.on('connection', connectionHandler);

server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
