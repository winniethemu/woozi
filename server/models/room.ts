import mongoose, { Document, Schema } from 'mongoose';

// Interface to describe a Room
interface IRoom extends Document {
  code: string; // code is a 4 character string
  users: mongoose.Types.ObjectId[];
  // Add other properties here
  // e.g., description: string;
  // e.g., createdBy: string;
  // e.g., createdAt: Date;
}

// Mongoose schema defining the structure of a Room
const RoomSchema: Schema = new Schema({
  code: { type: String, required: true },
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],  // Reference to User model
  // Other fields here
  // e.g., description: { type: String, required: false },
  // e.g., createdBy: { type: String, required: true },
  // e.g., createdAt: { type: Date, default: Date.now },
});

// Creating the model from the schema
const Room = mongoose.model<IRoom>('Room', RoomSchema);

export default Room;
