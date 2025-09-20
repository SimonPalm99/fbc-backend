import mongoose, { Schema, Document } from 'mongoose';

export interface IChatRoom extends Document {
  name: string;
  description: string;
  avatar?: string;
  participants: string[]; // User IDs
  creatorId: string;
  createdAt: Date;
}

const ChatRoomSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  avatar: { type: String, default: '' },
  participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  creatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IChatRoom>('ChatRoom', ChatRoomSchema);
