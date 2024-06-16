import React from 'react';
import { io } from 'socket.io-client';
import { useLocalStorage } from 'usehooks-ts';

import { SocketContextType } from '../types';
import { USER_ID_KEY, SERVER_ROOT } from '../consts';

const SocketContext = React.createContext<SocketContextType | null>(null);
SocketContext.displayName = 'SocketContext';

export function SocketProvider({ ...props }) {
  const [userId] = useLocalStorage(USER_ID_KEY, null);

  const value = {
    socket: io(SERVER_ROOT, {
      auth: { token: userId },
      autoConnect: false,
    }),
  };
  return <SocketContext.Provider value={value} {...props} />;
}

export function useSocket() {
  const context = React.useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  const { socket } = context;

  React.useEffect(() => {
    socket.on('connect_error', (err: Error) => {
      console.log('connection error', err);
    });

    socket.on('connect', () => {
      console.log('connected to server');
    });

    socket.onAny((event: string, ...payload) => {
      console.log(event, payload);
    });

    socket.connect();

    return () => {
      socket.off('connect_error');
      socket.disconnect();
    };
  }, [socket]);

  return context;
}
