import { Request, Response } from 'express';
import Room from '../models/room';
import User from '../models/user';
import jwt from 'jsonwebtoken';


export const getUsersForRoom = (req: Request, res: Response): void => { };

export const joinRoom = async (req: Request, res: Response): Promise<void> => {
  const roomCode = req.params.roomID;
  const userIds = req.body.userIds; // Assuming userIds are sent in the request body

  try {
    const update = { $addToSet: { users: userIds } }; // Use $addToSet to avoid adding duplicate userIds
    const options = { new: true }; // Return the updated document

    const updatedRoom = await Room.findOneAndUpdate({ code: roomCode });
    if (!updatedRoom) {
      res.status(404).send('Room not found');
      return;
    }

    res.status(200).json({ message: 'User added to the room', room: updatedRoom });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // Create new user
    const newUser = new User({
      name: req.body.userName
    });

    await newUser.save();

    // Create a token
    const token = jwt.sign(
      { userId: newUser._id },
      'your_jwt_secret',  // Replace with your actual secret key
      { expiresIn: '24h' } // Token expiration
    );

    res.status(201).json({ message: 'User created', token });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = (req: Request, res: Response): void => {
  // Logic for a player to join a room
  res.status(201).send('Player updated');
};
