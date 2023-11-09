const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const indexRouter = require('./routes/index');

// Middleware to serve static files from the public directory
app.use(express.static('public'));

// Use the routes defined in routes/index.js
app.use('/', indexRouter);

// ... Socket.io logic here ...
server.listen(3000, () => {
  console.log('listening on *:3000');
});
