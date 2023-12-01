import React from 'react';
import { io } from 'socket.io-client';

import { SERVER_BASE_URL } from './const';
import { AppContextType, SocketMessage } from './types';

const AppContext = React.createContext<AppContextType | null>(null);
AppContext.displayName = 'AppContext';

export function AppProvider({ ...props }) {
  const value = {
    socket: io(SERVER_BASE_URL, { autoConnect: false }),
  };
  return <AppContext.Provider value={value} {...props} />;
}

// eslint-disable-next-line
export function useAppContext() {
  const value = React.useContext(AppContext);
  if (!value) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  const { socket } = value;

  React.useEffect(() => {
    socket.on('connect_error', (err) => {
      if (err.message === SocketMessage.INVALID_USER) {
        console.log('invalid user');
      }
    });

    socket.onAny((event, ...args) => {
      console.log(event, args);
    });

    return () => {
      socket.off('connect_error');
      socket.disconnect();
    };
  }, [socket]);

  return value;
}
