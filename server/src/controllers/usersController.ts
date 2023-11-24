import { Request, Response } from 'express';

import Room from '../models/room';
import User, { IUser } from '../models/user';

export const getUsersForRoom = (req: Request, res: Response): void => {};

export const createUser = async (): Promise<IUser> => {
  const user = new User();
  await user.save();
  return user;
};

export const updateUser = (req: Request, res: Response): void => {
  // Logic for a player to join a room
  res.status(201).send('Player updated');
};
