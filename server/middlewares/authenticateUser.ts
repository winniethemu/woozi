import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateUser = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).send('Access Denied');
      return;
    }

    const verified = jwt.verify(token, 'your_jwt_secret');
    req.user = verified as { userId: string }; // Type assertion
    next(); 
  } catch (error) {
    res.status(400).send('Invalid Token');
  }
};