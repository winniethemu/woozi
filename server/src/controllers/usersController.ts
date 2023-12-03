import User, { IUser } from '../models/user';
import getDisplayName from '../utils/displayName';

export const createUser = async (): Promise<IUser> => {
  const name = getDisplayName();
  const user = new User({ name });
  await user.save();
  return user;
};

export const updateUser = async (
  userId: string,
  data: Partial<IUser>
): Promise<IUser | null> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error(`User ${userId} not found`);
  }
  const record = Object.assign(user, data);
  await record.save();
  return record;
};
