import mongoose, { Schema, Document } from 'mongoose';

export interface IProfile extends Document {
  user: string;
  bio?: string;
  avatarUrl?: string;
  contact?: string;
}

const ProfileSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  bio: { type: String },
  avatarUrl: { type: String },
  contact: { type: String }
});

export default mongoose.model<IProfile>('Profile', ProfileSchema);
