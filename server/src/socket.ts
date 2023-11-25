import { SessionSocket, SocketMessage } from './types';

export function userHandler(
  socket: SessionSocket,
  next: (err?: Error) => void
) {
  const userId = socket.handshake.auth.userId;
  if (!userId) {
    return next(new Error(SocketMessage.INVALID_USER));
  }
  socket.userId = userId;
  next();
}

export function connectionHandler(socket: SessionSocket) {
  socket.broadcast.emit(SocketMessage.USER_CONNECTED, {
    userId: socket.userId,
  });
}
