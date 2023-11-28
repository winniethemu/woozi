import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import mongoose from 'mongoose';
import { Server } from 'socket.io';

import apiRouter from './routes/api';
import { connectionHandler, userHandler } from './socket';
import { CLIENT_BASE_URL, corsOptions } from './const';

dotenv.config();

const app: Express = express();
const server = http.createServer(app);
const port = process.env.PORT;

async function db() {
  await mongoose.connect(process.env.DB_URL || '');
}
db().catch((err) => console.log(err));

app.use(cors(corsOptions));
app.use('/api', apiRouter);

const io = new Server(server, {
  cors: {
    origin: CLIENT_BASE_URL,
  },
});
io.use(userHandler);
io.on('connection', connectionHandler);

server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
