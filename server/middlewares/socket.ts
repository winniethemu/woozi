import { Socket } from 'socket.io';

import { SocketMessage } from '../../types';

export default function socketHandler(
  socket: Socket,
  next: (err?: Error) => void
) {
  const userId = socket.handshake.auth.userId;
  if (!userId) {
    return next(new Error(SocketMessage.INVALID_USER));
  }
  socket.userId = userId;
  next();
}
