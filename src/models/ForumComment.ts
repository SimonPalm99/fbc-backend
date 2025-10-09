import mongoose, { Schema, Document } from 'mongoose';

export interface IForumComment extends Document {
  author: string;
  text: string;
  date: Date;
  likes: string[]; // Array of User ObjectIds
  replies?: IForumComment[];
}

const ForumCommentSchema: Schema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  replies: [{ type: Schema.Types.ObjectId, ref: 'ForumComment' }]
});

export default mongoose.model<IForumComment>('ForumComment', ForumCommentSchema);
