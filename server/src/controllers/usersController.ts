import User, { IUser } from '../models/user';
import getDisplayName from '../utils/displayName';

export const createUser = async (): Promise<IUser> => {
  const name = getDisplayName();
  const user = new User({ name });
  await user.save();
  return user;
};

export const updateUserName = async (newName: string, user: IUser): Promise<IUser> => {
  // Logic for a player to join a room
  user.name = newName;
  await user.save();
  return user;
};
