import { Request, Response } from 'express';
import Room from '../models/room';
import User, { IUser } from '../models/user';
import jwt from 'jsonwebtoken';

export const getUsersForRoom = (req: Request, res: Response): void => {};

export const createUser = async (): Promise<{ user: IUser; token: string }> => {
  const user = new User();
  await user.save();

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET as string,
    { expiresIn: '365 days' }
  );

  return { user, token };
};

export const updateUser = (req: Request, res: Response): void => {
  // Logic for a player to join a room
  res.status(201).send('Player updated');
};
