import { Request, Response } from 'express';

import Room from '../models/room';
import User, { IUser } from '../models/user';

export const getUsersForRoom = (req: Request, res: Response): void => {};

export const createUser = async (): Promise<IUser> => {
  const user = new User();
  await user.save();
  return user;
};

export const updateUserName = async (newName: string, user: IUser): Promise<IUser> => {
  // Logic for a player to join a room
  user.name = newName;
  await user.save();
  return user;
};
