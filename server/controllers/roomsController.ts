import { Request, Response } from 'express';
// import { v4 as uuidv4 } from 'uuid';  // For generating unique room IDs

// import Room from '../models/Room';

export const createRoom = async (req: Request, res: Response): Promise<void> => {
  try {
      // Generate a unique ID for the new room
      // const newRoomId = uuidv4();

      // Create a new room object (replace with your actual database model or logic)
      // const newRoom = new Room({
      //     id: newRoomId,
      //     name: req.body.name, // Assuming the request body contains a 'name' for the room
      //     ... // other room properties
      // });

      // Save the new room (this is a placeholder, replace with actual database save logic)
      // await newRoom.save();

      // Send back the details of the new room
      res.status(201).json({
          message: 'Room created successfully',
          // roomId: newRoomId,
          // ... other details you want to send back
      });
  } catch (error: unknown) {
    // Perform type checking
    if (error instanceof Error) {
        // Now 'error' is narrowed down to the 'Error' type
        res.status(500).json({ message: error.message });
    } else {
        // Handle cases where the caught error is not an instance of Error
        res.status(500).json({ message: 'An unknown error occurred' });
    }
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
