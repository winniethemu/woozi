import express from 'express';
import * as roomsController from '../controllers/roomsController';
import * as usersController from '../controllers/usersController';

const router = express.Router();

router.get('/rooms/:roomID', roomsController.getRoom);
router.post('/rooms', roomsController.createRoom);
router.put('/rooms/:roomID', roomsController.updateRoom);
router.delete('/rooms/:roomID', roomsController.deleteRoom); 

router.get('/rooms/:roomID/users', usersController.getUsersForRoom);
router.post('/rooms/:roomID/users', usersController.joinRoom);
router.put('/rooms/:roomID/users', usersController.updateUser);
router.post('/users', usersController.createUser);

export default router;
