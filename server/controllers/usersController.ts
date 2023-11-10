import { Request, Response } from 'express';
import Room from '../models/Room';

export const getUsersForRoom = (req: Request, res: Response): void => {

};

export const joinRoom = async (req: Request, res: Response): Promise<void> => {
    const roomId = req.params.roomId;
    const userIds = req.body.userIds; // Assuming userIds are sent in the request body

    try {
        const room = await Room.findById(roomId);
        if (!room) {
            res.status(404).send('Room not found');
            return;
        }

        // Add user IDs to the room's users array
        room.users.push(...userIds);
        await room.save();

        res.status(200).json({ message: 'Users added to the room', room });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUser = (req: Request, res: Response): void => {
    // Logic for a player to join a room
    res.status(201).send('Player updated');
};