import User, { IUser } from '../models/user';

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
