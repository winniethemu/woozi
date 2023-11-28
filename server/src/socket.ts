import { SessionSocket, SocketMessage } from './types';

export function authHandler(
  socket: SessionSocket,
  next: (err?: Error) => void
) {
  const { code, userId } = socket.handshake.auth;
  if (!code || !userId) {
    return next(new Error(SocketMessage.INVALID_USER));
  }
  socket.code = code;
  socket.userId = userId;
  next();
}

export function handleConnect(socket: SessionSocket) {
  const roomCode = socket.code as string;
  const userId = socket.userId as string;

  socket.join(roomCode);
  socket.to(roomCode).emit(SocketMessage.USER_CONNECTED, {
    userId,
  });
}
