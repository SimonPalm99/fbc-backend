import mongoose, { Schema, Document } from 'mongoose';


export interface IMessage extends Document {
  sender: string;
  receiver: string;
  roomId: string;
  content: string;
  type: 'text' | 'emoji' | 'file';
  fileUrl?: string;
  createdAt: Date;
}


const MessageSchema: Schema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  roomId: { type: Schema.Types.ObjectId, ref: 'ChatRoom', required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['text', 'emoji', 'file'], default: 'text' },
  fileUrl: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IMessage>('Message', MessageSchema);
