// apps/auth-service/src/models/user.model.ts

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password: string;
  role: number;
  createdAt: Date;
  lastLogin: Date;
  refreshToken: string[];
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,        //? note: no ()
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    refreshToken: {
      type: [String],
      default: [],
    },
  },
  {
    collection: 'users',        // explicitly name your collection
    versionKey: false,          // remove __v field if you like
  }
);

const UserModel: Model<IUser> = mongoose.model<IUser>('User', userSchema);
export default UserModel;
