// utils/socket.js
module.exports = function(io) {
    return {
      joinRoom: function(socket, room) {
        socket.join(room);
      },
      leaveRoom: function(socket, room) {
        socket.leave(room);
      },
      broadcastToRoom: function(socket, room, event, message) {
        socket.to(room).emit(event, message);
      },
      emitToRoom: function(room, event, message) {
        io.in(room).emit(event, message);
      },
      emitToSocket: function(socket, event, message) {
        socket.emit(event, message);
      }
    };
  };
  