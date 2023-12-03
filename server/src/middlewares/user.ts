import { Response, NextFunction } from 'express';

import { createUser } from '../controllers/usersController';
import User from '../models/user';
import { SessionRequest } from '../types';

/**
 * Validate user token if it exists, otherwise generate a new one.
 */
export default async (
  req: SessionRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = req.header('X-User-Id');
  let user;
  try {
    const record = await User.findById(userId).exec();
    user = record ?? (await createUser());
  } catch (e: any) {
    // if userId is '', Mongoose throws error
    user = await createUser();
  }
  req.user = user;
  next();
};
