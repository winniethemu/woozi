import { Request, Response, NextFunction } from 'express';

import { createUser } from '../controllers/usersController';
import User from '../models/user';

/**
 * Validate user token if it exists, otherwise generate a new one.
 */
export default async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = req.headers.authorization?.split(' ')[1];
  const record = User.findById(userId).exec();
  const user = record ?? (await createUser());
  req.user = user;
  next();
};
