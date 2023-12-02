import User, { IUser } from '../models/user';

export const createUser = async (): Promise<IUser> => {
  const user = new User();
  await user.save();
  return user;
};

export const updateUser = async (): Promise<IUser> => {};
