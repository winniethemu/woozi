import express, { Request, Response } from 'express';

import user from '../middlewares/user';
import {
  createRoom,
  joinRoom,
  getRoom,
  updateRoom,
  deleteRoom,
} from '../controllers/roomsController';
import { getUsersForRoom, updateUser } from '../controllers/usersController';
import { SessionRequest } from '../types';
import { IUser } from '../models/user';

const router = express.Router();

router.get('/rooms/:roomID', getRoom);

router.post('/rooms', user, async (req: SessionRequest, res: Response) => {
  const user = req.user as IUser;
  try {
    const code = await createRoom(user);
    res.status(200).json({ code, userId: user._id });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/rooms/:roomID', updateRoom);

router.delete('/rooms/:roomID', deleteRoom);

router.get(
  '/rooms/:roomID/join',
  user,
  async (req: SessionRequest, res: Response) => {
    const code = req.params.roomID;
    const user = req.user as IUser;
    try {
      const room = await joinRoom(code, user);
      if (room) {
        res.status(200).json({ room, userId: user._id });
      } else {
        res.send(404);
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

// router.get('/rooms/:roomID/users', authenticateUser, getUsersForRoom);

// router.put('/rooms/:roomID/users', authenticateUser, updateUser);

export default router;
