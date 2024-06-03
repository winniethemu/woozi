import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

import { CLIENT_ROOT } from './consts';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: CLIENT_ROOT,
  },
});

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

io.on('connection', (socket) => {
  console.log('client connected');
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});
