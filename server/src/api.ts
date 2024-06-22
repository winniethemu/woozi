import express from 'express';
import mongoose from 'mongoose';

import { User, Game, Player } from './db.js';
import { createGameCode, randomColor } from './utils.js';
import { GameStatus } from './types.js';

const router = express.Router();

router.get(
  '/users/:userId',
  async (req: express.Request, res: express.Response) => {
    const { userId } = req.params;
    let user = null;
    if (mongoose.isValidObjectId(userId)) {
      user = await User.findById(userId);
    }
    if (!user) {
      user = new User({ name: 'Anonymous User' });
      await user.save();
    }
    res.status(200).json({
      id: user._id,
      name: user.name,
    });
  }
);

router.patch(
  '/users/:userId',
  async (req: express.Request, res: express.Response) => {
    const { userId } = req.params;
    try {
      let user = await User.findById(userId);
      if (user) {
        // TODO: make this more generic
        user.name = req.body.name;
        await user.save();
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
  const { userId } = req.body;

  try {
    const userExists = await User.exists({ _id: userId });
    if (userExists) {
      const player = new Player({
        userId,
        color: randomColor(),
      });

      const game = new Game({
        // TODO: what if code already exists?
        code: createGameCode(),
        moves: [],
        players: [player],
        status: GameStatus.PENDING,
      });
      await game.save();
      res.status(200).json({ code: game.code, color: player.color });
    } else {
      res.sendStatus(400);
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

export default router;
