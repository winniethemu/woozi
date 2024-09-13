import express from 'express';
import mongoose from 'mongoose';

import { User, Game } from './db.js';
import { GameStatus, MessageType, StoneType } from './types.js';
import {
  createGameCode,
  isParticipant,
  missingOpponent,
  randomColor,
} from './utils.js';
import { io } from './index.js';

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
      const player = {
        userId,
        color: randomColor(),
      };

      const game = new Game({
        // TODO: what if code already exists?
        code: createGameCode(),
        moves: [],
        players: [player],
        status: GameStatus.PENDING,
        turn: StoneType.BLACK,
      });
      await game.save();
      res.status(200).json(game);
    } else {
      res.sendStatus(400);
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

router.post(
  '/games/:code/join',
  async (req: express.Request, res: express.Response) => {
    const { code } = req.params;
    const { userId } = req.body;
    try {
      const userExists = await User.exists({ _id: userId });
      if (!userExists) {
        res.sendStatus(400);
        return;
      }

      const game = await Game.findOne({ code });
      if (!game) {
        res.sendStatus(400);
        return;
      }

      if (isParticipant(userId, game)) {
        res.status(200).json(game);
        return;
      }

      if (!missingOpponent(game)) {
        res.sendStatus(400);
        return;
      }

      const opponent = game.players[0];
      const player = {
        userId,
        color:
          opponent.color === StoneType.BLACK
            ? StoneType.WHITE
            : StoneType.BLACK,
      };
      game.players.push(player);
      game.status = GameStatus.PLAYING;
      await game.save();

      res.status(200).json(game);
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  }
);

export default router;
