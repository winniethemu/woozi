import { Request, Response } from 'express';

import Room, { IRoom } from '../models/room';
import generateUniqueRoomCode from '../utils/roomCodeGenerator';
import { IUser } from '../models/user';

export const createRoom = async (host: IUser): Promise<string> => {
  const code = await generateUniqueRoomCode();
  // FIX: what if code already exists?
  const room = new Room({ code, users: [host] });
  await room.save();
  return code;
};

export const joinRoom = async (
  code: string,
  user: IUser
): Promise<IRoom | null> => {
  // Use $addToSet to avoid adding duplicates
  const update = { $addToSet: { users: user } };
  // Use {new: true} to return the updated document
  const room = await Room.findOneAndUpdate({ code }, update, {
    new: true,
  });
  return room;
};

export const leaveRoom = async (
  code: string,
  users: IUser[]
): Promise<IRoom | null> => {
  const update = { $pull: { users: { $in: users } } };
  const room = await Room.findOneAndUpdate({ code }, update, {
    new: true,
  });
  return room;
};
