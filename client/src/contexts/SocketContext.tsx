import React from 'react';
import { io } from 'socket.io-client';
import { useLocalStorage } from 'usehooks-ts';

import { SocketContextType } from '../types';
import { AUTH_TOKEN_NAME, SERVER_ROOT } from '../consts';

const SocketContext = React.createContext<SocketContextType | null>(null);
SocketContext.displayName = 'SocketContext';

export function SocketProvider({ ...props }) {
  const [token] = useLocalStorage(AUTH_TOKEN_NAME, null);

  const value = {
    socket: io(SERVER_ROOT, {
      auth: { token },
      autoConnect: false,
    }),
  };
  return <SocketContext.Provider value={value} {...props} />;
}

export function useSocket() {
  const [, setToken] = useLocalStorage(AUTH_TOKEN_NAME, null);
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
      if (event === 'SET_USER_TOKEN') {
        setToken(payload[0]);
      }
    });

    socket.connect();

    return () => {
      socket.off('connect_error');
      socket.disconnect();
    };
  }, [socket]);

  return context;
}
