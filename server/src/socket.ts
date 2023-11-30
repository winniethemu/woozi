import Room from './models/room';
import User from './models/user';
import { SessionSocket, SocketMessage } from './types';

export async function authHandler(
  socket: SessionSocket,
  next: (err?: Error) => void
) {
  const { code, userId } = socket.handshake.auth;
  if (!code || !userId) {
    return next(new Error(SocketMessage.UNKNOWN_SOCKET));
  }

  const room = await Room.findOne({ code }).exec();
  if (!room) {
    return next(new Error(SocketMessage.UNKNOWN_ROOM));
  }

  const user = await User.findById(userId).exec();
  if (!user) {
    return next(new Error(SocketMessage.UNKNOWN_USER));
  }

  socket.room = room;
  socket.user = user;
  next();
}
