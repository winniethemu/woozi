import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Lobby from './components/Lobby.tsx';
import Room from './components/Room.tsx';
import './index.css';
import { AppProvider } from './App.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Lobby />,
  },
  {
    path: 'room/:roomCode',
    element: <Room />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  </React.StrictMode>
);
