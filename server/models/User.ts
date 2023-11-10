import mongoose, { Document, Schema } from 'mongoose';

// Interface to describe a Room
interface IUser extends Document {
  name: string;
  // Add other properties here
  // e.g., description: string;
  // e.g., createdBy: string;
  // e.g., createdAt: Date;
}

// Mongoose schema defining the structure of a Room
const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  // Other fields here
  // e.g., description: { type: String, required: false },
  // e.g., createdBy: { type: String, required: true },
  // e.g., createdAt: { type: Date, default: Date.now },
});

// Creating the model from the schema
const User = mongoose.model<IUser>('User', UserSchema);

export default User;
