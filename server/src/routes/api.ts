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

const router = express.Router();

router.get('/rooms/:roomID', getRoom);

router.post('/rooms', user, async (req: Request, res: Response) => {
  try {
    const code = await createRoom(req.user);
    res.status(200).json({ code, userId: req.user._id });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/rooms/:roomID', updateRoom);

router.delete('/rooms/:roomID', deleteRoom);

router.get('/rooms/:roomID/join', async (req: Request, res: Response) => {
  const code = req.params.roomID;
  const userId = req.body.userId;
  try {
    const room = await joinRoom(code, userId);
    if (room) {
      res.status(200).json(room);
    } else {
      res.send(404);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// router.get('/rooms/:roomID/users', authenticateUser, getUsersForRoom);

// router.put('/rooms/:roomID/users', authenticateUser, updateUser);

export default router;
