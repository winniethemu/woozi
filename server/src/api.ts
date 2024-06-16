import express from 'express';
import { EntityId, EntityKeyName } from 'redis-om';

import { Game } from './models.js';
import { redisClient, userRepository, gameRepository } from './db.js';
import { createGameCode } from './utils.js';

const router = express.Router();

router.get(
  '/users/:userId',
  async (req: express.Request, res: express.Response) => {
    const { userId } = req.params;
    let user = await userRepository.fetch(userId);
    const userExists = await redisClient.exists(user[EntityKeyName] as string);
    if (!userExists) {
      user = await userRepository.save({ name: 'Anonymous User' });
    }
    res.status(200).json({
      id: user[EntityId],
      name: user.name,
    });
  }
);

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
  // TODO: what if code already exists?
  const game = new Game(createGameCode(), [req.body.userId]);

  try {
    await gameRepository.save(game);
    res.status(200).json({ code: game.code });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

export default router;
