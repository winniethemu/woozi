import express from 'express';
import { EntityKeyName } from 'redis-om';

import { redisClient, userRepository, gameRepository } from './db.js';
import { createGameCode } from './utils.js';

const router = express.Router();

router.patch(
  '/users/:userId',
  async (req: express.Request, res: express.Response) => {
    const { userId } = req.params;
    try {
      let user = await userRepository.fetch(userId);
      let userExists = await redisClient.exists(user[EntityKeyName] as string);
      if (userExists) {
        user = Object.assign(user, req.body);
        await userRepository.save(user);
        res.sendStatus(200);
      } else {
        res.sendStatus(400);
      }
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  }
);

router.post('/games', async (req: express.Request, res: express.Response) => {
  const game = {
    code: createGameCode(), // TODO: what if code already exists?
    players: [req.body.userId],
  };

  try {
    await gameRepository.save(game);
    res.status(200).json({ code: game.code });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

export default router;
