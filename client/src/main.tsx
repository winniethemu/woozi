import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Theme } from '@radix-ui/themes';

import { SocketProvider } from './contexts/SocketContext';
import Home from './Home/Home.tsx';
import Game from './Game/Game.tsx';

import './index.css';
import '@radix-ui/themes/styles.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: 'games/:code',
    element: <Game />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Theme>
      <SocketProvider>
        <RouterProvider router={router} />
      </SocketProvider>
    </Theme>
  </React.StrictMode>
);
