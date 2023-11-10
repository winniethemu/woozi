import { Request, Response } from 'express';

export const getUsersForRoom = (req: Request, res: Response): void => {

};

export const joinRoom = (req: Request, res: Response): void => {
    // Logic for a player to join a room
    res.status(201).send('Player joined the room');
};

export const updateUser = (req: Request, res: Response): void => {
    // Logic for a player to join a room
    res.status(201).send('Player updated');
};