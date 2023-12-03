import express, { Response } from 'express';

import user from '../middlewares/user';
import { createRoom, joinRoom } from '../controllers/roomsController';
import { SessionRequest } from '../types';
import { IUser } from '../models/user';
import { updateUser } from '../controllers/usersController';

const router = express.Router();

router.post('/rooms', user, async (req: SessionRequest, res: Response) => {
  const user = req.user as IUser;
  try {
    const code = await createRoom(user);
    res.status(200).json({ code, userId: user._id });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

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

router.patch('/users/:userId', async (req: SessionRequest, res: Response) => {
  const userId = req.params.userId;
  try {
    const user = await updateUser(userId, req.body);
    console.log(user);
    res.status(200).json({ user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
