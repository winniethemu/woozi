declare namespace Express {
  export interface Request {
    user?: {
      userId: string;
      // Add other properties that you might store in user
    };
  }
}