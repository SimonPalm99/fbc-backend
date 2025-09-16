import mongoose, { Schema, Document } from 'mongoose';

export interface IForumPost extends Document {
  author: string;
  title: string;
  content: string;
  createdAt: Date;
}

const ForumPostSchema: Schema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IForumPost>('ForumPost', ForumPostSchema);
