import express, { Request, Response } from 'express';
import {
  createRoom,
  joinRoom,
  getRoom,
  updateRoom,
  deleteRoom,
} from '../controllers/roomsController';
import { getUsersForRoom, updateUser } from '../controllers/usersController';
import { authenticateUser } from '../middlewares/authenticateUser';

const router = express.Router();

router.get('/rooms/:roomID', getRoom);

router.post('/rooms', async (req: Request, res: Response) => {
  try {
    const result = await createRoom();
    res.status(200).json(result);
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

router.get('/rooms/:roomID/users', authenticateUser, getUsersForRoom);

router.put('/rooms/:roomID/users', authenticateUser, updateUser);

export default router;
