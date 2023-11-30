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
  const userId = req.headers.authorization?.split(' ')[1];
  const record = await User.findById(userId).exec();
  const user = record ?? (await createUser());
  req.user = user;
  next();
};
