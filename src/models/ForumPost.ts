import mongoose, { Schema, Document } from 'mongoose';

export interface IForumPost extends Document {
  author: string;
  title: string;
  content: string;
  createdAt: Date;
  pinned?: boolean;
  media?: string;
  poll?: string[];
  pollVotes?: number[];
  pollVoters?: string[];
  likes?: number;
  comments?: string[]; // Array of ForumComment ObjectIds
}

const ForumPostSchema: Schema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  pinned: { type: Boolean, default: false },
  media: { type: String },
  poll: [{ type: String }],
  pollVotes: [{ type: Number }],
  pollVoters: [{ type: String }],
  likes: { type: Number, default: 0 },
  comments: [{ type: Schema.Types.ObjectId, ref: 'ForumComment' }]
});

export default mongoose.model<IForumPost>('ForumPost', ForumPostSchema);
