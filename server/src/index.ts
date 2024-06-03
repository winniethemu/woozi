import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

import { CLIENT_ROOT, PORT } from './consts';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: CLIENT_ROOT,
  },
});

io.on('connection', (socket) => {
  console.log('client connected');
});

server.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});
