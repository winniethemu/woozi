import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    // Do we have a concept of denying access?
    // or should we create a new token for any new user?
    if (!token) {
      res.status(401).send('Access Denied');
      return;
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = verified as { userId: string }; // Type assertion
    next();
  } catch (error) {
    res.status(400).send('Invalid Token');
  }
};
