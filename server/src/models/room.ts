import mongoose, { Document, Schema } from 'mongoose';
import User, { UserSchema } from './user';

// Interface to describe a Room
export interface IRoom extends Document {
  code: string; // code is a 4 character string
  users: mongoose.Types.DocumentArray<typeof User>;
  // Add other properties here
  // e.g., description: string;
  // e.g., createdBy: string;
  // e.g., createdAt: Date;
}

// Mongoose schema defining the structure of a Room
export const RoomSchema: Schema = new Schema({
  code: { type: String, required: true, unique: true },
  users: [UserSchema],
  // Other fields here
  // e.g., description: { type: String, required: false },
  // e.g., createdBy: { type: String, required: true },
  // e.g., createdAt: { type: Date, default: Date.now },
});

// Creating the model from the schema
const Room = mongoose.model<IRoom>('Room', RoomSchema);

export default Room;
