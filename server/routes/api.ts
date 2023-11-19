import express, { Request, Response } from 'express';
import * as roomsController from '../controllers/roomsController';
import * as usersController from '../controllers/usersController';
import { authenticateUser } from '../middlewares/authenticateUser';

const router = express.Router();

router.get('/rooms/:roomID', roomsController.getRoom);

router.post('/rooms', async (req: Request, res: Response) => {
  try {
    const result = roomsController.createRoom();
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/rooms/:roomID', roomsController.updateRoom);

router.delete('/rooms/:roomID', roomsController.deleteRoom);

router.get(
  '/rooms/:roomID/users',
  authenticateUser,
  usersController.getUsersForRoom
);

router.post('/rooms/:roomID/users', authenticateUser, usersController.joinRoom);

router.put(
  '/rooms/:roomID/users',
  authenticateUser,
  usersController.updateUser
);

export default router;
