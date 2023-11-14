import { Request, Response } from 'express';
import generateUniqueRoomCode from '../utils/roomCodeGenerator';
import Room from '../models/room';
// import { v4 as uuidv4 } from 'uuid';  // For generating unique room IDs

// import Room from '../models/Room';

export const createRoom = async (req: Request, res: Response): Promise<void> => {
  try {
    let roomCode = generateUniqueRoomCode();
    const newRoom = new Room({
        // ... other room properties
        code: roomCode,
    });

    await newRoom.save();
    res.status(201).json({ message: 'Room created successfully', room: newRoom });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRoom = (req: Request, res: Response): void => {
  // Logic to create a new game room
  res.status(201).send('Room updated');
};

export const getRoom = async (req: Request, res: Response): Promise<void> => {
  const roomId = req.params.roomId;

  // try {
  //     // Replace with actual logic to retrieve room details, e.g. from a database
  //     const roomDetails = await someService.getRoomById(roomId);

  //     if (roomDetails) {
  //         res.status(200).json(roomDetails);
  //     } else {
  //         res.status(404).send('Room not found');
  //     }
  // } catch (error) {
  //     // Handle error, possibly a 500 internal server error
  //     res.status(500).send(error.message);
  // }
};

export const deleteRoom = (req: Request, res: Response): void => {
  res.status(201).send('Room deleted');
};
