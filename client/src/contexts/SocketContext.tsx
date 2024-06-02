import React from 'react';
import { io } from 'socket.io-client';

import { SocketContextType } from '../types';
import { SERVER_ROOT_URL } from '../consts';

const SocketContext = React.createContext<SocketContextType | null>(null);
SocketContext.displayName = 'SocketContext';

export function SocketProvider({ ...props }) {
  const value = {
    socket: io(SERVER_ROOT_URL, {
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

    socket.onAny((event: string, ...args) => {
      console.log(event, args);
    });

    return () => {
      socket.off('connect_error');
      socket.disconnect();
    };
  }, [socket]);

  return context;
}
