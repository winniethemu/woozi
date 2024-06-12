import express from 'express';
import { EntityKeyName } from 'redis-om';
import { redis, userRepository } from './index.js';

const router = express.Router();

router.patch(
  '/users/:userId',
  async (req: express.Request, res: express.Response) => {
    const { userId } = req.params;
    try {
      let user = await userRepository.fetch(userId);
      let userExists = await redis.exists(user[EntityKeyName] as string);
      if (userExists) {
        user = Object.assign(user, req.body);
        await userRepository.save(user);
      }
      res.sendStatus(200);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  }
);

export default router;
